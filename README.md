# Pabo Taaltrainer

Webapp om de **kennisbasis Nederlands (pabo)** op een leuke en effectieve manier te leren.
Alle 308 begrippen uit de *Uitwerking kennisbasis Nederlands* (9 domeinen), aangevuld met 52 rijtjes/stappenplannen en 38 kennisvragen.

## Oefenvormen
- **Slimme sessie**: mix van herhaling en nieuwe stof, door elkaar, steeds iets moeilijker
- **Flashcards** (ook omgekeerd) met zelfbeoordeling
- **Quiz**: meerkeuze, waar/niet waar, gatenteksten, ‘zie ook’-verbanden
- **Rijtjes & stappenplannen**: aanvullen, indringer zoeken, ordenen, koppelen, opnoemen
- **Koppelspel** (op tijd) en **Snelronde** (60 s waar/niet waar)
- **Leg het uit**: zelf verwoorden en vergelijken met de kennisbasis (kernwoorden-check)
- **Typ het begrip**: vrij ophalen zonder keuzehulp
- **Begrippen**: doorzoekbare naslag met status per begrip

## Leerstrategieën
Actief ophalen, gespreide herhaling (Leitner-dozen: 1, 2, 4, 7, 15, 30, 60, 120 dagen), interleaving,
oplopende moeilijkheid, elaboratie en directe feedback. Voortgang, XP, streaks en badges staan in `localStorage`
(exporteren/importeren via Instellingen).

## Lokaal draaien
Statische site zonder build-stap:

```bash
python -m http.server 5178
```

en open http://localhost:5178.

## Data opnieuw opbouwen
`tools/parse_pdf_text.py` leest de met `pdftotext -enc UTF-8` geëxtraheerde PDF-tekst en maakt `concepts.json`;
`tools/build_data.py` zet dat om naar `data/concepts.js`. De rijtjes en kennisvragen staan handmatig in `data/curated.js`.
