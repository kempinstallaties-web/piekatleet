// PIEK-ATLEET v5 — basketbal-atleet blok
// Verdeling: ~40% strength · 30% power/speed · 30% basketbal-athleticism.
// Filter voor élke oefening: "maakt dit mij beter in het verplaatsen van 105 kg op een veld?"
window.PROGRAM = {
  meta: {
    name: 'PIEK-ATLEET',
    version: 'v5.1',
    athlete: 'Kaj Kemp',
    motto: 'niet groter worden — beter bewegen',
    block: 'Basketbal-blok · seizoen start oktober',
    nutritionShort: '3500–3700 kcal · 240 g eiwit · performance bulk',
    weakPoints: 'Agility & COD · Reactiviteit · Basketbalspecificiteit',
    goals: '105 kg explosief leren verplaatsen: hoger springen, sneller versnellen én afremmen. Kracht is het middel, atletiek het doel.'
  },

  rules: [
    'Power vóór kracht. Springen en sprinten doe je fris, nooit als toetje na het tillen.',
    'Herstel is het plafond. Vrijdag moet je kunnen sprinten — dus donderdag geen ego-deadlift.',
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
          { name: 'A-skips 2 × 20 m', why: 'sprintmechaniek instellen', days: ['wo', 'vr'] },
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

  weekRule: 'Power staat vóór kracht op elke tildag. Vrijdag is je belangrijkste atletiekdag — donderdag mag die nooit slopen. Zondag is écht rust: max 45 min, RPE ≤ 4.',
  weekOrder: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],

  days: {
    ma: {
      key: 'ma', label: 'MA', title: 'Vertical + Lower Strength', sub: 'springen fris, dan pas tillen',
      erector: 'HOOG', power: 'Verticaal — vol', compound: 'Back squat',
      warn: 'De sprongen zijn hier geen warming-up maar de hoofdmoot. Volledige rust ertussen: als de hoogte zakt, stop je met springen.',
      items: [
        { key: 'cmj', group: 'POWER · eerst', name: 'Countermovement jump', cue: 'Max hoogte, volledige rust tussen sets. Log de hoogte of je gevoel', sets: 4, target: '2 reps', type: 'strength' },
        { key: 'broad_jump_plyo', group: 'POWER · eerst', name: 'Broad jump', cue: 'Horizontale power — meteen je 4-weken test', sets: 3, target: '2 reps', type: 'strength' },
        { key: 'back_squat', group: 'KRACHT', name: 'Back squat', cue: 'RPE 7–8: laat 2 reps in de tank. Explosief omhoog. Knie zeurt? Blijf op wat pijnvrij is', sets: 4, target: '3–5', inc: 5, type: 'strength' },
        { key: 'atg_split_squat', group: 'KRACHT', name: 'Bulgarian split squat', cue: 'Single-leg kracht — dit is hoe je op het veld beweegt', sets: 3, target: '5–6 p/b', type: 'strength' },
        { key: 'rdl', group: 'KRACHT', name: 'RDL', cue: 'Til hem vanaf de grond zoals een deadlift — dat pakt je eerste rep en haalt de pijn eruit', sets: 3, target: '6', inc: 5, type: 'strength' },
        { key: 'calf_standing', group: 'ONDERHOUD', name: 'Staande kuit', cue: 'Sprongkracht en enkelstabiliteit — low fatigue', sets: 3, target: '8–10', type: 'strength' },
        { key: 'sled', group: 'ONDERHOUD', name: 'Slee — duwen & achteruit trekken', cue: '4 × heen duwen, achteruit terug (±20 m). Achteruit is het knie-werk: kleine passen, laag blijven, knie mag voorbij de teen. Geen excentrische fase, dus je betaalt er vrijdag niets voor. Log het gewicht óp de slee', sets: 4, target: '20 m h/t', inc: 10, type: 'strength' },
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
      key: 'wo', label: 'WO', title: 'Basketball Athleticism', sub: 'versnellen · afremmen · draaien · spelen',
      erector: 'LAAG', power: 'Sprint & COD', compound: 'Acceleratie',
      warn: 'Geen zware conditioning erachteraan — donderdag deadlift je. Kwaliteit boven vermoeidheid: als je trager wordt, ben je klaar.',
      items: [
        { key: 'accel', group: 'SNELHEID · eerst', name: 'Acceleratie', cue: '4 × 10 m, daarna 3 × 20 m. Volle rust, elke start maximaal', type: 'check' },
        { key: 'decel', group: 'SNELHEID · eerst', name: 'Deceleratie', cue: '4 × 10 m sprint → volledig stoppen en stil staan. Afremmen is 80% van basketbal', type: 'check' },
        { key: 'cod_drill', group: 'AGILITY', name: 'Change of direction (5-10-5)', cue: '4–5 pogingen. Laag blijven bij de draai, niet omhoog komen', type: 'check' },
        { key: 'approach_jump_sl', group: 'AGILITY', name: 'Approach jump — 1 been', cue: 'Aanloop, afzet op één been, naar de ring. 3 × 2 per been, meer niet — maximale kwaliteit. Dít is hoe je in een wedstrijd springt', sets: 3, target: '2 p/b', type: 'strength' },
        { key: 'skill_work', group: 'BASKETBAL', name: 'Skills — dribbel & fundamentals', cue: '30–45 min. Dit is waarvoor je de rest doet', type: 'check' },
        { key: 'shooting', group: 'BASKETBAL', name: 'Shooting', cue: '10–15 min afsluiten', type: 'check' }
      ]
    },
    do: {
      key: 'do', label: 'DO', title: 'Deadlift + Horizontal Power', sub: 'explosief eerst, dan zwaar — en dan stoppen',
      erector: 'ZEER HOOG', power: 'Horizontaal — vol', compound: 'Trap bar deadlift',
      warn: 'Dit is je gevaarlijkste dag: vrijdag moet je kunnen sprinten. RPE 7–8 op de trap bar, geen ego. Geen zware rows, geen extra hamstringvolume, geen zware carries.',
      items: [
        { key: 'pogos', group: 'POWER · eerst', name: "Pogo's", cue: 'Stijve enkels, minimale grondcontacttijd', sets: 2, target: '15', type: 'strength' },
        { key: 'lateral_bound', group: 'POWER · eerst', name: 'Bounds', cue: 'Zijwaarts of vooruit springen, 2 tellen stil landen — dit is je horizontale power van de week', sets: 2, target: '3 p/z', type: 'strength' },
        { key: 'trap_bar_deadlift', group: 'KRACHT', name: 'Trap bar deadlift', cue: 'RPE 7–8, laat 2 reps in de tank. Voeten dichter bij elkaar en recht. Trek élke rep zo snel mogelijk omhoog', sets: 4, target: '3', inc: 5, type: 'strength' },
        { key: 'sl_rdl', group: 'KRACHT', name: 'Single-leg RDL', cue: 'Hamstring + balans in één. Lichter dan je denkt', sets: 3, target: '6 p/b', type: 'strength' },
        { key: 'reverse_nordic', group: 'PREHAB', name: 'Reverse Nordic', cue: 'Quads op lange spierlengte — knieschijfpees belastbaar maken', sets: 3, target: '8', type: 'strength' },
        { key: 'calf', group: 'ONDERHOUD', name: 'Kuit (machine)', sets: 3, target: '10', type: 'strength' },
        { key: 'do_core', group: 'CORE', name: 'Core — anti-laterale flexie', cue: 'Side plank of suitcase carry', type: 'check' }
      ]
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Speed + Agility', sub: 'je belangrijkste sessie van de week',
      erector: 'LAAG', power: 'Maximaal', compound: 'Sprint',
      warn: 'Hier meet je of je écht atletischer wordt. Volle rust tussen alles, geen conditioning. Word je moe, dan stop je — vermoeid sprinten traint traagheid.',
      items: [
        { key: 'sprints', group: 'SNELHEID · eerst', name: 'Sprint', cue: '4 × 10 m · 4 × 20 m · 2 × 30 m. Volledige rust, elke rep maximaal', type: 'check' },
        { key: 'cod_drill', group: 'AGILITY', name: 'Change of direction (5-10-5)', cue: '4 pogingen, kwaliteit boven kwantiteit', type: 'check' },
        { key: 'def_slides', group: 'AGILITY', name: 'Lateral shuffle → sprint', cue: '5 × zijwaarts verplaatsen en dan explosief wegsprinten', type: 'check' },
        { key: 'reactie_drill', group: 'AGILITY', name: 'Reactief — op signaal', cue: '6–10 reps. Maat wijst een richting, of bal tegen de muur. Pas beslissen als je moet reageren', type: 'check' },
        { key: 'carries', group: 'OPTIONEEL', name: 'Farmer carry', cue: 'Alleen als je sprints scherp waren én donderdag niet naijlt. 3 × 30–40 m. Een carry maakt je niet atletischer — hij is ondersteunend', type: 'check' },
      ]
    },
    za: {
      key: 'za', label: 'ZA', title: 'Upper Pull', sub: 'rug zonder je onderrug te slopen',
      erector: 'LAAG', power: 'Licht', compound: 'Chest-supported row',
      warn: 'Bewust géén bent-over row meer: je erector krijgt al genoeg van squat, deadlift en carries. Dit is de dag waar je herstelcapaciteit spaart.',
      items: [
        { key: 'chest_supported_row', group: 'RUG', name: 'Chest-supported row', cue: 'Zwaar mag hier — je onderrug doet niets mee', sets: 4, target: '6–8', type: 'strength' },
        { key: 'rear_delt_facepull', group: 'RUG', name: 'Rear delt + face pull', cue: 'Houding en achterkant schouder', sets: 2, target: '12–15', type: 'strength' },
        { key: 'shrugs', group: 'RUG', name: 'Shrugs', cue: 'Traps — nek en schouders sterk voor contact', sets: 2, target: '10–12', type: 'strength' },
        { key: 'nordic', group: 'PREHAB', name: 'Nordic curl (excentrisch)', cue: 'Je enige nordic-dag — halveert het risico op een hamstringblessure. Bewust hier: 5 dagen na de deadlift, 2 dagen voor de squat', sets: 3, target: '4–6', type: 'strength' },
        { key: 'biceps', group: 'ACCESSOIRE', name: 'Biceps', sets: 2, target: '10–15', type: 'strength' },
        { key: 'calf_pull', group: 'ONDERHOUD', name: 'Kuit', sets: 3, target: '10–15', type: 'strength' }
      ]
    },
    zo: {
      key: 'zo', label: 'ZO', title: 'Herstel — max 45 min, RPE ≤ 4', rest: true,
      items: [
        { key: 'zone2_zo', group: 'OPTIONEEL', name: 'Zone 2 of wandelen', cue: 'Rustig. Je moet erna frisser zijn dan ervoor', target: '30–45 min', type: 'check' },
        { key: 'skill_work_zo', group: 'OPTIONEEL', name: 'Casual shooting', cue: 'Schieten mag. Géén sprints, géén maximale sprongen, géén agility', type: 'check' },
        { key: 'mobility_zo', group: 'OPTIONEEL', name: 'Mobility', cue: 'Rustig doorbewegen wat stijf voelt', type: 'check' }
      ]
    }
  },

  // Tracking — meet of je écht atletischer wordt
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
      { key: 'cod_time', label: '5-10-5 tijd', unit: 'sec', hint: 'seconden' }
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
    title: 'Volume-check', sub: 'Bewust lager dan een bodybuildingschema — die ruimte gaat naar sprint, sprong en agility.',
    rows: [
      { name: 'Rug', sets: '~14 (di + za)' },
      { name: 'Hamstrings', sets: '~9 (ma · do · za)' },
      { name: 'Quads', sets: '~7 + sprongwerk' },
      { name: 'Borst', sets: '~9 (di)' },
      { name: 'Schouders', sets: '~5' },
      { name: 'Armen', sets: '~4' },
      { name: 'Sprongcontacten', sets: '~68 p/w (ma 14 · wo 12 · do 42)' },
      { name: 'Sprint/agility', sets: '3 dagen (wo · vr + wedstrijd)' }
    ]
  }
};
