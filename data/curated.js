// Handmatig samengestelde oefenstof uit de Uitwerking kennisbasis Nederlands.
// LISTS: rijtjes/indelingen. o = true als de volgorde ertoe doet. Items: [term, uitleg?]
// FACTS: meerkeuzevragen over kernfeiten. a = juiste antwoord (index 0 in de bron, wordt geschud).

window.LISTS = [
  { id: 'L01', c: '1.1.4', d: 1, t: 'De vier manieren van luisteren', o: false, i: [
    ['globaal luisteren', 'de grote lijn volgen'],
    ['intensief luisteren', 'details ook belangrijk vinden'],
    ['gericht luisteren', 'specifieke informatie oppikken'],
    ['kritisch luisteren', 'een mening vormen']] },
  { id: 'L02', c: '1.1.5', d: 1, t: 'Spreekdoelen', o: false, i: [
    ['amuseren', 'bijv. een mop vertellen'],
    ['informeren', 'bijv. vertellen hoe laat het is'],
    ['instrueren', 'bijv. de weg wijzen'],
    ['overtuigen', 'bijv. zeggen dat je een boek echt moet lezen']] },
  { id: 'L03', c: '1.1.3', d: 1, t: 'Voorbeelden van luisterdoelen', o: false, i: [
    ['iets te weten willen komen'], ['een bepaald gevoel willen ondergaan'], ['zich een mening willen vormen'],
    ['een bepaalde handeling willen uitvoeren'], ['een spel mee willen spelen']] },
  { id: 'L04', c: '1.1.7', d: 1, t: 'Aspecten van spreektechniek', o: false, i: [
    ['uitspraak', 'de uitspraak van klanken en klankcombinaties'],
    ['articulatie', 'het duidelijk uitspreken van de klanken'],
    ['intonatie', 'het toonhoogteverloop van woorden en zinnen']] },
  { id: 'L05', c: '1.1.8', d: 1, t: 'Sociale taalfuncties', o: false, i: [
    ['zelfhandhaving', 'zichzelf verdedigen of bezit beschermen ("Die had ik!")'],
    ['zelfsturing', 'eigen handelingen met woorden ordenen of plannen aankondigen'],
    ['sturing van anderen', 'gedrag van anderen beïnvloeden ("Zullen we gaan zwemmen?")'],
    ['structurering van het gesprek', '"Mag ik even wat zeggen?"']] },
  { id: 'L06', c: '1.1.15', d: 1, t: 'Relaties tussen zinnen (oplopend in moeilijkheid)', o: true, i: [
    ['vraag-antwoordstructuren'], ['chronologische volgorde (en toen)'], ['voorbeelden'],
    ['vergelijkingen (maar)'], ['middel-doelrelaties (want)'], ['voorwaardelijke structuren (als)']] },
  { id: 'L07', c: '1.2.3', d: 1, t: 'Scaffoldingstrategieën (Smit, Van Eerde & Bakker, 2013)', o: false, i: [
    ['herformuleren van leerlinguitingen'], ['verwijzen naar de benodigde denkstappen'], ['verwijzen naar woorden of formuleringen'],
    ['vragen om de taal te verbeteren'], ['herhalen van correcte taaluitingen'], ['vragen om de denkstappen te verwoorden']] },
  { id: 'L08', c: '1.2.4', d: 1, t: 'Vragen naar didactisch doel', o: false, i: [
    ['oplossingsgerichte vraag', '"Welke lessen wil jij dan hebben vandaag?"'],
    ['controlevraag', '"Kun je nog eens uitleggen hoe dat werkt?"'],
    ['reproducerende vraag', '"Wat is de hoofdstad van Spanje?"'],
    ['diagnosticerende vraag', '"Weet je nog wat hoofdsteden waren?"'],
    ['opiniërende / evaluatieve vraag', '"Wat vind jij daarvan?"']] },
  { id: 'L09', c: '1.3.3', d: 1, t: 'Taalontwikkelingsfasen', o: true, i: [
    ['huilen', 'eerste 6 weken (prelinguaal)'],
    ['vocaliseren', '6-20 weken (prelinguaal)'],
    ['vocaal spel', '4-6 maanden (prelinguaal)'],
    ['brabbelfase', 'vanaf 7 maanden (prelinguaal)'],
    ['vroeglinguale periode', '1-2,5 jaar: eenwoordzin, tweewoordzin, meerwoordzin'],
    ['differentiatiefase', '2,5-5 jaar: explosieve ontwikkeling'],
    ['voltooiingsfase', '5 jaar en ouder: de puntjes op de i']] },
  { id: 'L10', c: '1.3.5', d: 1, t: 'De drie functies van taal', o: false, i: [
    ['communicatieve functie', 'taal gebruiken om met anderen te communiceren'],
    ['conceptualiserende functie', 'taal gebruiken om de werkelijkheid te ordenen'],
    ['expressieve functie', 'taal gebruiken om persoonlijke emoties te uiten']] },
  { id: 'L11', c: '1.3.6', d: 1, t: 'Deelcompetenties van communicatieve competentie', o: false, i: [
    ['grammaticale competentie', 'fonologische en syntactische vaardigheden en een adequate woordenschat'],
    ['tekstuele competentie', 'de opbouw van teksten doorzien en teksten kunnen structureren'],
    ['strategische competentie', 'strategieën hanteren om communicatieve doelen te bereiken'],
    ['functionele competentie', 'taalgebruik aanpassen aan specifieke contexten']] },
  { id: 'L12', c: '1.4.1', d: 1, t: 'Uitgangspunten van interactief taalonderwijs', o: false, i: [
    ['sociaal leren'], ['betekenisvol leren'], ['strategisch leren']] },
  { id: 'L13', c: '2.1.4', d: 2, t: 'Woordleerstrategieën: woordbetekenissen achterhalen', o: false, i: [
    ['woord analyseren'], ['gebruikmaken van de verbale en non-verbale context'],
    ['gebruikmaken van een bron in de eerste of tweede taal'], ['letten op overeenkomsten tussen eerste en tweede taal']] },
  { id: 'L14', c: '2.2.2', d: 2, t: 'De drie uitjes bij semantiseren (Van den Nulft & Verhallen)', o: false, i: [
    ['uitbeelden', 'woordbetekenis zichtbaar maken met beelden, gebaren en voorwerpen'],
    ['uitleggen', 'verbale uitleg, omschrijven, voorbeelden geven'],
    ['uitbreiden', 'het woord in een netwerk van andere woorden plaatsen']] },
  { id: 'L15', c: '2.2.5', d: 2, t: 'De viertakt (didactisch model woordenschat)', o: true, i: [
    ['voorbewerken', 'voorkennis en gerelateerde begrippen activeren'],
    ['semantiseren', 'de woordbetekenis uitleggen'],
    ['consolideren', 'woord en betekenis oefenen (bijv. woordkast, woordparaplu)'],
    ['controleren', 'nagaan of de woorden zijn onthouden, enkele weken later']] },
  { id: 'L16', c: '2.1.6', d: 2, t: 'Soorten relaties in het woordnetwerk', o: false, i: [
    ['betekenisrelaties', 'venster-raam, vogel-mus, koekenpan-schort'],
    ['vormrelaties', 'rijmwoorden (bank-rank) of woorden die hetzelfde klinken (bank-bank)']] },
  { id: 'L17', c: '3.1.8', d: 3, t: 'Stappen van de elementaire leeshandeling', o: true, i: [
    ['het geschreven woord visueel analyseren in grafemen', 'tuin → t, ui, n'],
    ['de juiste fonemen koppelen aan de grafemen', '/t/ aan t'],
    ['de volgorde van de fonemen onthouden'],
    ['de fonemen auditief synthetiseren', '/t/+/ui/+/n/ → /tuin/'],
    ['betekenis geven aan het gesproken woord']] },
  { id: 'L18', c: '3.1.9', d: 3, t: 'Stappen van de elementaire spellinghandeling', o: true, i: [
    ['het gesproken woord auditief analyseren in fonemen', '/tuin/ → /t/, /ui/, /n/'],
    ['de volgorde van de fonemen onthouden'],
    ['de juiste grafemen koppelen aan de fonemen', 't aan /t/'],
    ['het hele woord schrijven', 'tuin']] },
  { id: 'L19', c: '3.1.7', d: 3, t: 'Visuele vaardigheden', o: false, i: [
    ['visuele analyse', 'de afzonderlijke grafemen in een woord herkennen'],
    ['visuele synthese', 'grafemen samenvoegen'],
    ['spatieel ordenen', 'letters van links naar rechts ordenen (kat ≠ tak)']] },
  { id: 'L20', c: '3.3.1', d: 3, t: 'Fasen vroege leesontwikkeling (Verhoeven & Aarnoutse)', o: true, i: [
    ['herkenning van bekende woorden', 'vaak de eigen naam'],
    ['woordbeelden vergelijken'],
    ['nieuwe woorden lezen']] },
  { id: 'L21', c: '3.3.3', d: 3, t: 'Componenten van functionele geletterdheid (Aarnoutse & Verhoeven)', o: false, i: [
    ['betrokkenheid', 'lees- en schrijfmotivatie'],
    ['(de)codeervaardigheid', 'technisch lezen en spellen'],
    ['tekstvaardigheid', 'begrijpend lezen en schrijven'],
    ['strategische vaardigheid', 'informatieverwerving en kennisverwerving'],
    ['leeswoordenschat'],
    ['reflectie', 'functies en structuur van geschreven taal']] },
  { id: 'L22', c: '3.2.14', d: 3, t: 'Speerpunten van De Taallijn', o: false, i: [
    ['mondelinge taal'], ['werken aan woordenschat'], ['beginnende geletterdheid'], ['ouderbetrokkenheid'], ['ICT en multimedia']] },
  { id: 'L23', c: '4.1.1', d: 4, t: 'Strategieën voor technisch lezen', o: true, i: [
    ['elementaire leeshandeling', 'grafeem voor grafeem verklanken'],
    ['klankclusters en spellingpatronen', 'str, sch, aan, ok direct herkennen'],
    ['visuele woordvorm / directe woordherkenning', 'het woord als plaatje herkennen'],
    ['morfologische analyse', 'morfemen (woorddelen) direct herkennen']] },
  { id: 'L24', c: '4.2.12', d: 4, t: 'Criteria leerstofordening voortgezet technisch lezen (in volgorde)', o: true, i: [
    ['moeilijkheid van de structuur van woorden', 'spellingbijzonderheden'],
    ['moeilijkheid van de structuur binnen de zin'],
    ['moeilijkheid van de opbouw van de hele tekst'],
    ['voordrachtsaspecten']] },
  { id: 'L25', c: '5.1.3', d: 5, t: 'Essentiële leesstrategieën', o: false, i: [
    ['voorspellen', 'een inschatting van de tekst maken op grond van beschikbare informatie'],
    ['vragen stellen', 'zichzelf voor, tijdens en na het lezen vragen stellen'],
    ['visualiseren', 'zich een voorstelling vormen bij de tekst'],
    ['verbinden', 'de tekst verbinden met eigen kennis en ervaringen'],
    ['samenvatten', 'de tekst samenvatten'],
    ['afleiden', 'impliciete informatie interpreteren']] },
  { id: 'L26', c: '5.1.11', d: 5, t: 'Tekstdoelen', o: false, i: [
    ['informeren', 'de lezer informatie geven over een onderwerp'],
    ['overtuigen', 'de lezer overhalen tot een mening'],
    ['amuseren', 'de lezer een bepaalde emotie laten beleven'],
    ['instrueren', 'de lezer aansporen tot een handeling']] },
  { id: 'L27', c: '5.2.5', d: 5, t: 'Stappenplan begrijpend lezen (Goed gelezen)', o: true, i: [
    ['wat gaan we doen?', 'terugkijken en vooruitkijken'],
    ['wat zie je al?', 'titel en illustraties, voorspellen'],
    ['wat voor tekst is het?', 'leesstrategie bepalen'],
    ['wat weet ik al?', 'voorkennis activeren'],
    ['moeilijke woorden', 'betekenis uit de zin achterhalen'],
    ['lees de tekst'],
    ['maak de opdrachten'],
    ['evalueer het lesdoel']] },
  { id: 'L28', c: '5.2.6', d: 5, t: 'Fasen van het directe instructiemodel (begrijpend lezen)', o: true, i: [
    ['uitleggen en voordoen', 'strategie hardop denkend voordoen'],
    ['oefening en begeleiding', 'in groepjes met directe feedback'],
    ['verwerking of toepassing', 'zelfstandig toepassen']] },
  { id: 'L29', c: '5.3.4', d: 5, t: 'Leestheoretische modellen', o: false, i: [
    ['bottom-upvisie', 'van losse woorden naar zinnen naar de hele tekst'],
    ['top-downvisie', 'de lezer leest een deel en voorspelt wat erna komt'],
    ['interactief model', 'voorkennis en tekstgegevens werken samen tot tekstbegrip']] },
  { id: 'L30', c: '5.3.6', d: 5, t: 'Onderdelen van digitale geletterdheid', o: false, i: [
    ['basiskennis ICT', 'kennis van digitale middelen'],
    ['informatievaardigheden', 'beoordelen of informatie betrouwbaar is'],
    ['mediawijsheid', 'verantwoord omgaan met media'],
    ['computational thinking', 'denkprocessen om met computertechnologie problemen op te lossen']] },
  { id: 'L31', c: '6.1.4', d: 6, t: 'Specifieke tekststructuren', o: false, i: [
    ['stapelstructuur', 'losse onderdelen (telefoonboek, boodschappenlijstje)'],
    ['verhaalstructuur', 'personages maken opeenvolgende gebeurtenissen mee'],
    ['betoogstructuur', 'uitspraken ondersteund met argumenten']] },
  { id: 'L32', c: '6.1.10', d: 6, t: 'Genres volgens Van Norden (2017)', o: false, i: [
    ['verhalende genres (meeslepen)', 'ervaring/vertelling en verhaal'],
    ['feitelijke genres (informeren)', 'historie, verslag, procedure, verklaring'],
    ['evaluerende genres (oordeel geven)', 'beschouwing en betoog']] },
  { id: 'L33', c: '6.2.6', d: 6, t: 'Stappenplan stellen', o: true, i: [
    ['nadenken', 'voor wie, wat, met welke bedoeling, welke tekstvorm?'],
    ['verzamelen', 'wat weet ik al, waar vind ik meer, hoe orden ik?'],
    ['schrijven', 'de eerste versie'],
    ['afwerken', 'nakijken, verbeteren, in het net schrijven']] },
  { id: 'L34', c: '6.2.7', d: 6, t: 'Werkwijze met voorbeeldteksten (Huizenga 2004)', o: true, i: [
    ['lezen van de voorbeeldtekst'], ['bespreken van tekstkenmerken'],
    ['formuleren van eisen voor de te schrijven tekst'], ['toepassen in een schrijfopdracht']] },
  { id: 'L35', c: '6.2.5', d: 6, t: 'Momenten voor een tekstbespreking', o: true, i: [
    ['tijdens het schrijven', 'hulp tijdens het schrijven'],
    ['als de eerste (klad)versie klaar is'],
    ['als de eindversie klaar is']] },
  { id: 'L36', c: '6.3.2', d: 6, t: 'Functies van schrijven', o: false, i: [
    ['communicatieve functie', 'een doel bij de lezer bereiken'],
    ['conceptualiserende functie', 'greep krijgen op de werkelijkheid: benoemen en relaties verwoorden'],
    ['expressieve functie', 'uiting geven aan gevoelens en verlangens']] },
  { id: 'L37', c: '7.1.6', d: 7, t: 'Belangrijkste verhaalelementen (narratologie)', o: false, i: [
    ['thema', 'waar het verhaal over gaat'],
    ['personages', 'wie een rol spelen'],
    ['handeling', 'wat de personages doen'],
    ['ruimte', 'waar het verhaal zich afspeelt'],
    ['tijd', 'wanneer het verhaal zich afspeelt'],
    ['perspectief', 'vanuit welk gezichtspunt verteld wordt'],
    ['motief', 'regelmatig terugkerend element']] },
  { id: 'L38', c: '7.3.2', d: 7, t: 'Zes basisfuncties van jeugdliteratuur (Van Coillie 1999)', o: false, i: [
    ['ontspannende functie', 'zich ontspannen, zich goed voelen'],
    ['creatieve functie', 'het verhaal zelf invullen, fantaseren'],
    ['emotionele functie', 'inzicht in gevoelens, emoties verwerken'],
    ['informatieve functie', 'behoefte aan kennis'],
    ['opvoedende functie', 'standpunt innemen over normen en waarden'],
    ['esthetische functie', 'genieten van het mooie op zichzelf']] },
  { id: 'L39', c: '7.2.11', d: 7, t: 'Leesstadia volgens Chall (1983)', o: true, i: [
    ['stadium 0: pseudolezen', 'tot 6 jaar'],
    ['stadium 1: aanvankelijk lezen / decoderen', '6-7 jaar'],
    ['stadium 2: automatiseren en vloeiend lezen', '7-8 jaar'],
    ['stadium 3: lezen om nieuwe ideeën op te doen'],
    ['vanaf 13-14 jaar: steeds abstractere teksten']] },
  { id: 'L40', c: '7.3.5', d: 7, t: 'Literaire prijzen voor kinderboeken', o: false, i: [
    ['Gouden en Zilveren Griffels', 'voor de tekst, tot twaalf jaar'],
    ['Gouden en Zilveren Penselen', 'voor de illustraties, tot twaalf jaar'],
    ['Boekenleeuw', 'Vlaamse prijs, vergelijkbaar met de Gouden Griffel'],
    ['Boekenwelpen', 'Vlaamse prijs, vergelijkbaar met de Zilveren Griffels'],
    ['Nederlandse Kinderjury', 'kinderen kiezen; 6-9 en 9-12 jaar']] },
  { id: 'L41', c: '7.2.7', d: 7, t: 'Leesbevorderingsprojecten', o: false, i: [
    ['Boekenpret', '0 tot 6 jaar'], ['Fantasia', 'basisschool'], ['Sirene', '12 tot 18 jaar']] },
  { id: 'L42', c: '7.2.3', d: 7, t: 'Richtlijnen voor voorlezen en vertellen', o: false, i: [
    ['articulatie'], ['intonatie'], ['volume'], ['tempo'], ['pauzes'], ['ademhaling'], ['stemkleur'], ['lichaamstaal']] },
  { id: 'L43', c: '8.2.1', d: 8, t: 'Zinsdelen in de Cito-taaltoets', o: false, i: [
    ['onderwerp'], ['werkwoordelijk gezegde'], ['naamwoordelijk gezegde'], ['lijdend voorwerp'],
    ['meewerkend voorwerp'], ['voorzetselvoorwerp'], ['bijwoordelijke bepaling']] },
  { id: 'L44', c: '8.2.9', d: 8, t: 'Didactisch model taalbeschouwing (vijf stappen)', o: true, i: [
    ['signaleren van een taalverschijnsel'], ['andere voorbeelden verzamelen'], ['voorbeelden vergelijken en ordenen'],
    ['formuleren van essentiële kenmerken (regelmatigheid)'], ['controleren van de regel']] },
  { id: 'L45', c: '8.2.6', d: 8, t: 'Standaardaanpak incidentele taalbeschouwing', o: true, i: [
    ['beschrijven van het taalverschijnsel'], ['verklaren van het taalverschijnsel'],
    ['beoordelen of waarderen van de verklaring'], ['toepassen in het eigen taalgebruik']] },
  { id: 'L46', c: '8.3.4', d: 8, t: 'Morfologische procedures in het Nederlands', o: false, i: [
    ['samenstelling', 'twee woorden vormen samen een nieuw woord (land + kaart)'],
    ['afleiding', 'een gebonden morfeem wordt aan een woord toegevoegd'],
    ['verbuiging', 'gebonden morfeem zonder nieuw woord te vormen (land + je)'],
    ['vervoeging', 'als verbuiging, maar bij werkwoordsvormen (land + t)']] },
  { id: 'L47', c: '9.2.5', d: 9, t: 'Stappen bij het analyseren van spelfouten (Huizenga 2003)', o: true, i: [
    ['vaststellen van de fouten'], ['registreren met een foutenrooster'], ['analyseren van de fouten'], ['remediëring']] },
  { id: 'L48', c: '9.2.6', d: 9, t: 'Dictees naar vorm', o: false, i: [
    ['woorddictee', 'losse woorden worden gedicteerd'],
    ['kerndictee', 'een zin wordt voorgelezen, het kernwoord herhaald en opgeschreven'],
    ['zinsdictee', 'een hele zin wordt opgelezen en opgeschreven']] },
  { id: 'L49', c: '9.2.9', d: 9, t: 'Soorten toetsdictees', o: false, i: [
    ['signaleringsdictee', 'woorden van verschillende spellingcategorieën'],
    ['diagnosticeringsdictee', 'beheersing van één bepaalde categorie'],
    ['controledictee', 'na een oefenperiode: zijn de geoefende categorieën beheerst?']] },
  { id: 'L50', c: '9.2.12', d: 9, t: 'Volgorde in leerlijnen spelling', o: false, i: [
    ['eerst klankzuiver, dan niet-klankzuiver'], ['eerst eenlettergrepig, dan meerlettergrepig'],
    ['eerst één spellingregel, dan meerdere regels'], ['eerst frequente, dan minder frequente woorden']] },
  { id: 'L51', c: '9.2.12', d: 9, t: 'Spellingindeling referentiekader', o: true, i: [
    ['alfabetische spelling', 'relatie klank en teken (kat, klok)'],
    ['orthografische spelling', 'schrijfwijze van woorden (bank, leeuw)'],
    ['lexicaal-morfologische spelling', 'opbouw van het woord (gebouw, veilig)'],
    ['grammaticale spelling', 'woord binnen de context (werkwoordspelling)'],
    ['logografische spelling', 'vaste combinaties (specht, saus, thee)']] },
  { id: 'L52', c: '9.3.3', d: 9, t: 'Beginselen van de Nederlandse spelling', o: false, i: [
    ['standaarduitspraak', 'spellen met de klanken van de standaarduitspraak'],
    ['gelijkvormigheid', 'een woord(deel) zoveel mogelijk op dezelfde manier spellen'],
    ['etymologie', 'de herkomst bepaalt soms de spelling']] },
];

