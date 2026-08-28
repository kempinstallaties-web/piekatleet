// PIEK-ATLEET v5 — basketbal-atleet blok
// Verdeling: ~40% strength · 30% power/speed · 30% basketbal-athleticism.
// Filter voor élke oefening: "maakt dit mij beter in het verplaatsen van 105 kg op een veld?"
window.PROGRAM = {
  meta: {
    name: 'PIEK-ATLEET',
    version: 'v6',
    athlete: 'Kaj Kemp',
    motto: 'niet groter worden — beter bewegen',
    block: 'Basketbal-blok · teamtraining donderdag · seizoen start oktober',
    nutritionShort: '3500–3700 kcal · 240 g eiwit · performance bulk',
    weakPoints: 'Agility & COD · Reactiviteit · Basketbalspecificiteit',
    goals: '105 kg explosief leren verplaatsen: hoger springen, sneller versnellen én afremmen. Kracht is het middel, atletiek het doel.'
  },

  rules: [
    'Power vóór kracht. Springen en sprinten doe je fris, nooit als toetje na het tillen.',
    'Herstel is het plafond. Donderdag moet je fris op de teamtraining staan — dus woensdag geen conditioning en zaterdag geen ego-deadlift.',
    'Elke oefening door één filter: maakt dit mij beter op het veld? Zo nee, alleen als er herstel over is.',
    'Word je zwaarder maar langzamer, dan ga je de verkeerde kant op.'
  ],

  opener: {
    title: 'Atleet-fase',
    sub: 'Kort en dagspecifiek — 10 minuten. Je échte springwerk staat niet hier maar bovenaan de training zelf.',
    blocks: [
      {
        key: 'reset', title: 'Mobility', sub: '~3 min',
        items: [
          { name: 'Cat-cow', why: 'rug losmaken', days: ['ma', 'di', 'do', 'za'] },
          { name: 'Open books', why: 'thoracale rotatie — persen, trekken en gooien', days: ['di', 'za'] },
          { name: '90/90 switches', why: 'heup in- en uitdraaien voor squat-diepte', days: ['ma', 'do'] },
          { name: 'Cossack flow', why: 'laag zitten + liezen — je verdedigingshouding', days: ['wo', 'vr'] },
          { name: "World's greatest stretch", why: 'heupbuiger + thoracaal in één', days: ['di', 'wo', 'vr'] },
          { name: 'Ankle rocks', why: 'enkelmobiliteit — diepere squat, zachtere landing', days: ['ma', 'wo', 'vr'] },
          { name: 'Hinge-drill (stok)', why: 'eerste rep goed bracen — jouw beperkende factor', days: ['do', 'za'] }
        ]
      },
      {
        key: 'power', title: 'Neural primer', sub: '~4 min · wakker maken, niet moe maken',
        items: [
          { name: 'Pogo hops 2 × 15', why: 'voetstijfheid — maakt je klaar voor het echte springwerk', days: ['ma', 'do'] },
          { name: 'Band pull-apart 2 × 15', why: 'schouders wakker vóór het persen', days: ['di', 'za'] },
          { name: 'Med ball chest pass licht 2 × 5', why: 'bovenlichaam op scherp', days: ['di'] },
          { name: 'A-skips 2 × 20 m', why: 'sprintmechaniek instellen', video: 'https://www.youtube.com/watch?v=2LAg2FFAXbo', days: ['wo', 'vr'] },
          { name: 'Buildups 3 × 30 m (60→90%)', why: 'opbouwen naar volle snelheid zonder koud te knallen', days: ['vr'] },
          { name: 'Split-step + reactie', why: 'eerste stap scherp zetten vóór je gaat spelen', days: ['wo'] },
          { name: 'Dead hang 2 × max', why: 'grip en decompressie vóór het trekken', days: ['za'] }
        ]
      },
      {
        key: 'balans', title: 'Voet & enkel', sub: '~3 min · je enkels zijn je grootste blessurerisico',
        items: [
          { name: 'Tibialis raise 2 × 20', why: 'scheenbeen — remkracht, beschermt de knie', days: ['ma', 'di', 'wo', 'do', 'vr', 'za'] },
          { name: 'Calf raise excentrisch 2 × 10', why: 'achillespees belastbaar voor sprinten en springen', days: ['di', 'wo', 'vr', 'za'] },
          { name: 'Single-leg balance 2 × 30 sec', why: 'kort. Stabiele enkel, geen circusact op een wiebelplank', days: ['di', 'wo', 'vr'] }
        ]
      }
    ]
  },

  weekRule: 'Basketbal is nu het skelet: donderdag teamtraining, woensdag je eigen agility-sessie, zondag schot en licht spel. Het tilwerk vult de gaten — maandag, dinsdag en zaterdag. Vrijdag is rust, tenzij er iets is uitgevallen én je fris bent.',
  weekOrder: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],

  days: {
    ma: {
      key: 'ma', label: 'MA', title: 'Onderlichaam + verticale power', sub: 'springen fris, dan pas tillen',
      erector: 'HOOG', power: 'Verticaal — vol', compound: 'Back squat',
      warn: 'De sprongen zijn hier geen warming-up maar de hoofdmoot. Volledige rust ertussen: als de hoogte zakt, stop je met springen.',
      items: [
        { key: 'cmj', group: 'POWER · eerst', name: 'Countermovement jump', cue: 'Precies 2 sprongen per set — meer is geen bonus, dan train je een lágere sprong. Volledige rust. Meet met sprong-en-reik tegen de muur, niet met een boxhoogte', sets: 4, target: '2 reps', type: 'strength' },
        { key: 'broad_jump_plyo', group: 'POWER · eerst', name: 'Broad jump', cue: '2 sprongen per set, verder niet. Horizontale power — meteen je 4-weken test', sets: 3, target: '2 reps', type: 'strength' },
        { key: 'back_squat', group: 'KRACHT', name: 'Back squat', cue: 'RPE 7–8: laat 2 reps in de tank. Explosief omhoog. Knie zeurt? Blijf op wat pijnvrij is', sets: 4, target: '3–5', inc: 5, type: 'strength' },
        { key: 'atg_split_squat', group: 'KRACHT', name: 'Bulgarian split squat', cue: 'Single-leg kracht — dit is hoe je op het veld beweegt', sets: 3, target: '5–6 p/b', type: 'strength' },
        { key: 'rdl', group: 'KRACHT', name: 'RDL', cue: 'Til hem vanaf de grond zoals een deadlift — dat pakt je eerste rep en haalt de pijn eruit', sets: 3, target: '6', inc: 5, type: 'strength' },
        { key: 'calf_standing', group: 'ONDERHOUD', name: 'Staande kuit', cue: 'Sprongkracht en enkelstabiliteit — low fatigue', sets: 3, target: '8–10', type: 'strength' },
        { key: 'wall_sit', group: 'ONDERHOUD', name: 'Wall sit', cue: 'Je knie-verzekering — de isometrische hold die de zeurpijn eruit haalt. Doet ander werk dan de slee, dus die twee vervangen elkaar niet. Seconden invullen bij reps', sets: 2, target: '45–60 sec', type: 'strength' },
        { key: 'ma_core', group: 'CORE', name: 'Core — anti-extensie', cue: 'Dead bug of ab wheel. Romp stil houden terwijl er aan je getrokken wordt', type: 'check' }
      ]
    },
    di: {

      key: 'di', label: 'DI', title: 'Upper Push + Throwing', sub: 'gooien vóór persen',
      erector: 'LAAG', power: 'Med ball — vol', compound: 'Incline press',
      warn: 'Med-ball werk is hier geen opwarmer maar training: max intentie, volle rust. Daarna pas het ijzer.',
      items: [
        { key: 'medball_rot', group: 'POWER · eerst', name: 'Med ball rotational throw', cue: 'Zijwaarts tegen de muur, alles erin. Dit is je pass- en schotpower', sets: 4, target: '3 p/z', type: 'strength' },
        { key: 'medball_chest', group: 'POWER · eerst', name: 'Med ball chest pass', cue: 'Explosief wegduwen, vangen, opnieuw', sets: 3, target: '4 reps', type: 'strength' },
        { key: 'incline_press', group: 'KRACHT', name: 'Incline barbell / DB press', cue: 'Zwaarste incline — raak iets lager aan (tepelhoogte), dat voelt krachtiger', sets: 4, target: '5–6', type: 'strength' },
        { key: 'overhead_press', group: 'KRACHT', name: 'Overhead press', cue: 'Machine of barbell — ná het borstwerk', sets: 3, target: '5', type: 'strength' },
        { key: 'weighted_pullups', group: 'RUG · 2× p/w', name: 'Weighted pullups', cue: 'Je zware pullup-dag: grip staat hier het verst van de deadlift', sets: 3, target: '6', type: 'strength' },
        { key: 'cable_row', group: 'RUG · 2× p/w', name: 'Cable / DB row', cue: 'Zittend of met steun — je onderrug hoeft niets te dragen', sets: 3, target: '8', type: 'strength' },
        { key: 'incline_prime', group: 'ACCESSOIRE', name: 'Incline press (Prime)', cue: 'Tweede incline-prikkel — upper chest blijft je zwakke punt', sets: 3, target: '8–12', type: 'strength' },
        { key: 'lateral_raise', group: 'ACCESSOIRE', name: 'Lateral raise', cue: 'Eerste dat je schrapt bij een zware week', sets: 2, target: '10–15', type: 'strength' },
        { key: 'triceps', group: 'ACCESSOIRE', name: 'Triceps', cue: 'Kort — ondersteunt je persen', sets: 2, target: '10–15', type: 'strength' },
        { key: 'copenhagen', group: 'PREHAB', name: 'Copenhagen plank', cue: 'Adductor/lies — benen zijn vandaag vers', sets: 2, target: '20–40 sec p/z', type: 'strength' },
        { key: 'di_core', group: 'CORE', name: 'Core — anti-rotatie', cue: 'Pallof press + hanging leg raise', type: 'check' }
      ]
    },
    wo: {
      key: 'wo', label: 'WO', title: 'Basketbal 1 — snelheid & agility', sub: 'alles wat je op de vloer nodig hebt, mét bal',
      erector: 'LAAG', power: 'Sprint & COD', compound: 'Acceleratie',
      warn: 'Dit is je eigen sessie, dus hier bepaal jij de kwaliteit. Volle rust tussen de sprints; word je trager, dan ben je klaar. Geen conditioning erachteraan — morgen is de teamtraining.',
      items: [
        { key: 'accel', group: 'SNELHEID · eerst', name: 'Acceleratie', video: 'https://www.youtube.com/watch?v=MHyM1uuMIwc', let: 'Eerste meters voorover, niet rechtop. Pas rond 10-15 m overeind komen',  cue: '4 × 10 m, daarna 3 × 20 m. Volle rust, elke start maximaal', type: 'check' },
        { key: 'decel', group: 'SNELHEID · eerst', name: 'Deceleratie', video: 'https://www.youtube.com/watch?v=GqVqQK_j_zQ', let: 'Zak op de laatste twee passen, borst blijft boven de knie. Niet met gestrekt been remmen',  cue: '4 × 10 m sprint → volledig stoppen en stil staan. Afremmen is 80% van basketbal', type: 'check' },
        { key: 'cod_drill', group: 'AGILITY', name: 'Change of direction (5-10-5)', video: 'https://www.youtube.com/watch?v=tYhCJd7LaBU', let: 'De tijd win je in de twee draaien, niet op het rechte stuk. Laag zakken, hand naar de lijn',  cue: '4–5 pogingen. Laag blijven bij de draai, niet omhoog komen', type: 'check' },
        { key: 'def_slides', group: 'AGILITY', name: 'Lateral shuffle → sprint', video: 'https://www.youtube.com/watch?v=aFtFDwHAso4', let: 'Voeten kruisen nooit, heupen laag. Overgang naar sprint is een draai, niet eerst rechtop komen',  cue: '5 × zijwaarts verplaatsen en dan explosief wegsprinten', type: 'check' },
        { key: 'reactie_drill', group: 'AGILITY', name: 'Reactief — op signaal', video: 'https://www.youtube.com/watch?v=TZC-Pl_quoc', let: 'Je mag pas beslissen op het signaal. Weet je het vooraf, dan train je iets anders',  cue: '6–10 reps. Maat wijst een richting, of bal tegen de muur. Pas beslissen als je moet reageren', type: 'check' },
        { key: 'approach_jump_sl', group: 'SPRONG', name: 'Approach jump — 1 been', cue: 'Aanloop, afzet op één been, naar de ring. 3 × 2 per been, meer niet — maximale kwaliteit. Dít is hoe je in een wedstrijd springt', sets: 3, target: '2 p/b', type: 'strength' },
        { key: 'shooting', group: 'BASKETBAL', name: 'Shooting', cue: '10–15 min afsluiten', type: 'check' }
      ]
    },
    do: {
      key: 'do', label: 'DO', title: 'Teamtraining', sub: 'de belangrijkste basketbaldag van je week',
      erector: 'WISSELEND', power: 'Wedstrijdvorm', compound: 'Live spel',
      warn: 'Kom fris binnen: woensdag geen extra conditioning, en het zware tilwerk staat bewust op zaterdag. Dit is de sessie waar je selectie wordt bepaald, niet je squat.',
      items: [
        { key: 'team_training', group: 'TEAMTRAINING', name: 'Teamtraining', cue: 'De coach bepaalt de inhoud — jij bepaalt alleen of je fris binnenkomt. Noteer achteraf wat er gedaan is en hoe je rug na 40 min voelde: dat is de test die we willen zien', type: 'check' },
        { key: 'team_note', group: 'TEAMTRAINING', name: 'Vrije worpen na afloop', cue: '2 × 10 aan het eind, vermoeid. Tel ze. Dit is de enige plek waar je je schot onder wedstrijdvermoeidheid meet', type: 'check' }
      ]
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Vrij — rust of inhalen', sub: 'standaard rust; alleen invullen als je fris bent',
      erector: 'LAAG', power: 'Geen', compound: '—', rest: true,
      warn: 'Dit is je herstel-klep na de teamtraining. Alleen invullen als er iets is uitgevallen én je je goed voelt. Twijfel je, dan rust je.',
      items: [
        { key: 'carries', group: 'ALS ER TIJD IS', name: 'Farmer carry', video: 'https://www.youtube.com/watch?v=P8iSOHX73FE', let: 'Schouders naar achteren, ribben omlaag. Zodra je gaat hangen is de set klaar',  cue: 'Niet meer optioneel: dit is wat je rug op de vloer nodig heeft — lang, rechtop, isometrisch. 3 × 30–40 m, zwaar genoeg om te moeten knijpen. Alleen overslaan als donderdag echt naijlt', type: 'check' },
        { key: 'nordic', group: 'ALS ER TIJD IS', name: 'Nordic curl (excentrisch)', cue: 'Je enige nordic-dag — halveert het risico op een hamstringblessure. Bewust hier: 5 dagen na de deadlift, 2 dagen voor de squat', sets: 3, target: '4–6', type: 'strength' },
        { key: 'reverse_nordic', group: 'ALS ER TIJD IS', name: 'Reverse Nordic', cue: 'Quads op lange spierlengte — knieschijfpees belastbaar maken', sets: 3, target: '8', type: 'strength' },
        { key: 'sl_rdl', group: 'ALS ER TIJD IS', name: 'Single-leg RDL', cue: 'Hamstring + balans in één. Lichter dan je denkt', sets: 3, target: '6 p/b', type: 'strength' },
        { key: 'rear_delt_facepull', group: 'ALS ER TIJD IS', name: 'Rear delt + face pull', cue: 'Houding en achterkant schouder', sets: 2, target: '12–15', type: 'strength' }
      ]
    },
    za: {
      key: 'za', label: 'ZA', title: 'Deadlift + trekken + rug', sub: 'de zware tildag, ver van de teamtraining',
      erector: 'ZEER HOOG', power: 'Horizontaal — vol', compound: 'Trap bar deadlift',
      warn: 'Bewust op zaterdag: twee dagen na de teamtraining en twee dagen voor de volgende. RPE 7–8, laat 2 reps in de tank — zondag speel je nog.',
      items: [
        { key: 'pogos', group: 'POWER · eerst', name: "Pogo's", cue: 'Stijve enkels, minimale grondcontacttijd', sets: 2, target: '15', type: 'strength' },
        { key: 'lateral_bound', group: 'POWER · eerst', name: 'Bounds', cue: 'Zijwaarts of vooruit springen, 2 tellen stil landen — dit is je horizontale power van de week', sets: 2, target: '3 p/z', type: 'strength' },
        { key: 'trap_bar_deadlift', group: 'KRACHT', name: 'Trap bar deadlift', cue: 'RPE 7–8, laat 2 reps in de tank. Voeten dichter bij elkaar en recht. Trek élke rep zo snel mogelijk omhoog', sets: 4, target: '3', inc: 5, type: 'strength' },
        { key: 'chest_supported_row', group: 'KRACHT', name: 'Chest-supported row', cue: 'Zwaar mag hier — je onderrug doet niets mee', sets: 4, target: '6–8', type: 'strength' },
        { key: 'sled', group: 'ONDERHOUD', name: 'Slee — duwen & achteruit trekken', cue: '4 × heen duwen, achteruit terug (±20 m). Achteruit is het knie-werk: kleine passen, laag blijven, knie mag voorbij de teen. Geen excentrische fase, dus je betaalt er morgen niets voor op de sprint. Log het gewicht óp de slee', sets: 4, target: '20 m h/t', inc: 10, type: 'strength' },
        { key: 'back_ext', group: 'RUG-CAPACITEIT', name: 'Back extension — uithoudingsvermogen', cue: 'Géén zware sets tot falen: 3 × 45-60 sec vasthouden op de 45°-bank, of 15-20 reps met 2 tel bovenin. Lichaamsgewicht. Dit is de spier die het na 40 min basketbal begeeft — je traint hier de tijd, niet het gewicht. Voelt het als een pomp, goed; voelt het als een zware set, te zwaar', sets: 3, target: '45–60 sec', type: 'strength' },
        { key: 'calf', group: 'ONDERHOUD', name: 'Kuit (machine)', sets: 3, target: '10', type: 'strength' },
        { key: 'do_core', group: 'CORE', name: 'Core — anti-laterale flexie', cue: 'Side plank of suitcase carry', type: 'check' }
      ]
    },
    zo: {
      key: 'zo', label: 'ZO', title: 'Basketbal 2 — schot & licht spel', sub: 'max 60 min · RPE ≤ 6',
      erector: 'LAAG', power: 'Licht', compound: 'Vrije worpen',
      warn: 'Bewust licht: je komt van een zware zaterdag en maandag til je weer. Schot en gevoel, geen wedstrijdtempo, geen maximale sprongen.',
      items: [
        { key: 'skill_work', group: 'BAL · eerst', name: 'Dribbelwerk', cue: '15-20 min, als warming-up. Zwakke hand krijgt het dubbele. Bal laag en hard, ogen omhoog - bij jouw lengte is laag houden het lastigst en precies wat je nodig hebt. Eindig met tempowisselingen en een crossover in beweging, niet stilstaand', video: 'https://www.youtube.com/watch?v=JWPvIxiv9q0', let: 'Als je erbij moet kijken, gaat hij te hoog. Liever langzamer en laag dan snel en hoog', type: 'check' },
        { key: 'free_throws', group: 'SCHOT', name: 'Vrije worpen — 5 × 10', cue: 'Tel ze en noteer het aantal. Zelfde aanloop elke worp: zelfde dribbels, zelfde pauze, zelfde kniebuiging. Ritme is hier het doel, niet het aantal', type: 'check' },
        { key: 'skill_work_zo', group: 'SPEL', name: 'Casual shooting', cue: 'Schieten mag. Géén sprints, géén maximale sprongen, géén agility', type: 'check' },
        { key: 'mobility_zo', group: 'HERSTEL', name: 'Mobility', cue: 'Rustig doorbewegen wat stijf voelt', type: 'check' }
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
      { key: 'cmj', label: 'Countermovement jump' },
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
    title: 'Volume-check', sub: 'Basketbal is nu het skelet: 3 vaste balmomenten per week. Het tilwerk is teruggebracht naar 3 dagen — kracht is het middel, niet het doel.',
    rows: [
      { name: 'Basketbal', sets: '3 vast (wo agility · do team · zo bal & schot)' },
      { name: 'Tildagen', sets: '3 (ma · di · za) + vr optioneel' },
      { name: 'Rug', sets: '~10 (di + za)' },
      { name: 'Hamstrings', sets: '~6 (ma · za) + vr optioneel' },
      { name: 'Quads', sets: '~7 + sprongwerk' },
      { name: 'Borst', sets: '~9 (di)' },
      { name: 'Sprongcontacten', sets: '~56 p/w (ma 14 · wo 6 · za 36)' },
      { name: 'Rustdag', sets: 'vrijdag — standaard leeg' }
    ]
  }
};
