// PiekAtleet v4 — programma-data 1-op-1 uit PiekAtleet_Programma_v4.pdf
// Ligt 12 weken vast (regel 04: één koers vasthouden) — geen editor, bewust.
window.PROGRAM = {
  meta: {
    name: 'PIEK-ATLEET',
    version: 'v4',
    athlete: 'Kaj Kemp',
    motto: 'machine worden, niet alleen groot',
    block: '12 weken · evalueren op data, niet op spiegelgevoel',
    protocol: 'TRT 125 mg/week (3× prikken) — sinds 22-06-2026',
    nutritionShort: '3500–3700 kcal · 240 g eiwit',
    weakPoints: 'Hamstrings · Rugdikte · Aerobe basis'
  },

  rules: [
    'Herstel is het plafond. Moet iets wijken → snijd in isolatie, nooit in de atleet-fase of de compound-kern.',
    'Power vóór vermoeidheid — explosief werk altijd fris.',
    'Compound eerst. Isolatie alleen voor zwakke punten.',
    'Eén koers vasthouden. 12 weken draaien, dán bijsturen.'
  ],

  redFlag: {
    ok: 'Stijf en zeurderig, maar losser bij bewegen → het systeem doet z\'n werk. Geef het 2–3 weken.',
    stop: 'Scherp, uitstralend of blijvend → stoppen met programmeren en naar de fysio.'
  },

  opener: {
    title: 'Atleet-fase',
    sub: 'Vaste opener van élke sessie — 12 tot 15 min. Pick-and-choose: kies wat je die dag nodig hebt, niet elke laag compleet.',
    blocks: [
      {
        key: 'reset', title: 'Reset', sub: '~5 min · kies 3',
        items: ['Cat-cow', 'Open books', 'Dead bug', 'Bird-dog', '90/90 switches', 'Cossack flow', "World's greatest stretch"]
      },
      {
        key: 'power', title: 'Power', sub: '~3 min · alleen fris',
        items: ['Box/broad jumps 3×3', 'Med ball slams', 'A-skips / pogo hops'],
        warn: 'Power nooit op een moe zenuwstelsel. Op zware til-dagen (ma / do) houd je dit blok licht of sla je het over — spaar het zenuwstelsel voor de tilarbeid.'
      },
      {
        key: 'balans', title: 'Balans & pantser', sub: '~4 min · elke dag',
        items: ['Hip airplane', 'Copenhagen óf Nordic (roterend)', 'Pallof press of loaded carry']
      }
    ]
  },

  weekRule: 'Squat → deadlift → row staan uit elkaar (72u / 48u / 48u herstel). Nooit twee erector-dagen op rij.',
  weekOrder: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],

  days: {
    ma: {
      key: 'ma', label: 'MA', title: 'Lower — Squat', sub: 'quads + full body',
      erector: 'HOOG', power: 'Jumps (vol)', compound: 'Back squat',
      items: [
        { key: 'ma_core', group: 'CORE', name: 'Ball planks / hyper holds', type: 'check' },
        { key: 'back_squat', group: 'WERK', name: 'Back squat', cue: 'Compound-kern — hier bouw je progressie', sets: 4, target: '5–8', type: 'strength' },
        { key: 'atg_split_squat', group: 'WERK', name: '(B)ATG split squat', sets: 3, target: '8–10', type: 'strength' },
        { key: 'leg_curl', group: 'WERK', name: 'Leg curl', cue: 'Hamstring-frequentie #1 — zwak punt', sets: 3, target: '', type: 'strength' },
        { key: 'leg_extension', group: 'WERK', name: 'Leg extension', sets: 2, target: '12', type: 'strength' },
        { key: 'calf_standing', group: 'WERK', name: 'Staande kuit', sets: 3, target: '', type: 'strength' }
      ]
    },
    di: {
      key: 'di', label: 'DI', title: 'Upper — Push', sub: 'borst + schouder gelijkwaardig',
      erector: 'LAAG', power: 'Throws (vol)', compound: 'Incline press + OHP',
      warn: 'Alle zware pers zit op deze ene dag. Voel je de schouder zeuren → haal dips eruit vóór je iets anders schrapt.',
      items: [
        { key: 'di_core', group: 'CORE', name: 'Hanging leg raises + crunches', type: 'check' },
        { key: 'incline_press', group: 'WERK', name: 'Incline barbell / DB press', cue: 'Borst-kern, zwaar', sets: 4, target: '6–10', type: 'strength' },
        { key: 'overhead_press', group: 'WERK', name: 'Overhead press', cue: 'Schouder-kern — tweede, niet eerste', sets: 3, target: '5–8', type: 'strength' },
        { key: 'flat_press_dips', group: 'WERK', name: 'Flat press of dips', cue: 'Tweede borst-prikkel — bouw naar weighted', sets: 3, target: '8–10', type: 'strength' },
        { key: 'cable_fly', group: 'WERK', name: 'Cable fly', cue: 'Enige isolatie — stretch / pump', sets: 2, target: '12–15', type: 'strength' },
        { key: 'lateral_raise', group: 'WERK', name: 'Lateral raise', sets: 2, target: '', type: 'strength' },
        { key: 'triceps', group: 'WERK', name: 'Triceps', sets: 2, target: '', type: 'strength' }
      ]
    },
    wo: { key: 'wo', label: 'WO', title: 'Rust', rest: true },
    do: {
      key: 'do', label: 'DO', title: 'Lower — Deadlift', sub: 'posterior + hamstrings',
      erector: 'ZEER HOOG', power: 'Licht / skip', compound: 'Trap bar deadlift',
      warn: 'Géén back extension op deze dag. Trap bar + RDL is al zware hinge-stapeling — back ext erbovenop is precies de erector-overload die eruit moest.',
      items: [
        { key: 'do_core', group: 'CORE', name: 'Cable rotations + Y-raises', type: 'check' },
        { key: 'trap_bar_deadlift', group: 'WERK', name: 'Trap bar deadlift', cue: 'Compound-kern', sets: 4, target: '3–6', type: 'strength' },
        { key: 'rdl', group: 'WERK', name: 'RDL', cue: 'Hamstring op lange spierlengte', sets: 3, target: '8–12', type: 'strength' },
        { key: 'lying_leg_curl', group: 'WERK', name: 'Lying leg curl', cue: 'Hamstring-frequentie #2 — zwak punt', sets: 3, target: '10–12', type: 'strength' },
        { key: 'hip_thrust', group: 'WERK', name: 'Hip thrust', sets: 2, target: '', type: 'strength' },
        { key: 'calf', group: 'WERK', name: 'Kuit', sets: 3, target: '', type: 'strength' }
      ]
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Atletiek + conditie', sub: 'fris = volledige power',
      erector: 'LAAG', power: 'Vol — fris', compound: 'Sprints · sled · carries',
      warn: 'Geen pushups of triceps hier — dat doe je dinsdag al en het vreet herstel dat je zaterdag nodig hebt.',
      items: [
        { key: 'vr_core', group: 'CORE', name: 'L-sits / calisthenics + crunches', type: 'check' },
        { key: 'sprints', group: 'ATLETIEK', name: 'Sprints / heuvel / sled', cue: 'snelheid', type: 'check' },
        { key: 'carries', group: 'ATLETIEK', name: 'Loaded carries (farmer / suitcase)', cue: 'Core onder last — full body', type: 'check' },
        { key: 'ball_jumps', group: 'ATLETIEK', name: 'Ball jumps vanuit zit + plyo', cue: 'Pure concentrische explosiviteit — power', type: 'check' },
        { key: 'zone2', group: 'CONDITIE & PREHAB', name: 'Zone 2 cardio', cue: 'HR 145–158 — aerobe basis = grootste gat', target: '30 min', type: 'check' },
        { key: 'cop_nordic', group: 'CONDITIE & PREHAB', name: 'Copenhagen / Nordic', cue: 'prehab', type: 'check' }
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
        { key: 'biceps', group: 'WERK', name: 'Biceps', sets: 2, target: '', type: 'strength' }
      ]
    },
    zo: { key: 'zo', label: 'ZO', title: 'Rust', rest: true }
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
      'Bloed ~half september: creatinine & CK opnieuw meten (12 wk na TRT-switch 22-06-2026)'
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
      { name: 'Rug', sets: '~13' },
      { name: 'Hamstrings', sets: '~11–12 (3× freq.)' },
      { name: 'Quads', sets: '~9' },
      { name: 'Borst', sets: '~9–10' },
      { name: 'Schouders', sets: '~7–9' },
      { name: 'Armen', sets: '~6–8' }
    ]
  }
};
