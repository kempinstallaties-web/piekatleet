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
    version: 'v27',
    athlete: 'Kaj Kemp',
    motto: 'goed bewegen · gezond lichaam · rauw werk',
    block: 'Krachtblok - golf 2 van 3 (intensiteit) sinds 16 nov - rug eerst t/m 6 dec - blok loopt t/m 10 januari',
    nutritionShort: '4000 kcal - 200-250 g eiwit - vis 2x per week - 2 stuks fruit - elke ochtend wegen',
    weakPoints: 'Posterior chain - hamstrings, bilspieren, rugstrekkers',
    goals: 'Compounds opbouwen, de achterkant ijzersterk maken en een lijf dat overal inzetbaar is: duwen, trekken, dragen en volhouden. Trap bar 150 x 3, squat 120 x 4, incline 105 x 4, 108-110 kg bij dezelfde taille.'
  },

  rules: [
    'Zwaar tillen blijft de basis. Het rauwe werk van zaterdag komt erbovenop, niet in de plaats.',
    'Garmin en je eigen gevoel zijn de rem. Scherpe pijn op een vaste plek bij een pees (knie, achilles, elleboog) meld je direct - dat ziet Garmin niet.',
    'Golf 2 is intensiteit: minder sets, elke set zwaar. Hoofdliften 4-6 reps met een rep in de tank, bijna alles 3 werksets (alleen de trap bar 4). Een set waar niets meer in zit sla je over: die kost herstel en bouwt niets. Haal je alle sets op de bovengrens, dan gaat er gewicht bij - geen plafond.',
    'Rug eerst t/m 6 december: trap bar, RDL, squat en hip thrust houden hun kilo\'s, meer reps mag. Daarna pas gewicht erbij als je rug twee maandagen achter elkaar 0-2 van de 10 is.',
    'Eerste uur na opstaan zijn je tussenwervelschijven vol en stijf: niet bukken met een ronde rug, ook niet op het werk. Buig vanuit je heupen.',
    'Gewicht: +0,3 kg per week bij dezelfde taille, gemeten als weekgemiddelde. Weeg elke ochtend na het toilet, voor het eten.'
  ],

  opener: {
    title: 'Voorwerk',
    sub: 'Vijftien minuten, dagspecifiek. Warm worden, je gewrichten onder gewicht op lengte brengen en je romp aanzetten. Je houdt alleen bereik dat je onder gewicht kunt gebruiken. Kort houden: dit is voorwerk, geen training.',
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
        key: 'romp', title: 'Romp en heupen', sub: '~5 min - rug, buik en heupen aan voordat er ijzer op komt',
        items: [
          { name: 'Bird dog, 6 p/z met 10 tellen vast', doel: 'Rug en billen sterk, romp tegen draaien in', cue: 'Strek een arm en het andere been lang en hou tien tellen vast. Heupen waterpas, alsof er een glas water op je onderrug staat.', why: 'rug en billen', days: ['ma', 'di', 'wo', 'vr', 'za'] },
          { name: 'Zijplank, 2 x 20-30 sec p/z', doel: 'Zijkant romp: dragen met een hand, schaatsen', cue: 'Steun op je onderarm, lijf recht van hoofd tot voet, heupen hoog. Eerst vanaf je knieen mag. Stop voordat je gaat zakken.', why: 'zijkant romp', days: ['ma', 'di', 'wo', 'vr', 'za'] },
          { name: 'McGill curl-up, 5 x 10 sec', doel: 'Buik aan zonder je onderrug te buigen', cue: 'Op je rug, handen onder je onderrug, een knie gebogen. Til hoofd en schouders een paar centimeter op en hou tien tellen vast.', why: 'buik zonder buigen', days: ['ma', 'di', 'wo', 'vr', 'za'] },
          { name: 'Couch stretch, 30 sec p/z', doel: 'Heupbuigers los, die trekken aan je onderrug', cue: 'Knie tegen de muur of bank, voorste voet plat. Knijp je bil aan zodat je onderrug niet hol trekt, en blijf rechtop.', why: 'heupbuigers', days: ['ma', 'vr', 'za'] },
          { name: 'Open book op je zij, 6 p/z', doel: 'Middenrug draaien, zo blijf je rechter in de squat', cue: 'Lig op je zij met je knieen op heuphoogte. Draai je bovenste arm open naar de grond achter je, je ogen volgen je hand.', why: 'middenrug', days: ['ma', 'wo', 'vr'] },
          { name: 'Hamstrings losmaken met band, 10 p/z', doel: 'Hamstrings soepel zonder voorover te buigen', cue: 'Op je rug, band om je voet, been omhoog. Strek en buig je knie rustig. Je onderrug blijft plat op de grond.', why: 'hamstrings', days: ['di', 'wo', 'vr'] }
        ]
      },
      {
        key: 'power', title: 'Wakker maken', sub: '~2 min - wakker maken, niet moe maken',
        items: [
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
      warn: 'Rug eerst t/m 6 dec: trap bar blijft op 135 en RDL op 109, reps mogen omhoog. Is je rug vandaag 3/10 of meer: trap bar 125 4 x 5 en RDL 100.',
      items: [
        { key: 'ma_core', group: 'Atletische core', name: 'Hanging leg raise', doel: 'Romp die kracht maakt, niet alleen tegenhoudt', cue: 'Hang stil en breng je knieen naar je borst zonder te zwaaien. Kantel je bekken mee - dat is het werk, niet de hoogte.', sets: 3, target: '8-12', type: 'strength' },
        { key: 'trap_bar_deadlift', group: 'Til zwaar', name: 'Trap bar deadlift', doel: 'De hoofdlift van dit blok', cue: 'Til vanaf de grond met een vlakke rug en duw de vloer weg. Golf 2: zwaar, een rep in de tank. Haal je 4 x 6, dan gaat er na 6 december gewicht bij.', sets: 4, target: '4-6', inc: 5, vast: '2026-12-06', type: 'strength' },
        { key: 'rdl', group: 'Bouw je achterkant', name: 'RDL', doel: 'Hamstrings op lengte sterk maken', cue: 'Zak met gestrekte rug tot halverwege je scheen en voel je hamstrings rekken. Rustig omlaag, explosief omhoog.', sets: 3, target: '8', inc: 5, vast: '2026-12-06', type: 'strength' },
        { key: 'leg_curl', group: 'Bouw je achterkant', name: 'Leg curl', doel: 'Hamstring direct, los van je rug', cue: 'Trek je hielen naar je billen en laat ze drie tellen zakken. Dit is de enige oefening die je hamstring alleen pakt.', sets: 3, target: '10-12', inc: 5, type: 'strength' },
        { key: 'chest_supported_row', group: 'Trek zwaar', name: 'Chest-supported row', doel: 'Rugdikte zonder je onderrug te belasten', cue: 'Trek je ellebogen naar achteren en knijp je schouderbladen samen. Golf 2: zwaarder, strakke reps, geen zwaai.', sets: 3, target: '6-8', type: 'strength' },
        { key: 'calf_standing', group: 'Onderhoud', name: 'Staande kuit', doel: 'Kuit en enkel sterk onder 105 kg', cue: 'Duw hoog door op de bal van je voet en laat langzaam zakken.', sets: 3, target: '10-12', type: 'strength' }
      ]
    },
    di: {
      key: 'di', label: 'DI', title: 'Push - borst voorop', sub: 'incline zwaar, flat en dips, dan tempo',
      erector: 'LAAG', power: 'Geen', compound: 'Incline press',
      warn: 'Incline blijft de zware eerste, daarna flat en dips. Geen overhead press meer: je schouders krijgen hun werk uit de lateral raise en zaterdag. Dips niet dieper dan bovenarm horizontaal. Daarna 20 min tempo op de fiets of roeier, direct of in de avond.',
      items: [
        { key: 'incline_press', group: 'Til zwaar', name: 'Incline barbell / DB press', doel: 'Bovenborst — je zwakste schakel boven', cue: 'Raak iets lager aan dan normaal (tepelhoogte), dat voelt krachtiger. Golf 2: drie zware sets in 4-6, een rep in de tank. Haal je er 8, dan is het gewicht te licht.', sets: 3, target: '4-6', type: 'strength' },
        { key: 'flat_press', group: 'Til zwaar', name: 'Flat bench press', doel: 'Massa op je hele borst', cue: 'Schouderbladen in de bank en naar elkaar, voeten vast. Laat zakken tot tepelhoogte en pers recht omhoog. Stang of dumbbells: kies er een en blijf daarbij, anders zegt je log niets. Na de incline zijn twee zware sets genoeg.', sets: 2, target: '6-8', type: 'strength' },
        { key: 'dips', group: 'Bouw je borst', name: 'Dips', doel: 'Onderkant borst en triceps', cue: 'Leun licht voorover, ellebogen iets naar buiten. Zak tot je bovenarm horizontaal is, niet dieper: met jouw armlengte spaart dat je schouder. Haal je 2 x 12, hang er dan gewicht aan.', sets: 2, target: '8-12', type: 'strength' },
        { key: 'chest_fly', group: 'Bouw je borst', name: 'Lage kabelfly', doel: 'Bovenborst, het deel dat achterloopt', cue: 'Breng de kabels van laag naar boven samen en knijp een tel vast. Lichte bocht in je elleboog, geen persbeweging.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'lateral_raise', group: 'Bouw volume', name: 'Lateral raise', doel: 'Schouderbreedte — je directe schouderwerk op deze dag', cue: 'Til zijwaarts tot schouderhoogte en laat gecontroleerd terug. Niet schrappen: zonder overhead press is dit je schouderwerk hier.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'triceps', group: 'Bouw volume', name: 'Triceps', doel: 'Ondersteunt je persen', cue: 'Strek volledig door, kort werk.', sets: 2, target: '10-12', type: 'strength' },
        { key: 'tempo_di', group: 'Conditie: aeroob-hoog', name: 'Tempo - fiets of roeier', doel: 'Het lege balkje in Garmin: aeroob-hoog', cue: '20 min aan een stuk op hartslag 165-175, of 4 x 5 min met 1 min rustig ertussen. Praten lukt alleen in korte zinnen. Start er een eigen activiteit voor in je Garmin (Indoor fietsen of Roeien binnen), dan telt Garmin het als conditie en niet als krachttraining. Direct na het persen of in de avond, wat past.', let: 'Komt het de volgende ochtend in het anaerobe balkje terecht, dan gaan we naar hartslag 160-170.', target: '20 min', type: 'check' },
        { key: 'thuis_hold_di', group: 'Thuis, na het werk', name: 'Rughold thuis (back extension)', doel: 'Uithouding rugstrekkers: licht en vaak', cue: 'Hou je romp recht en stop als je nog 15-20 sec had gekund: geen trillen. Vul de seconden in bij reps.', let: 'Niet in het eerste uur na opstaan. Elke week 5 sec erbij; gaat 3 x 60 sec makkelijk, houd dan een schijf tegen je borst. Daarna 5 min rekken: hamstrings, duif, heupbuiger en kindhouding, elk een minuut.', sets: 3, target: '30-60 sec', inc: 2.5, type: 'strength' }
      ]
    },
    wo: {
      key: 'wo', label: 'WO', title: 'Lats - breedte', sub: 'je zwakste schakel op de rug',
      erector: 'LAAG', power: 'Geen', compound: 'Weighted pullups',
      warn: 'Alles draait om breedte: ellebogen omlaag, volle rek bovenin.',
      items: [
        { key: 'rug_hold_row', group: 'Rug eerst', name: 'Rughold op de GHD + roeien met een arm', doel: 'Rugstrekkers uithoudend, romp tegen draaien in', cue: 'Hang horizontaal met je heupen op het kussen en je rug recht, en hou stil. Vul de seconden in bij reps.', let: 'Eerst zonder gewicht. Haal je 3 x 45 sec netjes, roei dan tijdens de hold met een arm een dumbbell van 6-10 kg, 6-8 keer per arm, en vul die in bij kg. Je heupen blijven recht naar de grond.', sets: 3, target: '30-45 sec', inc: 2, type: 'strength' },
        { key: 'wo_core', group: 'Atletische core', name: 'Ab wheel rollout', doel: 'Anti-extensie: je romp houdt je lange rug recht onder belasting', cue: 'Vanaf je knieen, billen aan en ribben omlaag. Rol zo ver uit als je kunt zonder dat je onderrug doorzakt en trek terug met je buik, niet met je heupen.', let: 'Haal je 3 x 12 vanaf je knieen: verder uitrollen, of vanaf staand. Geen ab wheel? Body saw of plank met langzaam armen reiken.', sets: 3, target: '8-12', type: 'strength' },
        { key: 'weighted_pullups', group: 'Trek zwaar', name: 'Weighted pullups', doel: 'Zware trekdag, ver van de deadlift', cue: 'Trek zwaar met extra gewicht, volle hang onderin. Haal je 3 x 6, dan gaat er 2,5 tot 5 kg bij. Daarna nog een back-off set op lichaamsgewicht mag, zoveel reps als er in zitten.', sets: 3, target: '4-6', type: 'strength' },
        { key: 'lat_pulldown', group: 'Bouw je lats', name: 'Lat pulldown', doel: 'Breedte - je zwakste schakel op de rug', cue: 'Trek met je ellebogen omlaag naar je heupen, niet met je handen. Laat bovenin volledig uitrekken voor je weer trekt.', sets: 3, target: '10-12', inc: 5, type: 'strength' },
        { key: 'pullover', group: 'Bouw je lats', name: 'Straight-arm pullover', doel: 'Lat op volle lengte, zonder je biceps', cue: 'Houd je armen gestrekt en duw de stang in een boog naar je heupen. Voel de rek bovenin - licht gewicht, lange baan.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'lat_row', group: 'Bouw je lats', name: 'Single-arm lat row', doel: 'Lat apart, met volle rek onderin', cue: 'Laat je schouderblad onderin ver naar voren komen en trek je elleboog langs je heup. Romp blijft stil.', sets: 2, target: '10-12 p/z', inc: 2.5, type: 'strength' },
        { key: 'biceps', group: 'Bouw volume', name: 'Biceps', doel: 'Elleboog en onderarm belastbaar', cue: 'Krul rustig en laat het gewicht gecontroleerd zakken. Twee oefeningen is genoeg, dit is geen armendag.', sets: 3, target: '10-12', inc: 2.5, type: 'strength' },
      ]
    },
    do: {
      key: 'do', label: 'DO', title: 'Rust', sub: 'niets doen is hier het werk',
      erector: 'LAAG', power: 'Geen', compound: '-', rest: true,
      warn: 'Rustdag. Wandelen mag, trainen niet. Wel de rughold thuis (3 x 30-60 sec, licht) en 5 min rekken: dat is herstel, geen training.',
      items: []
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Benen + bilspieren', sub: 'eerst leg extension en leg curl, dan squat',
      erector: 'HOOG', power: 'Geen', compound: 'Back squat',
      warn: 'Eerst leg extension en seated leg curl tot het gaatje, dan pas de squat: alles warm en soepel. De Bulgarian is eruit. Squat in golf 2 zwaarder en korter: 4 tot 6 reps.',
      items: [
        { key: 'do_core', group: 'Atletische core', name: 'Cable chop', doel: 'Rotatiekracht van heup naar schouder', cue: 'Draai vanuit je heup en laat je armen volgen. Duw je achterste voet in de grond - de kracht komt van onderen.', sets: 3, target: '10-12 p/z', type: 'strength' },
        { key: 'leg_ext', group: 'Eerst: knieen warm', name: 'Leg extension', doel: 'Knieen warm en bovenbenen vol voor je squat', cue: 'Strek volledig, knijp bovenin een tel vast en laat drie tellen zakken. Eerste set opbouwen, daarna stop je twee reps voor het einde. Warm en vol, niet leeg: gaan je bovenbenen leeg, dan neemt je onderrug het over in de squat.', sets: 3, target: '12-15', inc: 5, type: 'strength' },
        { key: 'seated_leg_curl', group: 'Eerst: knieen warm', name: 'Seated leg curl', doel: 'Hamstrings warm, je knie voelt stabieler onder de stang', cue: 'Trek volledig door en laat drie tellen terugkomen. Heupen blijven in de stoel. Stop twee reps voor het einde, de squat komt nog.', sets: 3, target: '10-12', inc: 5, type: 'strength' },
        { key: 'back_squat', group: 'Til zwaar', name: 'Back squat', doel: 'Je krachtbasis', cue: 'Zak tot net onder parallel: je heupvouw net onder de bovenkant van je knie, niet dieper. Een bankje achter je als dieptemaat helpt: aantikken, niet zitten. Onderin blijf je strak en dan duw je explosief omhoog. Golf 2: zwaar, een rep in de tank. Haal je 3 x 6, dan gaat er na 6 december gewicht bij. Je squat altijd na de leg extension en leg curl, dan blijven je gewichten vergelijkbaar.', let: 'Voel je hem in je onderrug terwijl het er netjes uitziet? Met jouw lengte leun je verder voorover, dus je rug draagt meer. Komen je heupen sneller omhoog dan je borst, dan stop je de set.', sets: 3, target: '4-6', inc: 5, vast: '2026-12-06', type: 'strength' },
        { key: 'hip_thrust', group: 'Bouw je bilspieren', name: 'Hip thrust', doel: 'Bilspieren zwaar belasten zonder je rug', cue: 'Duw door je hielen tot je romp horizontaal staat en knijp bovenin twee tellen vast.', let: 'Onderrug voelen? Dan duw je bovenin door met je rug in plaats van met je billen. Kin naar je borst, ribben omlaag, bekken iets kantelen en stop als je romp horizontaal is. Haal je 3 x 10 netjes, dan gaat er na 6 december 10 kg bij.', sets: 3, target: '8-10', inc: 10, vast: '2026-12-06', type: 'strength' },
        { key: 'abduction', group: 'Bouw je bilspieren', name: 'Hip abduction', doel: 'Bil van de zijkant, los van je benen', cue: 'Duw je knieen naar buiten en knijp twee tellen vast. Leun licht voorover, dan pakt de bil meer.', sets: 2, target: '15-20', inc: 5, type: 'strength' },
        { key: 'calf', group: 'Onderhoud', name: 'Kuit (machine)', doel: 'Kuitvolume, steun voor knie en enkel', cue: 'Duw volledig door en laat rustig zakken.', sets: 3, target: '12-15', type: 'strength' }
      ]
    },
    za: {
      key: 'za', label: 'ZA', title: 'Borst, schouders + dragen', sub: 'eerst borst, lats en schouders, daarna slee en dragen',
      erector: 'MIDDEL', power: 'Slee en gooien', compound: 'Incline press (Prime)',
      warn: 'Sinds 15-11 korter: nordics, push-ups, sit-ups en zone 2 zijn eraf en staan nu op zondag. De slee blijft hier - dat is je zwaarste conditiewerk van de week.',
      items: [
        { key: 'incline_prime', group: 'Bouw je borst', name: 'Incline press (Prime)', doel: 'Tweede prikkel voor de bovenborst', cue: 'Pers met vol bereik en rustig tempo; hier telt spanning, niet gewicht.', sets: 3, target: '10-12', type: 'strength' },
        { key: 'za_lat_pulldown', group: 'Bouw je lats', name: 'Lat pulldown - enkele arm (kabel)', doel: 'Tweede latprikkel van de week, op volle rek', cue: 'Kniel of zit schuin onder de kabel, arm bovenin helemaal gestrekt zodat je lat rekt. Trek je elleboog naar je heup, niet naar achteren.', let: 'Lichter dan woensdag: rek en samenknijpen, geen zware set. Twee tellen stretch bovenin.', sets: 3, target: '12-15 p/z', inc: 2.5, type: 'strength' },
        { key: 'za_lateral', group: 'Bouw je schouders', name: 'Lateral raise - kabel of machine', doel: 'Zijkant schouder: breedte op je frame', cue: 'Til je arm zijwaarts tot schouderhoogte met je elleboog voorop. Langzaam zakken, niet zwaaien.', let: 'Dinsdag doe je ze met dumbbells, hier met kabel of machine: andere weerstand, zelfde spier.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'rear_delt_fly', group: 'Bouw je achterste schouder', name: 'Reverse fly', doel: 'Achterste schouder, tegenwicht voor al het persen', cue: 'Breng je armen opzij uit elkaar met je duimen omlaag. Licht gewicht, knijp bovenin kort vast.', sets: 3, target: '12-15', inc: 2.5, type: 'strength' },
        { key: 'rear_delt_facepull', group: 'Bouw je achterste schouder', name: 'Rear delt + face pull', doel: 'Houding en achterkant schouder', cue: 'Trek naar je gezicht met hoge ellebogen en knijp kort vast.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'trap_raise', group: 'Bouw je achterste schouder', name: 'Trap raise (Y-raise)', doel: 'Onderste trapezius: schouderbladen omlaag en naar achteren', cue: 'Lig voorover op een schuine bank en til je armen in een Y met je duimen omhoog. Licht gewicht, bovenin een tel vasthouden.', sets: 3, target: '12-15', inc: 1, type: 'strength' },
        { key: 'calf_pull', group: 'Onderhoud', name: 'Kuit - zittend', doel: 'Derde kuitmoment, andere hoek', cue: 'Duw door de bal van je voet en laat de hiel diep zakken. Twee tellen bovenin vasthouden.', sets: 3, target: '12-15', inc: 5, type: 'strength' },
        { key: 'di_core', group: 'Rauw werk', name: 'Med ball side throw', doel: 'Explosieve rotatie vanuit je heup', cue: 'Gooi de bal zo hard je kunt zijwaarts tegen de muur en vang hem weer op. Maximale intentie, geen uithoudingswerk.', sets: 3, target: '6 p/z', mode: 'power', type: 'strength' },
        { key: 'sled', group: 'Rauw werk', name: 'Slee — duwen & achteruit trekken', doel: 'Hamstrings, bilspieren en conditie in een', cue: 'Heen en terug, om de beurt. Op 15-11 zat je hier gemiddeld op hartslag 163 met een piek van 176 - dit is je zwaarste conditiewerk van de week.', let: 'Achteruit is het kniewerk: knie mag voorbij de teen. Geen excentrische fase, dus weinig spierpijn.', sets: 4, target: '20 m h/t', inc: 10, type: 'strength' },
        { key: 'carries', group: 'Rauw werk', name: 'Farmer carry', doel: 'Grip, romp en rug onder last', cue: 'Loop 40 m zonder neerzetten, zwaar genoeg om te moeten knijpen. Log het gewicht per hand.', video: 'https://www.youtube.com/watch?v=P8iSOHX73FE', let: 'Schouders naar achteren, ribben omlaag. Zodra je gaat hangen is de set klaar.', sets: 3, target: '40 m', inc: 5, type: 'strength' },
        { key: 'suitcase_carry', group: 'Rauw werk', name: 'Suitcase carry', doel: 'Dragen met een hand, zoals een gereedschapskist', cue: 'Loop 40 m met een zware dumbbell of kettlebell in een hand en wissel dan. Schouders recht, niet scheef hangen. Log het gewicht.', let: 'Je zijkant houdt je recht. Minder druk op je onderrug dan de bear-hug, en precies wat je doet met een kind op je heup of een ketel in je hand.', sets: 3, target: '40 m p/z', inc: 2.5, type: 'strength' },
        { key: 'hang', group: 'Rauw werk', name: 'Dead hang', doel: 'Grip en schouders belastbaar', cue: 'Hang zo lang mogelijk met actieve schouders. Vul de seconden in bij reps.', sets: 2, target: '45-60 sec', type: 'strength' },
        { key: 'thuis_hold_za', group: 'Thuis, na het werk', name: 'Rughold thuis (back extension)', doel: 'Uithouding rugstrekkers: licht en vaak', cue: 'Hou je romp recht en stop als je nog 15-20 sec had gekund: geen trillen. Vul de seconden in bij reps.', let: 'Niet in het eerste uur na opstaan. Elke week 5 sec erbij; gaat 3 x 60 sec makkelijk, houd dan een schijf tegen je borst. Daarna 5 min rekken: hamstrings, duif, heupbuiger en kindhouding, elk een minuut.', sets: 3, target: '30-60 sec', inc: 2.5, type: 'strength' }
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
        { key: 'thuis_hold_zo', group: 'Thuis, na het werk', name: 'Rughold thuis (back extension)', doel: 'Uithouding rugstrekkers: licht en vaak', cue: 'Hou je romp recht en stop als je nog 15-20 sec had gekund: geen trillen. Vul de seconden in bij reps.', let: 'Niet in het eerste uur na opstaan. Elke week 5 sec erbij; gaat 3 x 60 sec makkelijk, houd dan een schijf tegen je borst. Daarna 5 min rekken: hamstrings, duif, heupbuiger en kindhouding, elk een minuut.', sets: 3, target: '30-60 sec', inc: 2.5, type: 'strength' },
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
    zone2_run: 'Stairmaster - zone 2',
    vr_core: 'L-sits / calisthenics + crunches',
    back_ext: 'Back extension — uithoudingsvermogen',
    bearhug_carry: 'Bear-hug carry'
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
      { key: 'row_500', label: 'Roeier 500 m', unit: 'sec', hint: 'seconden, alles erin' },
      { key: 'rug_hold', label: 'Rughold horizontaal (GHD)', unit: 'sec', hint: 'zo lang mogelijk, rug recht' },
      { key: 'zijplank_l', label: 'Zijplank links', unit: 'sec', hint: 'zo lang mogelijk, op je linker onderarm' },
      { key: 'zijplank_r', label: 'Zijplank rechts', unit: 'sec', hint: 'zo lang mogelijk, op je rechter onderarm' }
    ],
    body: [
      { key: 'weight', label: 'Lichaamsgewicht', unit: 'kg' },
      { key: 'waist', label: 'Taille', unit: 'cm' }
    ],
    reminders: [
      'Je maatstaf: zwaarder tillen en dragen bij dezelfde taille',
      'Elke 4 weken meten: farmer carry · dead hang · push-ups · roeier 500 m',
      'Rusthartslag en HRV op je eigen niveau: dan kan je lijf het aan',
      'Word je sterker maar zakken je conditie of je slaap? Dan doe je te veel',
      'Rug: gezonde jonge mannen houden de rughold rond 2,5 min en de zijplank rond 1,5 min per kant vol (McGill). Links en rechts horen gelijk te zijn.'
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
      { name: 'Bilspieren', sets: '15 (5 gericht), plus 2 back extension als je rug fris is' },
      { name: 'Lats - breedte', sets: '14 (11 wo + 3 za), twee keer per week' },
      { name: 'Hamstrings', sets: '9 (ma + vr), plus nordics op zo' },
      { name: 'Borst', sets: '13 (10 di + 3 za)' },
      { name: 'Rugstrekkers', sets: '7, plus 2 back extension als je rug fris is' },
      { name: 'Kuiten', sets: '9 (ma - vr - za)' },
      { name: 'Atletische core', sets: '12 - ma buik, wo anti-extensie, vr rotatie, za werpen; plus dragen op za' },
      { name: 'Slee en dragen', sets: '10 (za)' },
      { name: 'Quads', sets: '6 (vr: leg extension en squat)' },
      { name: 'Achterste schouder', sets: '9 (za, met trap raise)' },
      { name: 'Midden-rug', sets: '3 (ma)' },
      { name: 'Triceps direct', sets: '2 (di), plus 2 sets dips' },
      { name: 'Zijkant schouder', sets: '6 (di + za)' },
      { name: 'Conditie', sets: 'di tempo 20 min - zo intervallen 4 x 6 min - za slee' },
      { name: 'Zwaarste tildag', sets: '20 sets (vr), ma 19 plus 2 optioneel' }
    ]
  }
};
