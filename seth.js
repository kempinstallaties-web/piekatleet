// SETH-KAART — twaalf weken mindset, één thema per week (contract: seth-kaart-CONTRACT.md)
// Alle teksten in eigen woorden, gebaseerd op de video's van Seth Feroce. Geen citaten.
// Deze site en repository zijn openbaar: zet hier NOOIT iets persoonlijks in (namen,
// eigen patronen, bedrijfscijfers). Opdrachten beginnen met een werkwoord in de gebiedende
// wijs en zijn op een gewone werkdag te doen.
// Opslag in de app: metric 'seth_kaart' (datum van vandaag, 1/0) en 'seth_avond' (datum van gisteren).
window.SETH = {
  start: '2026-11-09', // maandag week 1 (Kaj 09-11: "mag deze week al beginnen"); het blok duurt 12 weken (84 dagen)

  weekcheck: {
    vragen: ['Waar ging het goed?', 'Waar ging het mis?', 'Wat doe ik deze week beter?'],
    rollen: 'ondernemer · werkgever · vakman · vriend of partner · zoon',
    lijst: 'Schrijf je antwoorden op papier, met twee kolommen: binnen en buiten je controle. Wat erbuiten ligt, laat je los.'
  },

  avond: ['Waar verloor ik vandaag de controle?', 'Wat zette het in gang?', 'Wat had de man die ik wil zijn gedaan?'],

  weeks: [
    {
      thema: 'Reset, en kom terug',
      zin: 'Ik ben iemand die na een reset terugkomt.',
      bron: { titel: 'Getting Your Mind Right', tijd: '3:44', url: 'https://www.youtube.com/watch?v=O-t6pvj5W_0&t=224s' },
      ma: 'Schrijf drie signalen op die je bij jezelf merkt vlak voordat je uitvalt of je afsluit.',
      di: 'Kies je reset voor vandaag: tien minuten lopen, stil in de auto zitten of een paar zware sets. Spreek af wanneer je hem gebruikt.',
      wo: 'Oefen je zin voor als het oploopt: ik ga tien minuten weg, daarna ben ik terug. Zeg hem één keer hardop.',
      vr: 'Blijf één minuut in de auto zitten voordat je ergens naar binnen gaat voor je werk. Drie keer diep ademen, dan pas uitstappen.',
      za: 'Blijf één minuut in de auto zitten voordat je thuis naar binnen gaat. Laat de week daar achter.',
      vraag: 'Hoe vaak trok ik me deze week terug, en hoe vaak kwam ik ook echt terug?'
    },
    {
      thema: 'Geen schuld afschuiven',
      zin: 'Ik ben iemand die eerst zijn eigen deel pakt.',
      bron: { titel: 'Being Broke Truck Rant', tijd: '12:28', url: 'https://www.youtube.com/watch?v=jcRIXonuCh8&t=748s' },
      ma: 'Denk aan het laatste dat misging en schrijf één zin op over jouw deel. Zonder "maar".',
      di: 'Noem aan het eind van je werkdag één ding dat beter kon, en wat jouw deel erin was.',
      wo: 'Betrap jezelf één keer op een ander de schuld geven. Zet er in gedachten tegenover wat jij anders had kunnen doen.',
      vr: 'Vraag iemand met wie je werkt wat je deze week beter had kunnen doen. Luister en verdedig je niet.',
      za: 'Kijk terug op een tegenvaller van deze week. Wat was jouw beslissing erin, en wat doe je volgende keer anders?',
      vraag: 'Waar gaf ik deze week een ander de schuld, en wat was mijn eigen deel?'
    },
    {
      thema: 'Kruimels worden een berg',
      zin: 'Ik ben iemand die het uitspreekt voordat het een berg wordt.',
      bron: { titel: 'Becoming the Man You Were Meant to Be', tijd: '24:10', url: 'https://www.youtube.com/watch?v=MtVfbi4bfVo&t=1450s' },
      ma: 'Schrijf drie dingen op die je deze maand hebt weggestopt, hoe klein ook. Je hoeft er nog niets mee.',
      di: 'Vertel kort aan iemand die je vertrouwt over één van die drie dingen.',
      wo: 'Bepaal wie je vaste man is: iemand ouder met ervaring die je belt als het oploopt. Zet zijn nummer bovenaan.',
      vr: 'Bel of app een vriend, gewoon om bij te praten. Over niks mag ook.',
      za: 'Vraag iemand hoe het echt met hem gaat. Wat hij vertelt, houd je voor jezelf.',
      vraag: 'Wat heb ik deze week weggestopt, en met wie ga ik erover praten?'
    },
    {
      thema: 'Je energie is besmettelijk',
      zin: 'Ik ben iemand die de toon zet als hij binnenkomt.',
      bron: { titel: 'Hard Work is Contagious', tijd: '26:22', url: 'https://www.youtube.com/watch?v=G_AbihvKr-M&t=1582s' },
      ma: 'Kies bewust je toon voordat je de deur opendoet, op je werk en thuis.',
      di: 'Zeg één keer "ik mag" waar je normaal "ik moet" zou zeggen, en merk wat het doet.',
      wo: 'Groet iedereen die je vandaag spreekt als eerste, en vraag hoe het met ze gaat.',
      vr: 'Geef twee mensen een gemeend compliment over hun werk.',
      za: 'Kom thuis zonder te klagen over je week, en vertel één ding dat goed ging.',
      vraag: 'Welke energie bracht ik deze week mee, en wat deed dat met de mensen om me heen?'
    },
    {
      thema: 'Vuur op de juiste plek',
      zin: 'Ik ben iemand die zijn vuur in werk en training stopt, niet in mensen.',
      bron: { titel: 'Every Man Needs to Hear This', tijd: '18:51', url: 'https://www.youtube.com/watch?v=DMiecNMlXmM&t=1131s' },
      ma: 'Train met volle intentie en stop wat je dwarszit in je zwaarste set.',
      di: 'Merk het moment waarop je fel wordt en benoem het voor jezelf: ik word nu kwaad.',
      wo: 'Stop je vuur in het werk zelf: pak de lastigste klus als eerste aan en maak hem af.',
      vr: 'Praat vandaag in elk gesprek rustiger en langzamer dan je gewend bent.',
      za: 'Gebruik je training als ventiel en zeg na afloop tegen jezelf wat je erin hebt achtergelaten.',
      vraag: 'Waar ging mijn vuur deze week naartoe: in werk en training, of in mensen?'
    },
    {
      thema: 'Wie ben je, blijkt het uit je daden?',
      zin: 'Ik ben iemand die doet wat hij zegt.',
      bron: { titel: 'Who Are You and What Do You Stand For?', tijd: '7:27', url: 'https://www.youtube.com/watch?v=0gdEsknFkb4&t=447s' },
      ma: 'Schrijf op wie je deze maand was, aan de hand van wat je deed. Niet wie je wilt zijn.',
      di: 'Gebruik het woord "proberen" niet. Het is gedaan, of het is niet gedaan en je zegt wanneer wel.',
      wo: 'Kies één belofte voor vandaag en kom hem na, hoe klein ook.',
      vr: 'Doe iets wat je al weken uitstelt.',
      za: 'Kijk in de spiegel en zeg wat je deze week hebt neergezet. Kun je jezelf recht aankijken?',
      vraag: 'Klopte deze week wat ik zei met wat ik deed?'
    },
    {
      thema: 'Winnen of verliezen, morgen weer',
      zin: 'Ik ben iemand die de dag na een misser gewoon weer begint.',
      bron: { titel: 'Who Are You and What Do You Stand For?', tijd: '30:57', url: 'https://www.youtube.com/watch?v=0gdEsknFkb4&t=1857s' },
      ma: 'Denk aan een misser van vorige week. Balen mag, en vandaag doe je je vaste dingen gewoon weer.',
      di: 'Doe iets ongemakkelijks dat niet hoeft. Het gaat om de oefening, niet om het resultaat.',
      wo: 'Begin je werkdag met de taak die je gisteren liet liggen.',
      vr: 'Maak iets af wat je bijna had opgegeven.',
      za: 'Schrijf drie dingen op die goed gingen en één die misging. Die ene laat je daarna los.',
      vraag: 'Waar viel ik deze week, en hoe snel stond ik weer op?'
    },
    {
      thema: 'Geen problemen, alleen werk',
      zin: 'Ik ben iemand die bij tegenslag de volgende stap zoekt.',
      bron: { titel: 'Becoming the Man You Were Meant to Be', tijd: '17:45', url: 'https://www.youtube.com/watch?v=MtVfbi4bfVo&t=1065s' },
      ma: 'Schrijf het grootste probleem van deze week op, met daaronder de eerste stap die het kleiner maakt.',
      di: 'Schrijf voor het slapen de grootste tegenvaller van vandaag op, met de volgende stap erbij.',
      wo: 'Los een klusje op dat al even blijft liggen, zonder uit te zoeken wie het liet liggen.',
      vr: 'Noem drie dingen waar je dankbaar voor bent, hardop of op papier.',
      za: 'Schrijf één ding op dat deze week zwaarder was dan je liet merken, en vertel het aan iemand die je vertrouwt.',
      vraag: 'Wat noemde ik deze week een probleem dat eigenlijk gewoon werk was?'
    },
    {
      thema: 'Simpel, elke dag, niet-onderhandelbaar',
      zin: 'Ik ben iemand die zijn vaste dingen ook op een slechte dag doet.',
      bron: { titel: 'Watch This If You\'re Feeling Lazy & Weak', tijd: '2:23', url: 'https://www.youtube.com/watch?v=Ra6c6pA-RlM&t=143s' },
      ma: 'Kies twee dingen die vanaf nu elke werkdag gebeuren, ook op een slechte dag. Schrijf ze op.',
      di: 'Doe je twee vaste dingen, hoe de dag ook loopt.',
      wo: 'Bedenk voor je twee vaste dingen een kleine versie van tien minuten, voor dagen dat het niet anders kan. Schrijf ze op.',
      vr: 'Noteer waar je nu staat met één ding dat je wilt verbeteren. Over zes weken meet je opnieuw.',
      za: 'Tel hoeveel dagen je deze week je vaste dingen deed. Schrijf het getal op, zonder oordeel.',
      vraag: 'Welke vaste dingen hield ik vol, ook op een slechte dag, en welke liet ik vallen?'
    },
    {
      thema: 'Leidinggeven is coachen',
      zin: 'Ik ben iemand die zijn mensen beter maakt.',
      bron: { titel: 'HWMF Podcast #4', tijd: '36:39', url: 'https://www.youtube.com/watch?v=1C3-dHLuRWI&t=2199s' },
      ma: 'Schrijf één regel op die iedereen in je werk moet kennen, met erbij waarom hij bestaat.',
      di: 'Bedenk een taak die net boven het niveau ligt van iemand met wie je werkt, voor jullie volgende dag samen.',
      wo: 'Schrijf op hoe je reageert als iemand een fout of schade meldt: rustig blijven en eerst bedanken dat hij het zegt.',
      vr: 'Leg de regel van maandag uit en laat iemand de taak van dinsdag doen, terwijl jij erbij bent.',
      za: 'Schrijf op wat je deze week iemand hebt geleerd, en wat je de volgende keer anders uitlegt.',
      vraag: 'Wie heb ik deze week beter gemaakt, en waar was ik ongeduldig?'
    },
    {
      thema: 'Kies je mensen',
      zin: 'Ik ben iemand die zich omringt met mensen die hem scherp houden.',
      bron: { titel: 'Seminar MassiveJoes 2019', tijd: '1:00:12', url: 'https://www.youtube.com/watch?v=Vl2uRIPYdNI&t=3612s' },
      ma: 'Schrijf de vijf mensen op met wie je het meest omgaat. Zet erbij: trekt hij me omhoog of omlaag?',
      di: 'Stuur een bericht aan iemand van wie je iets kunt leren en spreek deze week af.',
      wo: 'Houd één gesprek dat je energie kost vandaag korter.',
      vr: 'Bedank iemand die je verder heeft geholpen, met een bericht of een telefoontje.',
      za: 'Vraag iemand die het al heeft meegemaakt om advies over één ding waar je mee zit.',
      vraag: 'Met wie trok ik deze week op, en word ik daar beter van?'
    },
    {
      thema: 'Je loopt niet achter',
      zin: 'Ik ben iemand die zijn eigen weg loopt zonder te vergelijken.',
      bron: { titel: 'When You Feel Like You\'re Behind', tijd: '4:02', url: 'https://www.youtube.com/watch?v=KOwpUdDov24&t=242s' },
      ma: 'Leg je telefoon weg op de momenten dat je normaal gaat scrollen. Kies er twee vaste.',
      di: 'Betrap jezelf op één keer vergelijken met een ander. Zet ertegenover waar jij een jaar geleden stond.',
      wo: 'Schrijf op waar je naast je werk iets uit haalt, en plan er deze week tijd voor.',
      vr: 'Doe iets moeilijks dat je zelf kiest. Zeg daarna: dit deed ik, want zo iemand ben ik.',
      za: 'Schrijf de drie thema\'s op die je in dit blok het meest hebben geholpen. Neem ze mee naar de chat.',
      vraag: 'Waar vergeleek ik mezelf deze week met anderen, en wat heb ik zelf al neergezet?'
    }
  ]
};
