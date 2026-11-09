/* Pabo Taaltrainer — kennisbasis Nederlands
 * Leerprincipes: actief ophalen (retrieval practice), gespreide herhaling (Leitner-dozen),
 * door elkaar oefenen (interleaving), oplopende moeilijkheid, directe feedback en elaboratie.
 */
'use strict';

/* ================= basis ================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rnd = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rnd(a.length)];
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const today = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); };
const trunc = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s);

function lev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
function fuzzyEq(input, answer) {
  const a = norm(input), b = norm(answer);
  if (!a) return false;
  if (a === b) return true;
  return lev(a, b) <= Math.max(1, Math.floor(b.length * 0.2));
}

/* ================= inhoud ================= */
const DOMAINS = [
  null,
  { n: 1, name: 'Mondelinge taalvaardigheid', short: 'Mondeling', ico: '🗣️', h: 22 },
  { n: 2, name: 'Woordenschat', short: 'Woordenschat', ico: '🧩', h: 174 },
  { n: 3, name: 'Beginnende geletterdheid', short: 'Beg. geletterdheid', ico: '🔤', h: 330 },
  { n: 4, name: 'Voortgezet technisch lezen', short: 'Techn. lezen', ico: '⚡', h: 210 },
  { n: 5, name: 'Begrijpend lezen', short: 'Begr. lezen', ico: '🔎', h: 140 },
  { n: 6, name: 'Stellen', short: 'Stellen', ico: '✍️', h: 268 },
  { n: 7, name: 'Jeugdliteratuur', short: 'Jeugdliteratuur', ico: '📖', h: 2 },
  { n: 8, name: 'Taalbeschouwing', short: 'Taalbeschouwing', ico: '🧠', h: 42 },
  { n: 9, name: 'Spelling', short: 'Spelling', ico: '✏️', h: 236 },
];
const SUBS = { 1: 'Inhoud: wat leert de leerling?', 2: 'Didactiek: hoe pak je het aan?', 3: 'Achtergrondkennis', 4: 'Taalonderwijs & differentiatie' };

const CONCEPTS = (window.CONCEPTS || []).map((c) => ({ ...c, key: 'c:' + c.id }));
const LISTS = (window.LISTS || []).map((l) => ({ ...l, key: 'l:' + l.id }));
const FACTS = (window.FACTS || []).map((f, i) => ({ ...f, key: 'f:' + i, d: +f.c.split('.')[0] }));
const BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
const ITEMS = new Map([...CONCEPTS, ...LISTS, ...FACTS].map((x) => [x.key, x]));
const TITLE_IDX = new Map();
for (const c of CONCEPTS) { const k = norm(c.t); if (!TITLE_IDX.has(k)) TITLE_IDX.set(k, []); TITLE_IDX.get(k).push(c); }

const STOP = new Set('van het een bij aan in en de met voor op als door naar over tot uit om te dat die dit zijn zich hij zij wordt worden kan kunnen ook niet meer leerling leerlingen leerkracht onderwijs taalonderwijs samenhang andere domeinen jonge kind ontwikkeling startbekwame bijvoorbeeld'.split(' '));

/** Maskeer woorden uit de titel in een tekst, zodat het antwoord niet weggegeven wordt. */
function maskHTML(text, title) {
  const words = norm(title).split(' ').filter((w) => w.length >= 4 && !STOP.has(w));
  let html = esc(text);
  for (const w of words) {
    const stem = w.length > 7 ? w.slice(0, w.length - 2) : w;
    // accentongevoelig matchen op de stam
    const pattern = stem.split('').map((ch) => ({ e: '[eéëè]', i: '[iïí]', o: '[oóö]', a: '[aáä]', u: '[uüú]' }[ch] || reEsc(ch))).join('');
    html = html.replace(new RegExp(`[\\p{L}]*${pattern}[\\p{L}]*`, 'giu'), '<span class="mask">████</span>');
  }
  return html;
}

/** Omschrijving zonder het steeds terugkerende 'De startbekwame leerkracht …' — scheelt leeswerk in oefeningen. */
const oms = (c) => { const s = c.o.replace(/^De startbekwame leerkracht\s+/i, ''); return s === c.o ? s : '… ' + s; };

/** Zet een toelichting-alinea om in HTML, inclusief opsommingen met " - ". */
function fmtPara(p) {
  const parts = p.split(/\s+-\s?(?=[\p{L}("'‘“0-9])/u);
  if (parts.length >= 3 || (parts.length === 2 && /:\s*$/.test(parts[0]))) {
    const head = parts.shift().trim();
    return (head ? `<p>${esc(head)}</p>` : '') + `<ul>${parts.map((x) => `<li>${esc(x.trim().replace(/[;,]$/, ''))}</li>`).join('')}</ul>`;
  }
  return `<p>${esc(p)}</p>`;
}
const sentences = (txt) => txt.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý])/u).map((s) => s.trim()).filter(Boolean);

/* trefwoordenpool voor gatenteksten */
const KW = (() => {
  const m = new Map();
  const add = (k, d) => {
    k = k.toLowerCase().trim().replace(/[.;:]$/, '');
    if (k.length < 5 || k.length > 42 || k.split(' ').length > 4 || /[():]/.test(k)) return;
    if (!m.has(k)) m.set(k, new Set());
    m.get(k).add(d);
  };
  for (const c of CONCEPTS) { add(c.t, c.d); c.z.forEach((z) => add(z, c.d)); }
  for (const l of LISTS) l.i.forEach(([t]) => add(t, l.d));
  return [...m.entries()].map(([k, ds]) => ({ k, ds }));
})();
const clozeCache = new Map();
function clozesFor(c) {
  if (clozeCache.has(c.id)) return clozeCache.get(c.id);
  const out = [];
  const used = new Set();
  for (const s of c.x.flatMap(sentences)) {
    if (s.length < 60 || s.length > 260 || s.startsWith('-')) continue;
    const low = s.toLowerCase();
    let best = null;
    for (const { k } of KW) {
      const i = low.indexOf(k);
      if (i < 0) continue;
      const before = low[i - 1], after = low[i + k.length];
      if ((before && /\p{L}/u.test(before)) || (after && /\p{L}/u.test(after))) continue;
      if (!best || k.length > best.k.length) best = { k, i };
    }
    if (best && !used.has(best.k)) { used.add(best.k); out.push({ s, ...best }); }
    if (out.length >= 5) break;
  }
  clozeCache.set(c.id, out);
  return out;
}

/* ================= opslag ================= */
const STORE_KEY = 'pabo-taaltrainer-v1';
const DEFAULT = () => ({
  cards: {}, xp: 0, streak: 0, best: 0, lastDay: null, history: {}, badges: [],
  records: { speed: 0, match: null }, sessions: 0,
  settings: { len: 15, newPer: 6, domains: [1, 2, 3, 4, 5, 6, 7, 8, 9], sound: true, theme: 'auto', goal: 30 },
});
let S;
try { S = Object.assign(DEFAULT(), JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); S.settings = Object.assign(DEFAULT().settings, S.settings); } catch { S = DEFAULT(); }
const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch { /* opslag niet beschikbaar */ } };

const INTERVALS = [0, 1, 2, 4, 7, 15, 30, 60, 120];
const card = (key) => S.cards[key] || { box: 0, due: 0, seen: 0, right: 0, wrong: 0 };
const status = (key) => { const c = S.cards[key]; return !c || !c.seen ? 'n' : c.box >= 5 ? 'm' : 'l'; };

/** quality: 0 fout, 1 moeilijk, 2 goed, 3 makkelijk */
function review(key, q) {
  const c = { ...card(key) };
  const t = today();
  c.seen = (c.seen || 0) + 1;
  if (q === 0) { c.box = 1; c.due = t; c.wrong = (c.wrong || 0) + 1; }
  else {
    c.right = (c.right || 0) + 1;
    if (q === 1) c.box = Math.max(1, c.box);
    if (q === 2) c.box = Math.min(8, c.box + 1);
    if (q === 3) c.box = Math.min(8, c.box + 2);
    c.due = t + (q === 1 ? 1 : INTERVALS[c.box]);
  }
  c.last = t;
  S.cards[key] = c;
  tickDay(1);
  save();
}
function tickDay(n) {
  const t = today();
  if (S.lastDay !== t) {
    S.streak = S.lastDay === t - 1 ? S.streak + 1 : 1;
    S.lastDay = t;
  }
  S.best = Math.max(S.best || 0, S.streak);
  S.history[t] = (S.history[t] || 0) + n;
}
const doneToday = () => S.history[today()] || 0;
const level = () => { const l = Math.floor(Math.sqrt(S.xp / 60)) + 1; const a = 60 * (l - 1) ** 2, b = 60 * l ** 2; return { l, p: (S.xp - a) / (b - a) }; };
function addXP(n, ev) {
  const before = level().l;
  S.xp += n; save(); renderTop();
  if (ev && n > 0) {
    const el = document.createElement('div');
    el.className = 'xp-pop'; el.textContent = `+${n} XP`;
    const r = ev.getBoundingClientRect ? ev.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
    el.style.left = r.left + r.width / 2 - 30 + 'px'; el.style.top = r.top - 10 + 'px';
    document.body.appendChild(el); setTimeout(() => el.remove(), 1000);
  }
  if (level().l > before) { toast(`🎉 Niveau ${level().l} bereikt!`); confetti(); }
  checkBadges();
}

/* ================= geluid, toast, confetti ================= */
let AC;
function beep(good) {
  if (!S.settings.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'sine';
    const t = AC.currentTime;
    if (good) { o.frequency.setValueAtTime(660, t); o.frequency.setValueAtTime(880, t + 0.08); }
    else { o.frequency.setValueAtTime(240, t); o.frequency.setValueAtTime(180, t + 0.1); }
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + 0.26);
  } catch { /* geen audio */ }
}
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = $('#confetti'), ctx = cv.getContext('2d');
  cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio);
  const cols = ['#e8572a', '#1f9d6b', '#f2b13c', '#5b7cfa', '#d23c8b'];
  const P = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - 0.5) * 12, vy: Math.random() * -12 - 3, s: 4 + Math.random() * 6, c: pick(cols), r: Math.random() * 6 }));
  let f = 0;
  (function step() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of P) { p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.vx *= 0.99; p.r += 0.1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); }
    if (++f < 150) requestAnimationFrame(step); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  })();
}