window.FACTS = [
  { c: '2.1.2', q: 'Over hoeveel woorden beschikt een Nederlandstalig kind van vier jaar ongeveer receptief?', a: ['3.300', '1.000', '6.500', '17.000'] },
  { c: '2.1.2', q: 'Hoe groot is de receptieve woordenschat van een Nederlandstalig kind van twaalf ongeveer?', a: ['17.000 woorden', '5.000 woorden', '30.000 woorden', '50.000 woorden'] },
  { c: '2.1.3', q: 'Wat geldt voor de verhouding tussen receptieve en productieve woordenschat?', a: ['De productieve woordenschat is altijd kleiner dan de receptieve', 'Ze zijn ongeveer even groot', 'De productieve woordenschat is groter bij jonge kinderen', 'De receptieve woordenschat is kleiner bij volwassenen'] },
  { c: '2.1.3', q: 'Een leerling ziet een plaatje van een cavia en kan het dier benoemen. Welke woordenschat gebruikt hij?', a: ['Productieve woordenschat', 'Receptieve woordenschat', 'Passieve woordenschat', 'Schooltaalwoordenschat'] },
  { c: '2.2.5', q: 'Hoe vaak moet een woord minimaal aangeboden of gebruikt zijn voordat het verankerd is in het woordnetwerk?', a: ['Ten minste zeven keer', 'Ten minste twee keer', 'Ten minste vijftien keer', 'Eén keer, mits goed uitgelegd'] },
  { c: '2.2.5', q: 'Wanneer vindt de fase "controleren" van de viertakt bij voorkeur plaats?', a: ['Enkele weken na het woordenschataanbod', 'Direct na het semantiseren', 'Vóór het voorbewerken', 'Aan het eind van het schooljaar'] },
  { c: '2.2.5', q: 'Welke methodiek, vooral voor beginnende tweedetaalverwervers, laat leerlingen opdrachten fysiek uitvoeren?', a: ['Total Physical Response (TPR)', 'De viertakt', 'Woordparaplu', 'Interactief voorlezen'] },
  { c: '2.2.3', q: 'Wat is volgens de kennisbasis het nadeel van alleen incidenteel woordenschatonderwijs?', a: ['De kans is klein dat de woordenschat daardoor echt wordt uitgebreid', 'Het kost te veel lestijd', 'Leerlingen kunnen de activiteit niet volgen', 'Het werkt alleen bij meertalige leerlingen'] },
  { c: '1.3.7', q: 'Op welke twee dimensies verschillen CAT en DAT vooral?', a: ['Cognitieve complexiteit en contextuele steun', 'Woordenschat en uitspraak', 'Spreken en schrijven', 'Formeel en informeel register'] },
  { c: '1.3.7', q: 'Vanaf welke groep gaat schoolse taalvaardigheid (CAT) een belangrijke rol spelen?', a: ['Vanaf groep 5/6', 'Vanaf groep 1/2', 'Vanaf groep 3', 'Pas in groep 8'] },
  { c: '1.3.3', q: 'In welke taalontwikkelingsfase bevinden moedertaalsprekers op de basisschool zich voornamelijk?', a: ['Voltooiingsfase', 'Differentiatiefase', 'Vroeglinguale periode', 'Prelinguale fase'] },
  { c: '1.1.1', q: 'Wat houdt referentieniveau 1F in voor luisteren?', a: ['Luisteren naar eenvoudige teksten over alledaagse, concrete onderwerpen', 'Luisteren naar gesprekken over onderwerpen die ver van de leerling afstaan', 'Kritisch luisteren naar betogen', 'Luisteren naar vaktaal in zaakvakken'] },
  { c: '1.1.1', q: 'Hoe heet het streefniveau voor het einde van de basisschool?', a: ['1S (gelijk aan 2F)', '1F', '2S', '3F'] },
  { c: '1.1.4', q: 'Een leerling luistert naar het weerbericht om alleen te horen of het morgen regent. Welke manier van luisteren is dit?', a: ['Gericht luisteren', 'Globaal luisteren', 'Intensief luisteren', 'Kritisch luisteren'] },
  { c: '1.2.2', q: 'Een leerling zegt "Ik had mijn schoenen aangetrekt" en de leerkracht antwoordt "Je had je schoenen aangetrokken". Hoe heet dit?', a: ['Modeling (het correcte model geven)', 'Scaffolding', 'Semantiseren', 'Expliciete correctie'] },
  { c: '3.1.6', q: 'Wat blijkt een goede voorspeller van toekomstige leesprestaties?', a: ['De mate van fonologisch bewustzijn', 'De leeftijd waarop een kind gaat praten', 'Het aantal boeken thuis', 'De handschriftontwikkeling'] },
  { c: '3.1.6', q: '"Paddenstoel is langer dan boom," zegt een kleuter. Wat laat hij hiermee zien?', a: ['Auditieve objectivatie: naar de vorm van woorden kijken i.p.v. de betekenis', 'Fonemisch bewustzijn', 'Visuele synthese', 'Alfabetisch principe'] },
  { c: '3.1.8', q: 'Wat is de elementaire spellinghandeling ten opzichte van de elementaire leeshandeling?', a: ['Het spiegelbeeld', 'Een onderdeel ervan', 'Een latere fase', 'Hetzelfde proces'] },
  { c: '3.3.1', q: 'Hoe heet volgens Chall stadium 0, waarin kleuters een prentenboek "voorlezen" uit hun hoofd?', a: ['Pseudo-lezen', 'Aanvankelijk lezen', 'Decoderen', 'Ontluikend schrijven'] },
  { c: '4.1.1', q: 'Wanneer wordt de elementaire leeshandeling in de fase van voortgezet technisch lezen nog gebruikt?', a: ['Alleen nog voor het lezen van nieuwe woorden', 'Voor alle woorden', 'Alleen bij voorlezen', 'Nooit meer'] },
  { c: '4.3.4', q: 'Wat is volgens de werkdefinitie (Gezondheidsraad, 1995) kenmerkend voor dyslexie?', a: ['Een ernstige, hardnekkige lees- en spellingachterstand die weinig reageert op gebruikelijke hulp', 'Een tijdelijke achterstand in begrijpend lezen', 'Een gebrek aan leesmotivatie', 'Een probleem met de uitspraak van klanken'] },
  { c: '4.1.3', q: 'Wat gebeurt er met de zinsmelodie bij een vraagteken aan het einde van de zin?', a: ['Die loopt omhoog', 'Die loopt omlaag', 'Die blijft vlak', 'Die hangt alleen af van de klemtoon'] },
  { c: '5.1.3', q: 'Welke leesstrategie is de belangrijkste en overkoepelende?', a: ['Het sturen (monitoren) van het leesproces', 'Voorspellen', 'Samenvatten', 'Visualiseren'] },
  { c: '5.2.6', q: 'Welk didactisch model ligt ten grondslag aan de meeste methoden voor begrijpend lezen?', a: ['Het directe instructiemodel', 'Probleemgestuurd lezen', 'Elkaar onderwijzen', 'Zelfontdekkend leren'] },
  { c: '5.3.4', q: 'Een lezer leest een deel van een tekst en voorspelt wat erna komt. Welke visie is dit?', a: ['Top-downvisie', 'Bottom-upvisie', 'Interactief model', 'Directe instructie'] },
  { c: '7.1.4', q: 'Welk genre is typisch voor jeugdliteratuur, met het beeld minstens zo bepalend als het woord?', a: ['Het prentenboek', 'Het stripverhaal', 'De poëziebundel', 'Het informatieve boek'] },
  { c: '7.3.5', q: 'Waarvoor worden de Gouden en Zilveren Penselen toegekend?', a: ['Voor de illustraties van kinderboeken', 'Voor de tekst van kinderboeken', 'Voor Vlaamse kinderboeken', 'Door een kinderjury'] },
  { c: '7.3.5', q: 'Wat is de Boekenleeuw?', a: ['Een Vlaamse prijs voor het beste kinderboek', 'Een Nederlandse prijs voor illustraties', 'Een prijs gekozen door kinderen', 'Een leesbevorderingsproject'] },
  { c: '8.3.3', q: 'Wat is een foneem?', a: ['Een betekenisonderscheidende klank', 'De kleinste betekenisdragende eenheid', 'Een letter of lettercombinatie', 'Een klankgroep (syllabe)'] },
  { c: '8.3.4', q: 'Wat is een morfeem?', a: ['De kleinste betekenisdragende eenheid in taal', 'De kleinste klankeenheid', 'Een lettergreep', 'Een zinsdeel'] },
  { c: '8.3.4', q: 'Het voorvoegsel "ver-" in "verhuis" is een…', a: ['gebonden morfeem', 'vrij morfeem', 'foneem', 'samenstelling'] },
  { c: '8.3.4', q: 'Wat is de kern van de samenstelling "landkaart"?', a: ['kaart (het tweede deel)', 'land (het eerste deel)', 'beide delen', 'geen van beide'] },
  { c: '8.3.7', q: '"Ik verklaar u nu tot man en vrouw." Vanuit welk pragmatisch perspectief bekijk je deze uiting?', a: ['Als taalhandeling', 'Als fonologisch verschijnsel', 'Als morfologische procedure', 'Als taalvariatie'] },
  { c: '9.1.2', q: 'Een leerling schrijft een woord zonder na te denken, omdat hij het al zo vaak schreef. Welke strategie is dit?', a: ['Directe spellingstrategie', 'Fonologische strategie', 'Morfologische strategie', 'Regelstrategie'] },
  { c: '9.1.7', q: 'Waarom schrijf je "hij vindt" met een d?', a: ['Gelijkvormigheid: in het hele werkwoord "vinden" hoor je een d', 'Overeenkomst: zoals "hij loopt"', 'Standaarduitspraak', 'Etymologie'] },
  { c: '9.1.7', q: 'Waarom schrijf je "hij vindt" met een t aan het eind?', a: ['Overeenkomst (analogie): zoals "hij loopt" en "hij werkt"', 'Gelijkvormigheid', 'Standaarduitspraak', 'Etymologie'] },
  { c: '9.3.3', q: 'Wat is het hoofdprincipe van de Nederlandse spelling?', a: ['Het fonologisch principe: schrijf het woord zoals het klinkt', 'Het morfologisch principe', 'Het etymologisch principe', 'Het principe van analogie'] },
  { c: '9.2.6', q: 'Wat is het verschil tussen een oefendictee en een toetsdictee?', a: ['Oefenen: juiste schrijfwijze aanleren; toets: beheersing controleren', 'Oefenen: losse woorden; toets: zinnen', 'Oefenen: visueel; toets: auditief', 'Er is geen verschil'] },
];
