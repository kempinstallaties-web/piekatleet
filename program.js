// PIEK-ATLEET v15 — sterk, gezond en overal inzetbaar
// Verdeling: vier zware tildagen (ma, di, wo, vr), rauw werk op zaterdag (slee, dragen,
// gooien, hangen) en conditie op zondag. Geen sprong- of sprinttests meer.
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
    version: 'v15',
    athlete: 'Kaj Kemp',
    motto: 'goed bewegen · gezond lichaam · rauw werk',
    block: 'Krachtblok - golf 1 van 3 (volume) t/m 15 nov - blok loopt t/m 10 januari',
    nutritionShort: '3800 kcal - 200-210 g eiwit - +0,2 kg per week - taille meten bij elke weging',
    weakPoints: 'Posterior chain - hamstrings, bilspieren, rugstrekkers',
    goals: 'Compounds opbouwen, de achterkant ijzersterk maken en een lijf dat overal inzetbaar is: duwen, trekken, dragen en volhouden. Trap bar 150 x 3, squat 120 x 4, incline 105 x 4, 108-110 kg bij dezelfde taille.'
  },

  rules: [
    'Zwaar tillen blijft de basis. Het rauwe werk van zaterdag komt erbovenop, niet in de plaats.',
    'Herstel is het plafond. Donderdag is rust en zondag is conditie zonder zware benen, zodat je maandag de trap bar echt zwaar kunt doen.',
    'Golf 1 is volume op RPE 7. Je laat drie reps in de tank; de kilo s komen in golf 2 en 3.',
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

  weekRule: 'Simpele regel: 06:00 is tillen. Ma hinge en rugdikte, di persen, wo lats, vr benen en bilspieren. Zaterdag is rauw werk: slee, dragen, gooien en hangen. Donderdag volledig rust. Zondag conditie: een keer per week echt buiten adem, daarna rustig. Core staat vooraan in de sessie: wat achteraan staat valt weg.',
  weekOrder: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],

  days: {
    ma: {
      key: 'ma', label: 'MA', title: 'Hinge, hamstrings + rugdikte', sub: 'je zwaarste trekdag',
      erector: 'ZEER HOOG', power: 'Geen', compound: 'Trap bar deadlift',
      warn: 'Trap bar op RPE 7 in golf 1: drie reps in de tank. Dit is de dag waar je achterkant van verandert.',
      items: [
        { key: 'ma_core', group: 'Atletische core', name: 'Hanging leg raise', doel: 'Romp die kracht maakt, niet alleen tegenhoudt', cue: 'Hang stil en breng je knieen naar je borst zonder te zwaaien. Kantel je bekken mee - dat is het werk, niet de hoogte.', sets: 3, target: '8-12', type: 'strength' },
        { key: 'trap_bar_deadlift', group: 'Til zwaar', name: 'Trap bar deadlift', doel: 'De hoofdlift van dit blok', cue: 'Til vanaf de grond met een vlakke rug en duw de vloer weg. RPE 7: laat drie reps in de tank.', sets: 4, target: '6', inc: 5, type: 'strength' },
        { key: 'rdl', group: 'Bouw je achterkant', name: 'RDL', doel: 'Hamstrings op lengte sterk maken', cue: 'Zak met gestrekte rug tot halverwege je scheen en voel je hamstrings rekken. Rustig omlaag, explosief omhoog.', sets: 3, target: '8', inc: 5, type: 'strength' },
        { key: 'leg_curl', group: 'Bouw je achterkant', name: 'Leg curl', doel: 'Hamstring direct, los van je rug', cue: 'Trek je hielen naar je billen en laat ze drie tellen zakken. Dit is de enige oefening die je hamstring alleen pakt.', sets: 3, target: '10-12', inc: 5, type: 'strength' },
        { key: 'back_ext', group: 'Bouw je bilspieren', name: 'Back extension — uithoudingsvermogen', doel: 'Billen en rugstrekkers samen', cue: 'Kom omhoog tot je romp recht is en knijp bovenin je billen, niet je onderrug. Rond je rug licht af - dit is bilwerk, geen rugstrekking.', let: 'Of 15-20 reps met 2 tellen bovenin. Voelt het als een pomp: goed. Voelt het als een zware set: te zwaar. Je traint hier de tijd, niet het gewicht.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'chest_supported_row', group: 'Trek zwaar', name: 'Chest-supported row', doel: 'Rugdikte zonder je onderrug te belasten', cue: 'Trek je ellebogen naar achteren en knijp je schouderbladen samen. De bank draagt je romp, dus je onderrug doet hier niets.', sets: 4, target: '8-10', type: 'strength' },
        { key: 'calf_standing', group: 'Onderhoud', name: 'Staande kuit', doel: 'Kuit en enkel sterk onder 105 kg', cue: 'Duw hoog door op de bal van je voet en laat langzaam zakken.', sets: 3, target: '10-12', type: 'strength' }
      ]
    },
    di: {
      key: 'di', label: 'DI', title: 'Push - zwaar persen', sub: 'zwaar persen, daarna kort',
      erector: 'LAAG', power: 'Geen', compound: 'Incline press',
      warn: 'Alleen zwaar persen hier. De reverse fly staat woensdag bij het trekwerk, zodat je schouders niet alles op een dag krijgen.',
      items: [
        { key: 'incline_press', group: 'Til zwaar', name: 'Incline barbell / DB press', doel: 'Bovenborst — je zwakste schakel boven', cue: 'Raak iets lager aan dan normaal (tepelhoogte), dat voelt krachtiger. RPE 7–8.', sets: 4, target: '6-8', type: 'strength' },
        { key: 'overhead_press', group: 'Til zwaar', name: 'Overhead press', doel: 'Kracht boven je hoofd', cue: 'Pers machine of barbell ná het borstwerk. Ribben omlaag, geen doorgezakte rug.', sets: 3, target: '6-8', type: 'strength' },
        { key: 'chest_fly', group: 'Bouw je borst', name: 'Lage kabelfly', doel: 'Bovenborst, het deel dat achterloopt', cue: 'Breng de kabels van laag naar boven samen en knijp een tel vast. Lichte bocht in je elleboog, geen persbeweging.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'lateral_raise', group: 'Bouw volume', name: 'Lateral raise', doel: 'Schouderbreedte — laagste prioriteit', cue: 'Til zijwaarts tot schouderhoogte. Schrap dit als eerste bij een zware week.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'triceps', group: 'Bouw volume', name: 'Triceps', doel: 'Ondersteunt je persen', cue: 'Strek volledig door, kort werk.', sets: 2, target: '10-12', type: 'strength' }
      ]
    },
    wo: {
      key: 'wo', label: 'WO', title: 'Lats - breedte', sub: 'je zwakste schakel op de rug',
      erector: 'LAAG', power: 'Geen', compound: 'Weighted pullups',
      warn: 'Alles draait om breedte: ellebogen omlaag, volle rek bovenin. De reverse fly sluit af voor je achterste schouder.',
      items: [
        { key: 'weighted_pullups', group: 'Trek zwaar', name: 'Weighted pullups', doel: 'Zware trekdag, ver van de deadlift', cue: 'Trek zwaar met extra gewicht — je grip staat hier het verst van de deadlift.', sets: 4, target: '6-8', type: 'strength' },
        { key: 'lat_pulldown', group: 'Bouw je lats', name: 'Lat pulldown', doel: 'Breedte - je zwakste schakel op de rug', cue: 'Trek met je ellebogen omlaag naar je heupen, niet met je handen. Laat bovenin volledig uitrekken voor je weer trekt.', sets: 4, target: '10-12', inc: 5, type: 'strength' },
        { key: 'pullover', group: 'Bouw je lats', name: 'Straight-arm pullover', doel: 'Lat op volle lengte, zonder je biceps', cue: 'Houd je armen gestrekt en duw de stang in een boog naar je heupen. Voel de rek bovenin - licht gewicht, lange baan.', sets: 4, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'lat_row', group: 'Bouw je lats', name: 'Single-arm lat row', doel: 'Lat apart, met volle rek onderin', cue: 'Laat je schouderblad onderin ver naar voren komen en trek je elleboog langs je heup. Romp blijft stil.', sets: 3, target: '10-12 p/z', inc: 2.5, type: 'strength' },
        { key: 'rear_delt_fly', group: 'Bouw je achterste schouder', name: 'Reverse fly', doel: 'Achterste schouder, tegenwicht voor al het persen', cue: 'Breng je armen opzij uit elkaar met je duimen omlaag. Licht gewicht, knijp bovenin kort vast.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
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
      key: 'vr', label: 'VR', title: 'Benen + bilspieren', sub: 'puur tillen',
      erector: 'HOOG', power: 'Geen', compound: 'Back squat',
      warn: 'Hip thrust fors omhoog: 41 kg is te licht voor iemand die 105 trap bart. Squat naar 85.',
      items: [
        { key: 'do_core', group: 'Atletische core', name: 'Cable chop', doel: 'Rotatiekracht van heup naar schouder', cue: 'Draai vanuit je heup en laat je armen volgen. Duw je achterste voet in de grond - de kracht komt van onderen.', sets: 3, target: '10-12 p/z', type: 'strength' },
        { key: 'back_squat', group: 'Til zwaar', name: 'Back squat', doel: 'Je krachtbasis', cue: 'Zak diep en duw explosief omhoog. RPE 7–8: laat 2 reps in de tank. Knie zeurt? Blijf op wat pijnvrij is.', sets: 4, target: '6-8', inc: 5, type: 'strength' },
        { key: 'atg_split_squat', group: 'Til zwaar', name: 'Bulgarian split squat', doel: 'Eén been sterk, zoals je in het echt tilt en loopt', cue: 'Zak diep op één been met rechte romp; het achterste been is alleen steun.', sets: 3, target: '8 p/b', type: 'strength' },
        { key: 'hip_thrust', group: 'Bouw je bilspieren', name: 'Hip thrust', doel: 'Bilspieren zwaar belasten zonder je rug', cue: 'Duw door je hielen tot je romp horizontaal staat en knijp bovenin twee tellen vast.', sets: 4, target: '8-10', inc: 10, type: 'strength' },
        { key: 'abduction', group: 'Bouw je bilspieren', name: 'Hip abduction', doel: 'Bil van de zijkant, los van je benen', cue: 'Duw je knieen naar buiten en knijp twee tellen vast. Leun licht voorover, dan pakt de bil meer.', sets: 2, target: '15-20', inc: 5, type: 'strength' },
        { key: 'calf', group: 'Onderhoud', name: 'Kuit (machine)', doel: 'Kuitvolume, steun voor knie en enkel', cue: 'Duw volledig door en laat rustig zakken.', sets: 3, target: '12-15', type: 'strength' }
      ]
    },
    za: {
      key: 'za', label: 'ZA', title: 'Rauw werk', sub: 'slee, dragen, gooien en hangen',
      erector: 'MIDDEL', power: 'Gooien', compound: 'Slee en farmer carry',
      warn: 'Geen machines vandaag. Duwen, trekken, dragen en gooien: zwaar genoeg dat het werk is, licht genoeg dat je vorm blijft staan.',
      items: [
        { key: 'di_core', group: 'Gooi eerst, fris', name: 'Med ball side throw', doel: 'Explosieve rotatie vanuit je heup', cue: 'Gooi de bal zo hard je kunt zijwaarts tegen de muur en vang hem weer op. Maximale intentie, geen uithoudingswerk.', sets: 3, target: '6 p/z', mode: 'power', type: 'strength' },
        { key: 'sled', group: 'Duw en trek', name: 'Slee — duwen & achteruit trekken', doel: 'Benen, longen en knieen in een', cue: 'Duw 20 m heen en trek achteruit terug zonder te stoppen. Laag blijven, kleine passen. Log het gewicht op de slee.', let: 'Achteruit is het kniewerk: knie mag voorbij de teen. Geen excentrische fase, dus weinig spierpijn.', sets: 4, target: '20 m h/t', inc: 10, type: 'strength' },
        { key: 'carries', group: 'Draag', name: 'Farmer carry', doel: 'Grip, romp en rug onder last', cue: 'Loop 40 m zonder neerzetten, zwaar genoeg om te moeten knijpen. Log het gewicht per hand.', video: 'https://www.youtube.com/watch?v=P8iSOHX73FE', let: 'Schouders naar achteren, ribben omlaag. Zodra je gaat hangen is de set klaar.', sets: 4, target: '40 m', inc: 5, type: 'strength' },
        { key: 'bearhug_carry', group: 'Draag', name: 'Bear-hug carry', doel: 'Dragen zonder handvat, zoals in het echt', cue: 'Klem een zandzak, slamball of zware schijf tegen je borst en loop 30 m. Blijf rechtop en adem door. Log het gewicht.', sets: 3, target: '30 m', inc: 5, type: 'strength' },
        { key: 'nordic', group: 'Bouw je achterkant', name: 'Nordic curl (excentrisch)', doel: 'Halveert je risico op een hamstringblessure', cue: 'Zak langzaam voorover en rem zo lang mogelijk. Sla deze nooit over.', let: 'Bewust hier: ver genoeg van de deadlift van maandag en de squat van vrijdag.', sets: 3, target: '5', type: 'strength' },
        { key: 'rear_delt_facepull', group: 'Onderhoud', name: 'Rear delt + face pull', doel: 'Houding en achterkant schouder', cue: 'Trek naar je gezicht met hoge ellebogen en knijp kort vast.', sets: 4, target: '12-15', type: 'strength' },
        { key: 'hang', group: 'Onderhoud', name: 'Dead hang', doel: 'Grip en schouders belastbaar', cue: 'Hang zo lang mogelijk met actieve schouders. Vul de seconden in bij reps.', sets: 2, target: '45-60 sec', type: 'strength' },
        { key: 'pushup_situp', group: 'Afmaker', name: 'Push-ups en sit-ups', doel: 'De ondergrens: ook op een slechte dag', cue: 'Doe 100 push-ups en 100 sit-ups, verdeeld over zo weinig mogelijk sets. Geen kracht over? Halveer, maar sla niet over.', target: '100 + 100', type: 'check' },
        { key: 'zone2_run', group: 'Afmaker', name: 'Stairmaster - zone 2', doel: 'Aerobe basis: hart en herstel', cue: 'Stap 20-30 min op hartslag 135-155. Kun je er niet bij praten, dan ga je te hard.', target: '20-30 min', type: 'check' }
      ]
    },
    zo: {
      key: 'zo', label: 'ZO', title: 'Conditie', sub: 'een keer echt buiten adem, daarna rustig',
      erector: 'LAAG', power: 'Geen', compound: '-',
      warn: 'Een keer per week echt buiten adem, daarna rustig bewegen. Geen zware benen: morgen staat de trap bar.',
      items: [
        { key: 'tempo_block', group: 'Conditie', name: 'Intervallen - roeier of fiets', doel: 'Het enige bakje dat leeg staat: aeroob-hoog', cue: '5 x 3 min op hartslag 165-178, 2 min rustig ertussen. Praten moet net niet lukken. Geen stairmaster: die kost je benen voor morgen.', target: '5 x 3 min', type: 'check' },
        { key: 'zwemmen', group: 'Conditie', name: 'Zwemmen of wandelen - rustig', doel: 'Bloed rondpompen zonder enige impact', cue: 'Zwem of wandel 20-30 min rustig door. Dit is herstel, geen training: stop als het zwaar wordt.', target: '20-30 min', type: 'check' },
        { key: 'wall_sit', group: 'Onderhoud, als er tijd over is', name: 'Wall sit', doel: 'Je knie-verzekering tegen zeurpijn', cue: 'Houd 45–60 sec stil met bovenbenen horizontaal. Vul de seconden in bij reps.', sets: 2, target: '45-60 sec', type: 'strength' },
        { key: 'reverse_nordic', group: 'Onderhoud, als er tijd over is', name: 'Reverse Nordic', doel: 'Knieschijfpees belastbaar op lange lengte', cue: 'Leun langzaam achterover met gestrekte heupen en kom rustig terug.', sets: 3, target: '8', type: 'strength' },
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
    incline_prime: 'Incline press (Prime)',
    calf_pull: 'Kuit - zittend'
  },

  anchors: {
    strength: [
      { key: 'back_squat', label: 'Back squat' },
      { key: 'trap_bar_deadlift', label: 'Trap bar deadlift' },
      { key: 'incline_press', label: 'Incline press' },
      { key: 'overhead_press', label: 'Overhead press' },
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
    title: 'Volume-check', sub: 'Tillen op de ochtenden, rauw werk op zaterdag, conditie op zondag. Sets per week, hoofd- en bijrol samen.',
    rows: [
      { name: 'Bilspieren', sets: '20 (6 gericht)' },
      { name: 'Lats - breedte', sets: '15 (wo)' },
      { name: 'Hamstrings', sets: '13 (ma + za)' },
      { name: 'Borst', sets: '7 (di) + 100 push-ups (za)' },
      { name: 'Rugstrekkers', sets: '10' },
      { name: 'Kuiten', sets: '6 (ma - vr)' },
      { name: 'Atletische core', sets: '9 - staat nu vooraan in de sessie' },
      { name: 'Slee en dragen', sets: '11 (za)' },
      { name: 'Quads', sets: '7 (vr)' },
      { name: 'Achterste schouder', sets: '7 (3 wo + 4 za)' },
      { name: 'Midden-rug', sets: '4 (ma)' },
      { name: 'Triceps direct', sets: '2 (di)' },
      { name: 'Conditie', sets: 'za slee en stairmaster - zo intervallen' },
      { name: 'Zwaarste tildag', sets: '23 sets (ma)' }
    ]
  }
};