/* ================= badges ================= */
const BADGES = [
  { id: 'start', e: '🌱', t: 'Eerste stap', d: 'Rond je eerste sessie af', ok: () => S.sessions >= 1 },
  { id: 's3', e: '🔥', t: 'Op dreef', d: '3 dagen op rij geoefend', ok: () => S.best >= 3 },
  { id: 's7', e: '🚀', t: 'Weekstreak', d: '7 dagen op rij geoefend', ok: () => S.best >= 7 },
  { id: 'seen50', e: '👀', t: 'Verkenner', d: '50 onderdelen geoefend', ok: () => Object.values(S.cards).filter((c) => c.seen).length >= 50 },
  { id: 'm25', e: '🧱', t: 'Fundament', d: '25 onderdelen beheerst', ok: () => Object.values(S.cards).filter((c) => c.box >= 5).length >= 25 },
  { id: 'm100', e: '🏛️', t: 'Kennisbouwer', d: '100 onderdelen beheerst', ok: () => Object.values(S.cards).filter((c) => c.box >= 5).length >= 100 },
  { id: 'alld', e: '🌈', t: 'Allrounder', d: 'In alle 9 domeinen geoefend', ok: () => new Set(Object.keys(S.cards).map((k) => ITEMS.get(k)?.d)).size >= 9 },
  { id: 'lists', e: '📋', t: 'Rijtjeskenner', d: 'Alle rijtjes minstens één keer geoefend', ok: () => LISTS.every((l) => S.cards[l.key]?.seen) },
  { id: 'speed', e: '⚡', t: 'Bliksem', d: '20+ punten in de snelronde', ok: () => S.records.speed >= 20 },
  { id: 'match', e: '🧲', t: 'Koppelkampioen', d: 'Koppelspel binnen 30 seconden', ok: () => S.records.match && S.records.match <= 30 },
  { id: 'xp1k', e: '💎', t: 'Duizendpoot', d: '1000 XP verzameld', ok: () => S.xp >= 1000 },
];
function checkBadges() {
  for (const b of BADGES) if (!S.badges.includes(b.id) && b.ok()) { S.badges.push(b.id); save(); toast(`${b.e} Badge: ${b.t}!`); }
}

/* ================= router & topbar ================= */
const view = () => $('#view');
let keyHandler = null;
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#modal').hidden) { closeModal(); return; }
  if (!$('#modal').hidden) return;
  if (keyHandler && !(e.target.matches('input, textarea') && e.key !== 'Enter')) keyHandler(e);
});
function go(name, arg) {
  keyHandler = null;
  document.body.classList.remove('in-session');
  $$('.tabbar button').forEach((b) => b.classList.toggle('on', b.dataset.nav === name || (name !== 'home' && name !== 'library' && name !== 'progress' && b.dataset.nav === 'modes')));
  (ROUTES[name] || ROUTES.home)(arg);
  scrollTo(0, 0);
  renderTop();
}
document.addEventListener('click', (e) => {
  const n = e.target.closest('[data-nav]');
  if (n) { e.preventDefault(); go(n.dataset.nav, n.dataset.arg); }
  if (e.target.closest('[data-close]')) closeModal();
});
function renderTop() {
  const { l } = level();
  $('#topstats').innerHTML = `<span class="pill" title="Dagen op rij">🔥 ${S.lastDay >= today() - 1 ? S.streak : 0}</span><span class="pill" title="Niveau">⭐ ${l}</span><span class="pill" title="XP">${S.xp} XP</span>`;
}
function openModal(html) { $('#modal-body').innerHTML = html; $('#modal').hidden = false; $('.modal-x').focus(); }
function closeModal() { $('#modal').hidden = true; }
function applyTheme() { const t = S.settings.theme; if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t; }

/* ================= helpers voor selectie ================= */
const activeDomains = () => (S.settings.domains.length ? S.settings.domains : [1, 2, 3, 4, 5, 6, 7, 8, 9]);
function pool(domains = activeDomains()) {
  return [...ITEMS.values()].filter((x) => domains.includes(x.d));
}
function dueItems(domains) {
  const t = today();
  return pool(domains).filter((x) => S.cards[x.key]?.seen && S.cards[x.key].due <= t).sort((a, b) => card(a.key).due - card(b.key).due || card(a.key).box - card(b.key).box);
}
function newItems(domains) {
  // Nieuwe stof per domein in de volgorde van de kennisbasis (begrip, dan bijbehorend rijtje),
  // en om de beurt uit een ander domein, zodat je vanaf het begin door elkaar leert.
  const n = pool(domains).filter((x) => !S.cards[x.key]?.seen && !x.key.startsWith('f:'));
  const ord = (x) => (x.key.startsWith('l:') ? x.c + '.z' : x.id);
  const per = {};
  for (const x of n.sort((a, b) => ord(a).localeCompare(ord(b), 'nl', { numeric: true }))) (per[x.d] = per[x.d] || []).push(x);
  const doms = Object.keys(per).sort((a, b) => (doneIn(+a) - doneIn(+b)) || a - b);
  const out = [];
  for (let k = 0; out.length < n.length; k++) for (const d of doms) if (per[d][k]) out.push(per[d][k]);
  return out;
}
const doneIn = (d) => [...ITEMS.values()].filter((x) => x.d === d && S.cards[x.key]?.seen).length;
/** kennisvragen waarvan het begrip al bekend is */
const readyFacts = (domains) => FACTS.filter((f) => domains.includes(f.d) && !S.cards[f.key]?.seen && S.cards['c:' + f.c]?.seen);
/** door elkaar: vermijd twee keer achter elkaar hetzelfde domein */
function interleave(arr) {
  const out = []; const rest = shuffle(arr);
  while (rest.length) {
    const prev = out[out.length - 1];
    let i = rest.findIndex((x) => !prev || ITEMS.get(x.key).d !== ITEMS.get(prev.key).d);
    if (i < 0) i = 0;
    out.push(rest.splice(i, 1)[0]);
  }
  return out;
}

/* ================= oefenvormen ================= */
const domChip = (d) => `<span class="chip" style="--h:${DOMAINS[d].h}">${DOMAINS[d].ico} ${esc(DOMAINS[d].short)}</span>`;
const typeChip = (t) => `<span class="eyebrow">${esc(t)}</span>`;

/** Kies passende oefenvorm op basis van beheersing (oplopende moeilijkheid). */
function chooseType(item) {
  const box = card(item.key).box, seen = card(item.key).seen;
  if (item.key.startsWith('f:')) return 'fact';
  if (item.key.startsWith('l:')) {
    if (!seen) return 'listIntro';
    const opts = ['listMissing', 'listIntruder'];
    const expl = item.i.filter((x) => x[1]).length >= 3;
    if (box >= 1 && expl) opts.push('listMatch');
    if (box >= 2 && item.o) opts.push('listOrder', 'listOrder');
    if (box >= 3) opts.push('listRecall');
    if (box >= 4) return pick(opts.filter((o) => o !== 'listMissing'));
    return pick(opts);
  }
  if (!seen) return 'intro';
  const hasCloze = clozesFor(item).length > 0;
  const hasRel = item.z.length > 0;
  let opts;
  if (box <= 1) opts = ['defToTerm', 'termToDef', 'trueFalse'];
  else if (box <= 3) opts = ['defToTerm', 'termToDef', 'trueFalse', hasCloze && 'cloze', hasCloze && 'cloze', hasRel && 'related'];
  else opts = [hasCloze && 'clozeTyped', 'typeTerm', 'explain', hasRel && 'related', 'termToDef'];
  return pick(opts.filter(Boolean));
}

function distractTitles(c, n) {
  const sameSub = CONCEPTS.filter((x) => x.d === c.d && x.s === c.s && norm(x.t) !== norm(c.t));
  const sameDom = CONCEPTS.filter((x) => x.d === c.d && norm(x.t) !== norm(c.t));
  const other = CONCEPTS.filter((x) => norm(x.t) !== norm(c.t));
  const out = []; const seen = new Set([norm(c.t)]);
  for (const src of [shuffle(sameSub), shuffle(sameDom), shuffle(other)]) for (const x of src) { if (out.length >= n) break; if (!seen.has(norm(x.t))) { seen.add(norm(x.t)); out.push(x); } }
  return out;
}

/** Generieke meerkeuze. options: [{html, ok}] */
function mc(host, { head, prompt, options, long, after }, done) {
  const opts = shuffle(options);
  host.innerHTML = `${head}${prompt}<div class="options">${opts.map((o, i) => `<button class="opt ${long ? 'long' : ''}" data-i="${i}"><kbd>${i + 1}</kbd><span>${o.html}</span></button>`).join('')}</div><p class="kbdhint">Toets 1–${opts.length} om te kiezen</p>`;
  let answered = false;
  const choose = (i, btn) => {
    if (answered) return; answered = true;
    const ok = opts[i].ok;
    $$('.opt', host).forEach((b, j) => { b.disabled = true; if (opts[j].ok) b.classList.add('right'); else if (j === i) b.classList.add('wrong'); else b.classList.add('dim'); });
    done({ ok, q: ok ? 2 : 0, el: btn, after });
  };
  $$('.opt', host).forEach((b) => b.addEventListener('click', () => choose(+b.dataset.i, b)));
  keyHandler = (e) => { const k = +e.key; if (k >= 1 && k <= opts.length) choose(k - 1, $$('.opt', host)[k - 1]); };
}

function conceptExplain(c) {
  return `<div class="def"><b>${esc(c.id)} ${esc(c.t)}</b><br>${esc(c.o)}</div><button class="btn ghost small" style="margin-top:8px;padding:6px 10px" data-open="${c.id}">📖 Lees de toelichting</button>`;
}

