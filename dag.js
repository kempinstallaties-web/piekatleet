// VASTE DINGEN — een paar kleine dagelijkse acties per rol (ondernemer · vriend · persoon).
// Eén tik per ding, geen tekstveld. Onder de Seth-kaart op Vandaag.
// Deze site en repository zijn openbaar: zet hier NOOIT iets persoonlijks in (namen,
// klanten, bedrijfscijfers). Elk ding kost hooguit tien minuten en de tekst past op één
// regel van een telefoon (hooguit ~34 tekens): hij moet in één blik te lezen zijn.
// Opslag in de app: metric 'dag_<id>' op de datum van die dag, waarde 1 of 0.
// Een id nooit hergebruiken voor iets anders: de historie hangt eraan. Vervalt een ding,
// haal het dan uit de lijst en geef het nieuwe ding een nieuw id.
window.DAG = {
  start: '2026-11-11', // eerste dag die meetelt in de weekscore

  // dagen: op welke dagen het ding in de lijst staat (leeg = elke dag)
  // tekst: vaste tekst, of perDag: per weekdag een eigen tekst
  // kort: naam in de bijstuurregel ("... blijft liggen")
  taken: [
    {
      id: 'klus', rol: 'ondernemer', kort: 'Het ene ding kiezen', dagen: 'ma di wo do vr',
      tekst: 'Kies het ene ding dat af moet.'
    },
    {
      id: 'klant', rol: 'ondernemer', kort: 'De klant-update', dagen: 'ma di wo do vr',
      tekst: 'Geef één klant een update.'
    },
    {
      id: 'kantoor', rol: 'ondernemer', kort: 'Tien minuten kantoor', dagen: 'ma di wo do vr za',
      perDag: {
        ma: '10 min kantoor: plan je week.',
        di: '10 min kantoor: offertes versturen.',
        wo: '10 min kantoor: werk je mail bij.',
        'do': '10 min kantoor: boek je bonnetjes.',
        vr: '10 min kantoor: facturen versturen.',
        za: '10 min kantoor: bekijk je cijfers.'
      }
    },
    {
      id: 'mens', rol: 'vriend', kort: 'Iets van je laten horen',
      tekst: 'Laat iemand iets van je horen.'
    },
    {
      id: 'scherm', rol: 'persoon', kort: 'Telefoon weg voor het slapen',
      tekst: 'Leg je telefoon weg voor het slapen.'
    }
  ]
};
