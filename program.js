// PIEK-ATLEET v15 — sterk, gezond en overal inzetbaar
// Verdeling: vier zware tildagen (ma, di, wo, vr); zaterdag eerst borst, achterste schouder en
// kuiten, daarna rauw werk (slee, dragen, gooien, hangen); conditie op zondag. Geen sprong- of
// sprinttests meer.
// Filter voor élke oefening: "maakt dit mij sterker, gezonder of beter in bewegen onder last?"
//
// Tekstcontract (v7): elk item heeft
//   name   — hoe het heet
//   doel   — WAAROM je het doet (≤ 60 tekens)
//   cue    — WAT je nu moet doen (≤ 140 tekens, begint met een werkwoord in de gebiedende wijs)
//   target — hoeveel
// Extra (optioneel): let (aandachtspunt/details), video (techniek), inc (kg-stap),
//   mode: 'power' (geen kg-progressie, intentie is de progressie), unit (log-eenheid van het
//   eerste invulveld; standaard kg).
// Item-keys zijn PERMANENT: de historie in Supabase hangt eraan. Nooit hernoemen. Vervalt een
// oefening, zet de key dan met zijn naam in `retired` onderaan, zodat de export hem blijft herkennen.
// Opener-items worden op NAAM opgeslagen — die namen zijn dus net zo permanent.
window.PROGRAM = {
  meta: {
    name: 'PIEK-ATLEET',
    version: 'v21',
    athlete: 'Kaj Kemp',
    motto: 'goed bewegen · gezond lichaam · rauw werk',
    block: 'Krachtblok - golf 2 van 3 (intensiteit) sinds 16 nov - blok loopt t/m 10 januari',
    nutritionShort: '3800 kcal - 200-210 g eiwit - taille meten bij elke weging',
    weakPoints: 'Posterior chain - hamstrings, bilspieren, rugstrekkers',
    goals: 'Compounds opbouwen, de achterkant ijzersterk maken en een lijf dat overal inzetbaar is: duwen, trekken, dragen en volhouden. Trap bar 150 x 3, squat 120 x 4, incline 105 x 4, 108-110 kg bij dezelfde taille.'
  },

  rules: [
    'Zwaar tillen blijft de basis. Het rauwe werk van zaterdag komt erbovenop, niet in de plaats.',
    'Garmin en je eigen gevoel zijn de rem. Scherpe pijn op een vaste plek bij een pees (knie, achilles, elleboog) meld je direct - dat ziet Garmin niet.',
    'Golf 2 is intensiteit: 4-6 reps op de hoofdliften, een rep in de tank. Haal je alle sets op 6, dan gaat er gewicht bij - geen plafond.',
    'Gewicht: +0,2 kg per week bij dezelfde taille. Gaat het sneller, dan is het geen spier.'
  ],

  opener: {
    title: 'Voorwerk',
    sub: 'Twaalf minuten, dagspecifiek. Warm worden, je gewrichten onder gewicht op lengte brengen en je romp aanzetten. Je houdt alleen bereik dat je onder gewicht kunt gebruiken. Kort houden: dit is voorwerk, geen training.',
    blocks: [
      {
        key: 'warm', title: 'Warm worden', sub: 'eerst 2 min, nooit koud op eindstand',
        items: [
          { name: '2 min fiets of roeier', doel: 'Warm weefsel vóór je het op lengte belast', cue: 'Rustig trappen of roeien tot je ademhaling net oploopt. Koud weefsel op eindstand is precies de blessure die je wilt voorkomen.', why: 'warm worden', days: ['ma', 'di', 'wo', 'vr', 'za'] }
        ]
      },
      {
        key: 'geladen', title: 'Geladen eindstand', sub: '~5 min - hier zit je mobiliteitswinst',
        items: [
          { name: 'Goblet squat-hold, hakken hoog, 2 x 30 sec', doel: 'Patellapees op volle lengte onder gewicht', cue: 'Hakken op een schijf, halterkop tegen je borst, zak zo diep als je kunt en hou stil. Knieen mogen ver over je tenen.', why: 'knie en squatdiepte', days: ['ma', 'vr'] },
          { name: 'Cossack squat met schijf, 2 x 5 p/z', doel: 'Liezen en heup op lengte, onder belasting', cue: 'Schijf voor je borst, zak diep naar een kant met je andere been gestrekt. Twee tellen onderin, dan rustig omhoog.', why: 'liezen en heup', days: ['vr', 'wo'] },
          { name: 'Geladen 90/90, 2 x 5 p/z', doel: 'Heup in- en uitdraaien met weerstand', cue: 'Halterkop voor je borst, wissel je heupen van 90/90 naar de andere kant zonder je handen te gebruiken. Borst rechtop.', why: 'heuprotatie', days: ['ma', 'vr'] },
          { name: 'Kettlebell armbar, 2 x 30 sec p/z', doel: 'Schouder en borstwervels op eindstand onder gewicht', cue: 'Op je rug, gewicht recht boven je schouder, rol langzaam naar je zij en hou het gewicht loodrecht. Dit is je beste item voor persen.', why: 'schouder en thoracaal', days: ['di', 'za'] },
          { name: 'Diepe lunge met rotatie, halterkop, 2 x 4 p/z', doel: 'Heupbuiger en romprotatie in een', cue: 'Stap diep uit, gewicht in je handen, draai je romp open naar je voorste been en hou twee tellen vast.', why: 'heupbuiger en rotatie', days: ['di', 'wo'] },
          { name: 'RDL met 3 tellen pauze onderin, 2 x 5 licht', doel: 'Hamstrings op volle lengte plus je hinge-patroon', cue: 'Lege of lichte stang, zak tot je rek voelt en hou drie tellen stil. Rug vlak. Dit is je opwarming en je eerste rep in een.', why: 'hamstrings en bracen', days: ['ma', 'za'] },
          { name: 'Dead hang met actieve schouders, 2 x 30 sec', doel: 'Lats en schouder op lengte onder je eigen gewicht', cue: 'Hang vol uit, trek dan je schouderbladen een centimeter omlaag zonder je armen te buigen. Decompressie plus gripwerk.', why: 'lats en decompressie', days: ['wo', 'za'] }
        ]
      },
      {
        key: 'power', title: 'Wakker maken', sub: '~2 min - wakker maken, niet moe maken',
        items: [
          { name: 'Bear crawl 2 x 10 m', doel: 'Schouders, romp en heupen samen aanzetten', cue: 'Kruip op handen en voeten met je knieen net boven de grond. Rug vlak, kleine passen, heen vooruit en terug achteruit.', why: 'romp en schouders', days: ['ma', 'vr'] },
          { name: 'Band pull-apart 2 x 15', doel: 'Schouders wakker vóór het persen', cue: 'Trek de band uit elkaar tot borsthoogte en laat rustig terug.', why: 'schouders wakker', days: ['di', 'za'] },
          { name: 'Scapula pull-ups 2 x 8', doel: 'Je lats laten vuren vóór je gaat trekken', cue: 'Hang en trek je schouderbladen omlaag zonder je ellebogen te buigen. Precies de spier die bij jou achterloopt.', why: 'lats activeren', days: ['wo'] }
        ]
      },
      {
        key: 'balans', title: 'Voet en enkel', sub: '~2 min - je enkels en knieen dragen 105 kg',
        items: [
          { name: 'Tibialis raise 2 x 20', doel: 'Scheenbeen: remkracht, beschermt je knie', cue: 'Til je tenen op tegen de muur en laat ze langzaam zakken.', why: 'remkracht', days: ['ma', 'di', 'wo', 'vr', 'za'] },
          { name: 'Excentrische kuit op een opstapje, 2 x 10', doel: 'Achillespees belastbaar op volle lengte', cue: 'Duw omhoog op twee benen, zak op een been in drie tellen tot je hiel zo diep mogelijk hangt.', why: 'achillespees', days: ['di', 'wo', 'vr', 'za'] },
          { name: 'Knie-naar-muur met gewicht, 2 x 8 p/z', doel: 'Enkelmobiliteit onder belasting', cue: 'Halterkop vast, duw je knie over je tenen naar de muur, hiel blijft plat. Twee tellen op het diepste punt.', why: 'enkelmobiliteit', days: ['ma', 'wo', 'vr'] }
        ]
      }
    ]
  },

  weekRule: '06:00 is tillen. Ma hinge en rugdikte, di persen met een tempoblok erachter, wo lats, vr benen en bilspieren, za borst, schouders en het rauwe werk met de slee. Donderdag volledig rust. Zondag intervallen; de rest van die dag is optioneel en alleen als je hersteld bent. Conditie: twee keer per week aeroob-hoog (di tempo, zo intervallen), elk als eigen Garmin-activiteit. Core staat vooraan in de sessie: wat achteraan staat valt weg.',
  weekOrder: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],

  days: {
    ma: {
      key: 'ma', label: 'MA', title: 'Hinge, hamstrings + rugdikte', sub: 'je zwaarste trekdag',
      erector: 'ZEER HOOG', power: 'Geen', compound: 'Trap bar deadlift',
      warn: 'Golf 2: trap bar zwaar op 4-6 reps. Dit is de dag waar je achterkant van verandert.',
      items: [
        { key: 'ma_core', group: 'Atletische core', name: 'Hanging leg raise', doel: 'Romp die kracht maakt, niet alleen tegenhoudt', cue: 'Hang stil en breng je knieen naar je borst zonder te zwaaien. Kantel je bekken mee - dat is het werk, niet de hoogte.', sets: 3, target: '8-12', type: 'strength' },
        { key: 'trap_bar_deadlift', group: 'Til zwaar', name: 'Trap bar deadlift', doel: 'De hoofdlift van dit blok', cue: 'Til vanaf de grond met een vlakke rug en duw de vloer weg. Golf 2: zwaar, een rep in de tank. Haal je 4 x 6, dan gaat er gewicht bij.', sets: 4, target: '4-6', inc: 5, type: 'strength' },
        { key: 'rdl', group: 'Bouw je achterkant', name: 'RDL', doel: 'Hamstrings op lengte sterk maken', cue: 'Zak met gestrekte rug tot halverwege je scheen en voel je hamstrings rekken. Rustig omlaag, explosief omhoog.', sets: 3, target: '8', inc: 5, type: 'strength' },
        { key: 'leg_curl', group: 'Bouw je achterkant', name: 'Leg curl', doel: 'Hamstring direct, los van je rug', cue: 'Trek je hielen naar je billen en laat ze drie tellen zakken. Dit is de enige oefening die je hamstring alleen pakt.', sets: 3, target: '10-12', inc: 5, type: 'strength' },
        { key: 'back_ext', group: 'Bouw je bilspieren', name: 'Back extension — uithoudingsvermogen', doel: 'Billen en rugstrekkers samen', cue: 'Kom omhoog tot je romp recht is en knijp bovenin je billen, niet je onderrug. Rond je rug licht af - dit is bilwerk, geen rugstrekking.', let: 'Of 15-20 reps met 2 tellen bovenin. Voelt het als een pomp: goed. Voelt het als een zware set: te zwaar. Je traint hier de tijd, niet het gewicht.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'chest_supported_row', group: 'Trek zwaar', name: 'Chest-supported row', doel: 'Rugdikte zonder je onderrug te belasten', cue: 'Trek je ellebogen naar achteren en knijp je schouderbladen samen. Golf 2: zwaarder, strakke reps, geen zwaai.', sets: 4, target: '6-8', type: 'strength' },
        { key: 'calf_standing', group: 'Onderhoud', name: 'Staande kuit', doel: 'Kuit en enkel sterk onder 105 kg', cue: 'Duw hoog door op de bal van je voet en laat langzaam zakken.', sets: 3, target: '10-12', type: 'strength' }
      ]
    },
    di: {
      key: 'di', label: 'DI', title: 'Push - borst voorop', sub: 'incline zwaar, flat en dips, dan tempo',
      erector: 'LAAG', power: 'Geen', compound: 'Incline press',
      warn: 'Incline blijft de zware eerste, daarna flat en dips. Geen overhead press meer: je schouders krijgen hun werk uit de lateral raise en zaterdag. Dips niet dieper dan bovenarm horizontaal. Daarna 20 min tempo op de fiets of roeier, direct of in de avond.',
      items: [
        { key: 'incline_press', group: 'Til zwaar', name: 'Incline barbell / DB press', doel: 'Bovenborst — je zwakste schakel boven', cue: 'Raak iets lager aan dan normaal (tepelhoogte), dat voelt krachtiger. Golf 2: zwaar, een rep in de tank.', sets: 4, target: '4-6', type: 'strength' },
        { key: 'flat_press', group: 'Til zwaar', name: 'Flat bench press', doel: 'Massa op je hele borst', cue: 'Schouderbladen in de bank en naar elkaar, voeten vast. Laat zakken tot tepelhoogte en pers recht omhoog. Stang of dumbbells: kies er een en blijf daarbij, anders zegt je log niets.', sets: 3, target: '6-8', type: 'strength' },
        { key: 'dips', group: 'Bouw je borst', name: 'Dips', doel: 'Onderkant borst en triceps', cue: 'Leun licht voorover, ellebogen iets naar buiten. Zak tot je bovenarm horizontaal is, niet dieper: met jouw armlengte spaart dat je schouder. Haal je 3 x 12, hang er dan gewicht aan.', sets: 3, target: '8-12', type: 'strength' },
        { key: 'chest_fly', group: 'Bouw je borst', name: 'Lage kabelfly', doel: 'Bovenborst, het deel dat achterloopt', cue: 'Breng de kabels van laag naar boven samen en knijp een tel vast. Lichte bocht in je elleboog, geen persbeweging.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'lateral_raise', group: 'Bouw volume', name: 'Lateral raise', doel: 'Schouderbreedte — je directe schouderwerk op deze dag', cue: 'Til zijwaarts tot schouderhoogte en laat gecontroleerd terug. Niet schrappen: zonder overhead press is dit je schouderwerk hier.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'triceps', group: 'Bouw volume', name: 'Triceps', doel: 'Ondersteunt je persen', cue: 'Strek volledig door, kort werk.', sets: 2, target: '10-12', type: 'strength' },
        { key: 'tempo_di', group: 'Conditie: aeroob-hoog', name: 'Tempo - fiets of roeier', doel: 'Het lege balkje in Garmin: aeroob-hoog', cue: '20 min aan een stuk op hartslag 165-175, of 4 x 5 min met 1 min rustig ertussen. Praten lukt alleen in korte zinnen. Start er een eigen activiteit voor in je Garmin (Indoor fietsen of Roeien binnen), dan telt Garmin het als conditie en niet als krachttraining. Direct na het persen of in de avond, wat past.', let: 'Komt het de volgende ochtend in het anaerobe balkje terecht, dan gaan we naar hartslag 160-170.', target: '20 min', type: 'check' }
      ]
    },
    wo: {
      key: 'wo', label: 'WO', title: 'Lats - breedte', sub: 'je zwakste schakel op de rug',
      erector: 'LAAG', power: 'Geen', compound: 'Weighted pullups',
      warn: 'Alles draait om breedte: ellebogen omlaag, volle rek bovenin.',
      items: [
        { key: 'weighted_pullups', group: 'Trek zwaar', name: 'Weighted pullups', doel: 'Zware trekdag, ver van de deadlift', cue: 'Trek zwaar met extra gewicht, volle hang onderin. Haal je 4 x 6, dan gaat er 2,5 tot 5 kg bij.', sets: 4, target: '4-6', type: 'strength' },
        { key: 'lat_pulldown', group: 'Bouw je lats', name: 'Lat pulldown', doel: 'Breedte - je zwakste schakel op de rug', cue: 'Trek met je ellebogen omlaag naar je heupen, niet met je handen. Laat bovenin volledig uitrekken voor je weer trekt.', sets: 4, target: '10-12', inc: 5, type: 'strength' },
        { key: 'pullover', group: 'Bouw je lats', name: 'Straight-arm pullover', doel: 'Lat op volle lengte, zonder je biceps', cue: 'Houd je armen gestrekt en duw de stang in een boog naar je heupen. Voel de rek bovenin - licht gewicht, lange baan.', sets: 4, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'lat_row', group: 'Bouw je lats', name: 'Single-arm lat row', doel: 'Lat apart, met volle rek onderin', cue: 'Laat je schouderblad onderin ver naar voren komen en trek je elleboog langs je heup. Romp blijft stil.', sets: 3, target: '10-12 p/z', inc: 2.5, type: 'strength' },
        { key: 'biceps', group: 'Bouw volume', name: 'Biceps', doel: 'Elleboog en onderarm belastbaar', cue: 'Krul rustig en laat het gewicht gecontroleerd zakken. Twee oefeningen is genoeg, dit is geen armendag.', sets: 3, target: '10-12', inc: 2.5, type: 'strength' },
      ]
    },
    do: {
      key: 'do', label: 'DO', title: 'Rust', sub: 'niets doen is hier het werk',
      erector: 'LAAG', power: 'Geen', compound: '-', rest: true,
      warn: 'Volledige rustdag. Wandelen mag, trainen niet.',
      items: []
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Benen + bilspieren', sub: 'eerst leg extension en leg curl, dan squat',
      erector: 'HOOG', power: 'Geen', compound: 'Back squat',
      warn: 'Eerst leg extension en seated leg curl tot het gaatje, dan pas de squat: alles warm en soepel. De Bulgarian is eruit. Squat in golf 2 zwaarder en korter: 4 tot 6 reps.',
      items: [
        { key: 'do_core', group: 'Atletische core', name: 'Cable chop', doel: 'Rotatiekracht van heup naar schouder', cue: 'Draai vanuit je heup en laat je armen volgen. Duw je achterste voet in de grond - de kracht komt van onderen.', sets: 3, target: '10-12 p/z', type: 'strength' },
        { key: 'leg_ext', group: 'Eerst: knieen warm', name: 'Leg extension', doel: 'Knieen warm en bovenbenen vol voor je squat', cue: 'Strek volledig, knijp bovenin een tel vast en laat drie tellen zakken. Eerste set opbouwen, daarna tot je geen nette rep meer haalt.', sets: 3, target: '12-15', inc: 5, type: 'strength' },
        { key: 'seated_leg_curl', group: 'Eerst: knieen warm', name: 'Seated leg curl', doel: 'Hamstrings warm, je knie voelt stabieler onder de stang', cue: 'Trek volledig door en laat drie tellen terugkomen. Heupen blijven in de stoel. Tot je geen nette rep meer haalt.', sets: 3, target: '10-12', inc: 5, type: 'strength' },
        { key: 'back_squat', group: 'Til zwaar', name: 'Back squat', doel: 'Je krachtbasis', cue: 'Zak diep en duw explosief omhoog. Golf 2: zwaar, een rep in de tank. Haal je 4 x 6, dan gaat er gewicht bij. Je squat altijd na de leg extension en leg curl, dan blijven je gewichten vergelijkbaar.', sets: 4, target: '4-6', inc: 5, type: 'strength' },
        { key: 'hip_thrust', group: 'Bouw je bilspieren', name: 'Hip thrust', doel: 'Bilspieren zwaar belasten zonder je rug', cue: 'Duw door je hielen tot je romp horizontaal staat en knijp bovenin twee tellen vast.', sets: 4, target: '8-10', inc: 10, type: 'strength' },
        { key: 'abduction', group: 'Bouw je bilspieren', name: 'Hip abduction', doel: 'Bil van de zijkant, los van je benen', cue: 'Duw je knieen naar buiten en knijp twee tellen vast. Leun licht voorover, dan pakt de bil meer.', sets: 2, target: '15-20', inc: 5, type: 'strength' },
        { key: 'calf', group: 'Onderhoud', name: 'Kuit (machine)', doel: 'Kuitvolume, steun voor knie en enkel', cue: 'Duw volledig door en laat rustig zakken.', sets: 3, target: '12-15', type: 'strength' }
      ]
    },
    za: {
      key: 'za', label: 'ZA', title: 'Borst, schouders + dragen', sub: 'eerst het bouwwerk, daarna slee en dragen',
      erector: 'MIDDEL', power: 'Slee en gooien', compound: 'Incline press (Prime)',
      warn: 'Sinds 15-11 korter: nordics, push-ups, sit-ups en zone 2 zijn eraf en staan nu op zondag. De slee blijft hier - dat is je zwaarste conditiewerk van de week.',
      items: [
        { key: 'incline_prime', group: 'Bouw je borst', name: 'Incline press (Prime)', doel: 'Tweede prikkel voor de bovenborst', cue: 'Pers met vol bereik en rustig tempo; hier telt spanning, niet gewicht.', sets: 4, target: '10-12', type: 'strength' },
        { key: 'rear_delt_fly', group: 'Bouw je achterste schouder', name: 'Reverse fly', doel: 'Achterste schouder, tegenwicht voor al het persen', cue: 'Breng je armen opzij uit elkaar met je duimen omlaag. Licht gewicht, knijp bovenin kort vast.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'rear_delt_facepull', group: 'Bouw je achterste schouder', name: 'Rear delt + face pull', doel: 'Houding en achterkant schouder', cue: 'Trek naar je gezicht met hoge ellebogen en knijp kort vast.', sets: 4, target: '12-15', type: 'strength' },
        { key: 'trap_raise', group: 'Bouw je achterste schouder', name: 'Trap raise (Y-raise)', doel: 'Onderste trapezius: schouderbladen omlaag en naar achteren', cue: 'Lig voorover op een schuine bank en til je armen in een Y met je duimen omhoog. Licht gewicht, bovenin een tel vasthouden.', sets: 3, target: '12-15', inc: 1, type: 'strength' },
        { key: 'calf_pull', group: 'Onderhoud', name: 'Kuit - zittend', doel: 'Derde kuitmoment, andere hoek', cue: 'Duw door de bal van je voet en laat de hiel diep zakken. Twee tellen bovenin vasthouden.', sets: 3, target: '12-15', inc: 5, type: 'strength' },
        { key: 'di_core', group: 'Rauw werk', name: 'Med ball side throw', doel: 'Explosieve rotatie vanuit je heup', cue: 'Gooi de bal zo hard je kunt zijwaarts tegen de muur en vang hem weer op. Maximale intentie, geen uithoudingswerk.', sets: 3, target: '6 p/z', mode: 'power', type: 'strength' },
        { key: 'sled', group: 'Rauw werk', name: 'Slee — duwen & achteruit trekken', doel: 'Hamstrings, bilspieren en conditie in een', cue: 'Heen en terug, om de beurt. Op 15-11 zat je hier gemiddeld op hartslag 163 met een piek van 176 - dit is je zwaarste conditiewerk van de week.', let: 'Achteruit is het kniewerk: knie mag voorbij de teen. Geen excentrische fase, dus weinig spierpijn.', sets: 4, target: '20 m h/t', inc: 10, type: 'strength' },
        { key: 'carries', group: 'Rauw werk', name: 'Farmer carry', doel: 'Grip, romp en rug onder last', cue: 'Loop 40 m zonder neerzetten, zwaar genoeg om te moeten knijpen. Log het gewicht per hand.', video: 'https://www.youtube.com/watch?v=P8iSOHX73FE', let: 'Schouders naar achteren, ribben omlaag. Zodra je gaat hangen is de set klaar.', sets: 3, target: '40 m', inc: 5, type: 'strength' },
        { key: 'bearhug_carry', group: 'Rauw werk', name: 'Bear-hug carry', doel: 'Dragen zonder handvat, zoals in het echt', cue: 'Klem een zandzak, slamball of zware schijf tegen je borst en loop 30 m. Blijf rechtop en adem door. Log het gewicht.', sets: 3, target: '30 m', inc: 5, type: 'strength' },
        { key: 'hang', group: 'Rauw werk', name: 'Dead hang', doel: 'Grip en schouders belastbaar', cue: 'Hang zo lang mogelijk met actieve schouders. Vul de seconden in bij reps.', sets: 2, target: '45-60 sec', type: 'strength' }
      ]
    },
    zo: {
      key: 'zo', label: 'ZO', title: 'Conditie en herstel', sub: 'een conditieblok vast, de rest alleen als je hersteld bent',
      erector: 'LAAG', power: 'Geen', compound: '-',
      warn: 'De intervallen staan vast: je tweede aeroob-hoog-sessie van de week. Zone 2 is eraf, want je krachtsessies vullen aeroob-laag al boven de bovengrens. Alles onder de intervallen sla je over als je niet hersteld bent - dat is de bedoeling, geen gemiste sessie.',
      items: [
        { key: 'tempo_block', group: 'Conditie: aeroob-hoog', name: 'Intervallen - roeier of fiets', doel: 'Je tweede aeroob-hoog-sessie van de week', cue: '4 x 6 min op hartslag 165-175, 2 min rustig ertussen. Praten lukt alleen in korte zinnen. Eigen activiteit in je Garmin (Indoor fietsen of Roeien binnen). Geen stairmaster: die kost je benen voor de hinge-dag.', target: '4 x 6 min', type: 'check' },
        { key: 'pushup_situp', group: 'Alleen als je hersteld bent', name: 'Push-ups en sit-ups', doel: 'De ondergrens: ook op een slechte dag', cue: 'Doe 100 push-ups en 100 sit-ups, verdeeld over zo weinig mogelijk sets. Geen kracht over? Halveer, maar sla niet over.', target: '100 + 100', type: 'check' },
        { key: 'nordic', group: 'Alleen als je hersteld bent', name: 'Nordic curl (excentrisch)', doel: 'Halveert je risico op een hamstringblessure', cue: 'Zak zo langzaam mogelijk voorover. Sinds 15-11 hier in plaats van zaterdag: de slee pakt je hamstrings al.', let: 'Bewust hier: ver genoeg van de deadlift van maandag en de squat van vrijdag.', sets: 3, target: '5', type: 'strength' },
        { key: 'wall_sit', group: 'Alleen als je hersteld bent', name: 'Wall sit', doel: 'Je knie-verzekering tegen zeurpijn', cue: 'Houd 45–60 sec stil met bovenbenen horizontaal. Vul de seconden in bij reps.', sets: 2, target: '45-60 sec', type: 'strength' },
        { key: 'reverse_nordic', group: 'Alleen als je hersteld bent', name: 'Reverse Nordic', doel: 'Knieschijfpees belastbaar op lange lengte', cue: 'Leun langzaam achterover met gestrekte heupen en kom rustig terug.', sets: 3, target: '8', type: 'strength' },
        { key: 'zwemmen', group: 'Herstel', name: 'Zwemmen of wandelen - rustig', doel: 'Bloed rondpompen zonder enige impact', cue: 'Zwem of wandel 20-30 min rustig door. Dit is herstel, geen training: stop als het zwaar wordt.', target: '20-30 min', type: 'check' },
        { key: 'mobility_zo', group: 'Beweeg los', name: 'Mobility', doel: 'Stijfheid eruit voor de tildag van morgen', cue: 'Beweeg rustig door wat stijf voelt.', target: '5–10 min', type: 'check' }
      ]
    }
  },

  // Vervallen oefeningen: niet meer in het schema, wel nog in de historie en de export.
  retired: {
    cmj: 'Countermovement jump',
    drop_jump: 'Drop jump 30–40 cm',
    broad_jump_plyo: 'Broad jump',
    medball_rot: 'Med ball rotational throw',
    overhead_press: 'Overhead press',
    atg_split_squat: 'Bulgarian split squat',
    zone2_run: 'Stairmaster - zone 2'
  },

  anchors: {
    strength: [
      { key: 'back_squat', label: 'Back squat' },
      { key: 'trap_bar_deadlift', label: 'Trap bar deadlift' },
      { key: 'incline_press', label: 'Incline press' },
      { key: 'flat_press', label: 'Flat bench press' },
      { key: 'weighted_pullups', label: 'Weighted pullups' },
      { key: 'chest_supported_row', label: 'Chest-supported row' },
      { key: 'rdl', label: 'RDL' },
      { key: 'hip_thrust', label: 'Hip thrust' },
      { key: 'lat_pulldown', label: 'Lat pulldown' },
      { key: 'sled', label: 'Slee (gewicht)' },
      { key: 'carries', label: 'Farmer carry (per hand)' }
    ],
    athletic: [
      { key: 'farmer_40m', label: 'Farmer carry 40 m', unit: 'kg', hint: 'kg per hand, zonder neerzetten' },
      { key: 'dead_hang', label: 'Dead hang', unit: 'sec', hint: 'seconden hangen' },
      { key: 'pushups_max', label: 'Push-ups in een set', unit: 'reps', hint: 'aantal zonder pauze' },
      { key: 'row_500', label: 'Roeier 500 m', unit: 'sec', hint: 'seconden, alles erin' }
    ],
    body: [
      { key: 'weight', label: 'Lichaamsgewicht', unit: 'kg' },
      { key: 'waist', label: 'Taille', unit: 'cm' }
    ],
    reminders: [
      'Je maatstaf: zwaarder tillen en dragen bij dezelfde taille',
      'Elke 4 weken meten: farmer carry · dead hang · push-ups · roeier 500 m',
      'Rusthartslag en HRV op je eigen niveau: dan kan je lijf het aan',
      'Word je sterker maar zakken je conditie of je slaap? Dan doe je te veel'
    ]
  },

  nutrition: {
    title: 'Voeding',
    goal: '3800 kcal · 200-210 g eiwit · +0,2 kg per week',
    system: [
      { title: 'Elke dag', text: '400-500 g groente · 3-4 porties fruit · 500-800 g zuivel · 2 eieren · 50 g noten · 3 liter water' },
      { title: 'Eiwit', text: '150-200 g kip of mager vlees · vis 2x per week, 1x vet · rood vlees hooguit 2x per week · vleeswaren liever niet' },
      { title: 'Werkdag', text: 'Ontbijt: kwark, havermout, fruit, noten · Shake onderweg · Lunch: brood, eieren, vis of kip, rauwkost · Avond: 200 g kip of vis, rijst, 300 g groente' },
      { title: 'Bijsturen', text: 'Meer dan 0,3 kg per week erbij en je taille groeit: pindakaas en havermout uit de shake (-400 kcal)' }
    ]
  },

  volumeCheck: {
    title: 'Volume-check', sub: 'Tillen op de ochtenden, zaterdag bouwwerk en rauw werk, conditie op dinsdag en zondag. Sets per week, hoofd- en bijrol samen.',
    rows: [
      { name: 'Bilspieren', sets: '20 (6 gericht)' },
      { name: 'Lats - breedte', sets: '15 (wo)' },
      { name: 'Hamstrings', sets: '9 (ma + vr), plus nordics op zo' },
      { name: 'Borst', sets: '17 (13 di + 4 za)' },
      { name: 'Rugstrekkers', sets: '10' },
      { name: 'Kuiten', sets: '9 (ma - vr - za)' },
      { name: 'Atletische core', sets: '9 - staat nu vooraan in de sessie' },
      { name: 'Slee en dragen', sets: '10 (za)' },
      { name: 'Quads', sets: '7 (vr: leg extension en squat)' },
      { name: 'Achterste schouder', sets: '10 (za, met trap raise)' },
      { name: 'Midden-rug', sets: '4 (ma)' },
      { name: 'Triceps direct', sets: '2 (di), plus 3 sets dips' },
      { name: 'Zijkant schouder', sets: '3 (di)' },
      { name: 'Conditie', sets: 'di tempo 20 min - zo intervallen 4 x 6 min - za slee' },
      { name: 'Zwaarste tildag', sets: '23 sets (ma)' }
    ]
  }
};