const EX = {
  intro(host, c, done) {
    const first = c.x.slice(0, 2).map(fmtPara).join('');
    host.innerHTML = `<div class="ex-type">${domChip(c.d)}${typeChip('Nieuw begrip')}</div>
      <h2 class="prompt serif" style="font-size:1.6rem">${esc(c.t)}</h2>
      <div class="detail" style="--h:${DOMAINS[c.d].h}"><p class="oms">${esc(c.o)}</p>${first}${c.x.length > 2 ? `<button class="btn ghost small" data-open="${c.id}">Lees alles…</button>` : ''}</div>
      <p class="tiny" style="margin-top:12px">💡 Tip: bedenk zelf een voorbeeld uit de klas bij dit begrip. Straks vragen we het je terug.</p>`;
    done({ ok: true, q: 1, intro: true, label: 'Begrepen, verder' });
  },

  defToTerm(host, c, done) {
    const ds = distractTitles(c, 3);
    mc(host, {
      head: `<div class="ex-type">${domChip(c.d)}${typeChip('Welk begrip is dit?')}</div>`,
      prompt: `<div class="quote">${maskHTML(oms(c), c.t)}</div>`,
      options: [{ html: esc(c.t), ok: true }, ...ds.map((x) => ({ html: esc(x.t), ok: false }))],
      after: conceptExplain(c),
    }, done);
  },

  termToDef(host, c, done) {
    const ds = distractTitles(c, 3);
    mc(host, {
      head: `<div class="ex-type">${domChip(c.d)}${typeChip('Kies de juiste omschrijving')}</div>`,
      prompt: `<h2 class="prompt serif">${esc(c.t)}</h2>`,
      long: true,
      options: [{ html: maskHTML(trunc(oms(c), 200), c.t), ok: true }, ...ds.map((x) => ({ html: maskHTML(trunc(oms(x), 200), x.t), ok: false }))],
      after: conceptExplain(c),
    }, done);
  },

  trueFalse(host, c, done) {
    const truth = Math.random() < 0.5;
    const other = distractTitles(c, 1)[0];
    const shown = truth ? c : other;
    host.innerHTML = `<div class="ex-type">${domChip(c.d)}${typeChip('Waar of niet waar?')}</div>
      <p class="prompt">Past deze omschrijving bij <b>${esc(c.t)}</b>?</p>
      <div class="quote">${maskHTML(oms(shown), shown.t)}</div>
      <div class="tf"><button class="btn yes" data-v="1">✓ Klopt</button><button class="btn no" data-v="0">✗ Klopt niet</button></div>
      <p class="kbdhint">Toets J / N</p>`;
    let answered = false;
    const answer = (v, btn) => {
      if (answered) return; answered = true;
      const ok = v === truth;
      $$('.tf .btn', host).forEach((b) => { b.disabled = true; if ((b.dataset.v === '1') === truth) b.classList.add('primary'); });
      done({ ok, q: ok ? 2 : 0, el: btn, after: (truth ? '' : `<p class="small">Deze omschrijving hoort bij <b>${esc(other.t)}</b>.</p>`) + conceptExplain(c) });
    };
    $$('.tf .btn', host).forEach((b) => b.addEventListener('click', () => answer(b.dataset.v === '1', b)));
    keyHandler = (e) => { if (/^[jy1]$/i.test(e.key)) answer(true, $('.tf .yes', host)); if (/^[n0]$/i.test(e.key)) answer(false, $('.tf .no', host)); };
  },

  cloze(host, c, done) {
    const cz = pick(clozesFor(c));
    if (!cz) return EX.defToTerm(host, c, done);
    const ans = cz.s.substr(cz.i, cz.k.length);
    const sameDom = KW.filter((x) => x.k !== cz.k && x.ds.has(c.d) && !cz.s.toLowerCase().includes(x.k) && Math.abs(x.k.length - cz.k.length) < 12);
    const ds = sample(sameDom.length >= 3 ? sameDom : KW.filter((x) => x.k !== cz.k), 3);
    const blanked = esc(cz.s.slice(0, cz.i)) + '<span class="blank">&nbsp;?&nbsp;</span>' + esc(cz.s.slice(cz.i + cz.k.length));
    mc(host, {
      head: `<div class="ex-type">${domChip(c.d)}${typeChip('Gatentekst · ' + c.t)}</div>`,
      prompt: `<div class="quote">${blanked}</div>`,
      options: [{ html: esc(ans), ok: true }, ...ds.map((x) => ({ html: esc(x.k), ok: false }))],
      after: `<p class="small">“…${esc(cz.s)}”</p>` + conceptExplain(c),
    }, done);
  },

  clozeTyped(host, c, done) {
    const cz = pick(clozesFor(c));
    if (!cz) return EX.typeTerm(host, c, done);
    const ans = cz.s.substr(cz.i, cz.k.length);
    const blanked = esc(cz.s.slice(0, cz.i)) + `<span class="blank">&nbsp;${'_'.repeat(Math.min(12, ans.length))}&nbsp;</span>` + esc(cz.s.slice(cz.i + cz.k.length));
    typed(host, {
      head: `<div class="ex-type">${domChip(c.d)}${typeChip('Vul zelf in · ' + c.t)}</div>`,
      prompt: `<div class="quote">${blanked}</div><p class="tiny">Hint: begint met “${esc(ans[0])}”, ${ans.length} tekens</p>`,
      answer: ans, after: conceptExplain(c),
    }, done);
  },

  typeTerm(host, c, done) {
    typed(host, {
      head: `<div class="ex-type">${domChip(c.d)}${typeChip('Typ het begrip')}</div>`,
      prompt: `<div class="quote">${maskHTML(oms(c), c.t)}</div><p class="tiny">Hint: ${c.t.split(' ').length} woord(en), begint met “${esc(c.t[0])}”</p>`,
      answer: c.t, after: conceptExplain(c),
    }, done);
  },

  related(host, c, done) {
    const zie = c.z.filter((z) => norm(z) !== norm(c.t));
    if (!zie.length) return EX.defToTerm(host, c, done);
    const right = pick(zie);
    const ban = new Set([norm(c.t), ...c.z.map(norm)]);
    const ds = sample(CONCEPTS.filter((x) => x.d !== c.d && !ban.has(norm(x.t))), 3);
    mc(host, {
      head: `<div class="ex-type">${domChip(c.d)}${typeChip('Leg het verband')}</div>`,
      prompt: `<p class="prompt">Welk begrip noemt de kennisbasis bij <b>${esc(c.t)}</b> onder ‘zie ook’?</p>`,
      options: [{ html: esc(right), ok: true }, ...ds.map((x) => ({ html: esc(x.t), ok: false }))],
      after: `<p class="small">Verwante begrippen: ${c.z.map(esc).join(' · ')}</p><p class="tiny">💡 Elaboratie: hoe hangen deze begrippen samen? Verwoord het kort voor jezelf.</p>`,
    }, done);
  },

  explain(host, c, done) {
    const kws = keyWords(c);
    host.innerHTML = `<div class="ex-type">${domChip(c.d)}${typeChip('Leg het uit (Feynman)')}</div>
      <h2 class="prompt serif">${esc(c.t)}</h2>
      <p class="small muted">Leg dit begrip uit alsof je het aan een medestudent vertelt. Noem wat de leerkracht doet en waarom.</p>
      <textarea class="input" id="expl" placeholder="Typ je uitleg…"></textarea>
      <div class="next-bar"><button class="btn primary" id="check">Vergelijk met de kennisbasis</button></div>`;
    $('#expl', host).focus();
    const check = () => {
      const txt = norm($('#expl', host).value);
      const hit = kws.filter((k) => txt.includes(k.slice(0, Math.max(5, k.length - 2))));
      $('#check', host).parentElement.remove();
      $('#expl', host).disabled = true;
      const div = document.createElement('div');
      div.className = 'feedback neutral';
      div.innerHTML = `<h3>📘 Kennisbasis</h3><div class="def">${esc(c.o)}</div>${c.x[0] ? `<div class="small" style="margin-top:8px">${fmtPara(trunc(c.x[0], 500))}</div>` : ''}
        <p class="small"><b>Kernwoorden</b> (${hit.length}/${kws.length} genoemd): ${kws.map((k) => `<span class="chip ${hit.includes(k) ? '' : 'off'}" style="--h:140">${hit.includes(k) ? '✓ ' : ''}${esc(k)}</span>`).join(' ')}</p>
        <p class="small"><b>Hoe goed was je uitleg?</b></p>
        <div class="rate"><button class="btn r0" data-q="0">Mis<small>opnieuw</small></button><button class="btn r1" data-q="1">Deels<small>morgen</small></button><button class="btn r2" data-q="2">Goed<small>later</small></button><button class="btn r3" data-q="3">Top<small>veel later</small></button></div>`;
      host.appendChild(div);
      $$('.rate .btn', div).forEach((b) => b.addEventListener('click', () => { $$('.rate .btn', div).forEach((x) => (x.disabled = true)); done({ ok: +b.dataset.q > 0, q: +b.dataset.q, el: b, self: true }); }));
      keyHandler = (e) => { const k = +e.key; if (k >= 1 && k <= 4) $$('.rate .btn', div)[k - 1].click(); };
    };
    $('#check', host).addEventListener('click', check);
    keyHandler = (e) => { if (e.key === 'Enter' && e.ctrlKey) check(); };
  },

  fact(host, f, done) {
    mc(host, {
      head: `<div class="ex-type">${domChip(f.d)}${typeChip('Kennisvraag')}</div>`,
      prompt: `<p class="prompt">${esc(f.q)}</p>`,
      long: f.a[0].length > 40,
      options: f.a.map((a, i) => ({ html: esc(a), ok: i === 0 })),
      after: BY_ID[f.c] ? conceptExplain(BY_ID[f.c]) : '',
    }, done);
  },

  /* ---------- rijtjes ---------- */
  listIntro(host, l, done) {
    host.innerHTML = `<div class="ex-type">${domChip(l.d)}${typeChip(l.o ? 'Nieuw rijtje · volgorde telt' : 'Nieuw rijtje')}</div>
      <h2 class="prompt serif">${esc(l.t)}</h2>
      ${listHTML(l)}
      <p class="tiny">💡 Tip: maak er een ezelsbruggetje van (bijv. de beginletters: <b>${l.i.map((x) => esc(x[0].replace(/^[^\p{L}]+/u, '')[0].toUpperCase())).join('')}</b>). Straks vragen we het terug.</p>
      ${BY_ID[l.c] ? `<button class="btn ghost small" data-open="${l.c}">📖 ${esc(l.c)} ${esc(BY_ID[l.c].t)}</button>` : ''}`;
    done({ ok: true, q: 1, intro: true, label: 'Ik heb het bekeken' });
  },

  listMissing(host, l, done) {
    const hole = rnd(l.i.length);
    const others = LISTS.filter((x) => x.id !== l.id).flatMap((x) => x.i.map((i) => i[0])).filter((t) => !l.i.some((i) => norm(i[0]) === norm(t)));
    const sameDom = LISTS.filter((x) => x.id !== l.id && x.d === l.d).flatMap((x) => x.i.map((i) => i[0])).filter((t) => !l.i.some((i) => norm(i[0]) === norm(t)));
    const ds = sample(sameDom.length >= 3 ? sameDom : others, 3);
    mc(host, {
      head: `<div class="ex-type">${domChip(l.d)}${typeChip('Wat ontbreekt er?')}</div>`,
      prompt: `<p class="prompt">${esc(l.t)}</p>${listHTML(l, { hole, hideExpl: true })}`,
      options: [{ html: esc(l.i[hole][0]), ok: true }, ...ds.map((t) => ({ html: esc(t), ok: false }))],
      after: listHTML(l),
    }, done);
  },

  listIntruder(host, l, done) {
    const show = sample(l.i, Math.min(4, l.i.length));
    const cand = LISTS.filter((x) => x.id !== l.id).flatMap((x) => x.i.map((i) => ({ t: i[0], from: x }))).filter((o) => !l.i.some((i) => norm(i[0]) === norm(o.t)));
    const near = cand.filter((o) => o.from.d === l.d);
    const intr = pick(near.length ? near : cand);
    mc(host, {
      head: `<div class="ex-type">${domChip(l.d)}${typeChip('Zoek de indringer')}</div>`,
      prompt: `<p class="prompt">Welke hoort <b>niet</b> bij: ${esc(l.t)}?</p>`,
      options: [...show.map((i) => ({ html: esc(i[0]), ok: false })), { html: esc(intr.t), ok: true }],
      after: `<p class="small">“${esc(intr.t)}” hoort bij <b>${esc(intr.from.t)}</b>.</p>${listHTML(l)}`,
    }, done);
  },

  listMatch(host, l, done) {
    const pairs = sample(l.i.filter((x) => x[1]), 5);
    matchGame(host, {
      head: `<div class="ex-type">${domChip(l.d)}${typeChip('Koppel')}</div><p class="prompt">${esc(l.t)}</p>`,
      pairs: pairs.map(([a, b]) => [a, b]),
    }, (res) => done({ ok: res.errors <= 1, q: res.errors === 0 ? 2 : res.errors <= 1 ? 1 : 0, after: res.errors ? listHTML(l) : '' }));
  },

  listOrder(host, l, done) {
    const items = l.i.map((x) => x[0]);
    let placed = [];
    const pool0 = shuffle(items.map((t, i) => ({ t, i })));
    host.innerHTML = `<div class="ex-type">${domChip(l.d)}${typeChip('Zet in de goede volgorde')}</div>
      <p class="prompt">${esc(l.t)}</p>
      <ol class="listbox ordered order-slots" id="slots"></ol>
      <div class="order-pool" id="pool"></div>
      <div class="next-bar"><button class="btn" id="undo">↶ Terug</button><button class="btn primary" id="chk" disabled>Controleer</button></div>`;
    const draw = () => {
      $('#slots', host).innerHTML = items.map((_, k) => placed[k] ? `<li>${esc(placed[k].t)}</li>` : `<li class="empty">${k + 1}e stap…</li>`).join('');
      const left = pool0.filter((p) => !placed.includes(p));
      $('#pool', host).innerHTML = left.map((p) => `<button class="btn" data-i="${p.i}">${esc(p.t)}</button>`).join('');
      $$('#pool .btn', host).forEach((b) => b.addEventListener('click', () => { placed.push(pool0.find((p) => p.i === +b.dataset.i)); draw(); }));
      $('#chk', host).disabled = placed.length < items.length;
    };
    draw();
    $('#undo', host).addEventListener('click', () => { placed.pop(); draw(); });
    $('#chk', host).addEventListener('click', (ev) => {
      const right = placed.filter((p, k) => p.i === k).length;
      $$('#slots li', host).forEach((li, k) => li.classList.add(placed[k].i === k ? 'ok' : 'ko'));
      $('.next-bar', host).remove(); $('#pool', host).remove();
      const ok = right === items.length;
      done({ ok, q: ok ? 2 : right >= items.length - 2 ? 1 : 0, el: ev.target, after: ok ? '' : `<p class="small"><b>Juiste volgorde:</b></p>${listHTML(l)}` });
    });
  },

  listRecall(host, l, done) {
    host.innerHTML = `<div class="ex-type">${domChip(l.d)}${typeChip('Uit je hoofd')}</div>
      <p class="prompt">Noem: ${esc(l.t)} <span class="muted">(${l.i.length} onderdelen)</span></p>
      <textarea class="input" id="rc" placeholder="Eén per regel…"></textarea>
      <div class="next-bar"><button class="btn primary" id="chk">Controleer</button></div>`;
    $('#rc', host).focus();
    $('#chk', host).addEventListener('click', (ev) => {
      const lines = $('#rc', host).value.split(/\n|;|,/).map((s) => s.trim()).filter(Boolean);
      const hit = l.i.map((it) => {
        const target = it[0].replace(/\(.*?\)/g, '').replace(/^stadium \d+:\s*/i, '');
        const keyw = norm(target).split(' ').filter((w) => w.length >= 4 && !STOP.has(w));
        return lines.some((ln) => fuzzyEq(ln, target) || (keyw.length && keyw.some((w) => norm(ln).includes(w.slice(0, Math.max(4, w.length - 2))))));
      });
      const n = hit.filter(Boolean).length;
      $('#rc', host).disabled = true; $('.next-bar', host).remove();
      const ul = `<ul class="listbox">${l.i.map((it, k) => `<li style="${hit[k] ? 'background:var(--good-soft)' : ''}">${hit[k] ? '✓' : '○'} <span>${esc(it[0])}${it[1] ? `<small>${esc(it[1])}</small>` : ''}</span></li>`).join('')}</ul>`;
      const frac = n / l.i.length;
      done({ ok: frac >= 0.75, q: frac >= 0.9 ? 2 : frac >= 0.6 ? 1 : 0, el: ev.target, after: `<p class="small"><b>${n} van ${l.i.length}</b> herkend. Klopt de telling niet? Beoordeel jezelf eerlijk bij de volgende herhaling.</p>${ul}` });
    });
  },
};

