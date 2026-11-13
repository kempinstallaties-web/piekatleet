// VASTE DINGEN — vijf kleine dagelijkse groei-acties: hoofd, lezen, communicatie, ondernemer, vriend.
// Géén dagelijks werk (mail, klanten, planning): dat gebeurt toch al. Dit is wat je er
// bovenop doet om beter te worden. Eén tik per ding, geen tekstveld. Onder de Seth-kaart.
// Deze site en repository zijn openbaar: zet hier NOOIT iets persoonlijks in (namen,
// klanten, bedrijfscijfers). Elk ding kost hooguit tien minuten, ook op een slechte dag, en
// de tekst past op één regel van een telefoon (hooguit ~34 tekens).
// Opslag in de app: metric 'dag_<id>' op de datum van die dag, waarde 1 of 0.
// Een id nooit hergebruiken voor iets anders: de historie hangt eraan. Vervalt een ding,
// haal het dan uit de lijst en geef het nieuwe ding een nieuw id.
window.DAG = {
  start: '2026-11-13', // eerste dag die meetelt in de weekscore

  // rol: het label boven de regel
  // dagen: op welke dagen het ding in de lijst staat (leeg = elke dag)
  // tekst: vaste tekst, of perDag: per weekdag een eigen tekst
  // kort: naam in de bijstuurregel ("... blijft liggen")
  taken: [
    {
      id: 'stil', rol: 'hoofd', kort: 'Tien minuten stil',
      tekst: 'Tien minuten stil, zonder scherm.'
    },
    {
      id: 'lezen', rol: 'lezen', kort: 'Lezen',
      tekst: 'Lees tien pagina\'s.'
    },
    {
      // één oefening per dag, in een gesprek dat je toch al voert: kost geen extra tijd
      id: 'praten', rol: 'communicatie', kort: 'De communicatie-oefening', dagen: 'ma di wo do vr za',
      perDag: {
        ma: 'Zeg eerst wat je wilt bereiken.',
        di: 'Stel een open vraag en wacht.',
        wo: 'Vat samen voordat je reageert.',
        'do': 'Spreek uit wat je liever inslikt.',
        vr: 'Geef één gemeend compliment.',
        za: 'Vraag door: vertel eens meer.'
      }
    },
    {
      // tien minuten werken AAN het bedrijf, niet erin
      id: 'bedrijf', rol: 'ondernemer', kort: 'Werken aan je bedrijf', dagen: 'ma di wo do vr za',
      perDag: {
        ma: 'Kies de verbetering van deze week.',
        di: 'Reken één klus na op winst.',
        wo: 'Leg één werkwijze vast op papier.',
        'do': 'Leer tien minuten over ondernemen.',
        vr: 'Noteer de les van deze week.',
        za: 'Bekijk je cijfers van de week.'
      }
    },
    {
      id: 'mens', rol: 'vriend', kort: 'Iets van je laten horen',
      tekst: 'Laat iemand iets van je horen.'
    }
  ]
};
