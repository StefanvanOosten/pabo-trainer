import re, json, sys

txt = open(sys.argv[1], encoding='utf-8').read().replace('\f', '\n')
lines = txt.split('\n')
H = re.compile(r'^\s*(\d)\.(\d)\.(\d{1,2})\.?\s*([A-Za-zÀ-ÿ(].*)$')
heads = []
for i, l in enumerate(lines):
    m = H.match(l)
    if m:
        win = "\n".join(lines[i:i + 8])
        if 'Omschrijving' in win or 'startbekwame' in win:
            heads.append((i, m))

SENT = re.compile(r'(?<=[.!?:])\s+(?=[A-ZÀ-Ý])')


def split_zie(p):
    """Return (rest, zie-list) if the paragraph ends with a semicolon list."""
    parts = SENT.split(p.strip())
    last = parts[-1].strip()
    if ';' in last and len(last) < 400 and not last.startswith('-'):
        items = [z.strip(' .').strip() for z in last.split(';') if z.strip(' .')]
        if all(len(z) < 80 for z in items):
            return ' '.join(parts[:-1]).strip(), items
    return None


items = []
for k, (i, m) in enumerate(heads):
    end = heads[k + 1][0] if k + 1 < len(heads) else len(lines)
    raw = m.group(4).strip()
    title = re.split(r'\s{2,}', raw)[0].strip()
    rest = raw[len(title):].strip()
    tm = re.search(r'\s*\b(Omschrijving|Toelichting)\b.*$', title)
    if tm:
        title = title[:tm.start()]
    title = re.sub(r'^\([\d., ]+\)\s*', '', title).strip().rstrip('.')
    title = title[0].upper() + title[1:]
    title = title.replace('Strategieen', 'Strategieën').replace('stelles', 'stellen').replace('geletterheid', 'geletterdheid')
    body = ([rest] if rest else []) + lines[i + 1:end]
    paras, cur = [], []
    for l in body:
        s = l.strip()
        if not s:
            if cur:
                paras.append(' '.join(cur)); cur = []
        else:
            cur.append(s)
    if cur:
        paras.append(' '.join(cur))
    paras = [p for p in paras if not re.fullmatch(r'\d+', p)]
    LBL = re.compile(r'^(?:(?:Omschrijving|Toelichting|Zie ook)\s*)+')
    clean = []
    for p in paras:
        p = LBL.sub('', p).strip()
        p = re.sub(r'\s+(?:Omschrijving|Toelichting|Zie ook)\s*$', '', p).strip()
        if p:
            clean.append(p)
    # merge paragraphs that are broken mid-sentence (pdf line breaks)
    merged = []
    for p in clean:
        if merged and not re.search(r'[.!?:;)]$', merged[-1]) and not p.startswith('-') and p[0].islower():
            merged[-1] += ' ' + p
        else:
            merged.append(p)
    oms, toe, zie = '', [], []
    if merged:
        first = merged[0]
        mm = re.search(r'[.!?](\s|$)', first)
        if mm and mm.end() < len(first):
            oms = first[:mm.end()].strip(); toe = [first[mm.end():].strip()] + merged[1:]
        else:
            oms = first; toe = merged[1:]
    for j in range(len(toe) - 1, max(-1, len(toe) - 6), -1):
        r = split_zie(toe[j])
        if r:
            rest_p, zie = r
            if rest_p:
                toe[j] = rest_p
            else:
                del toe[j]
            break
    items.append(dict(id=f"{m.group(1)}.{m.group(2)}.{m.group(3)}", d=int(m.group(1)), s=int(m.group(2)),
                      title=title, oms=oms, toe=toe, zie=zie))

seen = set()
for it in items:
    while it['id'] in seen:
        it['id'] += "b"
    seen.add(it['id'])
json.dump(items, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(items), 'concepts;', sum(1 for i in items if i['zie']), 'with zie ook;', sum(1 for i in items if not i['toe']), 'without toelichting')
for it in items:
    if not it['oms'] or not it['toe']:
        print('WARN', it['id'], it['title'], len(it['oms']), len(it['toe']))