function keyWords(c) {
  const txt = c.o + ' ' + (c.x[0] || '');
  const words = norm(txt).split(' ').filter((w) => w.length >= 7 && !STOP.has(w) && !['startbekwame', 'authentieke', 'creeert', 'bijvoorbeeld', 'verschillende'].includes(w));
  const freq = {}; words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
  return Object.keys(freq).sort((a, b) => freq[b] - freq[a] || b.length - a.length).slice(0, 7);
}

function listHTML(l, { hole = -1, hideExpl = false } = {}) {
  return `<ol class="listbox ${l.o ? 'ordered' : ''}">${l.i.map((it, k) => k === hole ? '<li class="hole">❓ …</li>' : `<li><span>${esc(it[0])}${it[1] && !hideExpl ? `<small>${esc(it[1])}</small>` : ''}</span></li>`).join('')}</ol>`;
}

function typed(host, { head, prompt, answer, after }, done) {
  host.innerHTML = `${head}${prompt}<input class="input" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Jouw antwoord…">
    <div class="next-bar"><button class="btn ghost" id="idk">Weet ik niet</button><button class="btn primary" id="chk">Controleer</button></div>`;
  const inp = $('#ans', host); inp.focus();
  let answered = false;
  const check = (giveUp) => {
    if (answered) return; answered = true;
    const ok = !giveUp && fuzzyEq(inp.value, answer);
    inp.disabled = true; inp.classList.add(ok ? 'right' : 'wrong');
    $('.next-bar', host).remove();
    const exact = norm(inp.value) === norm(answer);
    done({
      ok, q: ok ? 2 : 0, el: inp,
      after: `<p class="small">Antwoord: <b>${esc(answer)}</b>${ok && !exact ? ' (bijna goed gespeld 👍)' : ''}</p>${after || ''}`,
      override: !ok && !giveUp && inp.value.trim().length > 0,
    });
  };
  $('#chk', host).addEventListener('click', () => check(false));
  $('#idk', host).addEventListener('click', () => check(true));
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); check(false); } });
  keyHandler = null;
}

