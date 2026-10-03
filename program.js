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
    version: 'v8',
    athlete: 'Kaj Kemp',
    motto: 'niet groter worden — beter bewegen',
    block: 'Krachtblok 12 weken - golf 1 van 3 (volume) - t/m 27 december',
    nutritionShort: '3300 kcal - 200-210 g eiwit - +0,2 kg per week',
    weakPoints: 'Posterior chain - hamstrings, bilspieren, rugstrekkers',
    goals: 'Compounds opbouwen en de achterkant ijzersterk maken, met het atletische werk volledig behouden. Trap bar 150 x 3, squat 110 x 4, incline 105 x 4, 104,5 kg bij dezelfde taille.'
  },

  rules: [
    'Power vóór kracht. Springen en sprinten doe je fris, nooit als toetje na het tillen.',
    'Herstel is het plafond. Drie rustdagen staan er niet voor niets: maandag en donderdag moet je zwaar kunnen tillen.',
    'Golf 1 is volume op RPE 7. Je laat drie reps in de tank; de kilo s komen in golf 2 en 3.',
    'Val je af, dan bouw je niet. 102,3 kg nu, 104,5 eind december, bij dezelfde taille.'
  ],

  opener: {
    title: 'Atleet-fase',
    sub: 'Kort en dagspecifiek — 10 minuten. Je échte springwerk staat niet hier maar bovenaan de training zelf.',
    blocks: [
      {
        key: 'reset', title: 'Mobility', sub: '~3 min',
        items: [
          { name: 'Cat-cow', doel: 'Rug losmaken vóór je hem belast', cue: 'Rol je rug wervel voor wervel op en af, rustig ademen.', why: 'rug losmaken', days: ['ma', 'di', 'do', 'za'] },
          { name: 'Open books', doel: 'Thoracale rotatie — persen, trekken en gooien', cue: 'Draai je bovenste arm open en volg met je ogen. Heupen blijven stil.', why: 'thoracale rotatie', days: ['di', 'za'] },
          { name: '90/90 switches', doel: 'Heup in- en uitdraaien voor squat-diepte', cue: 'Wissel je heupen links-rechts, borst rechtop.', why: 'heupmobiliteit', days: ['ma', 'do'] },
          { name: 'Cossack flow', doel: 'Laag zitten en liezen — je verdedigingshouding', cue: 'Zak diep naar één kant en schuif rustig door naar de andere.', why: 'liezen en diepte', days: ['wo', 'vr'] },
          { name: "World's greatest stretch", doel: 'Heupbuiger en thoracaal in één', cue: 'Stap diep uit en draai je bovenste arm naar het plafond.', why: 'heup + thoracaal', days: ['di', 'wo', 'vr'] },
          { name: 'Ankle rocks', doel: 'Enkelmobiliteit — diepere squat, zachtere landing', cue: 'Duw je knie voorbij je tenen, hiel blijft op de grond.', why: 'enkelmobiliteit', days: ['ma', 'wo', 'vr'] },
          { name: 'Hinge-drill (stok)', doel: 'Eerste rep goed bracen — je limiterende factor', cue: 'Houd de stok op drie punten en scharnier vanuit je heupen.', why: 'bracen', days: ['do', 'za'] }
        ]
      },
      {
        key: 'power', title: 'Neural primer', sub: '~4 min · wakker maken, niet moe maken',
        items: [
          { name: 'Pogo hops 2 × 15', doel: 'Voetstijfheid vóór het echte springwerk', cue: 'Stuiter op je voorvoet met bijna gestrekte knieën, kort op de grond.', why: 'voetstijfheid', days: ['ma', 'do'] },
          { name: 'Band pull-apart 2 × 15', doel: 'Schouders wakker vóór het persen', cue: 'Trek de band uit elkaar tot borsthoogte en laat rustig terug.', why: 'schouders wakker', days: ['di', 'za'] },
          { name: 'Med ball chest pass licht 2 × 5', doel: 'Bovenlichaam op scherp zetten', cue: 'Duw de bal licht en snel weg — snelheid, geen maximale kracht.', why: 'bovenlichaam scherp', days: ['di'] },
          { name: 'A-skips 2 × 20 m', doel: 'Sprintmechaniek instellen', cue: 'Huppel met hoge knie en zet je voet actief naar beneden.', why: 'sprintmechaniek', video: 'https://www.youtube.com/watch?v=2LAg2FFAXbo', days: ['wo', 'vr'] },
          { name: 'Buildups 3 × 30 m (60→90%)', doel: 'Opbouwen naar volle snelheid', cue: 'Bouw je snelheid op van 60 naar 90% — knal nooit koud weg.', why: 'opbouwen', days: ['vr'] },
          { name: 'Split-step + reactie', doel: 'Eerste stap scherp vóór je gaat spelen', cue: 'Land op je split-step en zet direct af in één richting.', why: 'eerste stap', days: ['wo'] },
          { name: 'Dead hang 2 × max', doel: 'Grip en decompressie vóór het trekken', cue: 'Hang zo lang je kunt met actieve schouders.', why: 'grip en decompressie', days: ['za'] }
        ]
      },
      {
        key: 'balans', title: 'Voet & enkel', sub: '~3 min · je enkels zijn je grootste blessurerisico',
        items: [
          { name: 'Tibialis raise 2 × 20', doel: 'Scheenbeen — remkracht, beschermt de knie', cue: 'Til je tenen op tegen de muur en laat langzaam zakken.', why: 'remkracht', days: ['ma', 'di', 'wo', 'do', 'vr', 'za'] },
          { name: 'Calf raise excentrisch 2 × 10', doel: 'Achillespees belastbaar voor sprint en sprong', cue: 'Duw omhoog en laat in drie tellen zakken.', why: 'achillespees', days: ['di', 'wo', 'vr', 'za'] },
          { name: 'Single-leg balance 2 × 30 sec', doel: 'Stabiele enkel, geen circusact', cue: 'Sta 30 sec stil op één been met je blik vooruit.', why: 'enkelstabiliteit', days: ['di', 'wo', 'vr'] }
        ]
      }
    ]
  },

  weekRule: 'Vier tildagen: maandag hinge, dinsdag push, donderdag squat, zaterdag pull. Woensdag, vrijdag en zondag zijn rust. Je achterkant komt vier keer per week terug en het springwerk staat altijd vooraan.',
  weekOrder: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],

  days: {
    ma: {
      key: 'ma', label: 'MA', title: 'Hinge + verticale power', sub: 'de zwaarste dag van je week',
      erector: 'ZEER HOOG', power: 'Verticaal', compound: 'Trap bar deadlift',
      warn: 'Springen staat vooraan en is geen warming-up. Trap bar op RPE 7: techniek en snelheid gaan voor kilo s in golf 1.',
      items: [
        { key: 'cmj', group: 'Spring eerst, fris', name: 'Countermovement jump', doel: 'De KPI van dit blok: sprong omhoog', cue: 'Spring precies 2 keer per set, volle rust. Meet met sprong-en-reik tegen de muur, niet met een boxhoogte.', let: 'Meer dan 2 sprongen per set traint een lágere sprong. Zakt de hoogte, dan stop je.', sets: 4, target: '2 · log de hoogte', unit: 'cm', mode: 'power', type: 'strength' },
        { key: 'drop_jump', group: 'Spring eerst, fris', name: 'Drop jump 30–40 cm', doel: 'Reactieve kracht — korter grondcontact', cue: 'Stap van de bak van 30–40 cm, land en spring meteen door. Knie zeurt → overslaan.', let: 'Je landing moet klinken als één tik, niet als twee. Hoor je twee tikken, dan is de bak te hoog.', sets: 3, target: '3', mode: 'power', type: 'strength' },
        { key: 'trap_bar_deadlift', group: 'Til zwaar', name: 'Trap bar deadlift', doel: 'De hoofdlift van dit blok', cue: 'Til vanaf de grond met een vlakke rug en duw de vloer weg. RPE 7: laat drie reps in de tank.', sets: 4, target: '6', inc: 5, type: 'strength' },
        { key: 'rdl', group: 'Bouw je achterkant', name: 'RDL', doel: 'Hamstrings op lengte sterk maken', cue: 'Zak met gestrekte rug tot halverwege je scheen en voel je hamstrings rekken. Rustig omlaag, explosief omhoog.', sets: 3, target: '8', inc: 5, type: 'strength' },
        { key: 'back_ext', group: 'Bouw je achterkant', name: 'Back extension — uithoudingsvermogen', doel: 'Rugstrekkers dikker en belastbaarder', cue: 'Kom rustig omhoog tot je rug recht is en knijp je billen bovenin. Voeg gewicht toe zodra 15 makkelijk gaat.', let: 'Of 15-20 reps met 2 tellen bovenin. Voelt het als een pomp: goed. Voelt het als een zware set: te zwaar. Je traint hier de tijd, niet het gewicht.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'calf_standing', group: 'Onderhoud', name: 'Staande kuit', doel: 'Enkelstijfheid — gratis centimeters', cue: 'Duw hoog door op de bal van je voet en laat langzaam zakken.', sets: 3, target: '10-12', type: 'strength' },
        { key: 'ma_core', group: 'Houd je romp stil', name: 'Core — anti-extensie', doel: 'Romp stil terwijl er aan je getrokken wordt', cue: 'Kies dead bug of ab wheel en houd je onderrug plat.', target: '2–3 sets', type: 'check' }
      ]
    },
    di: {
      key: 'di', label: 'DI', title: 'Push boven', sub: 'gooien voor persen',
      erector: 'LAAG', power: 'Med ball', compound: 'Incline press',
      warn: 'Med ball is training, geen opwarmer: maximale intentie, volle rust, daarna pas ijzer.',
      items: [
        { key: 'medball_rot', group: 'Gooi eerst, fris', name: 'Med ball rotational throw', doel: 'Je pass- en schotpower uit de romp', cue: 'Gooi zijwaarts tegen de muur, alles erin. Volle rust, elke worp maximaal.', sets: 3, target: '3 p/z', mode: 'power', type: 'strength' },
        { key: 'incline_press', group: 'Til zwaar', name: 'Incline barbell / DB press', doel: 'Bovenborst — je zwakste schakel boven', cue: 'Raak iets lager aan dan normaal (tepelhoogte), dat voelt krachtiger. RPE 7–8.', sets: 4, target: '6-8', type: 'strength' },
        { key: 'overhead_press', group: 'Til zwaar', name: 'Overhead press', doel: 'Kracht boven je hoofd — rebound en blok', cue: 'Pers machine of barbell ná het borstwerk. Ribben omlaag, geen doorgezakte rug.', sets: 3, target: '6-8', type: 'strength' },
        { key: 'incline_prime', group: 'Bouw volume', name: 'Incline press (Prime)', doel: 'Tweede prikkel voor de bovenborst', cue: 'Pers met vol bereik en rustig tempo; hier telt spanning, niet gewicht.', sets: 3, target: '10-12', type: 'strength' },
        { key: 'lateral_raise', group: 'Bouw volume', name: 'Lateral raise', doel: 'Schouderbreedte — laagste prioriteit', cue: 'Til zijwaarts tot schouderhoogte. Schrap dit als eerste bij een zware week.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'triceps', group: 'Bouw volume', name: 'Triceps', doel: 'Ondersteunt je persen', cue: 'Strek volledig door, kort werk.', sets: 3, target: '10-12', type: 'strength' },
        { key: 'di_core', group: 'Houd je romp stil', name: 'Core — anti-rotatie', doel: 'Romp stil tegen draaikrachten', cue: 'Doe Pallof press en hanging leg raise; houd je heupen recht.', target: '2–3 sets', type: 'check' }
      ]
    },
    wo: {
      key: 'wo', label: 'WO', title: 'Vrij - onderhoud of rust', sub: 'standaard rust; alleen invullen als je fris bent',
      erector: 'LAAG', power: 'Geen', compound: '-', rest: true,
      warn: 'Dit is je klep tussen twee zware dagen. Twijfel je, dan rust je - morgen staat squat.',
      items: [
        { key: 'tempo_block', group: 'Alleen als je fris bent', name: 'Tempo-blok — fiets of roeier', doel: 'Vult je enige lege conditiebakje (aeroob-hoog)', cue: 'Rij 5 × 3 min op hartslag 165–178, 2 min rustig ertussen. Praten moet net niet lukken.', let: 'Uit je inspanningstest: aerobe drempel 161–165, anaerobe drempel 179–182. Extra basketbal vult dit bakje niet — dat telt als zone 2.', target: '5 × 3 min', type: 'check' },
        { key: 'sled', group: 'Alleen als je fris bent', name: 'Slee — duwen & achteruit trekken', doel: 'Knie-onderhoud zonder spierpijn morgen', cue: 'Duw 20 m heen en trek achteruit terug. Kleine passen, laag blijven. Log het gewicht óp de slee.', let: 'Achteruit is het knie-werk: knie mag voorbij de teen. Geen excentrische fase, dus je betaalt er morgen niets voor op de sprint.', sets: 3, target: '20 m h/t', inc: 10, type: 'strength' },
        { key: 'wall_sit', group: 'Alleen als je fris bent', name: 'Wall sit', doel: 'Je knie-verzekering tegen zeurpijn', cue: 'Houd 45–60 sec stil met bovenbenen horizontaal. Vul de seconden in bij reps.', let: 'Doet ander werk dan de slee — die twee vervangen elkaar niet.', sets: 2, target: '45-60 sec', type: 'strength' },
        { key: 'reverse_nordic', group: 'Alleen als je fris bent', name: 'Reverse Nordic', doel: 'Knieschijfpees belastbaar op lange lengte', cue: 'Leun langzaam achterover met gestrekte heupen en kom rustig terug.', sets: 3, target: '8', type: 'strength' }
      ]
    },
    do: {
      key: 'do', label: 'DO', title: 'Squat + single-leg', sub: 'quads en billen',
      erector: 'HOOG', power: 'Horizontaal', compound: 'Back squat',
      warn: 'Broad jump en pogo s eerst, fris. Zakt de sprongafstand, dan stop je met springen en ga je tillen.',
      items: [
        { key: 'broad_jump_plyo', group: 'Spring eerst, fris', name: 'Broad jump', doel: 'Horizontale power — meteen je 4-weken test', cue: 'Spring 2 keer per set, verder niet. Land stabiel en meet de afstand.', sets: 3, target: '2', mode: 'power', type: 'strength' },
        { key: 'pogos', group: 'Spring eerst, fris', name: "Pogo's", doel: 'Voetstijfheid — korter grondcontact', cue: 'Stuiter met stijve enkels en minimale grondcontacttijd.', sets: 2, target: '15', mode: 'power', type: 'strength' },
        { key: 'back_squat', group: 'Til zwaar', name: 'Back squat', doel: 'Je krachtbasis voor elke afzet', cue: 'Zak diep en duw explosief omhoog. RPE 7–8: laat 2 reps in de tank. Knie zeurt? Blijf op wat pijnvrij is.', sets: 4, target: '6-8', inc: 5, type: 'strength' },
        { key: 'atg_split_squat', group: 'Til zwaar', name: 'Bulgarian split squat', doel: 'Eén been sterk — zo beweeg je op het veld', cue: 'Zak diep op één been met rechte romp; het achterste been is alleen steun.', sets: 3, target: '8 p/b', type: 'strength' },
        { key: 'hip_thrust', group: 'Bouw je achterkant', name: 'Hip thrust', doel: 'Bilspieren zwaar belasten zonder je rug', cue: 'Duw door je hielen tot je romp horizontaal staat en knijp bovenin twee tellen vast.', sets: 3, target: '8-10', inc: 10, type: 'strength' },
        { key: 'leg_curl', group: 'Bouw je achterkant', name: 'Leg curl', doel: 'Hamstring direct, los van je rug', cue: 'Trek je hielen naar je billen en laat ze drie tellen zakken. Dit is de enige oefening die je hamstring alleen pakt.', sets: 3, target: '10-12', inc: 5, type: 'strength' },
        { key: 'calf', group: 'Onderhoud', name: 'Kuit (machine)', doel: 'Kuitvolume voor afzet en landing', cue: 'Duw volledig door en laat rustig zakken.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'do_core', group: 'Houd je romp stil', name: 'Core — anti-laterale flexie', doel: 'Zijkant romp — stabiel onder eenzijdige last', cue: 'Doe side plank of suitcase carry en blijf recht, niet overhellen.', target: '2–3 sets', type: 'check' }
      ]
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Rust', sub: 'niets doen is hier het werk',
      erector: 'LAAG', power: 'Geen', compound: '-', rest: true,
      warn: 'Morgen is pull-dag en zondag is vrij. Gebruik deze dag om te eten en te slapen.',
      items: []
    },
    za: {
      key: 'za', label: 'ZA', title: 'Pull boven + carries', sub: 'rug, armen en grip',
      erector: 'MIDDEL', power: 'Licht', compound: 'Chest-supported row',
      warn: 'Trek zwaar maar hou je onderrug heel: chest-supported row juist omdat je rug daar niets hoeft te dragen.',
      items: [
        { key: 'weighted_pullups', group: 'Trek zwaar', name: 'Weighted pullups', doel: 'Zware trekdag, ver van de deadlift', cue: 'Trek zwaar met extra gewicht — je grip staat hier het verst van de deadlift.', sets: 4, target: '6-8', type: 'strength' },
        { key: 'chest_supported_row', group: 'Trek zwaar', name: 'Chest-supported row', doel: 'Rugdikte zonder je onderrug te belasten', cue: 'Trek zwaar — je onderrug doet niets mee. Knijp bovenin kort vast.', sets: 4, target: '8-10', type: 'strength' },
        { key: 'cable_row', group: 'Bouw volume', name: 'Cable / DB row', doel: 'Rugdikte zonder je onderrug te belasten', cue: 'Roei zittend of met steun — je onderrug hoeft niets te dragen.', sets: 3, target: '10-12', type: 'strength' },
        { key: 'rear_delt_facepull', group: 'Bouw volume', name: 'Rear delt + face pull', doel: 'Houding en achterkant schouder', cue: 'Trek naar je gezicht met hoge ellebogen en knijp kort vast.', sets: 3, target: '12-15', type: 'strength' },
        { key: 'nordic', group: 'Bouw je achterkant', name: 'Nordic curl (excentrisch)', doel: 'Halveert je risico op een hamstringblessure', cue: 'Zak langzaam voorover en rem zo lang mogelijk. Sla deze nooit over.', let: 'Bewust hier: 5 dagen na de deadlift, 2 dagen voor de squat.', sets: 3, target: '5', type: 'strength' },
        { key: 'biceps', group: 'Bouw volume', name: 'Biceps', doel: 'Elleboog en onderarm belastbaar', cue: 'Krul rustig en laat het gewicht gecontroleerd zakken. Twee oefeningen is genoeg, dit is geen armendag.', sets: 3, target: '10-12', inc: 2.5, type: 'strength' },
        { key: 'carries', group: 'Bouw je achterkant', name: 'Farmer carry', doel: 'Rug lang en rechtop houden onder last', cue: 'Loop 3 × 30–40 m, zwaar genoeg om te moeten knijpen. Sla alleen over als donderdag naijlt.', video: 'https://www.youtube.com/watch?v=P8iSOHX73FE', let: 'Schouders naar achteren, ribben omlaag. Zodra je gaat hangen is de set klaar', sets: 3, target: '30-40 m', type: 'check' }
      ]
    },
    zo: {
      key: 'zo', label: 'ZO', title: 'Rust', sub: 'wandelen mag, trainen niet',
      erector: 'LAAG', power: 'Geen', compound: '-', rest: true,
      warn: 'Maandag is je zwaarste dag. Alles wat je vandaag extra doet, betaal je morgen bij de trap bar.',
      items: [
        { key: 'mobility_zo', group: 'Beweeg los', name: 'Mobility', doel: 'Stijfheid eruit voor de tildag van morgen', cue: 'Beweeg rustig door wat stijf voelt.', target: '5–10 min', type: 'check' }
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
    title: 'Volume-check', sub: 'Golf 1 van 3: volume opbouwen op RPE 7. De kilo s komen in golf 2 en 3.',
    rows: [
      { name: 'Tildagen', sets: '4 (ma - di - do - za)' },
      { name: 'Posterior chain', sets: '4 dagen (trap bar, RDL, hip thrust, leg curl, nordic, back ext, carry)' },
      { name: 'Hinge', sets: '~7 (ma)' },
      { name: 'Hamstring direct', sets: '~6 (do + za)' },
      { name: 'Quads', sets: '~7 (do)' },
      { name: 'Rug', sets: '~14 (za)' },
      { name: 'Borst', sets: '~10 (di)' },
      { name: 'Sprongcontacten', sets: '~56 p/w (ma 17 - do 36 - opener 3)' },
      { name: 'Rustdagen', sets: '3 (wo - vr - zo)' }
    ]
  }
};
