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
    version: 'v7',
    athlete: 'Kaj Kemp',
    motto: 'niet groter worden — beter bewegen',
    block: 'Basketbal-blok · teamtraining donderdag · seizoen start oktober',
    nutritionShort: '3500–3700 kcal · 240 g eiwit · performance bulk',
    weakPoints: 'Agility & COD · Reactiviteit · Aeroob-hoog · Basketbalspecificiteit',
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

  weekRule: 'Basketbal is nu het skelet: donderdag teamtraining, woensdag je eigen agility-sessie, zondag schot en licht spel. Het tilwerk vult de gaten — maandag, dinsdag en zaterdag. Het tempo-blok staat op dinsdag en zaterdag. Vrijdag is rust, tenzij er iets is uitgevallen én je fris bent.',
  weekOrder: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],

  days: {
    ma: {
      key: 'ma', label: 'MA', title: 'Onderlichaam + verticale power', sub: 'springen fris, dan pas tillen',
      erector: 'HOOG', power: 'Verticaal — vol', compound: 'Back squat',
      warn: 'De sprongen zijn hier geen warming-up maar de hoofdmoot. Volledige rust ertussen: als de hoogte zakt, stop je met springen.',
      items: [
        { key: 'cmj', group: 'Spring eerst, fris', name: 'Countermovement jump', doel: 'De KPI van dit blok: sprong omhoog', cue: 'Spring precies 2 keer per set, volle rust. Meet met sprong-en-reik tegen de muur, niet met een boxhoogte.', let: 'Meer dan 2 sprongen per set traint een lágere sprong. Zakt de hoogte, dan stop je.', sets: 4, target: '2 · log de hoogte', unit: 'cm', mode: 'power', type: 'strength' },
        { key: 'broad_jump_plyo', group: 'Spring eerst, fris', name: 'Broad jump', doel: 'Horizontale power — meteen je 4-weken test', cue: 'Spring 2 keer per set, verder niet. Land stabiel en meet de afstand.', sets: 3, target: '2 reps', mode: 'power', type: 'strength' },
        { key: 'drop_jump', group: 'Spring eerst, fris', name: 'Drop jump 30–40 cm', doel: 'Reactieve kracht — korter grondcontact', cue: 'Stap van de bak van 30–40 cm, land en spring meteen door. Knie zeurt → overslaan.', let: 'Je landing moet klinken als één tik, niet als twee. Hoor je twee tikken, dan is de bak te hoog.', sets: 3, target: '3 reps', mode: 'power', type: 'strength' },
        { key: 'back_squat', group: 'Til zwaar', name: 'Back squat', doel: 'Je krachtbasis voor elke afzet', cue: 'Zak diep en duw explosief omhoog. RPE 7–8: laat 2 reps in de tank. Knie zeurt? Blijf op wat pijnvrij is.', sets: 4, target: '3–5', inc: 5, type: 'strength' },
        { key: 'atg_split_squat', group: 'Til zwaar', name: 'Bulgarian split squat', doel: 'Eén been sterk — zo beweeg je op het veld', cue: 'Zak diep op één been met rechte romp; het achterste been is alleen steun.', sets: 3, target: '5–6 p/b', type: 'strength' },
        { key: 'rdl', group: 'Til zwaar', name: 'RDL', doel: 'Hamstrings en rug — je hinge', cue: 'Til hem vanaf de grond zoals een deadlift — dat pakt je eerste rep en haalt de pijn eruit.', sets: 3, target: '6', inc: 5, type: 'strength' },
        { key: 'calf_standing', group: 'Onderhoud knie & enkel', name: 'Staande kuit', doel: 'Enkelstijfheid — gratis centimeters', cue: 'Duw hoog door op de bal van je voet en laat langzaam zakken.', sets: 3, target: '8–10', type: 'strength' },
        { key: 'wall_sit', group: 'Onderhoud knie & enkel', name: 'Wall sit', doel: 'Je knie-verzekering tegen zeurpijn', cue: 'Houd 45–60 sec stil met bovenbenen horizontaal. Vul de seconden in bij reps.', let: 'Doet ander werk dan de slee — die twee vervangen elkaar niet.', sets: 2, target: '45–60 sec', type: 'strength' },
        { key: 'ma_core', group: 'Houd je romp stil', name: 'Core — anti-extensie', doel: 'Romp stil terwijl er aan je getrokken wordt', cue: 'Kies dead bug of ab wheel en houd je onderrug plat.', target: '2–3 sets', type: 'check' }
      ]
    },
    di: {
      key: 'di', label: 'DI', title: 'Upper Push + Throwing', sub: 'gooien vóór persen',
      erector: 'LAAG', power: 'Med ball — vol', compound: 'Incline press',
      warn: 'Med-ball werk is hier geen opwarmer maar training: max intentie, volle rust. Daarna pas het ijzer, en als afsluiter het tempo-blok.',
      items: [
        { key: 'medball_rot', group: 'Gooi eerst, fris', name: 'Med ball rotational throw', doel: 'Je pass- en schotpower uit de romp', cue: 'Gooi zijwaarts tegen de muur, alles erin. Volle rust, elke worp maximaal.', sets: 4, target: '3 p/z', mode: 'power', type: 'strength' },
        { key: 'medball_chest', group: 'Gooi eerst, fris', name: 'Med ball chest pass', doel: 'Explosieve duwkracht vanuit de borst', cue: 'Duw de bal explosief weg, vang hem en gooi opnieuw.', sets: 3, target: '4 reps', mode: 'power', type: 'strength' },
        { key: 'incline_press', group: 'Til zwaar', name: 'Incline barbell / DB press', doel: 'Bovenborst — je zwakste schakel boven', cue: 'Raak iets lager aan dan normaal (tepelhoogte), dat voelt krachtiger. RPE 7–8.', sets: 4, target: '5–6', type: 'strength' },
        { key: 'overhead_press', group: 'Til zwaar', name: 'Overhead press', doel: 'Kracht boven je hoofd — rebound en blok', cue: 'Pers machine of barbell ná het borstwerk. Ribben omlaag, geen doorgezakte rug.', sets: 3, target: '5', type: 'strength' },
        { key: 'weighted_pullups', group: 'Trek twee keer per week', name: 'Weighted pullups', doel: 'Zware trekdag, ver van de deadlift', cue: 'Trek zwaar met extra gewicht — je grip staat hier het verst van de deadlift.', sets: 3, target: '6', type: 'strength' },
        { key: 'cable_row', group: 'Trek twee keer per week', name: 'Cable / DB row', doel: 'Rugdikte zonder je onderrug te belasten', cue: 'Roei zittend of met steun — je onderrug hoeft niets te dragen.', sets: 3, target: '8', type: 'strength' },
        { key: 'incline_prime', group: 'Vul aan', name: 'Incline press (Prime)', doel: 'Tweede prikkel voor de bovenborst', cue: 'Pers met vol bereik en rustig tempo; hier telt spanning, niet gewicht.', sets: 3, target: '8–12', type: 'strength' },
        { key: 'lateral_raise', group: 'Vul aan', name: 'Lateral raise', doel: 'Schouderbreedte — laagste prioriteit', cue: 'Til zijwaarts tot schouderhoogte. Schrap dit als eerste bij een zware week.', sets: 2, target: '10–15', type: 'strength' },
        { key: 'triceps', group: 'Vul aan', name: 'Triceps', doel: 'Ondersteunt je persen', cue: 'Strek volledig door, kort werk.', sets: 2, target: '10–15', type: 'strength' },
        { key: 'copenhagen', group: 'Hou je liezen heel', name: 'Copenhagen plank', doel: 'Adductor en lies — je risico bij draaien', cue: 'Houd 20–40 sec per zijde vast; je benen zijn vandaag vers.', sets: 2, target: '20–40 sec p/z', type: 'strength' },
        { key: 'di_core', group: 'Houd je romp stil', name: 'Core — anti-rotatie', doel: 'Romp stil tegen draaikrachten', cue: 'Doe Pallof press en hanging leg raise; houd je heupen recht.', target: '2–3 sets', type: 'check' },
        { key: 'tempo_block', group: 'Vul je lege bakje', name: 'Tempo-blok — fiets of roeier', doel: 'Vult je enige lege conditiebakje (aeroob-hoog)', cue: 'Rij 5 × 3 min op hartslag 165–178, 2 min rustig ertussen. Praten moet net niet lukken.', let: 'Uit je inspanningstest: aerobe drempel 161–165, anaerobe drempel 179–182. Extra basketbal vult dit bakje niet — dat telt als zone 2.', target: '5 × 3 min', type: 'check' }
      ]
    },
    wo: {
      key: 'wo', label: 'WO', title: 'Basketbal 1 — snelheid & agility', sub: 'alles wat je op de vloer nodig hebt, mét bal',
      erector: 'LAAG', power: 'Sprint & COD', compound: 'Acceleratie',
      warn: 'Dit is je eigen sessie, dus hier bepaal jij de kwaliteit. Volle rust tussen de sprints; word je trager, dan ben je klaar. Geen conditioning erachteraan — morgen is de teamtraining.',
      items: [
        { key: 'accel', group: 'Sprint eerst, fris', name: 'Acceleratie', doel: 'Eerste drie stappen — daar win je posities', cue: 'Sprint 4 × 10 m en daarna 3 × 20 m. Volle rust, elke start maximaal.', video: 'https://www.youtube.com/watch?v=MHyM1uuMIwc', let: 'Eerste meters voorover, niet rechtop. Pas rond 10-15 m overeind komen', target: '4 × 10 m + 3 × 20 m', type: 'check' },
        { key: 'decel', group: 'Sprint eerst, fris', name: 'Deceleratie', doel: 'Afremmen is 80% van basketbal', cue: 'Sprint 4 × 10 m en stop volledig stil. Afremmen traint je hier, niet het rennen.', video: 'https://www.youtube.com/watch?v=GqVqQK_j_zQ', let: 'Zak op de laatste twee passen, borst blijft boven de knie. Niet met gestrekt been remmen', target: '4 × 10 m', type: 'check' },
        { key: 'cod_drill', group: 'Versnel, rem, draai', name: 'Change of direction (5-10-5)', doel: 'Je 5-10-5-tijd — meetbare agility', cue: 'Loop 4–5 pogingen en blijf laag bij de draai; kom niet omhoog.', video: 'https://www.youtube.com/watch?v=tYhCJd7LaBU', let: 'De tijd win je in de twee draaien, niet op het rechte stuk. Laag zakken, hand naar de lijn', target: '4–5 pogingen', type: 'check' },
        { key: 'def_slides', group: 'Versnel, rem, draai', name: 'Lateral shuffle → sprint', doel: 'Verdedigen en er dan uit wegsprinten', cue: 'Schuif 5 × zijwaarts en sprint daarna explosief weg.', video: 'https://www.youtube.com/watch?v=aFtFDwHAso4', let: 'Voeten kruisen nooit, heupen laag. Overgang naar sprint is een draai, niet eerst rechtop komen', target: '5 reps', type: 'check' },
        { key: 'reactie_drill', group: 'Versnel, rem, draai', name: 'Reactief — op signaal', doel: 'Beslissen ónder tijdsdruk, niet vooraf', cue: 'Reageer 6–10 keer op een signaal: maat wijst een richting of bal tegen de muur.', video: 'https://www.youtube.com/watch?v=TZC-Pl_quoc', let: 'Je mag pas beslissen op het signaal. Weet je het vooraf, dan train je iets anders', target: '6–10 reps', type: 'check' },
        { key: 'two_step_takeoff', group: 'Spring naar de ring', name: 'Twee-passen-inzet', doel: 'Snellere inzet = hoger springen', cue: 'Zet de voorlaatste pas lang en laag, de laatste kort en snel. Zonder bal. Stuiter, hurk niet.', let: 'Uit je dunkanalyse: 280 ms grondcontact, je zakt pas bij de plant en pauzeert onderin. Dat kost hoogte.', target: '2 × 5', type: 'check' },
        { key: 'approach_jump_2', group: 'Spring naar de ring', name: 'Approach jump — 2 benen', doel: 'Zo dunk jij: aanloop, twee benen, ring', cue: 'Spring met aanloop af van twee benen naar de ring. 2 per set, maximale kwaliteit.', sets: 3, target: '2 reps', mode: 'power', type: 'strength' },
        { key: 'approach_jump_sl', group: 'Spring naar de ring', name: 'Approach jump — 1 been', doel: 'Tweede optie: afzet in volle loop', cue: 'Spring met aanloop af van één been. 2 per been per set, meer niet.', sets: 2, target: '2 p/b', mode: 'power', type: 'strength' },
        { key: 'shooting', group: 'Schiet', name: 'Shooting', doel: 'Afsluiten met een goed gevoel', cue: 'Schiet 10–15 min af, rustig en met ritme.', target: '10–15 min', type: 'check' }
      ]
    },
    do: {
      key: 'do', label: 'DO', title: 'Teamtraining', sub: 'de belangrijkste basketbaldag van je week',
      erector: 'WISSELEND', power: 'Wedstrijdvorm', compound: 'Live spel',
      warn: 'Kom fris binnen: woensdag geen extra conditioning, en het zware tilwerk staat bewust op zaterdag. Dit is de sessie waar je selectie wordt bepaald, niet je squat.',
      items: [
        { key: 'team_training', group: 'Train met het team', name: 'Teamtraining', doel: 'De sessie die je selectie bepaalt', cue: 'Kom fris binnen; de coach bepaalt de inhoud. Noteer achteraf hoe je rug na 40 min voelde.', target: 'hele training', type: 'check' },
        { key: 'team_note', group: 'Train met het team', name: 'Vrije worpen na afloop', doel: 'Je schot meten onder vermoeidheid', cue: 'Schiet 2 × 10 aan het eind, vermoeid. Tel ze en noteer het aantal.', target: '2 × 10', type: 'check' }
      ]
    },
    vr: {
      key: 'vr', label: 'VR', title: 'Vrij — rust of inhalen', sub: 'standaard rust; alleen invullen als je fris bent',
      erector: 'LAAG', power: 'Geen', compound: '—', rest: true,
      warn: 'Dit is je herstel-klep na de teamtraining. Alleen invullen als er iets is uitgevallen én je je goed voelt. Twijfel je, dan rust je.',
      items: [
        { key: 'carries', group: 'Vul aan als je fris bent', name: 'Farmer carry', doel: 'Rug lang en rechtop houden onder last', cue: 'Loop 3 × 30–40 m, zwaar genoeg om te moeten knijpen. Sla alleen over als donderdag naijlt.', video: 'https://www.youtube.com/watch?v=P8iSOHX73FE', let: 'Schouders naar achteren, ribben omlaag. Zodra je gaat hangen is de set klaar', target: '3 × 30–40 m', type: 'check' },
        { key: 'nordic', group: 'Vul aan als je fris bent', name: 'Nordic curl (excentrisch)', doel: 'Halveert je risico op een hamstringblessure', cue: 'Zak langzaam voorover en rem zo lang mogelijk. Sla deze nooit over.', let: 'Bewust hier: 5 dagen na de deadlift, 2 dagen voor de squat.', sets: 3, target: '4–6', type: 'strength' },
        { key: 'reverse_nordic', group: 'Vul aan als je fris bent', name: 'Reverse Nordic', doel: 'Knieschijfpees belastbaar op lange lengte', cue: 'Leun langzaam achterover met gestrekte heupen en kom rustig terug.', sets: 3, target: '8', type: 'strength' },
        { key: 'sl_rdl', group: 'Vul aan als je fris bent', name: 'Single-leg RDL', doel: 'Hamstring en balans in één', cue: 'Zak op één been met rechte rug — lichter dan je denkt.', sets: 3, target: '6 p/b', type: 'strength' },
        { key: 'rear_delt_facepull', group: 'Vul aan als je fris bent', name: 'Rear delt + face pull', doel: 'Houding en achterkant schouder', cue: 'Trek naar je gezicht met hoge ellebogen en knijp kort vast.', sets: 2, target: '12–15', type: 'strength' }
      ]
    },
    za: {
      key: 'za', label: 'ZA', title: 'Deadlift + trekken + rug', sub: 'de zware tildag, ver van de teamtraining',
      erector: 'ZEER HOOG', power: 'Horizontaal — vol', compound: 'Trap bar deadlift',
      warn: 'Bewust op zaterdag: twee dagen na de teamtraining en twee dagen voor de volgende. RPE 7–8, laat 2 reps in de tank — zondag speel je nog.',
      items: [
        { key: 'pogos', group: 'Spring eerst, fris', name: "Pogo's", doel: 'Voetstijfheid — korter grondcontact', cue: 'Stuiter met stijve enkels en minimale grondcontacttijd.', sets: 2, target: '15', mode: 'power', type: 'strength' },
        { key: 'lateral_bound', group: 'Spring eerst, fris', name: 'Bounds', doel: 'Horizontale power van de week', cue: 'Spring zijwaarts of vooruit en land 2 tellen stil.', sets: 2, target: '3 p/z', mode: 'power', type: 'strength' },
        { key: 'trap_bar_deadlift', group: 'Til zwaar', name: 'Trap bar deadlift', doel: 'Je zwaarste hinge, ver van de teamtraining', cue: 'Trek élke rep zo snel mogelijk omhoog. RPE 7–8, laat 2 reps in de tank. Voeten dicht bij elkaar en recht.', sets: 4, target: '3', inc: 5, type: 'strength' },
        { key: 'chest_supported_row', group: 'Til zwaar', name: 'Chest-supported row', doel: 'Rugdikte zonder je onderrug te belasten', cue: 'Trek zwaar — je onderrug doet niets mee. Knijp bovenin kort vast.', sets: 4, target: '6–8', type: 'strength' },
        { key: 'sled', group: 'Onderhoud knie & enkel', name: 'Slee — duwen & achteruit trekken', doel: 'Knie-onderhoud zonder spierpijn morgen', cue: 'Duw 20 m heen en trek achteruit terug. Kleine passen, laag blijven. Log het gewicht óp de slee.', let: 'Achteruit is het knie-werk: knie mag voorbij de teen. Geen excentrische fase, dus je betaalt er morgen niets voor op de sprint.', sets: 4, target: '20 m h/t', inc: 10, type: 'strength' },
        { key: 'back_ext', group: 'Bouw rug-uithouding', name: 'Back extension — uithoudingsvermogen', doel: 'De spier die na 40 min basketbal opgeeft', cue: 'Houd 45–60 sec vast op de 45°-bank met lichaamsgewicht. Géén zware sets tot falen.', let: 'Of 15-20 reps met 2 tellen bovenin. Voelt het als een pomp: goed. Voelt het als een zware set: te zwaar. Je traint hier de tijd, niet het gewicht.', sets: 3, target: '45–60 sec', type: 'strength' },
        { key: 'calf', group: 'Onderhoud knie & enkel', name: 'Kuit (machine)', doel: 'Kuitvolume voor afzet en landing', cue: 'Duw volledig door en laat rustig zakken.', sets: 3, target: '10', type: 'strength' },
        { key: 'do_core', group: 'Houd je romp stil', name: 'Core — anti-laterale flexie', doel: 'Zijkant romp — stabiel onder eenzijdige last', cue: 'Doe side plank of suitcase carry en blijf recht, niet overhellen.', target: '2–3 sets', type: 'check' },
        { key: 'tempo_block', group: 'Vul je lege bakje', name: 'Tempo-blok — fiets of roeier', doel: 'Vult je enige lege conditiebakje (aeroob-hoog)', cue: 'Rij 5 × 3 min op hartslag 165–178, 2 min rustig ertussen. Praten moet net niet lukken.', let: 'Na het tilwerk, nooit ervoor. Slaat je deadlift al terug, laat dit dan staan — donderdag gaat voor.', target: '5 × 3 min', type: 'check' }
      ]
    },
    zo: {
      key: 'zo', label: 'ZO', title: 'Basketbal 2 — schot & licht spel', sub: 'max 60 min · RPE ≤ 6',
      erector: 'LAAG', power: 'Licht', compound: 'Vrije worpen',
      warn: 'Bewust licht: je komt van een zware zaterdag en maandag til je weer. Schot en gevoel, geen wedstrijdtempo, geen maximale sprongen.',
      items: [
        { key: 'skill_work', group: 'Pak eerst de bal', name: 'Dribbelwerk', doel: 'Bal laag houden zonder ernaar te kijken', cue: 'Dribbel 15–20 min laag en hard met je ogen omhoog. Zwakke hand krijgt het dubbele.', video: 'https://www.youtube.com/watch?v=JWPvIxiv9q0', let: 'Eindig met tempowisselingen en een crossover in beweging, niet stilstaand. Moet je erbij kijken, dan gaat hij te hoog — liever langzamer en laag.', target: '15–20 min', type: 'check' },
        { key: 'free_throws', group: 'Schiet', name: 'Vrije worpen — 5 × 10', doel: 'Ritme vastleggen, niet het aantal', cue: 'Schiet 5 × 10 met exact dezelfde aanloop: zelfde dribbels, pauze en kniebuiging. Tel ze.', target: '5 × 10', type: 'check' },
        { key: 'skill_work_zo', group: 'Speel licht', name: 'Casual shooting', doel: 'Gevoel houden zonder belasting', cue: 'Schiet vrij rond. Géén sprints, géén maximale sprongen, géén agility.', target: 'RPE ≤ 6', type: 'check' },
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
    title: 'Volume-check', sub: 'Basketbal is het skelet: 3 vaste balmomenten per week. Het tilwerk staat op 3 dagen. Nieuw in v7: drop jumps, de twee-passen-inzet, de approach jump op twee benen en een echt tempo-blok.',
    rows: [
      { name: 'Basketbal', sets: '3 vast (wo agility · do team · zo bal & schot)' },
      { name: 'Tildagen', sets: '3 (ma · di · za) + vr optioneel' },
      { name: 'Rug', sets: '~10 (di + za)' },
      { name: 'Hamstrings', sets: '~6 (ma · za) + vr optioneel' },
      { name: 'Quads', sets: '~7 + sprongwerk' },
      { name: 'Borst', sets: '~9 (di)' },
      { name: 'Tempo (aeroob-hoog)', sets: '2 × 5 × 3 min (di · za) — het enige bakje dat leeg stond' },
      { name: 'Sprongcontacten', sets: '~139 p/w (ma 53 · wo 20 · do 30 · za 36)' },
      { name: 'Zo tel ik dat', sets: 'Elke afzet telt als 1 contact. De opener-pogo\'s tellen mee (2 × 15 op ma en do = 60 p/w); "p/b" en "p/z" tellen per set, niet dubbel. Ma = 30 pogo + 8 CMJ + 6 broad + 9 drop. Wo = 10 twee-passen + 6 approach 2-benig + 4 approach 1-benig. Za = 30 pogo + 6 bounds.' },
      { name: 'Rustdag', sets: 'vrijdag — standaard leeg' }
    ]
  }
};