function matchGame(host, { head, pairs }, finish) {
  const L = shuffle(pairs.map((p, i) => ({ i, t: p[0] })));
  const R = shuffle(pairs.map((p, i) => ({ i, t: p[1] })));
  host.innerHTML = `${head}<div class="match"><div class="col">${L.map((x) => `<button class="tile" data-s="L" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div>
    <div class="col">${R.map((x) => `<button class="tile r" data-s="R" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div></div>`;
  let sel = null, errors = 0, left = pairs.length;
  const t0 = Date.now();
  $$('.tile', host).forEach((b) => b.addEventListener('click', () => {
    if (!sel || sel.dataset.s === b.dataset.s) { $$('.tile.sel', host).forEach((x) => x.classList.remove('sel')); sel = b; b.classList.add('sel'); return; }
    if (sel.dataset.i === b.dataset.i) {
      sel.classList.remove('sel'); sel.classList.add('done'); b.classList.add('done'); beep(true); sel = null;
      if (--left === 0) finish({ errors, secs: Math.round((Date.now() - t0) / 1000) });
    } else {
      errors++; beep(false);
      const a = sel; a.classList.add('err'); b.classList.add('err');
      setTimeout(() => { a.classList.remove('err', 'sel'); b.classList.remove('err'); }, 400); sel = null;
    }
  }));
}

/* ================= sessie-runner ================= */
let SESSION = null;
function startSession(queue, title, opts = {}) {
  if (!queue.length) { toast('Niets te oefenen met deze selectie.'); return; }
  SESSION = { queue, title, i: 0, right: 0, wrong: 0, combo: 0, xp: 0, mistakes: [], requeued: new Set(), total: queue.length, startBoxes: {}, opts };
  queue.forEach((q) => (SESSION.startBoxes[q.key] = card(q.key).box));
  document.body.classList.add('in-session');
  $$('.tabbar button').forEach((b) => b.classList.remove('on'));
  nextExercise();
}
function nextExercise() {
  const s = SESSION;
  if (s.i >= s.queue.length) return finishSession();
  const step = s.queue[s.i];
  const item = ITEMS.get(step.key);
  const type = step.type && step.type !== 'auto' ? step.type : chooseType(item);
  const answeredBefore = s.i;
  view().innerHTML = `<div class="sess-top"><button class="sess-x" id="quit" aria-label="Stoppen">✕</button><div class="progress"><i style="width:${(s.i / s.queue.length) * 100}%"></i></div><div class="combo">${s.combo >= 3 ? '🔥×' + s.combo : ''}</div></div>
    <div class="ex card" id="ex"></div>`;
  $('#quit').addEventListener('click', () => { if (s.i === 0 || confirm('Sessie stoppen? Je voortgang tot nu toe is bewaard.')) finishSession(true); });
  const host = $('#ex');
  keyHandler = null;
  EX[type](host, item, (res) => {
    if (answeredBefore !== s.i) return;
    onAnswer(host, step, item, type, res);
  });
}
function onAnswer(host, step, item, type, res) {
  const s = SESSION;
  if (res.intro) {
    review(item.key, 1);
    // nieuw geleerd: verderop in de sessie terugvragen (spreiding binnen de sessie)
    const pos = Math.min(s.queue.length, s.i + 3 + rnd(3));
    s.queue.splice(pos, 0, { key: item.key, type: 'auto' });
    addXP(3);
  } else {
    review(item.key, res.q);
    if (res.ok) {
      s.right++; s.combo++;
      const gain = 10 + Math.min(10, (s.combo - 1) * 2);
      s.xp += gain; addXP(gain, res.el); beep(true);
    } else {
      s.wrong++; s.combo = 0; s.xp += 2; addXP(2); beep(false);
      s.mistakes.push({ key: item.key, type });
      if (!s.requeued.has(item.key)) { s.requeued.add(item.key); s.queue.splice(Math.min(s.queue.length, s.i + 4), 0, { key: item.key, type: 'auto' }); }
    }
  }
  const fb = document.createElement('div');
  if (!res.intro && !res.self) {
    fb.className = 'feedback ' + (res.ok ? 'good' : 'bad');
    const praise = ['Goed zo!', 'Top!', 'Helemaal goed!', 'Knap!', 'Yes!', 'Precies!'];
    fb.innerHTML = `<h3>${res.ok ? '✅ ' + pick(praise) : '💡 Net niet'}</h3>${res.after || ''}${res.override ? '<button class="btn ghost small" id="ovr" style="margin-top:8px">Ik had het toch goed</button>' : ''}`;
    host.appendChild(fb);
  } else if (res.self && res.after) {
    fb.className = 'feedback neutral'; fb.innerHTML = res.after; host.appendChild(fb);
  }
  const bar = document.createElement('div');
  bar.className = 'next-bar';
  bar.innerHTML = `<button class="btn primary big" id="nxt">${esc(res.label || 'Verder')} →</button>`;
  host.appendChild(bar);
  $$('[data-open]', host).forEach((b) => b.addEventListener('click', () => showConcept(b.dataset.open)));
  const ovr = $('#ovr', host);
  if (ovr) ovr.addEventListener('click', () => {
    review(item.key, 2); s.wrong--; s.right++; s.mistakes.pop(); addXP(8, ovr);
    ovr.replaceWith(Object.assign(document.createElement('p'), { className: 'small', textContent: '👍 Aangepast naar goed.' }));
  });
  const nxt = $('#nxt', host);
  nxt.focus({ preventScroll: true });
  if (!res.intro) bar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  let moved = false;
  const advance = () => { if (moved) return; moved = true; s.i++; nextExercise(); };
  nxt.addEventListener('click', advance);
  keyHandler = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); } };
}
function finishSession(aborted) {
  const s = SESSION; SESSION = null;
  document.body.classList.remove('in-session');
  keyHandler = null;
  const answered = s.right + s.wrong;
  if (answered > 0) S.sessions++;
  save(); checkBadges();
  const pct = answered ? Math.round((s.right / answered) * 100) : 0;
  const up = Object.entries(s.startBoxes).filter(([k, b]) => card(k).box >= 5 && b < 5).length;
  if (pct >= 80 && answered >= 5) confetti();
  const uniqMist = [...new Map(s.mistakes.map((m) => [m.key, m])).values()];
  view().innerHTML = `<div class="card result-hero">
      <div class="eyebrow">${esc(s.title)}${aborted ? ' · gestopt' : ''}</div>
      <div class="score">${answered ? pct + '%' : '—'}</div>
      <p class="muted">${s.right} goed · ${s.wrong} fout · +${s.xp} XP${up ? ` · ${up} nieuw beheerst 🎓` : ''}</p>
      <p>${pct >= 90 ? 'Fantastisch! Je zit er goed in.' : pct >= 70 ? 'Mooi werk! Herhaling maakt het blijvend.' : 'Fouten maken hoort bij leren: juist die onthoud je straks beter.'}</p>
      <div class="row" style="justify-content:center"><button class="btn primary" data-nav="home">Naar start</button>${uniqMist.length ? '<button class="btn" id="redo">Oefen mijn fouten</button>' : ''}</div>
    </div>
    ${uniqMist.length ? `<div class="card" style="margin-top:14px"><h3>Nog even aandacht voor</h3><div class="mistakes">${uniqMist.map((m) => { const it = ITEMS.get(m.key); return `<button class="lib-item" ${it.key.startsWith('c:') ? `data-open="${it.id}"` : it.c ? `data-open="${it.c}"` : ''}><span class="num">${esc(it.id || it.c || '')}</span><b>${esc(it.t || it.q)}</b><span></span></button>`; }).join('')}</div></div>` : ''}`;
  $$('[data-open]').forEach((b) => b.addEventListener('click', () => showConcept(b.dataset.open)));
  const redo = $('#redo');
  if (redo) redo.addEventListener('click', () => startSession(interleave(uniqMist.map((m) => ({ key: m.key, type: 'auto' }))), 'Foutenronde'));
  renderTop();
}

function smartQueue(domains = activeDomains(), len = S.settings.len) {
  const due = dueItems(domains);
  const minNew = Math.min(2, S.settings.newPer); // altijd een beetje nieuwe stof, tenzij er heel veel te herhalen is
  const nNew = due.length >= len * 2 ? 0 : Math.min(S.settings.newPer, Math.max(minNew, len - due.length));
  const fresh = newItems(domains).slice(0, nNew);
  let picked = [...due.slice(0, len - fresh.length), ...fresh, ...sample(readyFacts(domains), 2)];
  // aanvullen met (nog) niet beheerste of willekeurige stof voor extra herhaling
  if (picked.length < len) {
    const extra = shuffle(pool(domains).filter((x) => S.cards[x.key]?.seen && !picked.includes(x))).sort((a, b) => card(a.key).box - card(b.key).box);
    picked = picked.concat(extra.slice(0, len - picked.length));
  }
  return interleave(picked.map((x) => ({ key: x.key, type: 'auto' })));
}

/* ================= schermen ================= */
const ROUTES = {
  home() {
    const due = dueItems().length, fresh = newItems().length;
    const { l, p } = level();
    const goal = S.settings.goal, done = doneToday();
    const gp = clamp(Math.round((done / goal) * 100), 0, 100);
    const firstTime = !Object.keys(S.cards).length;
    view().innerHTML = `
      <section class="hero">
        <div class="card hero-main">
          <div class="eyebrow">${greet()}</div>
          <h1>${firstTime ? 'Welkom! Klaar om de kennisbasis te veroveren?' : due ? `${due} onderdelen staan klaar om te herhalen` : 'Je bent bij! Tijd voor nieuwe stof.'}</h1>
          <div class="session-meta"><span>🔁 <b>${due}</b> herhalen</span><span>✨ <b>${fresh}</b> nog nieuw</span><span>🎯 <b>${S.settings.len}</b> per sessie</span></div>
          <button class="btn primary big block" id="smart">▶ Start slimme sessie</button>
          <p class="tiny" style="margin-top:8px">Mix van herhaling en nieuwe stof, door elkaar en steeds iets moeilijker.</p>
        </div>
        <div class="card stack">
          <div class="goal"><div class="ring" style="--p:${gp}"><div>${done}<br><span class="tiny">/ ${goal}</span></div></div>
            <div><b>Dagdoel</b><p class="small muted" style="margin:0">${done >= goal ? 'Gehaald! 🎉 Alles extra is bonus.' : `Nog ${goal - done} oefeningen vandaag.`}</p></div></div>
          <div><div class="row" style="justify-content:space-between"><b>Niveau ${l}</b><span class="tiny">${S.xp} XP</span></div><div class="levelbar"><i style="width:${Math.round(p * 100)}%"></i></div></div>
          <div class="row small muted">🔥 ${S.lastDay >= today() - 1 ? S.streak : 0} dagen op rij · record ${S.best || 0}</div>
        </div>
      </section>
      <h2 style="margin-top:26px">Kies je oefenvorm</h2>
      ${modesHTML(true)}
      <div class="card" style="margin-top:22px">
        <div class="row" style="justify-content:space-between"><h2 style="margin:0">Domeinen</h2><span class="tiny">groen = beheerst · geel = aan het leren</span></div>
        <div class="domains" style="margin-top:10px">${DOMAINS.slice(1).map(domRow).join('')}</div>
      </div>
      ${whyHTML()}`;
    $('#smart').addEventListener('click', () => startSession(smartQueue(), 'Slimme sessie'));
    $$('[data-dom]').forEach((b) => b.addEventListener('click', () => domainSheet(+b.dataset.dom)));
    bindModes();
  },

  modes() {
    view().innerHTML = `<h1>Oefenen</h1><p class="muted">Wissel af tussen vormen: elke vorm traint het geheugen op een andere manier.</p>
      ${domainFilterHTML()}
      ${modesHTML(false)}${whyHTML()}`;
    bindDomainFilter(() => go('modes'));
    bindModes();
  },

  flash() { flashcards(); },
  match() { matchMode(); },
  speed() { speedMode(); },
  lists() { listsMode(); },
  library(q) { library(q); },
  progress() { progress(); },
  settings() { settings(); },
};

function greet() { const h = new Date().getHours(); return h < 6 ? 'Nachtbraker 🌙' : h < 12 ? 'Goedemorgen ☀️' : h < 18 ? 'Goedemiddag 👋' : 'Goedenavond 🌆'; }

