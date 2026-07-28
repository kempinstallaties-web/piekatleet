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
    weakPoints: 'Hamstrings · Rugdikte · Aerobe basis'
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
        { key: 'back_squat', group: 'WERK', name: 'Back squat', cue: 'Compound-kern — hier bouw je progressie', sets: 4, target: '5–8', inc: 5, type: 'strength' },
        { key: 'atg_split_squat', group: 'WERK', name: '(B)ATG split squat', sets: 3, target: '8–10', type: 'strength' },
        { key: 'leg_curl', group: 'WERK', name: 'Leg curl', cue: 'Hamstring-frequentie #1 — zwak punt', sets: 3, target: '', type: 'strength' },
        { key: 'leg_extension', group: 'WERK', name: 'Leg extension', sets: 2, target: '12', type: 'strength' },
        { key: 'calf_standing', group: 'WERK', name: 'Staande kuit', sets: 3, target: '', type: 'strength' }
      ]
    },
    di: {
      key: 'di', label: 'DI', title: 'Upper — Push', sub: 'borst + schouder gelijkwaardig',
      erector: 'LAAG', power: 'Throws (vol)', compound: 'Incline press + OHP',
      warn: 'Alle zware pers zit op deze ene dag, en upper chest heeft voorrang. Voel je de schouder zeuren → haal de OHP eruit vóór je in het incline-werk snijdt. Dips komen pas het volgende blok terug.',
      items: [
        { key: 'di_core', group: 'CORE', name: 'Hanging leg raises + crunches', type: 'check' },
        { key: 'incline_press', group: 'WERK', name: 'Incline barbell / DB press', cue: 'Zwaarste incline — upper chest is je zwakke punt, dus deze eerst', sets: 4, target: '6–10', type: 'strength' },
        { key: 'incline_prime', group: 'WERK', name: 'Incline press (Prime)', cue: 'Tweede incline-prikkel — machine, dus veilig tot dicht bij falen', sets: 3, target: '8–12', type: 'strength' },
        { key: 'cable_fly', group: 'WERK', name: 'Cable fly', cue: 'Stretch/pump op lange spierlengte', sets: 3, target: '12–15', type: 'strength' },
        { key: 'overhead_press', group: 'WERK', name: 'Overhead press', cue: 'Machine of barbell — ná het borstwerk', sets: 3, target: '6–10', type: 'strength' },
        { key: 'lateral_raise', group: 'WERK', name: 'Lateral raise', sets: 2, target: '', type: 'strength' },
        { key: 'triceps', group: 'WERK', name: 'Triceps', sets: 2, target: '', type: 'strength' },
        { key: 'copenhagen', group: 'PREHAB', name: 'Copenhagen plank', cue: 'Adductor/lies — benen zijn vandaag vers, dus geen conflict', sets: 3, target: '20–40 sec p/z', type: 'strength' }
      ]
    },
    wo: {
      key: 'wo', label: 'WO', title: 'Actief herstel — Zone 2', sub: 'aerobe basis · low impact',
      erector: 'LAAG', power: 'Geen', compound: 'Zone 2 cardio',
      warn: 'Low impact houden (fiets · roeier · wandelen). Géén hardlopen — donderdag is de zwaarste tildag en die wil je met frisse benen in.',
      items: [
        { key: 'zone2', group: 'CONDITIE', name: 'Zone 2 cardio', cue: 'HR 145–158 — aerobe basis = grootste gat', target: '40–45 min', type: 'check' },
        { key: 'wo_mobility', group: 'HERSTEL', name: 'Mobility / soft tissue', cue: 'Optioneel — heupen, thoracaal, kuiten', type: 'check' }
      ]
    },
    do: {
      key: 'do', label: 'DO', title: 'Lower — Deadlift', sub: 'posterior + hamstrings',
      erector: 'ZEER HOOG', power: 'Licht / skip', compound: 'Trap bar deadlift',
      warn: 'Géén back extension op deze dag. Trap bar + RDL is al zware hinge-stapeling — back ext erbovenop is precies de erector-overload die eruit moest.',
      items: [
        { key: 'do_core', group: 'CORE', name: 'Cable rotations + Y-raises', type: 'check' },
        { key: 'trap_bar_deadlift', group: 'WERK', name: 'Trap bar deadlift', cue: 'Compound-kern', sets: 4, target: '3–6', inc: 5, type: 'strength' },
        { key: 'rdl', group: 'WERK', name: 'RDL', cue: 'Hamstring op lange spierlengte — bouw de spanning op vóór je zakt', sets: 3, target: '8–12', inc: 5, type: 'strength' },
        { key: 'lying_leg_curl', group: 'WERK', name: 'Lying leg curl', cue: 'Hamstring-frequentie #2 — zwak punt', sets: 3, target: '10–12', type: 'strength' },
        { key: 'calf', group: 'WERK', name: 'Kuit', sets: 3, target: '', type: 'strength' }
      ]
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Atletiek + HIIT', sub: 'fris = volledige power',
      erector: 'LAAG', power: 'Vol — fris', compound: 'Sprints · sled · carries',
      warn: 'Volgorde is de hele truc: springen, sportwerk en sprinten eerst op een fris zenuwstelsel, isolatie pas achteraan. Isolatie hier mag — zaterdag is trekwerk, dus borst en triceps zitten elkaar niet in de weg.',
      items: [
        { key: 'ball_jumps', group: 'PLYO', name: 'Med ball jump vanuit zit', cue: 'Pure concentrische explosiviteit — geen stretch-reflex', sets: 3, target: '5 reps', type: 'strength' },
        { key: 'broad_jump_plyo', group: 'PLYO', name: 'Broad jump', cue: 'Horizontale power — meteen je 4-weken test', sets: 3, target: '3 reps', type: 'strength' },
        { key: 'lateral_bound', group: 'SPORT · kies 2', name: 'Lateral bound', cue: 'Zijwaarts springen, 2 tellen stil landen. Padel-verplaatsing + knie leren remmen', sets: 3, target: '5 p/z', type: 'strength' },
        { key: 'cod_drill', group: 'SPORT · kies 2', name: 'Richting veranderen (5-10-5)', cue: 'Afremmen en weer versnellen — laag blijven bij de draai', type: 'check' },
        { key: 'footwork', group: 'SPORT · kies 2', name: 'Voetenwerk (ladder · dot drill)', cue: 'Snelle voeten + eerste stap — kort en scherp, niet moe worden', type: 'check' },
        { key: 'def_slides', group: 'SPORT · kies 2', name: 'Defensive slides / lateral lunge', cue: 'Laag zitten in verdedigingshouding — heupen en liezen onder spanning', type: 'check' },
        { key: 'sprints', group: 'ATLETIEK & HIIT', name: 'Sprints / intervallen', cue: 'Kort & explosief (6–10 × 20–40 m, volle rust) óf intervallen (6 × 1 min, 1:30 rust)', type: 'check' },
        { key: 'carries', group: 'ATLETIEK & HIIT', name: 'Loaded carries (farmer / suitcase)', cue: 'Romp onder last — full body', type: 'check' },
        { key: 'pec_deck', group: 'OPVULLING', name: 'Pec deck', cue: 'Tweede borst-prikkel in de week — goed voor groei', sets: 3, target: '12–15', type: 'strength' },
        { key: 'shrugs', group: 'OPVULLING', name: 'Shrugs', cue: 'Traps — telt mee voor rugdikte (zwak punt)', sets: 3, target: '10–12', type: 'strength' },
        { key: 'triceps_vr', group: 'OPVULLING', name: 'Triceps', cue: 'Tweede armprikkel — samen met dinsdag kom je op ~5 sets', sets: 3, target: '10–12', type: 'strength' },
        { key: 'vr_core', group: 'CORE', name: 'L-sits / calisthenics + crunches', type: 'check' }
      ]
    },
    za: {
      key: 'za', label: 'ZA', title: 'Upper — Pull', sub: 'rugdikte',
      erector: 'MID-HOOG', power: 'Licht', compound: 'Bent-over row',
      items: [
        { key: 'bent_over_row', group: 'WERK', name: 'Bent-over row', cue: 'Rugdikte-anker — hard trainen mag', sets: 4, target: '6–10', type: 'strength' },
        { key: 'weighted_pullups', group: 'WERK', name: 'Weighted pullups', cue: 'Breedte — progressie via gewicht', sets: 3, target: '6–10', type: 'strength' },
        { key: 'chest_supported_row', group: 'WERK', name: 'Chest-supported row', cue: 'Dikte, lage erector', sets: 3, target: '10–12', type: 'strength' },
        { key: 'cable_row', group: 'WERK', name: 'Cable row', sets: 3, target: '8–12', type: 'strength' },
        { key: 'rear_delt_facepull', group: 'WERK', name: 'Rear delt + face pull', sets: 2, target: '', type: 'strength' },
        { key: 'biceps', group: 'WERK', name: 'Biceps', sets: 2, target: '', type: 'strength' },
        { key: 'nordic', group: 'PREHAB', name: 'Nordic curl (excentrisch)', cue: 'Hamstring-prehab — 5 dagen na de deadlift, dus soreness stoort niets', sets: 3, target: '4–6', type: 'strength' }
      ]
    },
    zo: {
      key: 'zo', label: 'ZO', title: 'Rust — optioneel Zone 2', rest: true,
      items: [
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
      { name: 'Rug', sets: '~13 + 3 shrugs' },
      { name: 'Hamstrings', sets: '~12 (ma · do · za)' },
      { name: 'Quads', sets: '~9' },
      { name: 'Borst', sets: '~13 (2× incline + fly + pec deck)' },
      { name: 'Schouders', sets: '~5 + indirect uit persen' },
      { name: 'Armen', sets: '~7' }
    ]
  }
};
