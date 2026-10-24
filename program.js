// PIEK-ATLEET v7 — basketbal-atleet blok, gestuurd op verticale sprong
// Verdeling: ~40% strength · 30% power/speed · 30% basketbal-athleticism.
// Filter voor élke oefening: "maakt dit mij beter in het verplaatsen van 105 kg op een veld?"
//
// Tekstcontract (v7): elk item heeft
//   name   — hoe het heet
//   doel   — WAAROM je het doet (≤ 60 tekens)
//   cue    — WAT je nu moet doen (≤ 140 tekens, begint met een werkwoord in de gebiedende wijs)
//   target — hoeveel
// Extra (optioneel): let (aandachtspunt/details), video (techniek), inc (kg-stap),
//   mode: 'power' (geen kg-progressie, intentie is de progressie), unit (log-eenheid van het
//   eerste invulveld; standaard kg).
// Item-keys zijn PERMANENT: de historie in Supabase hangt eraan. Nooit hernoemen of verwijderen.
// Opener-items worden op NAAM opgeslagen — die namen zijn dus net zo permanent.
window.PROGRAM = {
  meta: {
    name: 'PIEK-ATLEET',
    version: 'v14',
    athlete: 'Kaj Kemp',
    motto: 'niet groter worden — beter bewegen',
    block: 'Krachtblok - golf 1 van 3 (volume) t/m 15 nov - blok loopt t/m 10 januari',
    nutritionShort: '3800 kcal - 200-210 g eiwit - +0,2 kg per week - taille meten bij elke weging',
    weakPoints: 'Posterior chain - hamstrings, bilspieren, rugstrekkers',
    goals: 'Compounds opbouwen en de achterkant ijzersterk maken, met het atletische werk volledig behouden. Trap bar 150 x 3, squat 120 x 4, incline 105 x 4, 108-110 kg bij dezelfde taille.'
  },

  rules: [
    'Power vóór kracht. Springen en gooien doe je fris, nooit als toetje na het tillen.',
    'Herstel is het plafond. Donderdag en zondag zijn rust zodat je maandag de trap bar en vrijdag de squat echt zwaar kunt doen.',
    'Golf 1 is volume op RPE 7. Je laat drie reps in de tank; de kilo s komen in golf 2 en 3.',
    'Gewicht 104,2 op 19-10 na de vakantie. Doel is +0,2 per week naar 105,5 in januari - gaat het sneller, dan is het geen spier.'
  ],

  opener: {
    title: 'Atleet-fase',
    sub: 'Twaalf minuten, dagspecifiek. Sinds 21-10 geladen eindstandwerk in plaats van passief rekken: je houdt alleen bereik dat je onder gewicht kunt gebruiken. Kort en matig houden - lang en zwaar rekken vlak voor je sets kost je kracht.',
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
          { name: 'Pogo hops 2 x 15', doel: 'Voetstijfheid vóór het echte springwerk', cue: 'Stuiter op je voorvoet met bijna gestrekte knieen, zo kort mogelijk op de grond.', why: 'voetstijfheid', days: ['ma', 'vr'] },
          { name: 'Band pull-apart 2 x 15', doel: 'Schouders wakker vóór het persen', cue: 'Trek de band uit elkaar tot borsthoogte en laat rustig terug.', why: 'schouders wakker', days: ['di', 'za'] },
          { name: 'Scapula pull-ups 2 x 8', doel: 'Je lats laten vuren vóór je gaat trekken', cue: 'Hang en trek je schouderbladen omlaag zonder je ellebogen te buigen. Precies de spier die bij jou achterloopt.', why: 'lats activeren', days: ['wo'] }
        ]
      },
      {
        key: 'balans', title: 'Voet en enkel', sub: '~2 min - je enkels en knieen dragen 104 kg',
        items: [
          { name: 'Tibialis raise 2 x 20', doel: 'Scheenbeen: remkracht, beschermt je knie', cue: 'Til je tenen op tegen de muur en laat ze langzaam zakken.', why: 'remkracht', days: ['ma', 'di', 'wo', 'vr', 'za'] },
          { name: 'Excentrische kuit op een opstapje, 2 x 10', doel: 'Achillespees belastbaar op volle lengte', cue: 'Duw omhoog op twee benen, zak op een been in drie tellen tot je hiel zo diep mogelijk hangt.', why: 'achillespees', days: ['di', 'wo', 'vr', 'za'] },
          { name: 'Knie-naar-muur met gewicht, 2 x 8 p/z', doel: 'Enkelmobiliteit onder belasting', cue: 'Halterkop vast, duw je knie over je tenen naar de muur, hiel blijft plat. Twee tellen op het diepste punt.', why: 'enkelmobiliteit', days: ['ma', 'wo', 'vr'] }
        ]
      }
    ]
  },

  weekRule: 'Simpele regel sinds 24-10: 06:00 is tillen, zondag is atletiek. Ma hinge en rugdikte, di persen, wo lats, vr benen en bilspieren, za borst en achterste schouder. Donderdag volledig rust. Zondag springen, gooien en het tempoblok - het enige moment dat je fris bent en geen afspraak om 08:30 hebt. Core staat vooraan in de sessie: wat achteraan staat valt weg.',
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
        { key: 'calf_standing', group: 'Onderhoud', name: 'Staande kuit', doel: 'Enkelstijfheid — gratis centimeters', cue: 'Duw hoog door op de bal van je voet en laat langzaam zakken.', sets: 3, target: '10-12', type: 'strength' }
      ]
    },
    di: {
      key: 'di', label: 'DI', title: 'Push - zwaar persen', sub: 'gooien voor persen, daarna kort',
      erector: 'LAAG', power: 'Med ball', compound: 'Incline press',
      warn: 'Alleen zwaar persen hier. De Prime en de reverse fly staan zaterdag, zodat je schouders en rotators niet alles op een dag krijgen.',
      items: [
        { key: 'incline_press', group: 'Til zwaar', name: 'Incline barbell / DB press', doel: 'Bovenborst — je zwakste schakel boven', cue: 'Raak iets lager aan dan normaal (tepelhoogte), dat voelt krachtiger. RPE 7–8.', sets: 4, target: '6-8', type: 'strength' },
        { key: 'overhead_press', group: 'Til zwaar', name: 'Overhead press', doel: 'Kracht boven je hoofd — rebound en blok', cue: 'Pers machine of barbell ná het borstwerk. Ribben omlaag, geen doorgezakte rug.', sets: 3, target: '6-8', type: 'strength' },
        { key: 'chest_fly', group: 'Bouw je borst', name: 'Lage kabelfly', doel: 'Bovenborst, het deel dat achterloopt', cue: 'Breng de kabels van laag naar boven samen en knijp een tel vast. Lichte bocht in je elleboog, geen persbeweging.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'lateral_raise', group: 'Bouw volume', name: 'Lateral raise', doel: 'Schouderbreedte — laagste prioriteit', cue: 'Til zijwaarts tot schouderhoogte. Schrap dit als eerste bij een zware week.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'triceps', group: 'Bouw volume', name: 'Triceps', doel: 'Ondersteunt je persen', cue: 'Strek volledig door, kort werk.', sets: 2, target: '10-12', type: 'strength' }
      ]
    },
    wo: {
      key: 'wo', label: 'WO', title: 'Lats - breedte', sub: 'je zwakste schakel op de rug',
      erector: 'LAAG', power: 'Geen', compound: 'Weighted pullups',
      warn: 'Alles draait om breedte: ellebogen omlaag, volle rek bovenin. Geen cardio meer hier - het tempoblok staat sinds 21-10 op donderdag.',
      items: [
        { key: 'weighted_pullups', group: 'Trek zwaar', name: 'Weighted pullups', doel: 'Zware trekdag, ver van de deadlift', cue: 'Trek zwaar met extra gewicht — je grip staat hier het verst van de deadlift.', sets: 4, target: '6-8', type: 'strength' },
        { key: 'lat_pulldown', group: 'Bouw je lats', name: 'Lat pulldown', doel: 'Breedte - je zwakste schakel op de rug', cue: 'Trek met je ellebogen omlaag naar je heupen, niet met je handen. Laat bovenin volledig uitrekken voor je weer trekt.', sets: 4, target: '10-12', inc: 5, type: 'strength' },
        { key: 'pullover', group: 'Bouw je lats', name: 'Straight-arm pullover', doel: 'Lat op volle lengte, zonder je biceps', cue: 'Houd je armen gestrekt en duw de stang in een boog naar je heupen. Voel de rek bovenin - licht gewicht, lange baan.', sets: 4, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'lat_row', group: 'Bouw je lats', name: 'Single-arm lat row', doel: 'Lat apart, met volle rek onderin', cue: 'Laat je schouderblad onderin ver naar voren komen en trek je elleboog langs je heup. Romp blijft stil.', sets: 3, target: '10-12 p/z', inc: 2.5, type: 'strength' },
        { key: 'biceps', group: 'Bouw volume', name: 'Biceps', doel: 'Elleboog en onderarm belastbaar', cue: 'Krul rustig en laat het gewicht gecontroleerd zakken. Twee oefeningen is genoeg, dit is geen armendag.', sets: 3, target: '10-12', inc: 2.5, type: 'strength' },
      ]
    },
    do: {
      key: 'do', label: 'DO', title: 'Rust', sub: 'niets doen is hier het werk',
      erector: 'LAAG', power: 'Geen', compound: '-', rest: true,
      warn: 'Volledige rustdag. Je sprongwerk en tempoblok staan sinds 24-10 op zondag, waar je wel fris en wakker bent.',
      items: []
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Benen + bilspieren', sub: 'puur tillen, springen staat zondag',
      erector: 'HOOG', power: 'Geen', compound: 'Back squat',
      warn: 'Hip thrust fors omhoog: 41 kg is te licht voor iemand die 105 trap bart. Squat naar 85.',
      items: [
        { key: 'do_core', group: 'Atletische core', name: 'Cable chop', doel: 'Rotatiekracht van heup naar schouder', cue: 'Draai vanuit je heup en laat je armen volgen. Duw je achterste voet in de grond - de kracht komt van onderen.', sets: 3, target: '10-12 p/z', type: 'strength' },
        { key: 'back_squat', group: 'Til zwaar', name: 'Back squat', doel: 'Je krachtbasis voor elke afzet', cue: 'Zak diep en duw explosief omhoog. RPE 7–8: laat 2 reps in de tank. Knie zeurt? Blijf op wat pijnvrij is.', sets: 4, target: '6-8', inc: 5, type: 'strength' },
        { key: 'atg_split_squat', group: 'Til zwaar', name: 'Bulgarian split squat', doel: 'Eén been sterk — zo beweeg je op het veld', cue: 'Zak diep op één been met rechte romp; het achterste been is alleen steun.', sets: 3, target: '8 p/b', type: 'strength' },
        { key: 'hip_thrust', group: 'Bouw je bilspieren', name: 'Hip thrust', doel: 'Bilspieren zwaar belasten zonder je rug', cue: 'Duw door je hielen tot je romp horizontaal staat en knijp bovenin twee tellen vast.', sets: 4, target: '8-10', inc: 10, type: 'strength' },
        { key: 'abduction', group: 'Bouw je bilspieren', name: 'Hip abduction', doel: 'Bil van de zijkant, los van je benen', cue: 'Duw je knieen naar buiten en knijp twee tellen vast. Leun licht voorover, dan pakt de bil meer.', sets: 2, target: '15-20', inc: 5, type: 'strength' },
        { key: 'calf', group: 'Onderhoud', name: 'Kuit (machine)', doel: 'Kuitvolume voor afzet en landing', cue: 'Duw volledig door en laat rustig zakken.', sets: 3, target: '12-15', type: 'strength' }
      ]
    },
    za: {
      key: 'za', label: 'ZA', title: 'Borst, achterkant schouder + onderhoud', sub: 'het volume dat dinsdag niet paste',
      erector: 'MIDDEL', power: 'Licht', compound: 'Incline press (Prime)',
      warn: 'Dit is de dag voor het volume dat dinsdag je schouders zou slopen. Alles hier op gevoel en controle, niets zwaars.',
      items: [
        { key: 'di_core', group: 'Atletische core', name: 'Med ball side throw', doel: 'Explosieve rotatie, de snelste coreoefening die er is', cue: 'Gooi de bal zo hard je kunt zijwaarts tegen de muur en vang hem weer op. Maximale intentie, geen uithoudingswerk.', sets: 3, target: '6 p/z', type: 'strength' },
        { key: 'incline_prime', group: 'Bouw je borst', name: 'Incline press (Prime)', doel: 'Tweede prikkel voor de bovenborst', cue: 'Pers met vol bereik en rustig tempo; hier telt spanning, niet gewicht.', sets: 4, target: '10-12', type: 'strength' },
        { key: 'rear_delt_fly', group: 'Bouw je achterste schouder', name: 'Reverse fly', doel: 'Achterste schouder, tegenwicht voor al het persen', cue: 'Breng je armen opzij uit elkaar met je duimen omlaag. Licht gewicht, knijp bovenin kort vast.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'rear_delt_facepull', group: 'Bouw je achterste schouder', name: 'Rear delt + face pull', doel: 'Houding en achterkant schouder', cue: 'Trek naar je gezicht met hoge ellebogen en knijp kort vast.', sets: 4, target: '12-15', type: 'strength' },
        { key: 'nordic', group: 'Bouw je achterkant', name: 'Nordic curl (excentrisch)', doel: 'Halveert je risico op een hamstringblessure', cue: 'Zak langzaam voorover en rem zo lang mogelijk. Sla deze nooit over.', let: 'Bewust hier: 5 dagen na de deadlift, 2 dagen voor de squat.', sets: 3, target: '5', type: 'strength' },
        { key: 'carries', group: 'Bouw je achterkant', name: 'Farmer carry', doel: 'Rug lang en rechtop houden onder last', cue: 'Loop 3 × 30–40 m, zwaar genoeg om te moeten knijpen. Sla alleen over als donderdag naijlt.', video: 'https://www.youtube.com/watch?v=P8iSOHX73FE', let: 'Schouders naar achteren, ribben omlaag. Zodra je gaat hangen is de set klaar', sets: 3, target: '30-40 m', type: 'check' },
        { key: 'calf_pull', group: 'Onderhoud', name: 'Kuit - zittend', doel: 'Derde kuitmoment, andere hoek', cue: 'Duw door de bal van je voet en laat de hiel diep zakken. Twee tellen bovenin vasthouden.', sets: 3, target: '12-15', inc: 5, type: 'strength' },
        { key: 'zone2_run', group: 'Conditie', name: 'Hardlopen - zone 2', doel: 'Aerobe basis zonder je benen te slopen', cue: 'Loop 25-35 min op hartslag onder 160. Kun je er niet bij praten, dan ga je te hard.', target: '25-35 min', type: 'check' }
      ]
    },
    zo: {
      key: 'zo', label: 'ZO', title: 'Atletiek + tempo', sub: 'het enige moment dat je fris en wakker bent',
      erector: 'LAAG', power: 'Verticaal, horizontaal en rotatie', compound: '-',
      warn: 'Geen rustdag meer. Springen eerst en met volle intentie - zakt de hoogte, dan stop je. Daarna het tempoblok. Samen ongeveer 45 minuten.',
      items: [
        { key: 'cmj', group: 'Spring eerst, fris', name: 'Countermovement jump', doel: 'De KPI van dit blok: sprong omhoog', cue: 'Spring precies 2 keer per set, volle rust. Meet met sprong-en-reik tegen de muur, niet met een boxhoogte.', let: 'Meer dan 2 sprongen per set traint een lágere sprong. Zakt de hoogte, dan stop je.', sets: 3, target: '2 · log de hoogte', unit: 'cm', mode: 'power', type: 'strength' },
        { key: 'drop_jump', group: 'Spring eerst, fris', name: 'Drop jump 30–40 cm', doel: 'Reactieve kracht — korter grondcontact', cue: 'Stap van de bak van 30–40 cm, land en spring meteen door. Knie zeurt → overslaan.', let: 'Je landing moet klinken als één tik, niet als twee. Hoor je twee tikken, dan is de bak te hoog.', sets: 2, target: '3', mode: 'power', type: 'strength' },
        { key: 'broad_jump_plyo', group: 'Spring eerst, fris', name: 'Broad jump', doel: 'Horizontale power — meteen je 4-weken test', cue: 'Spring 2 keer per set, verder niet. Land stabiel en meet de afstand.', sets: 2, target: '2', mode: 'power', type: 'strength' },
        { key: 'medball_rot', group: 'Gooi eerst, fris', name: 'Med ball rotational throw', doel: 'Je pass- en schotpower uit de romp', cue: 'Gooi zijwaarts tegen de muur, alles erin. Volle rust, elke worp maximaal.', sets: 2, target: '3 p/z', mode: 'power', type: 'strength' },
        { key: 'tempo_block', group: 'Conditie', name: 'Tempo - fiets of roeier', doel: 'Je enige lege bakje: aeroob-hoog', cue: '5 x 3 min op hartslag 165-178, 2 min rustig ertussen. Praten moet net niet lukken. Geen stairmaster: die kost je benen te veel voor morgen.', target: '5 x 3 min', type: 'check' },
        { key: 'sled', group: 'Optioneel, als er tijd over is', name: 'Slee — duwen & achteruit trekken', doel: 'Knie-onderhoud zonder spierpijn morgen', cue: 'Duw 20 m heen en trek achteruit terug. Kleine passen, laag blijven. Log het gewicht óp de slee.', let: 'Achteruit is het knie-werk: knie mag voorbij de teen. Geen excentrische fase, dus je betaalt er morgen niets voor op de sprint.', sets: 3, target: '20 m h/t', inc: 10, type: 'strength' },
        { key: 'wall_sit', group: 'Optioneel, als er tijd over is', name: 'Wall sit', doel: 'Je knie-verzekering tegen zeurpijn', cue: 'Houd 45–60 sec stil met bovenbenen horizontaal. Vul de seconden in bij reps.', let: 'Doet ander werk dan de slee — die twee vervangen elkaar niet.', sets: 2, target: '45-60 sec', type: 'strength' },
        { key: 'reverse_nordic', group: 'Optioneel, als er tijd over is', name: 'Reverse Nordic', doel: 'Knieschijfpees belastbaar op lange lengte', cue: 'Leun langzaam achterover met gestrekte heupen en kom rustig terug.', sets: 3, target: '8', type: 'strength' },
        { key: 'mobility_zo', group: 'Beweeg los', name: 'Mobility', doel: 'Stijfheid eruit voor de tildag van morgen', cue: 'Beweeg rustig door wat stijf voelt.', target: '5–10 min', type: 'check' },
        { key: 'zwemmen', group: 'Herstel', name: 'Zwemmen - rustig', doel: 'Bloed rondpompen zonder enige impact', cue: 'Zwem 20-30 min rustig door. Dit is herstel, geen training - stop als het zwaar wordt.', target: '20-30 min', type: 'check' }
      ]
    }
  },

  anchors: {
    strength: [
      { key: 'back_squat', label: 'Back squat' },
      { key: 'trap_bar_deadlift', label: 'Trap bar deadlift' },
      { key: 'incline_press', label: 'Incline press' },
      { key: 'overhead_press', label: 'Overhead press' },
      { key: 'weighted_pullups', label: 'Weighted pullups' },
      { key: 'chest_supported_row', label: 'Chest-supported row' },
      { key: 'cmj', label: 'Countermovement jump — hoogte' },
      { key: 'rdl', label: 'RDL' },
      { key: 'hip_thrust', label: 'Hip thrust' },
      { key: 'lat_pulldown', label: 'Lat pulldown' },
      { key: 'sled', label: 'Slee (gewicht)' }
    ],
    athletic: [
      { key: 'vertical', label: 'Verticale sprong', unit: 'cm', hint: 'hoogte' },
      { key: 'broad_jump', label: 'Broad jump', unit: 'm', hint: 'afstand' },
      { key: 'sprint_10m', label: 'Sprint 10 m', unit: 'sec', hint: 'seconden' },
      { key: 'cod_time', label: '5-10-5 tijd', unit: 'sec', hint: 'seconden' },
      { key: 'rug_hold', label: 'Rug-hold (uithoudingsvermogen)', unit: 'sec', hint: 'seconden horizontaal vasthouden' }
    ],
    body: [
      { key: 'weight', label: 'Lichaamsgewicht', unit: 'kg' }
    ],
    reminders: [
      'Je KPI: sprong omhoog en tijden omlaag — niet je squat-kilo per week',
      'Elke 4 weken meten: verticale sprong · broad jump · 10 m · 5-10-5',
      'Squat 160→170 maar vertical 80→77? Dan heb je dit blok niet gewonnen',
      'Squat gelijk maar vertical 75→85 en sneller? Dat is precies de bedoeling',
      'Het experiment: 105 kg behouden en dat gewicht drastisch beter leren verplaatsen'
    ]
  },

  nutrition: {
    title: 'Performance bulk — geen massabulk',
    context: 'Je bent 105 kg. Elke extra kilo moet je meesleuren over het veld, dus die moet zichzelf terugverdienen in kracht of snelheid.',
    goal: '3500 – 3700 kcal · 240 g eiwit · gewicht vrijwel stabiel houden',
    systemNote: 'Ga je van 105 naar 106 met een hogere sprong en snellere sprint: prima. Ga je naar 109 en word je langzamer: te veel.',
    system: [
      { title: 'Vloeibare calorieën', text: 'Shake van 1000+ kcal (melk, oats, pindakaas, whey, banaan) — 2 minuten, overal te drinken' },
      { title: 'Dichtheid verhogen', text: 'Olijfolie over maaltijden · volle melk · extra rijst/pasta · handje noten' },
      { title: 'Drie vaste ankers', text: 'Ontbijt · shake onderweg · avondeten' },
      { title: 'Meet allebei', text: 'Weeg wekelijks én test elke 4 weken je sprong en sprint. Dat samen vertelt of de bulk werkt' }
    ]
  },

  volumeCheck: {
    title: 'Volume-check', sub: 'Sinds 24-10: tillen op de ochtenden, atletiek op zondag. Sets per week, hoofd- en bijrol samen.',
    rows: [
      { name: 'Bilspieren', sets: '20 (6 gericht)' },
      { name: 'Lats - breedte', sets: '15 (wo)' },
      { name: 'Hamstrings', sets: '13 (ma + za)' },
      { name: 'Borst', sets: '11 (7 di + 4 za)' },
      { name: 'Rugstrekkers', sets: '10' },
      { name: 'Kuiten', sets: '9 (ma - vr - za)' },
      { name: 'Atletische core', sets: '9 - staat nu vooraan in de sessie' },
      { name: 'Sprong- en gooiwerk', sets: '9 (zo, verplaatst van vr)' },
      { name: 'Quads', sets: '7 (vr)' },
      { name: 'Achterste schouder', sets: '7 (za)' },
      { name: 'Midden-rug', sets: '4 (ma)' },
      { name: 'Triceps direct', sets: '2 (di)' },
      { name: 'Cardio', sets: 'zo tempo - za zone 2 - zo zwemmen' },
      { name: 'Zwaarste tildag', sets: '23 sets (ma en za)' }
    ]
  }
};