function domStats(d) {
  const items = [...ITEMS.values()].filter((x) => x.d === d);
  const m = items.filter((x) => status(x.key) === 'm').length, l = items.filter((x) => status(x.key) === 'l').length;
  return { n: items.length, m, l };
}
function domRow(D) {
  const st = domStats(D.n);
  return `<button class="dom-row" data-dom="${D.n}" style="--h:${D.h}"><span class="dom-ico">${D.ico}</span>
    <span><b class="small">${D.n}. ${esc(D.name)}</b><span class="stackbar"><i class="m" style="width:${(st.m / st.n) * 100}%"></i><i class="l" style="width:${(st.l / st.n) * 100}%"></i></span></span>
    <span class="tiny">${st.m}/${st.n}</span></button>`;
}
function domainSheet(d) {
  const D = DOMAINS[d], st = domStats(d);
  openModal(`<div style="--h:${D.h}"><span class="chip">${D.ico} Domein ${d}</span><h2 id="modal-title" style="margin-top:10px">${esc(D.name)}</h2>
    <p class="muted">${st.m} beheerst · ${st.l} aan het leren · ${st.n - st.m - st.l} nieuw</p>
    <div class="grid">
      <button class="btn primary block" id="ds-smart">▶ Slimme sessie alleen dit domein</button>
      <button class="btn block" id="ds-flash">🃏 Flashcards</button>
      <button class="btn block" id="ds-lib">📚 Begrippen bekijken</button>
    </div></div>`);
  $('#ds-smart').addEventListener('click', () => { closeModal(); startSession(smartQueue([d]), D.name); });
  $('#ds-flash').addEventListener('click', () => { closeModal(); flashcards([d]); });
  $('#ds-lib').addEventListener('click', () => { closeModal(); libFilter = d; go('library'); });
}

const MODES = [
  { id: 'smart', ico: '🧠', h: 22, t: 'Slimme sessie', d: 'Herhalen op het juiste moment, afgewisseld met nieuwe stof.' },
  { id: 'flash', ico: '🃏', h: 210, t: 'Flashcards', d: 'Draai de kaart, beoordeel jezelf. Ook omgekeerd.' },
  { id: 'quiz', ico: '❓', h: 140, t: 'Quiz', d: 'Meerkeuze, waar/niet waar en gatenteksten.' },
  { id: 'lists', ico: '📋', h: 42, t: 'Rijtjes & stappenplannen', d: 'Fasen, indelingen en modellen: aanvullen, ordenen, opnoemen.' },
  { id: 'match', ico: '🧲', h: 330, t: 'Koppelspel', d: 'Koppel zo snel mogelijk begrip en uitleg.' },
  { id: 'speed', ico: '⚡', h: 268, t: 'Snelronde', d: '60 seconden: waar of niet waar? Haal je record.' },
  { id: 'explain', ico: '💬', h: 174, t: 'Leg het uit', d: 'Verwoord een begrip zelf en vergelijk met de kennisbasis.' },
  { id: 'type', ico: '⌨️', h: 236, t: 'Typ het begrip', d: 'Zonder keuzehulp: haal het begrip zelf op.' },
];
function modesHTML(compact) {
  const list = compact ? MODES.filter((m) => m.id !== 'smart') : MODES;
  return `<div class="modes">${list.map((m) => `<button class="mode" data-mode="${m.id}" style="--h:${m.h}"><span class="ico">${m.ico}</span><b>${m.t}</b><span class="d">${m.d}</span></button>`).join('')}</div>`;
}
function bindModes() {
  $$('[data-mode]').forEach((b) => b.addEventListener('click', () => {
    const m = b.dataset.mode, doms = activeDomains();
    const concepts = CONCEPTS.filter((c) => doms.includes(c.d));
    const prefer = (arr) => { const seen = arr.filter((x) => S.cards[x.key]?.seen); return seen.length >= 8 ? seen : arr; };
    if (m === 'smart') startSession(smartQueue(), 'Slimme sessie');
    if (m === 'flash') go('flash');
    if (m === 'lists') go('lists');
    if (m === 'match') go('match');
    if (m === 'speed') go('speed');
    if (m === 'quiz') {
      const items = sample([...prefer(concepts), ...FACTS.filter((f) => doms.includes(f.d))], 12);
      startSession(items.map((x) => ({ key: x.key, type: x.key.startsWith('f:') ? 'fact' : pick(['defToTerm', 'termToDef', 'trueFalse', 'cloze']) })), 'Quiz');
    }
    if (m === 'explain') startSession(sample(prefer(concepts), 5).map((x) => ({ key: x.key, type: 'explain' })), 'Leg het uit');
    if (m === 'type') startSession(sample(prefer(concepts), 10).map((x) => ({ key: x.key, type: pick(['typeTerm', 'clozeTyped']) })), 'Typ het begrip');
  }));
}
function whyHTML() {
  return `<details class="card why" style="margin-top:22px"><summary><b>Waarom werkt deze aanpak?</b> <span class="tiny">de leerstrategieën achter de app</span></summary>
    <ul style="margin-top:12px" class="small">
      <li><b>Actief ophalen (retrieval practice):</b> jezelf overhoren werkt beter dan herlezen. Daarom vraagt de app steeds iets terug.</li>
      <li><b>Gespreide herhaling:</b> elk onderdeel zit in een ‘doos’. Goed? Dan zie je het pas na 1, 2, 4, 7, 15, 30… dagen terug. Fout? Dan komt het snel weer langs.</li>
      <li><b>Door elkaar oefenen (interleaving):</b> een sessie mixt domeinen en vormen, zodat je leert onderscheiden en niet op de automatische piloot gaat.</li>
      <li><b>Oplopende moeilijkheid:</b> eerst herkennen (meerkeuze), dan aanvullen, daarna zelf ophalen en uitleggen.</li>
      <li><b>Elaboratie:</b> verbanden leggen (‘zie ook’) en in eigen woorden uitleggen verankert de stof.</li>
      <li><b>Directe feedback:</b> na elke vraag zie je de omschrijving uit de kennisbasis.</li>
    </ul></details>`;
}

let libFilter = 0;
function domainFilterHTML() {
  const on = S.settings.domains;
  return `<div class="card" style="margin:14px 0"><div class="row" style="justify-content:space-between"><b class="small">Welke domeinen oefen je?</b><button class="btn ghost small" id="df-all" style="padding:4px 10px">${on.length === 9 ? 'Geen' : 'Alle'}</button></div>
    <div class="row" style="margin-top:8px;gap:6px">${DOMAINS.slice(1).map((D) => `<button class="chip ${on.includes(D.n) ? '' : 'off'}" data-df="${D.n}" style="--h:${D.h};padding:6px 10px">${D.ico} ${esc(D.short)}</button>`).join('')}</div></div>`;
}
function bindDomainFilter(rerender) {
  $$('[data-df]').forEach((b) => b.addEventListener('click', () => {
    const d = +b.dataset.df, set = new Set(S.settings.domains);
    set.has(d) ? set.delete(d) : set.add(d);
    S.settings.domains = [...set].sort(); save(); rerender();
  }));
  $('#df-all').addEventListener('click', () => { S.settings.domains = S.settings.domains.length === 9 ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; save(); rerender(); });
}

/* ---------- flashcards ---------- */
function flashcards(domains) {
  const doms = domains || activeDomains();
  const items = CONCEPTS.filter((c) => doms.includes(c.d));
  const t = today();
  const due = items.filter((c) => S.cards[c.key]?.seen && card(c.key).due <= t);
  const fresh = items.filter((c) => !S.cards[c.key]?.seen);
  const rest = shuffle(items.filter((c) => S.cards[c.key]?.seen && card(c.key).due > t)).sort((a, b) => card(a.key).box - card(b.key).box);
  let deck = [...shuffle(due), ...fresh.slice(0, 10), ...rest].slice(0, 20);
  if (!deck.length) { view().innerHTML = '<p class="empty">Geen kaarten in deze selectie.</p>'; return; }
  let reverse = false, i = 0, stats = [0, 0, 0, 0];
  document.body.classList.add('in-session');
  const draw = () => {
    if (i >= deck.length) {
      document.body.classList.remove('in-session'); keyHandler = null; S.sessions++; save(); checkBadges();
      view().innerHTML = `<div class="card result-hero"><div class="eyebrow">Flashcards</div><div class="score">${deck.length}</div><p class="muted">kaarten · ${stats[2] + stats[3]} goed · ${stats[1]} moeilijk · ${stats[0]} opnieuw</p>
        <div class="row" style="justify-content:center"><button class="btn primary" data-nav="flash">Nog een stapel</button><button class="btn" data-nav="home">Naar start</button></div></div>`;
      if (stats[2] + stats[3] >= deck.length * 0.8) confetti();
      return;
    }
    const c = deck[i];
    const front = reverse ? `<div class="eyebrow">Welk begrip?</div><p style="font-size:1.1rem;font-weight:600">${maskHTML(oms(c), c.t)}</p>` : `<div class="eyebrow">${esc(c.id)}</div><div class="big-term">${esc(c.t)}</div><p class="tiny">Wat houdt dit in? Bedenk het antwoord en draai dan om.</p>`;
    view().innerHTML = `<div class="sess-top"><button class="sess-x" data-nav="modes" aria-label="Stoppen">✕</button><div class="progress"><i style="width:${(i / deck.length) * 100}%"></i></div><div class="tiny">${i + 1}/${deck.length}</div></div>
      <div class="row" style="justify-content:space-between;margin-bottom:10px">${domChip(c.d)}<label class="small row" style="gap:6px"><input type="checkbox" id="rev" ${reverse ? 'checked' : ''}> Omgekeerd</label></div>
      <div class="flash" id="fc" style="--h:${DOMAINS[c.d].h}"><div class="flash-inner">
        <div class="face front" id="front">${front}<p class="tiny" style="margin-top:14px">Tik of druk op spatie om te draaien</p></div>
        <div class="face back detail"><div class="eyebrow">${esc(c.id)} · ${esc(c.t)}</div><p class="oms" style="margin-top:8px">${esc(c.o)}</p>${c.x[0] ? fmtPara(trunc(c.x[0], 420)) : ''}<button class="btn ghost small" data-open="${c.id}">📖 Alles lezen</button></div>
      </div></div>
      <div class="rate" id="rate" style="visibility:hidden"><button class="btn r0" data-q="0">Opnieuw<small>&lt;1 dag</small></button><button class="btn r1" data-q="1">Moeilijk<small>1 dag</small></button><button class="btn r2" data-q="2">Goed<small>${INTERVALS[Math.min(8, card(c.key).box + 1)]} d</small></button><button class="btn r3" data-q="3">Makkelijk<small>${INTERVALS[Math.min(8, card(c.key).box + 2)]} d</small></button></div>`;
    const flip = () => { $('#fc').classList.add('flipped'); $('#rate').style.visibility = 'visible'; };
    $('#front').addEventListener('click', flip);
    $('#rev').addEventListener('change', (e) => { reverse = e.target.checked; draw(); });
    $$('[data-open]').forEach((b) => b.addEventListener('click', () => showConcept(b.dataset.open)));
    const rate = (q, el) => {
      review(c.key, q); stats[q]++; addXP(q === 0 ? 1 : 5, el);
      if (q === 0) deck.splice(Math.min(deck.length, i + 4), 0, c);
      i++; draw();
    };
    $$('#rate .btn').forEach((b) => b.addEventListener('click', () => rate(+b.dataset.q, b)));
    keyHandler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      const k = +e.key; if ($('#fc').classList.contains('flipped') && k >= 1 && k <= 4) rate(k - 1, $$('#rate .btn')[k - 1]);
    };
  };
  draw();
}

