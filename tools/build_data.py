"""Zet concepts.json (uit parse_pdf_text.py) om naar data/concepts.js voor de webapp."""
import json, re, sys

src, dst = sys.argv[1], sys.argv[2]
items = json.load(open(src, encoding='utf-8'))


def clean(t):
    t = re.sub(r'\s\d{1,2}B\s', ' ', t)          # pdf-bladwijzerresten zoals "0B", "29B"
    t = t.replace('\u00ad', '').replace('\ufffd', '')
    t = re.sub(r'\s{2,}', ' ', t)
    t = t.replace('bottum', 'bottom')
    return t.strip()


out = []
for c in items:
    toe = [clean(p) for p in c['toe'] if clean(p)]
    zie = [clean(z) for z in c['zie'] if clean(z)]
    zie = [z[0].upper() + z[1:] for z in zie]
    out.append({'id': c['id'], 'd': c['d'], 's': c['s'], 't': clean(c['title']), 'o': clean(c['oms']), 'x': toe, 'z': zie})

with open(dst, 'w', encoding='utf-8') as f:
    f.write('// Gegenereerd door tools/build_data.py uit de Uitwerking kennisbasis Nederlands (pabo).\n')
    f.write('window.CONCEPTS = ')
    json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')
print(len(out), 'begrippen geschreven')
