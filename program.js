// PiekAtleet v4 — programma-data 1-op-1 uit PiekAtleet_Programma_v4.pdf
// Ligt 12 weken vast (regel 04: één koers vasthouden) — geen editor, bewust.
window.PROGRAM = {
  meta: {
    name: 'PIEK-ATLEET',
    version: 'v4',
    athlete: 'Kaj Kemp',
    motto: 'machine worden, niet alleen groot',
    block: '12 weken · evalueren op data, niet op spiegelgevoel',
    nutritionShort: '3500–3700 kcal · 240 g eiwit',
    weakPoints: 'Rugkracht · Springkracht · Aerobe basis',
    goals: 'Sterker worden — vooral de rug · hoger springen · pijnvrij basketballen · mobieler en atletischer, mét behoud van massa'
  },

  rules: [
    'Herstel is het plafond. Moet iets wijken → snijd in isolatie, nooit in de atleet-fase of de compound-kern.',
    'Power vóór vermoeidheid — explosief werk altijd fris.',
    'Compound eerst. Isolatie alleen voor zwakke punten.',
    'Eén koers vasthouden. 12 weken draaien, dán bijsturen.'
  ],

  opener: {
    title: 'Atleet-fase',
    sub: 'Vaste opener van élke sessie — 10 tot 12 min. Kies wat je die dag nodig hebt; achter elke oefening staat waar hij voor is. Core zit niet meer hier — dat doe je als eigen blok.',
    blocks: [
      {
        key: 'reset', title: 'Reset & mobiliteit', sub: '~5 min · kies 3',
        items: [
          { name: 'Cat-cow', why: 'rug losmaken, segment voor segment' },
          { name: 'Open books', why: 'thoracale rotatie — voor persen én rotatiepower' },
          { name: '90/90 switches', why: 'heup in- en uitdraaien — squat-diepte' },
          { name: 'Cossack flow', why: 'laag zitten + liezen — direct padel/basketbal' },
          { name: "World's greatest stretch", why: 'heupbuiger + thoracaal in één beweging' },
          { name: 'Ankle rocks', why: 'enkelmobiliteit — diepere squat, zachtere landing' },
          { name: 'Hinge-drill (stok of licht)', why: 'jouw beperkende factor: eerste rep goed bracen' }
        ]
      },
      {
        key: 'power', title: 'Power', sub: '~3 min · alleen fris',
        items: [
          { name: 'Box/broad jumps 3×3', why: 'verticale + horizontale explosiviteit' },
          { name: 'Med ball slams', why: 'full-body power, weinig gewrichtsbelasting' },
          { name: 'A-skips / pogo hops', why: 'voetstijfheid & sprintmechaniek' },
          { name: 'Split-step + reactie', why: 'eerste stap voor padel/basketbal' }
        ],
        warn: 'Power nooit op een moe zenuwstelsel. Op zware til-dagen (ma / do) houd je dit blok licht of sla je het over — spaar het zenuwstelsel voor de tilarbeid.'
      },
      {
        key: 'balans', title: 'Balans & gewrichten', sub: '~4 min · knie- en enkelbescherming',
        items: [
          { name: 'Achteruit lopen (2–3 min)', why: 'knie-vriendelijke quad-prep — bouwt de rem op zonder impact' },
          { name: 'Wall sit 2 × 1 min', why: 'iso-warmte in de knie vóór je gaat laden' },
          { name: 'Hip airplane', why: 'heupcontrole op één been — basis voor landen' },
          { name: 'Tibialis raise', why: 'scheenbeen — remkracht, beschermt de knie' },
          { name: 'Single-leg balance', why: 'enkelstabiliteit — verzwikken voorkomen' },
          { name: 'Calf raise excentrisch', why: 'achillespees belastbaar maken voor sprinten' }
        ]
      }
    ]
  },

  weekRule: 'Squat → deadlift → row staan uit elkaar (72u / 48u / 48u herstel). Nooit twee erector-dagen op rij. Hamstring-prehab (Nordic) ver van de deadlift-dag: zaterdag.',
  weekOrder: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],

  days: {
    ma: {
      key: 'ma', label: 'MA', title: 'Lower — Squat', sub: 'quads + full body',
      erector: 'HOOG', power: 'Jumps (vol)', compound: 'Back squat',
      items: [
        { key: 'ma_core', group: 'CORE', name: 'Ball planks / hyper holds', type: 'check' },
        { key: 'calf_standing', group: 'WERK', name: 'Staande kuit', cue: 'Eerst — low fatigue en kuiten kunnen nooit groot genoeg', sets: 4, target: '10–15', type: 'strength' },
        { key: 'back_squat', group: 'WERK', name: 'Back squat', cue: 'Compound-kern. Knie zeurt (bv. na basketbal)? Blijf op het gewicht dat pijnvrij is — één week vasthouden kost je niks', sets: 4, target: '5–8', inc: 5, type: 'strength' },
        { key: 'atg_split_squat', group: 'WERK', name: '(B)ATG split squat', sets: 3, target: '8–10', type: 'strength' },
        { key: 'leg_curl', group: 'WERK', name: 'Leg curl', cue: 'Hamstring-frequentie #1 — zwak punt', sets: 3, target: '', type: 'strength' },
        { key: 'leg_extension', group: 'WERK', name: 'Leg extension', cue: 'Prime: hoofdgewicht in het kg-veld, load-shift in de notitie', sets: 3, target: '12–15', type: 'strength' },
        { key: 'lateral_bound', group: 'PREHAB · KNIE', name: 'Lateral bound', cue: 'Zijwaarts springen, 2 tellen stil landen — springkracht én je knie leren remmen voor basketbal', sets: 3, target: '5 p/z', type: 'strength' },
        { key: 'wall_sit', group: 'PREHAB · KNIE', name: 'Wall sit', cue: 'Iso op 90° — vul seconden in bij reps. Opbouw: naar 3×60 sec, dan schijf op schoot', sets: 3, target: '30–60 sec', type: 'strength' }
      ]
    },
    di: {
      key: 'di', label: 'DI', title: 'Upper — Push', sub: 'borst + schouder gelijkwaardig',
      erector: 'LAAG', power: 'Throws (vol)', compound: 'Incline press + OHP',
      warn: 'Alle zware pers zit op deze ene dag, en upper chest heeft voorrang. Voel je de schouder zeuren → haal de OHP eruit vóór je in het incline-werk snijdt. Dips komen pas het volgende blok terug.',
      items: [
        { key: 'di_core', group: 'CORE', name: 'Hanging leg raises + crunches', type: 'check' },
        { key: 'incline_press', group: 'WERK', name: 'Incline barbell / DB press', cue: 'Zwaarste incline — raak iets lager aan (tepelhoogte), dat voelt krachtiger', sets: 4, target: '6–10', type: 'strength' },
        { key: 'incline_prime', group: 'WERK', name: 'Incline press (Prime)', cue: 'Tweede incline-prikkel — machine, dus veilig tot dicht bij falen', sets: 3, target: '8–12', type: 'strength' },
        { key: 'cable_fly', group: 'WERK', name: 'Cable fly', cue: 'Stretch/pump op lange spierlengte', sets: 3, target: '12–15', type: 'strength' },
        { key: 'overhead_press', group: 'WERK', name: 'Overhead press', cue: 'Machine of barbell — ná het borstwerk', sets: 3, target: '6–10', type: 'strength' },
        { key: 'lateral_raise', group: 'WERK', name: 'Lateral raise', sets: 2, target: '', type: 'strength' },
        { key: 'triceps', group: 'WERK', name: 'Triceps', sets: 2, target: '', type: 'strength' },
        { key: 'chest_supported_row', group: 'RUG · 2× p/w', name: 'Chest-supported row', cue: 'Tweede rugdag — rugkracht bouw je met frequentie, niet met één zware dag', sets: 3, target: '10–12', type: 'strength' },
        { key: 'rear_delt_facepull', group: 'RUG · 2× p/w', name: 'Rear delt + face pull', cue: 'Bovenrug en schouderhouding — tegenwicht voor al het persen', sets: 2, target: '12–15', type: 'strength' },
        { key: 'copenhagen', group: 'PREHAB', name: 'Copenhagen plank', cue: 'Adductor/lies — benen zijn vandaag vers, dus geen conflict', sets: 3, target: '20–40 sec p/z', type: 'strength' }
      ]
    },
    wo: {
      key: 'wo', label: 'WO', title: 'Basketbal / conditie', sub: 'sport = je conditiewerk',
      erector: 'LAAG', power: 'Sport', compound: 'Basketbal',
      warn: 'Basketbal telt volwaardig als je conditiewerk — dan hoeft zone 2 er niet ook nog bij. Speel je niet, doe dan de zone 2. Donderdag is de zwaarste tildag, dus tot laat doorspelen is de enige echte val.',
      items: [
        { key: 'basketbal', group: 'SPORT', name: 'Basketbal', cue: 'Log duur + hoe het ging (knie, benen, conditie) — dat stuurt de rest van je week', type: 'check' },
        { key: 'zone2', group: 'CONDITIE', name: 'Zone 2 cardio', cue: 'Alleen als je niet gespeeld hebt — HR 145–158, aerobe basis', target: '40–45 min', type: 'check' },
        { key: 'retro_walk', group: 'HERSTEL', name: 'Achteruit lopen', cue: 'Loopband op helling of sled achteruit — knie-opbouw zonder impact', target: '10 min', type: 'check' },
        { key: 'wo_iso_knee', group: 'HERSTEL', name: 'Wall sit / Spanish squat (iso)', cue: 'Bij knie-gevoel: 3–5 × 30–45 sec op pijnvrij niveau — iso werkt pijndempend voor de pees', type: 'check' }
      ]
    },
    do: {
      key: 'do', label: 'DO', title: 'Lower — Deadlift', sub: 'posterior + hamstrings',
      erector: 'ZEER HOOG', power: 'Licht / skip', compound: 'Trap bar deadlift',
      warn: 'Géén back extension op deze dag. Trap bar + RDL is al zware hinge-stapeling — back ext erbovenop is precies de erector-overload die eruit moest.',
      items: [
        { key: 'do_core', group: 'CORE', name: 'Cable rotations + Y-raises', type: 'check' },
        { key: 'calf', group: 'WERK', name: 'Kuit (machine)', cue: 'Eerst — low fatigue, warmt meteen de enkels op voor de hinge', sets: 4, target: '10–15', type: 'strength' },
        { key: 'trap_bar_deadlift', group: 'WERK', name: 'Trap bar deadlift', cue: 'Voeten iets dichter bij elkaar en recht houden — dat pakt jouw hinge', sets: 4, target: '3–6', inc: 5, type: 'strength' },
        { key: 'contrast_jumps', group: 'WERK', name: 'Box jumps + pogo\'s', cue: 'Contrast ná het zware tillen: box jumps 4×4, dan pogo\'s (2 benen heen, 1 been terug) 2 sets. Maakt ook de weg vrij voor de RDL', type: 'check' },
        { key: 'rdl', group: 'WERK', name: 'RDL', cue: 'Til hem vanaf de grond zoals een deadlift — dat pakt je eerste rep en haalt de pijn eruit', sets: 3, target: '8–12', inc: 5, type: 'strength' },
        { key: 'lying_leg_curl', group: 'WERK', name: 'Lying leg curl', cue: 'Hamstring-frequentie #2 — zwak punt', sets: 3, target: '10–12', type: 'strength' }
      ]
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Veld & atletiek', sub: 'bonusdag — pak eruit wat de tijd toelaat',
      erector: 'LAAG', power: 'Vol — fris', compound: 'Veldwerk · sprints · carries',
      warn: 'Dit is een bonusdag, geen plicht: je essentiële werk staat al op ma/di/do/za. Weinig tijd? Kies alleen het veldwerk. Basketbal morgen? Houd het kort en laat de sprints zitten.',
      items: [
        { key: 'skill_work', group: 'VELD', name: 'Dribbel · schot · fundamentals', cue: 'Skill-werk telt volwaardig mee — log wat je deed en hoe lang', type: 'check' },
        { key: 'ball_jumps', group: 'PLYO', name: 'Med ball jump vanuit zit', cue: 'Pure concentrische explosiviteit — geen stretch-reflex', sets: 3, target: '5 reps', type: 'strength' },
        { key: 'broad_jump_plyo', group: 'PLYO', name: 'Broad jump', cue: 'Horizontale power — meteen je 4-weken test', sets: 3, target: '3 reps', type: 'strength' },
        { key: 'cod_drill', group: 'SPORT · kies 2', name: 'Richting veranderen (5-10-5)', cue: 'Afremmen en weer versnellen — laag blijven bij de draai', type: 'check' },
        { key: 'footwork', group: 'SPORT · kies 2', name: 'Voetenwerk (ladder · dot drill)', cue: 'Snelle voeten + eerste stap — kort en scherp, niet moe worden', type: 'check' },
        { key: 'def_slides', group: 'SPORT · kies 2', name: 'Defensive slides / lateral lunge', cue: 'Laag zitten in verdedigingshouding — heupen en liezen onder spanning', type: 'check' },
        { key: 'sprints', group: 'ATLETIEK & HIIT', name: 'Sprints / intervallen', cue: 'Kort & explosief (6–10 × 20–40 m, volle rust) óf intervallen (6 × 1 min, 1:30 rust)', type: 'check' },
        { key: 'carries', group: 'ATLETIEK & HIIT', name: 'Loaded carries (farmer / suitcase)', cue: 'Romp onder last — full body', type: 'check' },
        { key: 'pec_deck', group: 'OPVULLING', name: 'Pec deck', cue: 'Tweede borst-prikkel in de week — goed voor groei', sets: 3, target: '12–15', type: 'strength' },
        { key: 'triceps_vr', group: 'OPVULLING', name: 'Triceps', cue: 'Tweede armprikkel — samen met dinsdag kom je op ~5 sets', sets: 3, target: '10–12', type: 'strength' },
        { key: 'vr_core', group: 'CORE', name: 'L-sits / calisthenics + crunches', type: 'check' }
      ]
    },
    za: {
      key: 'za', label: 'ZA', title: 'Upper — Pull', sub: 'rugdikte',
      erector: 'MID-HOOG', power: 'Licht', compound: 'Bent-over row',
      items: [
        { key: 'calf_pull', group: 'WERK', name: 'Kuit (vrij te kiezen)', cue: 'Derde kuitdag — eerst, low fatigue', sets: 3, target: '10–15', type: 'strength' },
        { key: 'bent_over_row', group: 'WERK', name: 'Bent-over row', cue: 'Rugdikte-anker — warm de hinge op met 2 lichte sets vóór je zwaar gaat', sets: 4, target: '6–10', type: 'strength' },
        { key: 'weighted_pullups', group: 'WERK', name: 'Weighted pullups', cue: 'Blijf je op 6/5/4 hangen? Zet er 2 sets van 4 achter met extra rust, of gebruik een elastiek voor de laatste sets', sets: 3, target: '6–10', type: 'strength' },
        { key: 'cable_row', group: 'WERK', name: 'Cable row', sets: 3, target: '8–12', type: 'strength' },
        { key: 'shrugs', group: 'WERK', name: 'Shrugs', cue: 'Traps — telt direct mee voor rugdikte', sets: 3, target: '10–12', type: 'strength' },
        { key: 'biceps', group: 'WERK', name: 'Biceps', sets: 2, target: '', type: 'strength' },
        { key: 'nordic', group: 'PREHAB', name: 'Nordic curl (excentrisch)', cue: 'Hamstring-prehab — 5 dagen na de deadlift, dus soreness stoort niets', sets: 3, target: '4–6', type: 'strength' }
      ]
    },
    zo: {
      key: 'zo', label: 'ZO', title: 'Rust — optioneel veld', rest: true,
      items: [
        { key: 'skill_work', group: 'OPTIONEEL', name: 'Veld: dribbel · schot · fundamentals', cue: 'Skill-werk is geen belasting voor je herstel — juist een goede zondag', type: 'check' },
        { key: 'zone2_zo', group: 'OPTIONEEL', name: 'Zone 2 kort', cue: 'Alleen als je er zin in hebt — wandelen of rustig fietsen', target: '20–30 min', type: 'check' }
      ]
    }
  },

  // Tracking — 12-weken evaluatie ("objectieve data verslaat spiegelgevoel")
  anchors: {
    strength: [
      { key: 'back_squat', label: 'Back squat' },
      { key: 'trap_bar_deadlift', label: 'Trap bar deadlift' },
      { key: 'overhead_press', label: 'Overhead press' },
      { key: 'incline_press', label: 'Incline press' },
      { key: 'bent_over_row', label: 'Bent-over row' },
      { key: 'weighted_pullups', label: 'Weighted pullups' },
      { key: 'leg_curl', label: 'Leg curl' }
    ],
    athletic: [
      { key: 'broad_jump', label: 'Broad jump', unit: 'm', hint: 'afstand' },
      { key: 'balance_hold', label: 'Balans-hold single-leg', unit: 'sec', hint: 'seconden' },
      { key: 'sprint_time', label: 'Sprinttijd', unit: 'sec', hint: 'seconden' }
    ],
    body: [
      { key: 'weight', label: 'Lichaamsgewicht', unit: 'kg' }
    ],
    reminders: [
      'Wekelijks: kracht-ankers (top set) + lichaamsgewicht',
      'Elke 4 weken: broad jump · balans-hold · sprinttijd · foto\'s',
      'Bloed ~half september: creatinine & CK opnieuw meten'
    ]
  },

  nutrition: {
    title: 'Voeding — het grootste gat',
    context: 'Je verloor 5,4 kg in een blok dat bedoeld was om te bouwen. Niet clean-heid was het probleem, maar te weinig op drukke dagen.',
    goal: '3500 – 3700 kcal · 240 g eiwit · richting: +0,2 kg per week',
    systemNote: 'Systeem > wilskracht. Eten dat een beslissing vereist, gebeurt niet op een drukke dag.',
    system: [
      { title: 'Vloeibare calorieën', text: 'Shake van 1000+ kcal (melk, oats, pindakaas, whey, banaan) — 2 minuten, overal te drinken' },
      { title: 'Dichtheid verhogen', text: 'Olijfolie over maaltijden · volle melk i.p.v. mager · extra rijst/pasta · handje noten' },
      { title: 'Drie vaste ankers', text: 'Ontbijt · shake onderweg · avondeten. Wat er extra bij kan is bonus' },
      { title: 'Prep-systeem aan', text: 'Bevroren porties + opgeslagen MyFitnessPal-combo\'s — juist in drukke weken' }
    ]
  },

  volumeCheck: {
    title: 'Volume-check', sub: 'Werksets per week — alles op groei-volume.',
    rows: [
      { name: 'Rug', sets: '~18 (di + za)' },
      { name: 'Hamstrings', sets: '~12 (ma · do · za)' },
      { name: 'Quads', sets: '~9' },
      { name: 'Borst', sets: '~13 (2× incline + fly + pec deck)' },
      { name: 'Schouders', sets: '~5 + indirect uit persen' },
      { name: 'Armen', sets: '~7' }
    ]
  }
};