/* ---------- rijtjes ---------- */
function listsMode() {
  const doms = activeDomains();
  const ls = LISTS.filter((l) => doms.includes(l.d));
  view().innerHTML = `<h1>Rijtjes & stappenplannen</h1>
    <p class="muted">Indelingen, fasen en modellen die vaak getoetst worden. Kies er één of oefen een mix.</p>
    <button class="btn primary big block" id="mix">▶ Mix van ${Math.min(10, ls.length)} rijtjes</button>
    <div style="margin-top:16px">${ls.map((l) => `<button class="lib-item" data-l="${l.id}" style="--h:${DOMAINS[l.d].h}"><span class="chip">${DOMAINS[l.d].ico} ${l.d}</span><b>${esc(l.t)}${l.o ? ' <span class="tiny">· volgorde</span>' : ''}</b><span class="dot ${status(l.key)}"></span></button>`).join('')}</div>`;
  $('#mix').addEventListener('click', () => startSession(interleave(sample(ls, 10).map((l) => ({ key: l.key, type: 'auto' }))), 'Rijtjes'));
  $$('[data-l]').forEach((b) => b.addEventListener('click', () => {
    const l = LISTS.find((x) => x.id === b.dataset.l);
    const types = ['listIntro', 'listMissing', 'listIntruder'];
    if (l.i.filter((x) => x[1]).length >= 3) types.push('listMatch');
    if (l.o) types.push('listOrder');
    types.push('listRecall');
    startSession(types.map((t) => ({ key: l.key, type: t })), l.t);
  }));
}

/* ---------- koppelspel ---------- */
function matchMode() {
  const doms = activeDomains();
  const pairs = LISTS.filter((l) => doms.includes(l.d)).flatMap((l) => l.i.filter((x) => x[1] && x[1].length < 90).map((x) => ({ a: x[0], b: x[1], l })));
  const chosen = [];
  const usedA = new Set();
  for (const p of shuffle(pairs)) { if (chosen.length >= 6) break; if (!usedA.has(norm(p.a))) { usedA.add(norm(p.a)); chosen.push(p); } }
  if (chosen.length < 3) { view().innerHTML = '<p class="empty">Te weinig koppels in deze domeinen. Kies meer domeinen bij Oefenen.</p>'; return; }
  view().innerHTML = `<div class="sess-top"><button class="sess-x" data-nav="modes" aria-label="Stoppen">✕</button><b style="flex:1">🧲 Koppelspel</b><span class="pill" id="clock">0 s</span></div><div id="mg"></div>`;
  const t0 = Date.now();
  const iv = setInterval(() => { const c = $('#clock'); if (!c) return clearInterval(iv); c.textContent = Math.round((Date.now() - t0) / 1000) + ' s'; }, 250);
  matchGame($('#mg'), { head: '<p class="muted small">Tik een begrip en daarna de bijpassende uitleg.</p>', pairs: chosen.map((p) => [p.a, p.b]) }, (res) => {
    clearInterval(iv);
    const rec = S.records.match;
    const isRec = res.errors === 0 && (!rec || res.secs < rec);
    if (isRec) S.records.match = res.secs;
    tickDay(chosen.length); save();
    addXP(Math.max(5, chosen.length * 5 - res.errors * 2));
    if (isRec) confetti();
    const div = document.createElement('div');
    div.className = 'card result-hero'; div.style.marginTop = '16px';
    div.innerHTML = `<div class="score">${res.secs} s</div><p class="muted">${res.errors} fout${res.errors === 1 ? '' : 'en'}${isRec ? ' · 🏆 nieuw record!' : rec ? ` · record ${rec} s` : ''}</p>
      <div class="row" style="justify-content:center"><button class="btn primary" data-nav="match">Nog een keer</button><button class="btn" data-nav="modes">Andere oefenvorm</button></div>`;
    $('#mg').appendChild(div);
  });
}

/* ---------- snelronde ---------- */
function speedStatement() {
  const doms = activeDomains();
  const ls = LISTS.filter((l) => doms.includes(l.d));
  const r = Math.random();
  if (r < 0.45 && ls.length) {
    const l = pick(ls), truth = Math.random() < 0.5;
    let item = pick(l.i)[0];
    if (!truth) {
      const near = LISTS.filter((x) => x.id !== l.id && x.d === l.d);
      const o = pick(near.length ? near : LISTS.filter((x) => x.id !== l.id));
      const cand = o.i.filter((i) => !l.i.some((j) => norm(j[0]) === norm(i[0])));
      item = (cand.length ? pick(cand) : pick(o.i))[0];
    }
    return { html: `<div class="eyebrow">${esc(l.t)}</div><p class="prompt serif">“${esc(item)}” hoort hierbij</p>`, truth, d: l.d };
  }
  if (r < 0.8 && ls.length) {
    const withLists = ls.filter((x) => x.i.filter((i) => i[1]).length >= 2);
    const l = withLists.length ? pick(withLists) : null;
    const withE = l ? l.i.filter((i) => i[1]) : [];
    if (withE.length >= 2) {
      const a = pick(withE), truth = Math.random() < 0.5;
      const b = truth ? a : pick(withE.filter((x) => x !== a));
      return { html: `<div class="eyebrow">${esc(l.t)}</div><p class="prompt serif">${esc(a[0])}</p><div class="quote">${esc(b[1])}</div>`, truth, d: l.d };
    }
  }
  const fs = FACTS.filter((f) => doms.includes(f.d));
  const f = pick(fs.length ? fs : FACTS), truth = Math.random() < 0.5;
  return { html: `<p class="prompt">${esc(f.q)}</p><div class="quote">${esc(truth ? f.a[0] : pick(f.a.slice(1)))}</div>`, truth, d: f.d };
}
function speedMode() {
  let score = 0, combo = 0, n = 0, running = false, end = 0;
  view().innerHTML = `<div class="card result-hero"><div style="font-size:3rem">⚡</div><h1>Snelronde</h1><p class="muted">60 seconden. Waar of niet waar? Elke goede = 1 punt, reeksen geven bonus.<br>Toetsen: <b>J</b> = waar, <b>N</b> = niet waar.</p>
    <p>Record: <b>${S.records.speed}</b></p><button class="btn primary big" id="go">Start!</button></div>`;
  $('#go').addEventListener('click', () => {
    running = true; end = Date.now() + 60000;
    document.body.classList.add('in-session');
    view().innerHTML = `<div class="sess-top"><button class="sess-x" data-nav="modes" aria-label="Stoppen">✕</button><div class="progress"><i id="tbar" style="width:100%;background:var(--accent)"></i></div><span class="pill" id="sc">0</span></div><div class="ex card" id="st"></div>`;
    const tick = setInterval(() => {
      const left = end - Date.now(); const b = $('#tbar');
      if (!b) { clearInterval(tick); return; }
      b.style.width = clamp(left / 600, 0, 100) + '%';
      if (left <= 0) { clearInterval(tick); stop(); }
    }, 100);
    next();
  });
  let cur;
  function next() {
    cur = speedStatement();
    $('#st').innerHTML = `<div class="ex-type">${domChip(cur.d)}${combo >= 3 ? `<span class="combo">🔥×${combo}</span>` : ''}</div>${cur.html}<div class="tf"><button class="btn yes" data-v="1">✓ Waar</button><button class="btn no" data-v="0">✗ Niet waar</button></div>`;
    $$('#st .tf .btn').forEach((b) => b.addEventListener('click', () => answer(b.dataset.v === '1', b)));
  }
  function answer(v, el) {
    if (!running) return;
    n++;
    if (v === cur.truth) { combo++; score += 1 + (combo >= 5 ? 1 : 0); beep(true); }
    else { combo = 0; beep(false); $('#st').animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], 250); }
    $('#sc').textContent = score;
    next();
  }
  keyHandler = (e) => { if (/^[jy]$/i.test(e.key)) answer(true); if (/^n$/i.test(e.key)) answer(false); };
  function stop() {
    running = false; keyHandler = null; document.body.classList.remove('in-session');
    const rec = score > S.records.speed; if (rec) S.records.speed = score;
    S.history[today()] = (S.history[today()] || 0) + n; tickDay(0); S.sessions++; save();
    addXP(score * 2);
    if (rec && score > 0) confetti();
    view().innerHTML = `<div class="card result-hero"><div class="eyebrow">Snelronde</div><div class="score">${score}</div><p class="muted">${n} beantwoord${rec ? ' · 🏆 nieuw record!' : ` · record ${S.records.speed}`}</p>
      <div class="row" style="justify-content:center"><button class="btn primary" data-nav="speed">Nog een keer</button><button class="btn" data-nav="modes">Andere oefenvorm</button></div></div>`;
  }
}

/* ---------- bibliotheek ---------- */
function library() {
  let q = '';
  view().innerHTML = `<h1>Begrippen</h1><p class="muted">Alle ${CONCEPTS.length} begrippen uit de kennisbasis. Tik om te lezen.</p>
    <div class="search"><input class="input" id="q" placeholder="Zoek een begrip of woord…" autocomplete="off"><div class="dom-filter" style="margin-top:8px">
      <button class="chip ${libFilter ? 'off' : ''}" data-lf="0" style="--h:20">Alles</button>${DOMAINS.slice(1).map((D) => `<button class="chip ${libFilter === D.n ? '' : 'off'}" data-lf="${D.n}" style="--h:${D.h}">${D.ico} ${esc(D.short)}</button>`).join('')}</div></div>
    <div id="lib"></div>`;
  const draw = () => {
    const nq = norm(q);
    const hits = CONCEPTS.filter((c) => (!libFilter || c.d === libFilter) && (!nq || norm(c.t).includes(nq) || norm(c.o + ' ' + c.x.join(' ')).includes(nq)));
    let html = '', lastD = 0, lastS = 0;
    for (const c of hits) {
      if (c.d !== lastD) { html += `<h2 style="margin-top:22px;--h:${DOMAINS[c.d].h}"><span class="chip">${DOMAINS[c.d].ico} ${c.d}</span> ${esc(DOMAINS[c.d].name)}</h2>`; lastD = c.d; lastS = 0; }
      if (c.s !== lastS) { html += `<div class="eyebrow lib-sub">${c.d}.${c.s} · ${esc(SUBS[c.s] || '')}</div>`; lastS = c.s; }
      html += `<button class="lib-item" data-open="${c.id}"><span class="num">${esc(c.id)}</span><b>${esc(c.t)}</b><span class="dot ${status(c.key)}" title="${{ n: 'nieuw', l: 'aan het leren', m: 'beheerst' }[status(c.key)]}"></span></button>`;
    }
    $('#lib').innerHTML = html || '<p class="empty">Niets gevonden.</p>';
    $$('#lib [data-open]').forEach((b) => b.addEventListener('click', () => showConcept(b.dataset.open, q)));
  };
  $('#q').addEventListener('input', (e) => { q = e.target.value; draw(); });
  $$('[data-lf]').forEach((b) => b.addEventListener('click', () => { libFilter = +b.dataset.lf; $$('[data-lf]').forEach((x) => x.classList.toggle('off', x !== b)); draw(); }));
  draw();
}
function showConcept(id, highlight) {
  const c = BY_ID[id];
  if (!c) return;
  const D = DOMAINS[c.d];
  const lists = LISTS.filter((l) => l.c === c.id);
  let body = c.x.map(fmtPara).join('');
  if (highlight && highlight.length > 2) body = body.replace(new RegExp(`(${reEsc(esc(highlight))})`, 'gi'), '<mark>$1</mark>');
  const st = status(c.key), cd = card(c.key);
  openModal(`<div class="detail" style="--h:${D.h}">
    <div class="row"><span class="chip">${D.ico} ${esc(D.name)}</span><span class="tiny">${c.d}.${c.s} ${esc(SUBS[c.s] || '')}</span></div>
    <h2 id="modal-title" style="margin-top:12px">${esc(c.id)} ${esc(c.t)}</h2>
    <p class="oms">${esc(c.o)}</p>
    ${body}
    ${lists.length ? `<p class="eyebrow">Rijtjes bij dit begrip</p>${lists.map((l) => `<p><b>${esc(l.t)}</b></p>${listHTML(l)}`).join('')}` : ''}
    ${c.z.length ? `<p class="eyebrow" style="margin-top:14px">Zie ook</p><div class="zie">${c.z.map((z) => { const t = TITLE_IDX.get(norm(z)); const m = t && (t.find((x) => x.d === c.d) || t[0]); return m ? `<button data-goto="${m.id}">${esc(z)} →</button>` : `<span>${esc(z)}</span>`; }).join('')}</div>` : ''}
    <div class="row" style="margin-top:18px;justify-content:space-between">
      <span class="small muted">Status: <b>${{ n: 'nieuw', l: 'aan het leren', m: 'beheerst ✓' }[st]}</b>${cd.seen ? ` · ${cd.right || 0}× goed, ${cd.wrong || 0}× fout` : ''}</span>
      <button class="btn primary" id="practice">🎯 Oefen dit begrip</button></div></div>`);
  $$('[data-goto]').forEach((b) => b.addEventListener('click', () => showConcept(b.dataset.goto)));
  $('#practice').addEventListener('click', () => {
    closeModal();
    const steps = [{ key: c.key, type: 'intro' }, { key: c.key, type: 'defToTerm' }, { key: c.key, type: 'termToDef' }];
    if (clozesFor(c).length) steps.push({ key: c.key, type: 'cloze' });
    if (c.z.length) steps.push({ key: c.key, type: 'related' });
    steps.push({ key: c.key, type: 'typeTerm' });
    lists.forEach((l) => steps.push({ key: l.key, type: 'auto' }));
    startSession(steps, c.t);
  });
  $('#modal').scrollTop = 0; $('.modal-card').scrollTop = 0;
}
document.addEventListener('click', (e) => { const o = e.target.closest('#modal [data-open]'); if (o) showConcept(o.dataset.open); });

/* ---------- voortgang ---------- */
function progress() {
  const all = [...ITEMS.values()];
  const m = all.filter((x) => status(x.key) === 'm').length, l = all.filter((x) => status(x.key) === 'l').length;
  const total = Object.values(S.history).reduce((a, b) => a + b, 0);
  const t = today();
  const startDay = t - 7 * 15 - ((new Date().getDay() + 6) % 7);
  let heat = '';
  for (let d = startDay; d <= t; d++) { const v = S.history[d] || 0; heat += `<i class="${v ? (v >= 30 ? 'h3' : v >= 12 ? 'h2' : 'h1') : ''}" title="${new Date(d * 864e5).toLocaleDateString('nl-NL')}: ${v}"></i>`; }
  const due7 = all.filter((x) => S.cards[x.key]?.seen && card(x.key).due <= t + 7).length;
  view().innerHTML = `<h1>Voortgang</h1>
    <div class="stats">
      <div class="stat"><b>${m}</b><span class="small muted">beheerst</span></div>
      <div class="stat"><b>${l}</b><span class="small muted">aan het leren</span></div>
      <div class="stat"><b>${all.length - m - l}</b><span class="small muted">nog nieuw</span></div>
      <div class="stat"><b>${total}</b><span class="small muted">oefeningen totaal</span></div>
      <div class="stat"><b>${S.best || 0}</b><span class="small muted">langste streak</span></div>
      <div class="stat"><b>${due7}</b><span class="small muted">herhalingen komende week</span></div>
    </div>
    <div class="card" style="margin-top:16px"><h2>Per domein</h2><div class="domains">${DOMAINS.slice(1).map(domRow).join('')}</div></div>
    <div class="card" style="margin-top:16px"><h2>Activiteit</h2><div class="heat">${heat}</div><p class="tiny">Laatste 16 weken · donkerder = meer geoefend</p></div>
    <div class="card" style="margin-top:16px"><h2>Badges</h2><div class="badges">${BADGES.map((b) => `<div class="badge ${S.badges.includes(b.id) ? '' : 'locked'}"><span class="e">${b.e}</span><b>${b.t}</b><span>${b.d}</span></div>`).join('')}</div></div>
    <div class="card" style="margin-top:16px"><h2>Records</h2><p>⚡ Snelronde: <b>${S.records.speed}</b> punten · 🧲 Koppelspel: <b>${S.records.match ? S.records.match + ' s' : '—'}</b></p></div>
    <button class="btn block" style="margin-top:16px" data-nav="settings">⚙️ Instellingen & back-up</button>`;
  $$('[data-dom]').forEach((b) => b.addEventListener('click', () => domainSheet(+b.dataset.dom)));
}

/* ---------- instellingen ---------- */
function settings() {
  const st = S.settings;
  const sel = (id, vals, cur, lab) => `<select id="${id}">${vals.map((v) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${lab ? lab(v) : v}</option>`).join('')}</select>`;
  view().innerHTML = `<h1>Instellingen</h1>
    <div class="card settings">
      <label>Oefeningen per slimme sessie ${sel('s-len', [10, 15, 20, 30], st.len)}</label>
      <label>Max. nieuwe onderdelen per sessie ${sel('s-new', [3, 6, 9, 12], st.newPer)}</label>
      <label>Dagdoel (oefeningen) ${sel('s-goal', [15, 30, 50, 80], st.goal)}</label>
      <label>Geluidjes <input type="checkbox" id="s-sound" ${st.sound ? 'checked' : ''}></label>
      <label>Thema ${sel('s-theme', ['auto', 'light', 'dark'], st.theme, (v) => ({ auto: 'Automatisch', light: 'Licht', dark: 'Donker' }[v]))}</label>
    </div>
    ${domainFilterHTML()}
    <div class="card stack">
      <h2>Back-up</h2>
      <p class="small muted">Je voortgang staat alleen in deze browser. Maak een back-up om over te zetten naar een ander apparaat.</p>
      <div class="row"><button class="btn" id="exp">⬇️ Exporteer voortgang</button><label class="btn" style="cursor:pointer">⬆️ Importeer<input type="file" id="imp" accept="application/json" hidden></label></div>
      <button class="btn ghost" id="reset" style="color:var(--bad)">Alles wissen en opnieuw beginnen</button>
    </div>
    <p class="tiny" style="margin-top:16px">Bron: Uitwerking kennisbasis Nederlands (pabo). ${CONCEPTS.length} begrippen · ${LISTS.length} rijtjes · ${FACTS.length} kennisvragen.</p>`;
  const bind = (id, fn) => $(id).addEventListener('change', (e) => { fn(e.target); save(); applyTheme(); toast('Opgeslagen'); });
  bind('#s-len', (t) => (st.len = +t.value));
  bind('#s-new', (t) => (st.newPer = +t.value));
  bind('#s-goal', (t) => (st.goal = +t.value));
  bind('#s-sound', (t) => (st.sound = t.checked));
  bind('#s-theme', (t) => (st.theme = t.value));
  bindDomainFilter(() => go('settings'));
  $('#exp').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' }));
    a.download = `taaltrainer-voortgang-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  });
  $('#imp').addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const d = JSON.parse(await f.text()); if (!d.cards) throw 0; S = Object.assign(DEFAULT(), d); save(); toast('Voortgang geïmporteerd'); go('home'); }
    catch { toast('Dit bestand kon ik niet lezen.'); }
  });
  $('#reset').addEventListener('click', () => { if (confirm('Weet je het zeker? Al je voortgang wordt gewist.')) { S = DEFAULT(); save(); applyTheme(); go('home'); } });
}

/* ================= start ================= */
applyTheme();
renderTop();
go('home');
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
