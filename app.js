/* PiekAtleet — app-logica: state, local-first sync (Supabase), views, grafieken.
   XSS-discipline: ALLE dynamische waarden (notities, namen, labels) gaan door esc()
   vóór ze in een HTML-string belanden; el() mag alleen met ge-escapete input worden
   aangeroepen. Data is bovendien uitsluitend eigen invoer van de enige gebruiker. */
(function () {
  'use strict';

  var P = window.PROGRAM;
  var CFG = window.PA_CONFIG || {};
  // Bump samen met CACHE in sw.js bij elke deploy — zichtbaar in Info zodat je kunt checken
  // of een update binnen is. De versie in de header is de PROGRAMMA-versie (P.meta.version).
  var APP_VERSION = '61 · 24-11-2026';

  /* ---------------- Utils ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function el(html) {
    // input is altijd een template-literal waarin dynamische delen ge-escaped zijn (zie kop)
    html = html.trim();
    var m = html.match(/^<(tr|td|th|tbody|thead)\b/i);
    if (m) {
      // losse tabel-elementen worden buiten table-context door de parser gedropt
      var frag = document.createRange().createContextualFragment('<table>' + html + '</table>');
      return frag.querySelector(m[1]);
    }
    return document.createRange().createContextualFragment(html).firstElementChild;
  }
  function clear(node) { node.replaceChildren(); }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  var DAGNAMEN = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
  function dayKeyForDate(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    return DAGNAMEN[d.getDay()];
  }
  function fmtDate(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    return DAGNAMEN[d.getDay()] + ' ' + String(d.getDate()).padStart(2, '0') + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function isoWeekParts(dateStr) {
    var d = new Date(dateStr + 'T12:00:00');
    var day = (d.getDay() + 6) % 7; // ma=0
    d.setDate(d.getDate() - day + 3); // donderdag van deze week
    var isoYear = d.getFullYear(); // ISO-weekjaar = jaar van de donderdag
    var thursday = d.getTime();
    d.setMonth(0, 1);
    if (d.getDay() !== 4) d.setMonth(0, 1 + ((4 - d.getDay()) + 7) % 7);
    return { year: isoYear, week: 1 + Math.round((thursday - d.getTime()) / (7 * 24 * 3600 * 1000)) };
  }
  function num(v) {
    if (v === '' || v == null) return null;
    var n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? null : n;
  }
  function fmtNum(n) {
    if (n == null) return '';
    return String(n).replace('.', ',');
  }
  function nowIso() { return new Date().toISOString(); }
  // timestamps als epoch vergelijken — Postgres ("...+00") en JS ("...Z") serialiseren verschillend
  function ts(v) { var t = new Date(v || 0).getTime(); return isNaN(t) ? 0 : t; }

  /* ---------------- State + opslag ---------------- */
  var LS_SESS = 'pa_sessions_v1', LS_MET = 'pa_metrics_v1', LS_DIRTY = 'pa_dirty_v1';
  var LS_GARMIN = 'pa_garmin_v1';
  // garmin komt van de horlogesync en is hier ALLEEN-LEZEN — nooit dirty, nooit terugschrijven
  var S = { sessions: {}, metrics: {}, dirty: { sessions: [], metrics: [] }, garmin: {} };
  var UI = { view: 'vandaag', date: todayStr(), dayKey: null, histMode: 'sessies', histEx: 'back_squat', openerOpen: null, focusIdx: 0 };
  UI.dayKey = dayKeyForDate(UI.date);

  function loadLocal() {
    try { S.sessions = JSON.parse(localStorage.getItem(LS_SESS) || '{}'); } catch (e) { S.sessions = {}; }
    try { S.metrics = JSON.parse(localStorage.getItem(LS_MET) || '{}'); } catch (e) { S.metrics = {}; }
    try { S.dirty = JSON.parse(localStorage.getItem(LS_DIRTY) || '{"sessions":[],"metrics":[]}'); } catch (e) { S.dirty = { sessions: [], metrics: [] }; }
    try { S.garmin = JSON.parse(localStorage.getItem(LS_GARMIN) || '{}'); } catch (e) { S.garmin = {}; }
    if (!S.dirty.sessions) S.dirty.sessions = [];
    if (!S.dirty.metrics) S.dirty.metrics = [];
  }
  var saveTimer = null;
  function saveLocalNow() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    if (SETH_TEST) return; // testmodus (?sethdatum=): niets naar de lokale opslag
    try {
      localStorage.setItem(LS_SESS, JSON.stringify(S.sessions));
      localStorage.setItem(LS_MET, JSON.stringify(S.metrics));
      localStorage.setItem(LS_DIRTY, JSON.stringify(S.dirty));
      localStorage.setItem(LS_GARMIN, JSON.stringify(S.garmin));
    } catch (e) {
      toast('Let op: lokaal opslaan mislukt (' + e.name + ')');
    }
  }
  // korte debounce: geen volledige serialize op élke toetsaanslag; flush bij verbergen/sluiten
  function saveLocal() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(saveLocalNow, 300);
  }
  window.addEventListener('pagehide', saveLocalNow);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') saveLocalNow();
  });

  function sessKey(date, dayKey) { return date + '|' + dayKey; }

  function getSession(date, dayKey, create) {
    var k = sessKey(date, dayKey);
    if (!S.sessions[k] && create) {
      S.sessions[k] = { date: date, dayKey: dayKey, opener: {}, items: {}, note: '', updatedAt: nowIso() };
    }
    return S.sessions[k] || null;
  }
  function ensureItem(sess, item) {
    if (!sess.items[item.key]) {
      var sets = [];
      var n = item.sets || 0;
      for (var i = 0; i < n; i++) sets.push({ kg: '', reps: '', done: false });
      sess.items[item.key] = { sets: sets, done: false, note: '' };
    }
    return sess.items[item.key];
  }
  function markSessionDirty(date, dayKey) {
    var k = sessKey(date, dayKey);
    var s = S.sessions[k];
    if (s) s.updatedAt = nowIso();
    if (S.dirty.sessions.indexOf(k) < 0) S.dirty.sessions.push(k);
    saveLocal();
    schedulePush();
    updateDayProgress();
  }

  // Voortgang van een dag: sets/onderdelen gelogd t.o.v. wat er gepland staat.
  // Check-items tellen als één "eenheid", krachtoefeningen als hun aantal sets.
  function dagVoortgang(date, dayKey) {
    var day = P.days[dayKey];
    var out = { setsLogged: 0, itemsDone: 0, total: 0, gepland: 0, gedaan: 0, pct: 0 };
    if (!day || !day.items) return out;
    var sess = getSession(date, dayKey, false);
    out.total = day.items.length;
    day.items.forEach(function (it) {
      var l = sess && sess.items && sess.items[it.key];
      if (it.type === 'strength') {
        var n = it.sets || 0;
        out.gepland += n;
        var arr = (l && l.sets) || [];
        arr.forEach(function (st) { if (num(st.kg) != null || num(st.reps) != null || st.done) out.setsLogged++; });
        var prog = arr.slice(0, n);
        prog.forEach(function (st) { if (num(st.kg) != null || num(st.reps) != null || st.done) out.gedaan++; });
        if (n && prog.length === n && prog.every(function (st) { return st.done; })) out.itemsDone++;
      } else {
        out.gepland += 1;
        if (l && l.done) { out.gedaan += 1; out.itemsDone++; }
      }
    });
    out.pct = out.gepland ? Math.min(100, Math.round(100 * out.gedaan / out.gepland)) : 0;
    return out;
  }
  var RING_C = 2 * Math.PI * 31; // straal 31 in de 72×72 viewBox van de voortgangsring

  // live voortgang in de hero-kaart (ring + regel), zonder de hele view te hertekenen
  function updateDayProgress() {
    var elP = $('#dayProgress');
    var day = P.days[UI.dayKey];
    if (!day || day.rest) return;
    var v = dagVoortgang(UI.date, UI.dayKey);
    if (elP) {
      elP.textContent = (v.setsLogged || v.itemsDone)
        ? v.setsLogged + ' sets gelogd · ' + v.itemsDone + '/' + v.total + ' onderdelen klaar'
        : 'Nog niets gelogd vandaag';
    }
    var pct = $('#dayPct'); if (pct) pct.textContent = v.pct + '%';
    var ring = $('#dayRing');
    if (ring) {
      ring.setAttribute('stroke-dasharray', RING_C.toFixed(1));
      ring.setAttribute('stroke-dashoffset', (RING_C * (1 - v.pct / 100)).toFixed(1));
    }
  }
  function markMetricDirty(k) {
    if (S.dirty.metrics.indexOf(k) < 0) S.dirty.metrics.push(k);
    saveLocal();
    schedulePush();
  }

  /* ---------------- Sync (local-first) ---------------- */
  var sb = null;
  var pushTimer = null;
  var lastSyncError = null;

  function initSupabase() {
    if (window.supabase && CFG.SUPABASE_URL && CFG.SUPABASE_KEY) {
      try { sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_KEY); } catch (e) { sb = null; }
    }
  }
  function setSync(state, text) {
    var box = $('#syncStatus'), t = $('#syncText');
    if (!box) return;
    box.className = 'sync sync-' + state;
    t.textContent = text;
  }
  function refreshSyncUI() {
    var pending = S.dirty.sessions.length + S.dirty.metrics.length;
    if (!sb) { setSync('offline', 'lokaal (geen sync)'); return; }
    if (!navigator.onLine) { setSync('offline', pending ? 'offline — ' + pending + ' te syncen' : 'offline'); return; }
    if (lastSyncError) { setSync('error', 'sync-fout — data staat lokaal'); return; }
    if (pending) { setSync('pending', 'synct…'); return; }
    setSync('ok', 'gesynct');
  }
  function schedulePush() {
    refreshSyncUI();
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(pushDirty, 1200);
  }

  function pushDirty() {
    if (SETH_TEST) return; // testmodus (?sethdatum=): niets naar de database
    if (!sb || !navigator.onLine) { refreshSyncUI(); return; }
    var sessKeys = S.dirty.sessions.slice();
    var metKeys = S.dirty.metrics.slice();
    var jobs = [];

    if (sessKeys.length) {
      var sentSess = {};
      var rows = sessKeys.map(function (k) {
        var s = S.sessions[k];
        if (!s) return null;
        sentSess[k] = s.updatedAt;
        return { session_date: s.date, day_key: s.dayKey, data: s, updated_at: s.updatedAt };
      }).filter(Boolean);
      jobs.push(sb.from('pa_sessions').upsert(rows, { onConflict: 'session_date,day_key' }).then(function (res) {
        if (res.error) throw res.error;
        // alleen de-dirty'en als er tijdens de round-trip geen nieuwe edit op dezelfde key kwam
        S.dirty.sessions = S.dirty.sessions.filter(function (k) {
          if (!(k in sentSess)) return true;
          return S.sessions[k] && S.sessions[k].updatedAt !== sentSess[k];
        });
      }));
    }
    if (metKeys.length) {
      var sentMet = {};
      var mrows = metKeys.map(function (k) {
        var m = S.metrics[k];
        if (!m) return null;
        sentMet[k] = m.updatedAt;
        return { metric_date: m.date, metric_key: m.key, value: m.value, note: m.note || '', updated_at: m.updatedAt };
      }).filter(Boolean);
      jobs.push(sb.from('pa_metrics').upsert(mrows, { onConflict: 'metric_date,metric_key' }).then(function (res) {
        if (res.error) throw res.error;
        S.dirty.metrics = S.dirty.metrics.filter(function (k) {
          if (!(k in sentMet)) return true;
          return S.metrics[k] && S.metrics[k].updatedAt !== sentMet[k];
        });
      }));
    }
    if (!jobs.length) { refreshSyncUI(); return; }

    Promise.all(jobs).then(function () {
      lastSyncError = null;
      saveLocalNow();
      refreshSyncUI();
      // kwam er tijdens de round-trip een nieuwe edit binnen → direct opnieuw pushen
      if (S.dirty.sessions.length || S.dirty.metrics.length) schedulePush();
    }).catch(function (err) {
      lastSyncError = err;
      saveLocalNow();
      refreshSyncUI();
      console.error('Sync-fout:', err);
    });
  }

  function pullAll() {
    if (!sb || !navigator.onLine) return Promise.resolve(false);
    // gepagineerd: PostgREST kapt select('*') af op de default rijenlimiet
    function fetchAll(table) {
      var all = [];
      function page(from) {
        return sb.from(table).select('*').range(from, from + 999).then(function (res) {
          if (res.error) throw res.error;
          all = all.concat(res.data || []);
          if ((res.data || []).length === 1000) return page(from + 1000);
          return all;
        });
      }
      return page(0);
    }
    // horloge-data: alleen de recente weken, alleen-lezen (mag falen zonder de rest te breken)
    var vanaf = new Date(Date.now() - 40 * 864e5).toISOString().slice(0, 10);
    var garminJob = sb.from('pa_garmin').select('*').gte('snapshot_date', vanaf).then(function (res) {
      if (res.error) throw res.error;
      (res.data || []).forEach(function (row) { S.garmin[row.snapshot_date] = row; });
    }).catch(function (err) { console.warn('Garmin-pull overgeslagen:', err && err.message); });

    return Promise.all([fetchAll('pa_sessions'), fetchAll('pa_metrics'), garminJob]).then(function (results) {
      results[0].forEach(function (row) {
        var k = sessKey(row.session_date, row.day_key);
        var local = S.sessions[k];
        var localIsDirty = S.dirty.sessions.indexOf(k) >= 0;
        if (local && localIsDirty && ts(local.updatedAt) >= ts(row.updated_at)) return; // lokale nieuwere wijziging wint
        var data = row.data || {};
        data.date = row.session_date;
        data.dayKey = row.day_key;
        data.updatedAt = row.updated_at;
        S.sessions[k] = data;
      });
      results[1].forEach(function (row) {
        var k = row.metric_date + '|' + row.metric_key;
        var local = S.metrics[k];
        var localIsDirty = S.dirty.metrics.indexOf(k) >= 0;
        if (local && localIsDirty && ts(local.updatedAt) >= ts(row.updated_at)) return;
        S.metrics[k] = { date: row.metric_date, key: row.metric_key, value: row.value == null ? null : Number(row.value), note: row.note || '', updatedAt: row.updated_at };
      });
      lastSyncError = null;
      saveLocalNow();
      refreshSyncUI();
      return true;
    }).catch(function (err) {
      lastSyncError = err;
      refreshSyncUI();
      console.error('Pull-fout:', err);
      return false;
    });
  }

  var toastTimer = null;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }

  /* ---------------- Afgeleiden ---------------- */
  function sessionsSorted() {
    return Object.keys(S.sessions).map(function (k) { return S.sessions[k]; })
      .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  }
  function itemHasData(it) {
    if (!it) return false;
    if (it.done) return true;
    if (it.note) return true;
    return (it.sets || []).some(function (s) { return s.kg !== '' || s.reps !== '' || s.done; });
  }
  function sessionHasData(sess) {
    if (!sess) return false;
    if (sess.note) return true;
    if (Object.keys(sess.opener || {}).length) return true;
    return Object.keys(sess.items || {}).some(function (k) { return itemHasData(sess.items[k]); });
  }
  function prevSessionFor(exKey, beforeDate, excludeKey) {
    var best = null;
    Object.keys(S.sessions).forEach(function (k) {
      if (k === excludeKey) return;
      var s = S.sessions[k];
      if (s.date >= beforeDate) return;
      var it = s.items && s.items[exKey];
      if (!it || !(it.sets || []).some(function (x) { return num(x.kg) != null || num(x.reps) != null; })) return;
      if (!best || s.date > best.date) best = s;
    });
    return best;
  }
  // unit = de eenheid van het eerste invulveld ('kg' standaard, 'cm' bij de CMJ-hoogte)
  function setsSummary(it, unit) {
    var u = unit || 'kg';
    return (it.sets || [])
      .filter(function (s) { return num(s.kg) != null || num(s.reps) != null; })
      .map(function (s) {
        var kg = num(s.kg), reps = num(s.reps);
        var r = reps == null ? '?' : fmtNum(reps);
        // bodyweight (geen of 0 kg) → alleen de reps, geen lelijke "0×6"
        if (kg == null || kg === 0) return r;
        if (u !== 'kg') return fmtNum(kg) + ' ' + u + ' × ' + r;
        return fmtNum(kg) + '×' + r;
      })
      .join(' · ');
  }
  /* ---------------- Progressie-advies (double progression) ----------------
     Regel: haal je bij álle werksets de bovengrens van de rep-range → gewicht omhoog
     en terug naar de ondergrens. Zit je ertussen → zelfde gewicht, meer reps.
     Val je onder de ondergrens → gewicht vasthouden tot het weer staat. */
  function parseTarget(t) {
    if (!t) return null;
    if (/sec|min/i.test(t)) return null; // tijd-gebaseerd, geen rep-progressie
    var m = String(t).match(/(\d+)\s*[–—-]\s*(\d+)/);
    if (m) return { min: parseInt(m[1], 10), max: parseInt(m[2], 10) };
    var one = String(t).match(/(\d+)/);
    if (one) { var v = parseInt(one[1], 10); return { min: v, max: v }; }
    return null;
  }

  /* FR-002 — power, worpen en sprongen krijgen NOOIT een kg-advies.
     Daar is de intentie de progressie: hoger, harder, korter op de grond.
     Double progression op een med ball gaf "9 × 3 → nu 11,5 kg"; dat is onzin. */
  var POWER_BAL = { medball_rot: 1, medball_chest: 1, di_core: 1 };
  var POWER_REACTIEF = { pogos: 1, lateral_bound: 1 };
  var POWER_WOORD = { broad_jump_plyo: 'verder' }; // broad jump meet je in afstand, niet in hoogte

  function powerAdvies(item, prevItem) {
    if (POWER_BAL[item.key]) return { kg: null, power: true, tekst: 'Zelfde bal, harder — snelheid is de progressie' };
    if (POWER_REACTIEF[item.key]) return { kg: null, power: true, tekst: 'Korter grondcontact, niet meer reps' };
    var best = null;
    ((prevItem && prevItem.sets) || []).forEach(function (s) {
      var v = num(s.kg);
      if (v != null && v > 0 && (best == null || v > best)) best = v;
    });
    if (best != null) {
      var u = item.unit ? ' ' + item.unit : '';
      return { kg: null, power: true, tekst: 'Zelfde sets, mik ' + (POWER_WOORD[item.key] || 'hoger') + ' dan ' + fmtNum(best) + u };
    }
    return { kg: null, power: true, tekst: 'Elke sprong maximaal, volledige rust' };
  }

  function progressieAdvies(item, prevItem) {
    if (item.type !== 'strength') return null;
    if (item.mode === 'power') return powerAdvies(item, prevItem);
    if (!prevItem) return null;
    var nWerk = item.sets || 0;
    // 0 reps = set niet uitgevoerd (bv. afgebroken) → telt niet als prestatie
    var werksets = (prevItem.sets || []).slice(0, nWerk).filter(function (s) {
      var r = num(s.reps);
      return r != null && r > 0;
    });
    if (!werksets.length) return null;

    var kgs = werksets.map(function (s) { var k = num(s.kg); return k == null ? 0 : k; });
    var repsArr = werksets.map(function (s) { return num(s.reps); });
    var topKg = Math.max.apply(null, kgs);
    var minReps = Math.min.apply(null, repsArr);
    var compleet = werksets.length >= nWerk;
    var inc = item.inc || 2.5;
    var range = parseTarget(item.target);
    var bodyweight = topKg === 0;

    if (bodyweight) {
      if (!range) return null;
      if (compleet && minReps >= range.max) {
        return { kg: null, op: true, tekst: 'Alle sets op ' + range.max + ' — tijd om gewicht toe te voegen (+' + fmtNum(inc) + ' kg)' };
      }
      // eerst de ondergrens pakken; 3×10 als eerste doel is demotiverend
      if (minReps < range.min) {
        return { kg: null, tekst: 'Eerst ' + nWerk + '× ' + range.min + ' schoon (laagste set was ' + minReps + ')' };
      }
      return { kg: null, tekst: 'Mik op ' + nWerk + '× ' + range.max + ' (laagste set was ' + minReps + ')' };
    }

    if (!range) return { kg: topKg, tekst: 'Vorige top: ' + fmtNum(topKg) + ' kg — evenaren of iets zwaarder' };

    if (!compleet) {
      return { kg: topKg, tekst: 'Vorige keer ' + werksets.length + ' van ' + nWerk + ' sets ingevuld → maak eerst ' + nWerk + '× ' + range.max + ' vol op ' + fmtNum(topKg) + ' kg' };
    }
    var zelfdeGewicht = kgs.every(function (k) { return k === topKg; });
    var mik = range.min === range.max ? String(range.max) : range.min + '–' + range.max;
    if (compleet && zelfdeGewicht && minReps >= range.max) {
      // rug eerst: tot en met item.vast blijven de kilo's staan, ook als het doel gehaald is;
      // daarna pas omhoog als de rugscore het toelaat (P.rug.vrij, twee weken achter elkaar)
      if (item.vast) {
        var nuDag = sethVandaag();
        if (nuDag <= item.vast) {
          return { kg: topKg, tekst: fmtNum(topKg) + ' × ' + range.max + ' stond op alle sets, maar de kilo\'s blijven vast t/m ' + item.vast.split('-').reverse().join('-') + ': houd ' + fmtNum(topKg) + ' kg' };
        }
        var rv = rugVrij(nuDag);
        if (!rv.vrij) {
          if (rv.geenRegel) {
            return { kg: topKg, tekst: fmtNum(topKg) + ' × ' + range.max + ' stond op alle sets, maar er staat geen rugregel in het programma: houd ' + fmtNum(topKg) + ' kg' };
          }
          var stand = rv.nu == null ? 'de rugscore van deze week ontbreekt'
            : (rv.vorig == null ? 'de rugscore van vorige week ontbreekt' : 'nu ' + fmtNum(rv.vorig) + ' en ' + fmtNum(rv.nu));
          return { kg: topKg, tekst: fmtNum(topKg) + ' × ' + range.max + ' stond op alle sets. Gewicht erbij pas na twee weken met rug 0-' + RUG.vrij + ' bij de eerste meting (' + stand + '): houd ' + fmtNum(topKg) + ' kg' };
        }
      }
      var nieuw = topKg + inc;
      return { kg: nieuw, op: true, tekst: fmtNum(topKg) + ' × ' + range.max + ' stond op alle sets → nu ' + fmtNum(nieuw) + ' kg, mik op ' + mik };
    }
    if (minReps < range.min) {
      return { kg: topKg, tekst: 'Zakte naar ' + minReps + ' reps → houd ' + fmtNum(topKg) + ' kg tot alle sets ' + range.min + '+ halen' };
    }
    return { kg: topKg, tekst: 'Houd ' + fmtNum(topKg) + ' kg tot alle sets ' + range.max + ' halen (laagste was ' + minReps + ')' };
  }

  function findProgramItem(exKey) {
    var found = null;
    Object.keys(P.days).forEach(function (dk) {
      (P.days[dk].items || []).forEach(function (it) {
        if (it.key === exKey) found = { item: it, day: P.days[dk] };
      });
    });
    return found;
  }
  // eenheid van het eerste invulveld van een oefening ('kg' tenzij het programma iets anders zegt)
  function unitForKey(exKey) {
    var f = findProgramItem(exKey);
    return (f && f.item.unit) || 'kg';
  }
  function allStrengthItems() {
    var out = [];
    P.weekOrder.forEach(function (dk) {
      (P.days[dk].items || []).forEach(function (it) {
        if (it.type === 'strength') out.push({ key: it.key, name: it.name, day: P.days[dk].label });
      });
    });
    return out;
  }
  // Wekelijkse top set per anker (zwaarste kg; bij gelijk: meeste reps)
  function weeklyTopSets(exKey) {
    var byWeek = {};
    var isCm = unitForKey(exKey) === 'cm';
    Object.keys(S.sessions).forEach(function (k) {
      var s = S.sessions[k];
      var it = s.items && s.items[exKey];
      if (!it) return;
      (it.sets || []).forEach(function (st) {
        var kg = num(st.kg), reps = num(st.reps);
        if (reps == null) return;
        // cm-oefening (CMJ): een set zonder hoogte is geen meting. Als 0 meetellen
        // zou oude sessies (reps, geen hoogte) als "0 cm gesprongen" plotten.
        if (kg == null && isCm) return;
        if (kg == null) kg = 0; // bodyweight (bv. pullups) telt gewoon mee
        var wp = isoWeekParts(s.date);
        var wkKey = wp.year + '-' + wp.week; // jaar erbij: wk 30 van 2026 ≠ wk 30 van 2027
        var cur = byWeek[wkKey];
        if (!cur || kg > cur.kg || (kg === cur.kg && reps > cur.reps)) {
          byWeek[wkKey] = { week: wp.week, kg: kg, reps: reps, date: s.date };
        }
      });
    });
    return Object.keys(byWeek).map(function (w) { return byWeek[w]; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  }
  function metricSeries(key) {
    return Object.keys(S.metrics).map(function (k) { return S.metrics[k]; })
      .filter(function (m) { return m.key === key && m.value != null; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  }

  /* ---------------- Grafiek (SVG, één serie) ---------------- */
  function lineChart(points, unit) {
    // points: [{label, value, sub}] — labels/subs zijn al veilige eigen data, tóch esc() overal
    var wrap = el('<div class="chartwrap"></div>');
    if (points.length < 2) {
      wrap.appendChild(el('<div class="tiny chart-note">Nog te weinig data voor een grafiek — log minstens 2 keer.</div>'));
      return wrap;
    }
    var W = 340, H = 130, padL = 34, padR = 16, padT = 16, padB = 22;
    var vals = points.map(function (p) { return p.value; });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    if (min === max) { min -= 1; max += 1; }
    var span = max - min;
    min -= span * 0.12; max += span * 0.12;
    var iw = W - padL - padR, ih = H - padT - padB;
    function X(i) { return padL + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw); }
    function Y(v) { return padT + ih - ((v - min) / (max - min)) * ih; }

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;display:block" role="img" aria-label="Verloop">';
    // recessieve gridlijnen op data-min & -max
    var gmin = Math.min.apply(null, vals), gmax = Math.max.apply(null, vals);
    [gmin, gmax].forEach(function (gv) {
      svg += '<line x1="' + padL + '" y1="' + Y(gv) + '" x2="' + (W - padR) + '" y2="' + Y(gv) + '" stroke="#262b33" stroke-width="1"/>';
      svg += '<text x="' + (padL - 5) + '" y="' + (Y(gv) + 4) + '" text-anchor="end" font-size="9.5" fill="#717a86">' + fmtNum(gv) + '</text>';
    });
    var path = points.map(function (p, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.value).toFixed(1); }).join(' ');
    svg += '<path d="' + path + '" fill="none" stroke="#f6b73c" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    points.forEach(function (p, i) {
      svg += '<circle cx="' + X(i) + '" cy="' + Y(p.value) + '" r="4" fill="#f6b73c" stroke="#14171c" stroke-width="2"/>';
      svg += '<circle cx="' + X(i) + '" cy="' + Y(p.value) + '" r="15" fill="transparent" data-i="' + i + '" style="cursor:pointer"/>';
    });
    // selectief direct label: alleen het laatste punt
    var last = points[points.length - 1];
    var lx = Math.min(X(points.length - 1), W - padR - 4);
    svg += '<text x="' + lx + '" y="' + (Y(last.value) - 9) + '" text-anchor="end" font-size="11" font-weight="700" fill="#e8eaed">' + fmtNum(last.value) + (unit ? ' ' + esc(unit) : '') + '</text>';
    svg += '<text x="' + padL + '" y="' + (H - 6) + '" font-size="9.5" fill="#717a86">' + esc(points[0].label) + '</text>';
    svg += '<text x="' + (W - padR) + '" y="' + (H - 6) + '" text-anchor="end" font-size="9.5" fill="#717a86">' + esc(last.label) + '</text>';
    svg += '</svg>';

    var svgEl = el('<div>' + svg + '</div>');
    wrap.appendChild(svgEl);

    var tip = null;
    function hideTip() { if (tip) { tip.remove(); tip = null; } }
    svgEl.addEventListener('click', function (ev) {
      var t = ev.target;
      hideTip();
      if (t.dataset && t.dataset.i != null) {
        var p = points[Number(t.dataset.i)];
        tip = el('<div class="charttip">' + esc(p.label) + ' — <b>' + fmtNum(p.value) + (unit ? ' ' + esc(unit) : '') + '</b>' + (p.sub ? '<br>' + esc(p.sub) : '') + '</div>');
        document.body.appendChild(tip);
        var r = t.getBoundingClientRect();
        tip.style.left = Math.max(8, Math.min(window.innerWidth - tip.offsetWidth - 8, r.left + r.width / 2 - tip.offsetWidth / 2)) + 'px';
        tip.style.top = (r.top - tip.offsetHeight - 8) + 'px';
        setTimeout(function () {
          document.addEventListener('click', function once(e2) {
            if (!svgEl.contains(e2.target)) hideTip();
            document.removeEventListener('click', once);
          });
        }, 0);
      }
    });
    return wrap;
  }

  /* ---------------- Rust-timer ---------------- */
  var LS_REST = 'pa_rest_v1', LS_AUTOREST = 'pa_autorest_v1';
  var restDefault = (function () { var v = parseInt(localStorage.getItem(LS_REST), 10); return (v >= 15 && v <= 900) ? v : 120; })();
  function autoRestOn() { return localStorage.getItem(LS_AUTOREST) !== '0'; }
  var RT = { remaining: 0, total: 0, iv: null, audio: null };

  function fmtClock(s) { var m = Math.floor(s / 60), ss = s % 60; return m + ':' + String(ss).padStart(2, '0'); }
  function beep() {
    try {
      if (!RT.audio) RT.audio = new (window.AudioContext || window.webkitAudioContext)();
      var ctx = RT.audio;
      if (ctx.state === 'suspended') ctx.resume();
      [0, 0.18].forEach(function (offset) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 880;
        o.connect(g); g.connect(ctx.destination);
        var t = ctx.currentTime + offset;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        o.start(t); o.stop(t + 0.16);
      });
    } catch (e) { /* geluid mag nooit de app breken */ }
  }
  function vibrate(pattern) { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} }

  function restPillEl() {
    var p = $('#restPill');
    if (!p) {
      p = el('<div id="restPill" class="rest-pill" hidden>' +
        '<button class="rest-adj" data-d="-15" aria-label="15 seconden eraf">–15</button>' +
        '<div class="rest-mid"><div class="rest-time">0:00</div><div class="rest-lbl">rust</div></div>' +
        '<button class="rest-adj" data-d="15" aria-label="15 seconden erbij">+15</button>' +
        '<button class="rest-x" aria-label="Timer stoppen">✕</button>' +
        '</div>');
      document.body.appendChild(p);
      p.querySelectorAll('.rest-adj').forEach(function (b) { b.addEventListener('click', function () { adjustRest(parseInt(b.dataset.d, 10)); }); });
      p.querySelector('.rest-x').addEventListener('click', stopRest);
    }
    return p;
  }
  function paintRest() {
    var p = restPillEl();
    p.querySelector('.rest-time').textContent = fmtClock(Math.max(0, RT.remaining));
    p.classList.toggle('rest-done', RT.remaining <= 0);
  }
  function scheduleTick(endAt) {
    if (RT.iv) clearInterval(RT.iv);
    RT.iv = setInterval(function () {
      RT.remaining = Math.round((endAt - Date.now()) / 1000);
      paintRest();
      if (RT.remaining <= 0) {
        clearInterval(RT.iv); RT.iv = null;
        beep(); vibrate([120, 60, 120]);
        setTimeout(function () { if (RT.remaining <= 0) hideRest(); }, 4000);
      }
    }, 250);
  }
  function startRest(sec) {
    sec = sec || restDefault;
    restDefault = sec;
    if (!SETH_TEST) { try { localStorage.setItem(LS_REST, String(sec)); } catch (e) {} }
    RT.remaining = sec; RT.total = sec;
    var p = restPillEl(); p.hidden = false; p.classList.remove('rest-done');
    // audio ontgrendelen binnen de klik-gesture (set afvinken)
    if (!RT.audio) { try { RT.audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (RT.audio && RT.audio.state === 'suspended') RT.audio.resume();
    paintRest();
    scheduleTick(Date.now() + sec * 1000);
  }
  function adjustRest(d) {
    var p = $('#restPill'); if (!p || p.hidden) return;
    RT.remaining = Math.max(0, RT.remaining + d);
    paintRest();
    if (RT.remaining > 0) { p.classList.remove('rest-done'); scheduleTick(Date.now() + RT.remaining * 1000); }
    else if (RT.iv) { clearInterval(RT.iv); RT.iv = null; }
  }
  function stopRest() { if (RT.iv) { clearInterval(RT.iv); RT.iv = null; } hideRest(); }
  function hideRest() { var p = $('#restPill'); if (p) p.hidden = true; RT.remaining = 0; }
  function onSetCompleted() { if (autoRestOn()) startRest(restDefault); }

  /* ---------------- Workout-modus (focus, één oefening tegelijk) ---------------- */
  function enterFocus(idx) { UI.focusIdx = idx || 0; renderFocus(); }
  function exitFocus() {
    var o = $('#focusOverlay'); if (o) o.remove();
    document.body.classList.remove('focus-open');
    stopRest();
    renderVandaag();
  }
  function focusItemDone(item) {
    var l = (getSession(UI.date, UI.dayKey, false) || {}).items;
    l = l && l[item.key];
    if (!l) return false;
    if (item.type === 'strength') {
      var prog = (l.sets || []).slice(0, item.sets || 0);
      return prog.length > 0 && prog.every(function (s) { return s.done; });
    }
    return !!l.done;
  }
  function renderFocus() {
    var date = UI.date, dayKey = UI.dayKey, day = P.days[dayKey];
    if (!day || day.rest) { exitFocus(); return; }
    var items = day.items;
    if (UI.focusIdx < 0) UI.focusIdx = 0;
    if (UI.focusIdx >= items.length) { exitFocus(); return; }
    var item = items[UI.focusIdx];

    var old = $('#focusOverlay'); if (old) old.remove();
    document.body.classList.add('focus-open');
    var o = el('<div id="focusOverlay" class="focus"></div>');

    var header = el('<div class="focus-head">' +
      '<button class="focus-x" aria-label="Afsluiten">✕ Afsluiten</button>' +
      '<div class="focus-count">' + (UI.focusIdx + 1) + ' / ' + items.length + '</div></div>');
    header.querySelector('.focus-x').addEventListener('click', exitFocus);
    o.appendChild(header);

    var dots = el('<div class="focus-dots"></div>');
    items.forEach(function (it, i) {
      var d = el('<button class="fdot' + (i === UI.focusIdx ? ' cur' : '') + (focusItemDone(it) ? ' done' : '') + '" aria-label="Oefening ' + (i + 1) + '"></button>');
      d.addEventListener('click', function () { UI.focusIdx = i; renderFocus(); });
      dots.appendChild(d);
    });
    o.appendChild(dots);

    var body = el('<div class="focus-body"></div>');
    body.appendChild(el('<div class="focus-group tiny">' + esc(item.group) + '</div>'));
    // hergebruik exact dezelfde log-kaart als de lijst → identieke opslag/sync
    body.appendChild(item.type === 'strength' ? strengthCard(date, dayKey, item) : checkCard(date, dayKey, item));
    o.appendChild(body);

    var last = UI.focusIdx === items.length - 1;
    var nav = el('<div class="focus-nav">' +
      '<button class="fnav-prev"' + (UI.focusIdx === 0 ? ' disabled' : '') + '>‹ Vorige</button>' +
      '<button class="fnav-next">' + (last ? 'Workout afronden ✓' : 'Volgende ›') + '</button></div>');
    nav.querySelector('.fnav-prev').addEventListener('click', function () { if (UI.focusIdx > 0) { UI.focusIdx--; renderFocus(); } });
    nav.querySelector('.fnav-next').addEventListener('click', function () {
      if (last) renderAfsluiting();
      else { UI.focusIdx++; renderFocus(); }
    });
    o.appendChild(nav);

    document.body.appendChild(o);
    o.scrollTop = 0;
  }

  /* FR-009 — afsluitscherm: wat heb je gelogd, wat was beter dan vorige keer,
     en wat verandert er de volgende keer. Het advies is exact dezelfde functie als
     op de kaart zelf, maar dan met de sessie van vandaag als "vorige keer". */
  function renderAfsluiting() {
    var date = UI.date, dayKey = UI.dayKey, day = P.days[dayKey];
    var skey = sessKey(date, dayKey);
    var sess = getSession(date, dayKey, false);
    stopRest();

    var setsGelogd = 0, onderdelen = 0, prs = [], volgende = [];
    (day.items || []).forEach(function (it) {
      var l = sess && sess.items && sess.items[it.key];
      if (!l) return;
      var unit = it.unit || 'kg';
      if (it.type !== 'strength') { if (l.done) onderdelen++; return; }

      var top = null, topReps = null, n = 0;
      (l.sets || []).forEach(function (st) {
        var kg = num(st.kg), reps = num(st.reps);
        if (kg == null && reps == null && !st.done) return;
        n++;
        if (kg != null && (top == null || kg > top)) top = kg;
        if (reps != null && (topReps == null || reps > topReps)) topReps = reps;
      });
      if (!n) return;
      setsGelogd += n;

      var prev = prevSessionFor(it.key, date, skey);
      if (prev) {
        var pTop = null, pReps = null;
        (prev.items[it.key].sets || []).forEach(function (st) {
          var kg = num(st.kg), reps = num(st.reps);
          if (kg != null && (pTop == null || kg > pTop)) pTop = kg;
          if (reps != null && (pReps == null || reps > pReps)) pReps = reps;
        });
        if (top != null && top > 0 && pTop != null && top > pTop) {
          prs.push(it.name + ': ' + fmtNum(top) + ' ' + unit + ' (was ' + fmtNum(pTop) + ')');
        } else if ((top == null || top === 0) && topReps != null && pReps != null && topReps > pReps) {
          prs.push(it.name + ': ' + fmtNum(topReps) + ' reps (was ' + fmtNum(pReps) + ')');
        }
      }
      var adv = progressieAdvies(it, l);
      if (adv) volgende.push({ naam: it.name, tekst: adv.tekst });
    });

    var old = $('#focusOverlay'); if (old) old.remove();
    document.body.classList.add('focus-open');
    var o = el('<div id="focusOverlay" class="focus focus-end"></div>');
    var body = el('<div class="focus-body end-body"></div>');

    body.appendChild(el('<div class="end-kop">Sessie afgerond</div>'));
    body.appendChild(el('<div class="end-sub">' + esc(fmtDate(date) + ' — ' + day.title) + '</div>'));
    body.appendChild(el('<div class="end-stats">' +
      '<div class="end-stat"><b>' + setsGelogd + '</b><span>sets gelogd</span></div>' +
      '<div class="end-stat"><b>' + onderdelen + '</b><span>onderdelen af</span></div>' +
      '<div class="end-stat"><b>' + prs.length + '</b><span>persoonlijk record</span></div>' +
      '</div>'));

    var prCard = el('<div class="card end-card"><div class="end-h2">Beter dan vorige keer</div></div>');
    if (prs.length) {
      prs.forEach(function (p) { prCard.appendChild(el('<div class="end-pr">▲ ' + esc(p) + '</div>')); });
    } else {
      prCard.appendChild(el('<div class="tiny">Geen zwaardere set dan de vorige sessie. Dat hoeft ook niet elke week.</div>'));
    }
    body.appendChild(prCard);

    var nxt = el('<div class="card end-card"><div class="end-h2">Volgende keer</div></div>');
    if (volgende.length) {
      volgende.forEach(function (v) {
        nxt.appendChild(el('<div class="end-next"><b>' + esc(v.naam) + '</b><span>' + esc(v.tekst) + '</span></div>'));
      });
    } else {
      nxt.appendChild(el('<div class="tiny">Log je sets, dan staat hier de volgende keer wat je moet doen.</div>'));
    }
    body.appendChild(nxt);
    o.appendChild(body);

    var nav = el('<div class="focus-nav"><button class="fnav-next end-close">Sluiten</button></div>');
    nav.querySelector('.end-close').addEventListener('click', exitFocus);
    o.appendChild(nav);
    document.body.appendChild(o);
    o.scrollTop = 0;
  }

  /* ---------------- View: Vandaag (workout-editor) ---------------- */
  /* ---------------- Herstel (Garmin) ----------------
     Bewust één strook, geen dashboard: Kaj wil dit niet bijhouden, alleen weten
     of het zware en het rauwe werk vandaag door kan. De sync draait 's ochtends 08:00, dus
     val terug op de laatste dag mét data en zeg er dan bij van wanneer die is. */
  /* FR-003 — de sync maakt 's ochtends soms al een rij aan vóórdat het horloge heeft
     gesynct. Die lege rij van vandaag mag de strook niet op "—" zetten: zoek de laatste
     rij ≤ datum die écht een readiness, slaap óf rust-HR heeft. "vannacht" staat er
     alleen als die rij van de bekeken dag zelf is. */
  function garminRijHeeftData(r) {
    return !!r && (r.readiness_score != null || r.sleep_hours != null || r.resting_hr != null);
  }
  function garminVoor(date) {
    var dagen = Object.keys(S.garmin).filter(function (d) { return d <= date; }).sort();
    for (var i = dagen.length - 1; i >= 0; i--) {
      var r = S.garmin[dagen[i]];
      if (garminRijHeeftData(r)) return { row: r, date: dagen[i], vers: dagen[i] === date };
    }
    return null;
  }

  // readiness stuurt vooral het conditie- en sleewerk aan; kracht blijft bijna altijd staan
  function herstelAdvies(r) {
    var rd = r.readiness_score;
    if (rd == null) return null;
    if (rd >= 80) return { kleur: 'good', tekst: 'Groen. Alles op vol vermogen.' };
    if (rd >= 60) return { kleur: 'good', tekst: 'Normaal. Schema aanhouden zoals het staat.' };
    if (rd >= 40) return { kleur: 'accent', tekst: 'Kracht mag blijven staan. Halveer de slee en het conditiewerk.' };
    return { kleur: 'hot', tekst: 'Geen slee, geen intervallen. Rustig bewegen of rust.' };
  }

  /* Conditie-advies uit Garmin's eigen belastingverdeling.
     Garmin splitst je maandlast in aeroob-laag (zone 2), aeroob-hoog (tempo/drempel)
     en anaeroob (sprints). Rustig werk en zone 2 vullen alleen het eerste bakje —
     het gat zit bij Kaj in het middelste. Vandaar dat dit apart van readiness staat:
     readiness zegt of je vandaag KUNT, dit zegt wat er MIST.
     165-178 komt uit Kaj's inspanningstest van 28-03: aerobe drempel 161-165,
     anaerobe drempel 179-182, max 198. Niet schatten op de hoogst waargenomen
     hartslag (~175) - hij gaat zelden echt tot zijn maximum.
     Sinds 17-11 twee aeroob-hoog-sessies: dinsdag tempo na het persen, zondag intervallen
     (roeier of fiets, zodat de benen voor de hinge- en de beendag fris blijven). */
  var TEMPO_DAGEN = { di: 1, zo: 1 };

  function conditieAdvies(r, dayKey) {
    var hoog = num(r.load_aerobic_high);
    var doel = (r.load_targets && r.load_targets.aeroob_hoog) || null;
    if (hoog == null || !doel || doel[0] == null) return null;
    if (hoog >= doel[0]) return null; // op peil, niets toe te voegen

    var tekort = Math.round(doel[0] - hoog);
    if (TEMPO_DAGEN[dayKey]) {
      return { kleur: 'accent', tekst: 'Doe vandaag je tempoblok: dit is het enige bakje dat leeg staat (' +
        tekort + ' tekort). Rustig werk vult het niet, dat telt als zone 2.' };
    }
    return { kleur: 'muted', tekst: 'Tempowerk ontbreekt nog (' + tekort + ' onder de ondergrens), maar niet vandaag: dat hoort op dinsdag en zondag.' };
  }

  function herstelKaart(date) {
    var g = garminVoor(date);
    if (!g) return null;
    var r = g.row;
    // cijfer bovenaan, label eronder — het getal is waar je naar kijkt
    var cel = function (label, waarde, sub) {
      return '<div class="hcel"><div class="hval">' + esc(waarde == null ? '–' : waarde) + '</div>' +
        '<div class="hlab">' + esc(label) + '</div>' +
        (sub ? '<div class="hsub">' + esc(sub) + '</div>' : '') + '</div>';
    };
    // PostgREST levert numeric-kolommen als string terug — altijd zelf omzetten
    var uur = num(r.sleep_hours), hrv = num(r.hrv_last_night);
    var uren = uur == null ? null : fmtNum(Math.round(uur * 10) / 10) + ' u';
    var bed = (r.sleep_start && r.sleep_end) ? String(r.sleep_start).slice(0, 5) + '–' + String(r.sleep_end).slice(0, 5) : null;

    var html = '<div class="card herstel">' +
      '<div class="hkop"><span>Herstel</span><span class="tiny">' +
      esc(g.vers ? 'vannacht' : 'laatste meting: ' + fmtDate(g.date)) + '</span></div>' +
      '<div class="hgrid">' +
      cel('Readiness', r.readiness_score, r.readiness_level || '') +
      cel('Slaap', uren, bed || (r.sleep_score != null ? 'score ' + r.sleep_score : '')) +
      cel('HRV', hrv == null ? null : Math.round(hrv), r.hrv_status || '') +
      cel('Rust-HR', r.resting_hr, r.resting_hr == null ? '' : 'slagen/min') +
      '</div>';

    var adv = herstelAdvies(r);
    if (adv) html += '<div class="hadvies h-' + adv.kleur + '">' + esc(adv.tekst) + '</div>';
    var cond = conditieAdvies(r, UI.dayKey); // de dag die je bekijkt, niet die van de meting
    if (cond) html += '<div class="hadvies h-' + cond.kleur + '">' + esc(cond.tekst) + '</div>';
    if (uur != null && uur < 6.5) {
      html += '<div class="tiny" style="margin-top:6px">Onder de 6,5 u — dat kost je morgen readiness, niet vandaag kracht.</div>';
    }
    html += '</div>';
    return el(html);
  }

  /* FR-005 — Nulmeting-kaart. De vijf prestatie-ankers zijn nog nooit gemeten en het
     gewicht verloopt; die herinnering hoort bovenaan Vandaag te staan, niet weggestopt
     in Ankers. Schrijft via dezelfde metrics-opslag als de Ankers-tab (key: datum|metric). */
  function metricLaatste(key) {
    var s = metricSeries(key);
    return s.length ? s[s.length - 1] : null;
  }
  function dagenGeleden(dateStr) {
    var a = new Date(todayStr() + 'T12:00:00').getTime();
    var b = new Date(dateStr + 'T12:00:00').getTime();
    return Math.round((a - b) / 864e5);
  }
  function nulmetingKaart() {
    var mist = P.anchors.athletic.filter(function (a) { return !metricLaatste(a.key); });
    var w = metricLaatste('weight');
    var weegOud = !w || dagenGeleden(w.date) > 7;
    if (!mist.length && !weegOud) return null;

    var titel = mist.length ? 'Nulmeting ontbreekt' : 'Weeg je';
    var sub = mist.length
      ? (mist.length + ' van de ' + P.anchors.athletic.length + ' ankers ' + (mist.length === 1 ? 'is' : 'zijn') + ' nog nooit gemeten. Vul in wat je hebt — de rest kan later.')
      : (w ? 'Je laatste weging is ' + dagenGeleden(w.date) + ' dagen oud.' : 'Nog nooit gewogen in de app.');

    // standaard één regel: de invulkaart is zeven velden hoog en hoort niet elke dag bovenaan
    if (!UI.nmOpen) {
      var kort = mist.length ? (mist.length + (mist.length === 1 ? ' anker' : ' ankers') + ' nog niet gemeten') : sub;
      var dicht = el('<button class="card nm-dicht" aria-expanded="false"><span class="nm-kop">' + esc(mist.length ? 'Nulmeting' : titel) + '</span>' +
        '<span class="tiny">' + esc(kort) + '</span><span class="nm-pijl">›</span></button>');
      dicht.addEventListener('click', function () {
        UI.nmOpen = true;
        var open = nulmetingKaart();
        if (open) dicht.replaceWith(open);
      });
      return dicht;
    }

    var card = el('<div class="card nulmeting">' +
      '<div class="nm-kop">' + esc(titel) + '</div>' +
      '<div class="tiny nm-sub">' + esc(sub) + '</div>' +
      '<div class="nm-rows"></div></div>');
    var rowsEl = card.querySelector('.nm-rows');
    var velden = [];

    function veld(label, key, unit, hint) {
      var r = el('<label class="nm-row">' +
        '<span class="nm-lab">' + esc(label) + (hint ? '<small>' + esc(hint) + '</small>' : '') + '</span>' +
        '<input type="text" inputmode="decimal" placeholder="' + esc(unit) + '" aria-label="' + esc(label + ' in ' + unit) + '">' +
        '<span class="nm-unit">' + esc(unit) + '</span></label>');
      velden.push({ key: key, input: r.querySelector('input') });
      rowsEl.appendChild(r);
    }
    mist.forEach(function (a) { veld(a.label, a.key, a.unit, a.hint); });
    if (weegOud) {
      veld('Weeg je', 'weight', 'kg', w ? 'laatste: ' + fmtDate(w.date) : 'nog nooit gelogd');
      // het programma: taille meten bij elke weging (doel = zwaarder bij dezelfde taille)
      veld('Taille', 'waist', 'cm', 'op navelhoogte, na uitademen');
    }

    var btn = el('<button class="btn nm-save">Opslaan</button>');
    btn.addEventListener('click', function () {
      var d = todayStr(), n = 0;
      velden.forEach(function (v) {
        var val = num(v.input.value);
        if (val == null) return;
        var k = d + '|' + v.key;
        S.metrics[k] = { date: d, key: v.key, value: val, note: '', updatedAt: nowIso() };
        markMetricDirty(k);
        n++;
      });
      if (!n) { toast('Vul minstens één waarde in'); return; }
      toast(n === 1 ? '1 meting gelogd' : n + ' metingen gelogd');
      renderVandaag();
    });
    card.appendChild(btn);
    return card;
  }

  /* Seth-kaart (contract seth-kaart-CONTRACT.md) — één mindset-opdracht per dag, bovenaan
     Vandaag. Volgt de telefoondatum, los van de datumkiezer van de training. Opslag via
     dezelfde metrics als de nulmeting: 'seth_kaart' op de datum van de kaart (1 = gedaan,
     0 = niet gedaan, geen rij = geen antwoord) en 'seth_avond' op gisteren. Nooit verwijderen.
     Bewust GEEN tekstveld: deze app heeft geen login. */
  var SETH = window.SETH || null;
  var SETH_DAGEN = 84; // 12 weken
  // alleen om te testen: ?sethdatum=JJJJ-MM-DD toont de kaarten van die dag en bewaart niets
  var SETH_TEST = (function () {
    var m = /[?&]sethdatum=(\d{4}-\d{2}-\d{2})/.exec(location.search);
    return m ? m[1] : null;
  })();
  var sethGetekend = null; // datum waarvoor de kaart het laatst is getekend (middernacht-check)
  var sethTest = {};   // testmodus: waarden alleen in het geheugen, nooit opslaan of syncen
  var sethTestOp = {}; // testmodus: de (test)dag waarop een waarde is gezet

  function sethVandaag() { return SETH_TEST || todayStr(); }
  function datumPlus(dateStr, n) {
    var d = new Date(dateStr + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function dagenTussen(van, tot) {
    return Math.round((new Date(tot + 'T12:00:00').getTime() - new Date(van + 'T12:00:00').getTime()) / 864e5);
  }

  /* Alle vinkjes en scores lopen via deze functies, zodat de testmodus nooit iets bewaart.
     Waarden zijn getallen; een rij wordt nooit verwijderd, alleen overschreven. */
  function metricWaarde(dateStr, key) {
    var k = dateStr + '|' + key;
    if (SETH_TEST && k in sethTest) return sethTest[k];
    var m = S.metrics[k];
    return (m && m.value != null) ? num(m.value) : null;
  }
  function metricZet(dateStr, key, value) {
    var k = dateStr + '|' + key;
    if (SETH_TEST) { sethTest[k] = value; sethTestOp[k] = SETH_TEST; return; }
    S.metrics[k] = { date: dateStr, key: key, value: value, note: '', updatedAt: nowIso() };
    markMetricDirty(k);
  }
  // lokale datum waarop de waarde het laatst is gezet (om 'vandaag beantwoord' te herkennen)
  function metricGezetOp(dateStr, key) {
    var k = dateStr + '|' + key;
    if (SETH_TEST && k in sethTestOp) return sethTestOp[k];
    var m = S.metrics[k];
    if (!m || !m.updatedAt) return null;
    var d = new Date(m.updatedAt);
    if (isNaN(d.getTime())) return null;
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  // alle waarden van één metric, oud → nieuw (in de testmodus met de testwaarden eroverheen)
  function metricReeks(key) {
    var per = {};
    Object.keys(S.metrics).forEach(function (k) {
      var m = S.metrics[k];
      if (m && m.key === key && m.value != null && num(m.value) != null) per[m.date] = num(m.value);
    });
    if (SETH_TEST) {
      Object.keys(sethTest).forEach(function (k) {
        var p = k.split('|');
        if (p[1] === key) per[p[0]] = sethTest[k];
      });
    }
    return Object.keys(per).sort().map(function (d) { return { date: d, value: per[d] }; });
  }
  function sethGedaan(dateStr, key) { return metricWaarde(dateStr, key) === 1; }
  function sethZet(dateStr, key, aan) { metricZet(dateStr, key, aan ? 1 : 0); }
  function sethTotaal() {
    var eind = datumPlus(SETH.start, SETH_DAGEN - 1);
    return metricReeks('seth_kaart').filter(function (m) {
      return m.date >= SETH.start && m.date <= eind && m.value === 1;
    }).length;
  }

  /* Terugkijken en herhalen (amendement A1). Kaartdagen: ma di wo vr za (dagopdracht) en zo
     (weekcheck). De vraag "gedaan?" over een kaart komt op de eerstvolgende dag dat de app
     opengaat, niet op de dag zelf: dan is de opdracht pas gedaan. */
  var SETH_KAARTDAG = { ma: 1, di: 1, wo: 1, vr: 1, za: 1, zo: 1 };
  var DAGNAAM = { ma: 'Maandag', di: 'Dinsdag', wo: 'Woensdag', 'do': 'Donderdag', vr: 'Vrijdag', za: 'Zaterdag', zo: 'Zondag' };

  function sethWeekNr(d) { return Math.floor(dagenTussen(SETH.start, d) / 7); }
  function sethInBlok(d) {
    var b = dagenTussen(SETH.start, d);
    return b >= 0 && b < SETH_DAGEN && sethWeekNr(d) < SETH.weeks.length;
  }
  // laatste kaartdag vóór d (donderdag heeft geen opdracht), alleen binnen het blok
  function sethVorige(d) {
    for (var i = 1; i <= 2; i++) {
      var v = datumPlus(d, -i);
      if (SETH_KAARTDAG[dayKeyForDate(v)]) return sethInBlok(v) ? v : null;
    }
    return null;
  }
  // eigen opdracht van een dag: de dagopdracht, op zondag de themavraag van de weekcheck
  function sethEigen(d) {
    var w = SETH.weeks[sethWeekNr(d)], dk = dayKeyForDate(d);
    if (!w) return null;
    return dk === 'zo' ? (w.vraag || null) : (w[dk] || null);
  }
  /* Antwoord op de kaart van dag d: 1 = gedaan, 0 = niet gedaan, null = geen antwoord.
     Een 0 die op de dag zelf is gezet is een teruggedraaid vinkje (misklik), geen "nee":
     "nee" kan alleen op een latere dag gegeven worden. */
  function sethAntwoord(d) {
    var w = metricWaarde(d, 'seth_kaart');
    if (w === 1) return 1;
    if (w === 0) {
      var op = metricGezetOp(d, 'seth_kaart');
      return (op && op > d) ? 0 : null;
    }
    return null;
  }
  /* Eén keer is oké: na "nee" op een dagopdracht van dezelfde week krijgt de volgende kaartdag
     die opdracht nog één keer. Een herhaling wordt zelf niet herhaald. Niet over de weekgrens,
     niet op zondag (weekcheck) en nooit de weekcheck zelf. */
  function sethHerhaling(d) {
    var dk = dayKeyForDate(d);
    if (!sethInBlok(d) || dk === 'zo' || dk === 'do') return false;
    var v = sethVorige(d);
    if (!v || dayKeyForDate(v) === 'zo' || sethWeekNr(v) !== sethWeekNr(d)) return false;
    if (sethAntwoord(v) !== 0 || !sethEigen(v)) return false;
    return !sethHerhaling(v);
  }
  // de opdracht die op dag d telt: de eigen opdracht, of de herhaling van de vorige
  function sethActief(d) {
    if (sethHerhaling(d)) return { tekst: sethEigen(sethVorige(d)), herhaling: true };
    return { tekst: sethEigen(d), herhaling: false };
  }

  // in testmodus staat er een regel onder de kaart, zodat niemand denkt dat er iets is opgeslagen
  function sethKaart() {
    var card = sethKaartBasis();
    if (card && SETH_TEST) {
      card.appendChild(el('<div class="tiny seth-test">Testmodus ' + esc(fmtDate(SETH_TEST)) + ': vinkjes worden niet opgeslagen</div>'));
    }
    return card;
  }

  function sethKaartBasis() {
    if (!SETH || !SETH.weeks || !SETH.weeks.length) return null;
    var vandaag = sethVandaag();
    sethGetekend = vandaag;
    var blokdag = dagenTussen(SETH.start, vandaag);
    var max = SETH.weeks.length * 6; // vijf dagkaarten + de weekcheck per week

    if (blokdag < 0) {
      var w1 = SETH.weeks[0];
      return el('<div class="card seth">' +
        '<div class="seth-thema">Seth-kaart start ' + esc(fmtDate(SETH.start)) + '</div>' +
        '<div class="seth-opdracht">Week 1 · ' + esc(w1.thema) + '</div>' +
        '<div class="seth-zin">' + esc(w1.zin) + '</div></div>');
    }
    if (blokdag >= SETH_DAGEN || !SETH.weeks[Math.floor(blokdag / 7)]) {
      return el('<div class="card seth">' +
        '<div class="seth-thema">Seth-blok klaar</div>' +
        '<div class="seth-opdracht">' + sethTotaal() + ' van ' + max + ' kaarten gedaan. Welke drie thema\'s wil je herhalen? Zeg het in de chat.</div></div>');
    }

    var wi = Math.floor(blokdag / 7);
    var w = SETH.weeks[wi];
    var dk = dayKeyForDate(vandaag);
    var zondag = dk === 'zo';
    var kop = 'Week ' + (wi + 1) + ' · ' + w.thema;
    var actief = dk === 'do' ? { tekst: null, herhaling: false } : sethActief(vandaag);
    var opdracht = actief.tekst;

    // terugkijken op de vorige kaartdag
    var gisteren = datumPlus(vandaag, -1);
    var vorige = sethVorige(vandaag);
    var antw = vorige ? sethAntwoord(vorige) : null;
    var vraagOpen = !!vorige && antw == null;
    var antwVandaag = !!vorige && antw != null && metricGezetOp(vorige, 'seth_kaart') === vandaag;
    var vorigeDk = vorige ? dayKeyForDate(vorige) : null;
    var wanneer = vorige === gisteren ? 'Gisteren' : DAGNAAM[vorigeDk];

    var toonAvond = blokdag >= 1;
    var avondGedaan = toonAvond && sethGedaan(gisteren, 'seth_avond');
    var avondVandaag = toonAvond && metricGezetOp(gisteren, 'seth_avond') === vandaag;
    var avondKnop = (toonAvond && (!avondGedaan || avondVandaag))
      ? '<button class="seth-mini seth-avond' + (avondGedaan ? ' on' : '') + '" aria-pressed="' + avondGedaan +
        '" aria-label="Avondcheck van gisteravond gedaan"><span class="seth-vink">✓</span>Avondcheck</button>'
      : '';

    // een antwoord van vandaag blijft zichtbaar en is met één tik om te zetten (misklik)
    var wijzigKnop = antwVandaag
      ? '<button class="seth-mini seth-wijzig' + (antw === 1 ? ' on' : ' nee') + '" aria-label="Antwoord wijzigen">' +
        '<span class="seth-vink">✓</span>' + esc(wanneer) + (antw === 1 ? ' gedaan' : ' niet gedaan') + '</button>'
      : '';
    var terug = '';
    if (vraagOpen) {
      var wat = vorigeDk === 'zo' ? 'Weekcheck ' + wanneer.toLowerCase() + ' gedaan?' : wanneer + ' gedaan?';
      terug = '<div class="seth-terug">' +
        '<div class="seth-label">' + esc(wat) + '</div>' +
        '<div class="seth-vorige">' + esc(sethActief(vorige).tekst || '') + '</div>' +
        '<div class="seth-rij"><button class="seth-mini seth-ja">Ja</button>' +
        '<button class="seth-mini seth-nee">Nee</button>' + avondKnop + '</div></div>';
    } else if (antwVandaag || avondKnop) {
      terug = '<div class="seth-terug kaal"><div class="seth-rij">' + wijzigKnop + avondKnop + '</div></div>';
    }

    var card;
    function opnieuw() { var nieuw = sethKaart(); if (nieuw && card) card.replaceWith(nieuw); }
    // een antwoord over de vorige kaartdag verandert ook de consistentieregel op de rugkaart
    function beantwoord(waarde) { metricZet(vorige, 'seth_kaart', waarde); opnieuw(); rugVervang(); }
    function koppel() {
      var b;
      if ((b = card.querySelector('.seth-ja'))) b.addEventListener('click', function () { beantwoord(1); });
      if ((b = card.querySelector('.seth-nee'))) b.addEventListener('click', function () { beantwoord(0); });
      if ((b = card.querySelector('.seth-wijzig'))) b.addEventListener('click', function () { beantwoord(antw === 1 ? 0 : 1); });
      if ((b = card.querySelector('.seth-avond'))) b.addEventListener('click', function () { sethZet(gisteren, 'seth_avond', !avondGedaan); opnieuw(); });
    }
    // zolang de vraag openstaat, blijft de "Ik ben iemand die..."-zin weg: één ding tegelijk
    var zin = vraagOpen ? '' : '<div class="seth-zin">' + esc(w.zin) + '</div>';

    // donderdag is rust: thema en zin, geen opdracht; terugkijken op woensdag kan wel.
    // Ontbrekende tekst valt hierop terug (nooit een lege kaart).
    if (dk === 'do' || !opdracht) {
      card = el('<div class="card seth seth-rust"><div class="seth-thema">' + esc(kop) + '</div>' + zin + terug + '</div>');
      koppel();
      return card;
    }

    var gedaan = sethGedaan(vandaag, 'seth_kaart');

    // vandaag al afgevinkt en niets meer te beantwoorden → ingeklapt tot één regel
    if (gedaan && UI.sethOpen !== vandaag && !vraagOpen) {
      card = el('<div class="card seth seth-dicht">' +
        '<button class="seth-dicht-main" aria-expanded="false"><span class="seth-vink">✓</span>' +
        '<span class="seth-dicht-txt">Seth · ' + esc(w.thema) + '</span></button>' +
        wijzigKnop + (avondGedaan ? '' : avondKnop) + '</div>');
      card.querySelector('.seth-dicht-main').addEventListener('click', function () { UI.sethOpen = vandaag; opnieuw(); });
      koppel();
      return card;
    }

    var knop = '<button class="seth-mini seth-vandaag' + (gedaan ? ' on' : '') + '" aria-pressed="' + gedaan + '">' +
      '<span class="seth-vink">✓</span>Gedaan</button>';
    var html = '<div class="card seth"><div class="seth-thema">' + esc(kop) + '</div>' + zin + terug;
    if (zondag) {
      html += '<div class="seth-kop2"><span class="seth-label">Weekcheck</span>' + knop + '</div>' +
        '<ol class="seth-vragen">' + SETH.weekcheck.vragen.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>' +
        '<div class="tiny">Rollen: ' + esc(SETH.weekcheck.rollen) + '</div>' +
        '<div class="seth-opdracht">' + esc(opdracht) + '</div>' +
        '<div class="tiny">' + esc(SETH.weekcheck.lijst) + '</div>';
    } else {
      html += '<div class="seth-kop2"><span class="seth-label">Vandaag</span>' + knop + '</div>' +
        (actief.herhaling ? '<div class="tiny seth-regel">' + esc(SETH.herhaal || 'Nog één keer.') + '</div>' : '') +
        '<div class="seth-opdracht">' + esc(opdracht) + '</div>';
    }
    if (dk === 'ma' && w.bron) {
      html += '<a class="seth-bron" href="' + esc(w.bron.url) + '" target="_blank" rel="noopener">▶ Seth: ' +
        esc(w.bron.titel) + ' · ' + esc(w.bron.tijd) + '</a>';
    }
    html += '</div>';

    card = el(html);
    card.querySelector('.seth-vandaag').addEventListener('click', function () {
      sethZet(vandaag, 'seth_kaart', !gedaan);
      if (!gedaan) UI.sethOpen = null; // net afgevinkt → inklappen
      opnieuw();
    });
    koppel();
    return card;
  }

  /* Rugkaart en consistentie (amendement A1). Eén smalle kaart bovenaan Vandaag: de rugscore
     van vandaag (0-10, één tik, metric P.rug.key) en één regel over de laatste vier weken.
     De score stuurt de variant van de dag (P.rug.advies) en de kiloregel in progressieAdvies.
     Volgt de telefoondatum, net als de Seth-kaart. Geen tekstveld. */
  var RUG = (P.rug && P.rug.key) ? P.rug : null;

  function maandagVan(d) { return datumPlus(d, -((new Date(d + 'T12:00:00').getDay() + 6) % 7)); }
  // eerste rugscore van een week: die van maandag, anders de eerste erna (nooit na 'tot')
  function rugWeekStart(maandag, tot) {
    for (var i = 0; i < 7; i++) {
      var d = datumPlus(maandag, i);
      if (d > tot) break;
      var v = metricWaarde(d, RUG.key);
      if (v != null) return v;
    }
    return null;
  }
  // de kilo's mogen pas omhoog als de eerste score van deze week en van vorige week laag genoeg is
  function rugVrij(vandaag) {
    // zonder rugregel in het programma blijft het gewicht staan: liever te voorzichtig
    if (!RUG) return { vrij: false, nu: null, vorig: null, geenRegel: true };
    var ma = maandagVan(vandaag);
    var nu = rugWeekStart(ma, vandaag), vorig = rugWeekStart(datumPlus(ma, -7), vandaag);
    return { vrij: nu != null && vorig != null && nu <= RUG.vrij && vorig <= RUG.vrij, nu: nu, vorig: vorig };
  }

  function inRust(d) {
    return (P.rust || []).some(function (r) { return d >= r.van && d <= r.tot; });
  }
  /* Consistentie over de 28 dagen vóór vandaag (vandaag telt niet mee: die dag is nog bezig).
     Geen reeks die op nul springt: gedaan van gepland. Eerst wat er gepland was (per week de
     programmadagen en de thuis-onderdelen), dan alleen de sessies die daarbij horen: een
     training die een dag later is gedaan telt mee, een sessie op een vervallen dag niet.
     P.rust geldt alleen voor de training; thuis-onderdelen blijven gepland. */
  function trainingGedaan(s, thuisDag) {
    var opener = s.opener || {};
    if (Object.keys(opener).some(function (b) { return Object.keys(opener[b] || {}).length > 0; })) return true;
    // alleen een thuis-onderdeel loggen is geen training
    return Object.keys(s.items || {}).some(function (k) { return !(k in thuisDag) && itemHasData(s.items[k]); });
  }
  function consistentie(vandaag) {
    var van = datumPlus(vandaag, -28), tot = datumPlus(vandaag, -1);
    var uit = { training: { gedaan: 0, van: 0 }, seth: { gedaan: 0, van: 0 }, thuis: { gedaan: 0, van: 0 } };
    var cfg = (P.consistentie && P.consistentie.thuis) || null;
    var thuisDag = {}; // key → programmadag waarop het onderdeel staat
    if (cfg) {
      (cfg.keys || []).forEach(function (key) {
        Object.keys(P.days).forEach(function (pdk) {
          (P.days[pdk].items || []).forEach(function (it) { if (it.key === key) thuisDag[key] = pdk; });
        });
      });
    }
    function weekVan(d) { var wp = isoWeekParts(d); return wp.year + '-' + wp.week; }
    var planT = {}, planH = {}; // 'week|programmadag' en 'week|onderdeel' → 0 (gepland) of 1 (gedaan)
    for (var i = 28; i >= 1; i--) {
      var d = datumPlus(vandaag, -i), dk = dayKeyForDate(d);
      if (P.days[dk] && !P.days[dk].rest && !inRust(d)) planT[weekVan(d) + '|' + dk] = 0;
      if (SETH && SETH.weeks && sethInBlok(d) && dk !== 'do') {
        uit.seth.van++;
        if (metricWaarde(d, 'seth_kaart') === 1) uit.seth.gedaan++;
      }
      if (cfg && d >= cfg.sinds) {
        Object.keys(thuisDag).forEach(function (key) { if (thuisDag[key] === dk) planH[weekVan(d) + '|' + key] = 0; });
      }
    }
    Object.keys(S.sessions).forEach(function (k) {
      var s = S.sessions[k];
      if (!s || !s.date || s.date < van || s.date > tot) return;
      var w = weekVan(s.date), tk = w + '|' + s.dayKey;
      if (tk in planT && trainingGedaan(s, thuisDag)) planT[tk] = 1;
      Object.keys(thuisDag).forEach(function (key) {
        var hk = w + '|' + key, it = s.items && s.items[key];
        if (hk in planH && it && itemHasData(it)) planH[hk] = 1;
      });
    });
    function tel(plan) {
      var ks = Object.keys(plan);
      return { gedaan: ks.filter(function (x) { return plan[x] === 1; }).length, van: ks.length };
    }
    uit.training = tel(planT);
    uit.thuis = tel(planH);
    return uit;
  }
  function consistentieRegel(vandaag) {
    var c = consistentie(vandaag), delen = [];
    if (c.training.van) delen.push('training ' + c.training.gedaan + '/' + c.training.van);
    if (c.seth.van) delen.push('Seth ' + c.seth.gedaan + '/' + c.seth.van);
    if (c.thuis.van) delen.push(((P.consistentie.thuis.label) || 'thuis') + ' ' + c.thuis.gedaan + '/' + c.thuis.van);
    return delen.length ? '4 weken: ' + delen.join(' · ') : '';
  }

  function rugKaart(dayKey) {
    if (!RUG) return null;
    var vandaag = sethVandaag();
    var score = metricWaarde(vandaag, RUG.key);
    var cons = consistentieRegel(vandaag);
    var card;

    // de vakjes staan open tot er getikt is; de consistentieregel komt erbij zodra de kaart dichtklapt
    if (score == null || UI.rugOpen === vandaag) {
      var vakjes = '';
      for (var n = 0; n <= 10; n++) {
        vakjes += '<button class="rug-vak' + (score === n ? ' on' : '') + '" data-n="' + n + '" aria-pressed="' + (score === n) + '">' + n + '</button>';
      }
      card = el('<div class="card rug">' +
        '<div class="rug-kop"><span class="seth-thema">Rug nu</span><span class="tiny">0 = niets · 10 = ergst</span></div>' +
        '<div class="rug-schaal" role="group" aria-label="Rugscore van 0 tot 10">' + vakjes + '</div></div>');
      Array.prototype.forEach.call(card.querySelectorAll('.rug-vak'), function (b) {
        b.addEventListener('click', function () {
          metricZet(vandaag, RUG.key, parseInt(b.getAttribute('data-n'), 10));
          UI.rugOpen = null;
          // de score kan het advies bij de oefeningen veranderen (kiloregel): hele dag opnieuw tekenen
          if (UI.view === 'vandaag') renderVandaag(); else rugVervang();
        });
      });
      return card;
    }

    var reeks = metricReeks(RUG.key).filter(function (m) { return m.date <= vandaag; }).slice(-7);
    var verloop = reeks.length > 1
      ? 'laatste ' + reeks.length + ': ' + reeks.map(function (m) { return fmtNum(m.value); }).join(' · ') : '';
    // op of boven de grens staat de lichte variant van de dag in beeld op de plek van het verloop;
    // daaronder is er niets te melden: het gewone programma staat al op het scherm
    var adv = RUG.advies && RUG.advies[dayKey];
    var licht = (adv && adv.hoog && score >= RUG.grens) ? adv.hoog : '';
    // ingeklapt is het geen kaart meer maar een smalle statusregel; de hele regel is de knop
    card = el('<div class="card rug rug-dicht"><button class="rug-main" aria-label="Rugscore wijzigen">' +
      '<span class="rug-regel"><span class="rug-getal">Rug ' + esc(fmtNum(score)) + '/10</span>' +
      (licht ? '<span class="tiny rug-verloop hoog">' + esc(licht) + '</span>'
        : (verloop ? '<span class="tiny rug-verloop">' + esc(verloop) + '</span>' : '')) + '</span>' +
      (cons ? '<span class="tiny rug-cons">' + esc(cons) + '</span>' : '') + '</button></div>');
    card.querySelector('.rug-main').addEventListener('click', function () { UI.rugOpen = vandaag; rugVervang(); });
    return card;
  }
  function rugVervang() {
    var oud = document.querySelector('#view .card.rug');
    if (!oud) return;
    var nieuw = rugKaart(UI.dayKey);
    if (nieuw) oud.replaceWith(nieuw);
  }

  /* Vaste dingen (dag.js) — een paar kleine dagelijkse groei-acties, één tik per ding.
     Zelfde opslag als de Seth-kaart: metric 'dag_<id>' op de datum, waarde 1 of 0.
     Gisteren is na te vinken, want een avond-ding vink je vaak pas de volgende ochtend af. */
  var DAG = window.DAG || null;

  function dagTaken(dateStr) {
    if (!DAG || !DAG.taken) return [];
    var dk = dayKeyForDate(dateStr);
    return DAG.taken.filter(function (t) {
      if (t.dagen && (' ' + t.dagen + ' ').indexOf(' ' + dk + ' ') < 0) return false;
      return !!(t.tekst || (t.perDag && t.perDag[dk]));
    });
  }
  function dagTekst(t, dateStr) { return t.tekst || t.perDag[dayKeyForDate(dateStr)]; }
  function dagStand(dateStr) {
    var taken = dagTaken(dateStr), n = 0;
    taken.forEach(function (t) { if (sethGedaan(dateStr, 'dag_' + t.id)) n++; });
    return { gedaan: n, totaal: taken.length };
  }

  // Bijsturing in één regel. Kijkt naar de zeven dagen vóór vandaag (vanaf DAG.start);
  // de lopende dag telt niet mee, zodat een dag die nog bezig is nooit als misser telt.
  function dagCoach(vandaag) {
    var perTaak = {}, gedaan = 0, kon = 0, dagen = 0;
    for (var i = 1; i <= 7; i++) {
      var d = datumPlus(vandaag, -i);
      if (d < DAG.start) break;
      dagen++;
      dagTaken(d).forEach(function (t) {
        var p = perTaak[t.id] || (perTaak[t.id] = { t: t, gedaan: 0, kon: 0 });
        p.kon++; kon++;
        if (sethGedaan(d, 'dag_' + t.id)) { p.gedaan++; gedaan++; }
      });
    }
    if (!dagen || !kon) return '';
    var gisteren = dagStand(datumPlus(vandaag, -1));
    if (gisteren.totaal && gisteren.gedaan === 0) return 'Gisteren niets afgevinkt. Vandaag gewoon weer.';
    // het ding dat het vaakst blijft liggen (minder dan de helft, minstens drie kansen gehad)
    var zwak = null;
    Object.keys(perTaak).forEach(function (id) {
      var p = perTaak[id];
      if (p.kon < 3 || p.gedaan * 2 >= p.kon) return;
      if (!zwak || p.gedaan / p.kon < zwak.gedaan / zwak.kon) zwak = p;
    });
    if (zwak) {
      var staatVandaag = dagTaken(vandaag).some(function (t) { return t.id === zwak.t.id; });
      return zwak.t.kort + ' blijft liggen: ' + zwak.gedaan + ' van ' + zwak.kon + ' dagen.' + (staatVandaag ? ' Begin daar vandaag mee.' : '');
    }
    var periode = dagen === 1 ? 'Gisteren ' : 'Afgelopen ' + dagen + ' dagen ';
    var sterk = gedaan * 5 >= kon * 4;
    return periode + gedaan + ' van ' + kon + '.' + (sterk ? ' Vasthouden.' : '');
  }

  function dagKaart() {
    if (!DAG || !DAG.taken || !DAG.taken.length) return null;
    var vandaag = sethVandaag();
    if (vandaag < DAG.start) return null;
    var gisteren = datumPlus(vandaag, -1);
    var kanGisteren = gisteren >= DAG.start && dagTaken(gisteren).length > 0;
    if (UI.dagDatum !== gisteren || !kanGisteren) UI.dagDatum = null; // alleen gisteren is na te vinken
    var datum = UI.dagDatum || vandaag;
    var isGisteren = datum !== vandaag;
    var taken = dagTaken(datum);
    if (!taken.length) return null;
    var stand = dagStand(datum);
    var card;
    function opnieuw() { var nieuw = dagKaart(); if (nieuw && card) card.replaceWith(nieuw); }

    // alles af → ingeklapt tot één regel, net als de Seth-kaart
    if (!isGisteren && stand.gedaan === stand.totaal && UI.dagOpen !== vandaag) {
      card = el('<div class="card seth seth-dicht">' +
        '<button class="seth-dicht-main" aria-expanded="false"><span class="seth-vink">✓</span>' +
        '<span class="seth-dicht-txt">Vaste dingen</span>' +
        '<span class="tiny">' + stand.gedaan + '/' + stand.totaal + '</span></button></div>');
      card.querySelector('.seth-dicht-main').addEventListener('click', function () { UI.dagOpen = vandaag; opnieuw(); });
      return card;
    }

    var html = '<div class="card dag">' +
      '<div class="dag-kop"><span class="seth-thema">Vaste dingen' + (isGisteren ? ' · gisteren' : '') + '</span>' +
      '<span class="dag-stand">' + stand.gedaan + '/' + stand.totaal + '</span></div>';
    taken.forEach(function (t) {
      var aan = sethGedaan(datum, 'dag_' + t.id);
      html += '<button class="dag-rij' + (aan ? ' on' : '') + '" data-id="' + esc(t.id) + '" aria-pressed="' + aan + '">' +
        '<span class="seth-vink">✓</span>' +
        '<span class="dag-txt">' + esc(dagTekst(t, datum)) + '</span></button>';
    });

    // weekstrook ma–zo: vol = alles af, half = een deel
    var maandag = datumPlus(vandaag, -((new Date(vandaag + 'T12:00:00').getDay() + 6) % 7));
    var dots = '';
    for (var i = 0; i < 7; i++) {
      var d = datumPlus(maandag, i);
      var cls = '';
      if (d >= DAG.start && d <= vandaag) {
        var s = dagStand(d);
        if (s.totaal && s.gedaan === s.totaal) cls = ' on';
        else if (s.gedaan > 0) cls = ' half';
      }
      if (d === vandaag) cls += ' nu';
      dots += '<span class="seth-dot' + cls + '" title="' + esc(fmtDate(d)) + '"></span>';
    }
    var gStand = kanGisteren ? dagStand(gisteren) : null;
    var wissel = isGisteren
      ? '<button class="linkbtn dag-wissel">naar vandaag</button>'
      : (gStand && gStand.gedaan < gStand.totaal
        ? '<button class="linkbtn dag-wissel">gisteren ' + gStand.gedaan + '/' + gStand.totaal + '</button>' : '');
    var coach = dagCoach(vandaag);
    html += '<div class="seth-strook dag-strook" aria-label="Vaste dingen deze week">' + dots +
      '<span class="dag-voet">' + wissel + '</span></div>' +
      (coach ? '<div class="tiny dag-coach">' + esc(coach) + '</div>' : '') + '</div>';

    card = el(html);
    Array.prototype.forEach.call(card.querySelectorAll('.dag-rij'), function (b) {
      b.addEventListener('click', function () {
        var key = 'dag_' + b.getAttribute('data-id');
        var aan = !sethGedaan(datum, key);
        sethZet(datum, key, aan);
        if (aan && navigator.vibrate) { try { navigator.vibrate(10); } catch (e) { /* geen trilmotor */ } }
        if (!isGisteren && dagStand(datum).gedaan === taken.length) UI.dagOpen = null; // alles af → inklappen
        opnieuw();
      });
    });
    var wisselBtn = card.querySelector('.dag-wissel');
    if (wisselBtn) wisselBtn.addEventListener('click', function () { UI.dagDatum = isGisteren ? null : gisteren; opnieuw(); });
    return card;
  }

  function renderVandaag() {
    var root = $('#view');
    clear(root);
    var date = UI.date, dayKey = UI.dayKey;
    var day = P.days[dayKey];

    sethGetekend = sethVandaag(); // ook zonder Seth-kaart: bij terugkomst na middernacht opnieuw tekenen
    var rug = rugKaart(dayKey);
    if (rug) root.appendChild(rug);
    var seth = sethKaart();
    if (seth) root.appendChild(seth);
    var dag = dagKaart();
    if (dag) root.appendChild(dag);

    var picker = el('<div class="dayselect"><input type="date" value="' + esc(date) + '" aria-label="Datum"></div>');
    picker.querySelector('input').addEventListener('change', function () {
      if (!this.value) return;
      UI.date = this.value;
      UI.dayKey = dayKeyForDate(this.value);
      renderVandaag();
    });
    root.appendChild(picker);

    var chips = el('<div class="daychips"></div>');
    P.weekOrder.forEach(function (dk) {
      var d = P.days[dk];
      var c = el('<button class="daychip' + (dk === dayKey ? ' active' : '') + (d.rest ? ' rest' : '') + '">' + esc(d.label) +
        '<small>' + (d.rest ? 'rust' : esc((d.title.split('—')[1] || d.title).trim())) + '</small></button>');
      c.addEventListener('click', function () { UI.dayKey = dk; renderVandaag(); });
      chips.appendChild(c);
    });
    root.appendChild(chips);

    var nulmeting = nulmetingKaart();
    if (nulmeting) root.appendChild(nulmeting);

    var herstel = herstelKaart(date);
    if (herstel) root.appendChild(herstel);

    if (day.rest) {
      var idxR = P.weekOrder.indexOf(dayKey);
      var nextDay = null;
      for (var iR = 1; iR <= 7 && !nextDay; iR++) {
        var cand = P.days[P.weekOrder[(idxR + iR) % 7]];
        if (!cand.rest) nextDay = cand;
      }
      root.appendChild(el('<div class="card restcard"><div class="h1">Rustdag</div>' +
        '<div class="sub">Herstel is het plafond — vandaag bouw je.</div>' +
        (nextDay ? '<div class="sub" style="margin-top:10px;color:var(--accent)">Volgende training: ' + esc(nextDay.label + ' — ' + nextDay.title) + '</div>' : '') +
        '<div class="tiny" style="margin-top:10px">Toch trainen? Kies hierboven een andere dag — de sessie wordt op ' + esc(fmtDate(date)) + ' gelogd.</div></div>'));

      // rustdag mag optionele items hebben (bv. korte Zone 2 op zondag) — geen opener, geen focus-modus
      if (day.items && day.items.length) {
        var restSess = getSession(date, dayKey, false);
        root.appendChild(el('<div class="section-title">Optioneel</div>'));
        day.items.forEach(function (it) {
          root.appendChild(it.type === 'strength' ? strengthCard(date, dayKey, it) : checkCard(date, dayKey, it));
        });
        var restNote = el('<div class="card"><textarea class="ex-note" rows="2" placeholder="Notitie (hoe voel je je?)"></textarea></div>');
        var rta = restNote.querySelector('textarea');
        rta.value = (restSess && restSess.note) || '';
        rta.addEventListener('input', function () {
          getSession(date, dayKey, true).note = rta.value;
          markSessionDirty(date, dayKey);
        });
        root.appendChild(restNote);
      }
      return;
    }

    var sess = getSession(date, dayKey, false);

    // hero-dagkaart: voortgangsring links (sets gelogd / gepland), titel en status rechts
    var head = el('<div class="card hero">' +
      '<div class="hero-top">' +
      '<div class="hero-ring">' +
      '<svg viewBox="0 0 72 72" aria-hidden="true">' +
      '<defs><linearGradient id="ringgrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#35e0ff"/><stop offset="100%" stop-color="#a3ff4e"/>' +
      '</linearGradient></defs>' +
      '<circle class="ring-bg" cx="36" cy="36" r="31"/>' +
      '<circle class="ring-fg" id="dayRing" cx="36" cy="36" r="31" stroke-dasharray="' + RING_C.toFixed(1) + '" stroke-dashoffset="' + RING_C.toFixed(1) + '"/>' +
      '</svg>' +
      '<div class="ring-txt"><span class="ring-pct" id="dayPct">0%</span><span class="ring-lbl">klaar</span></div>' +
      '</div>' +
      '<div class="hero-main">' +
      '<div class="hero-title">' + esc(day.title) + '</div>' +
      '<div class="hero-sub">' + esc(day.sub || '') + '</div>' +
      '<div class="pillrow">' +
      '<span class="badge badge-erector-' + esc(day.erector.toLowerCase().replace(/\s+/g, '-')) + '">erector ' + esc(day.erector) + '</span>' +
      '<span class="badge badge-power">' + esc(day.power) + '</span>' +
      '</div>' +
      '<div class="tiny hero-prog" id="dayProgress"></div>' +
      '</div></div>' +
      (day.warn ? '<div class="callout"><span class="ic">⚠</span><span>' + esc(day.warn) + '</span></div>' : '') +
      '</div>');
    root.appendChild(head);

    // atleet-fase: inklapbaar zodat de compound-kern direct in beeld staat
    var skeyOpener = sessKey(date, dayKey);
    var openerChecked = 0;
    if (sess && sess.opener) Object.keys(sess.opener).forEach(function (bk) { openerChecked += Object.keys(sess.opener[bk]).length; });
    var openerOpen = UI.openerOpen === skeyOpener;
    var opener = el('<div class="card">' +
      '<button class="opener-toggle" aria-expanded="' + openerOpen + '">' +
      '<span><span class="h2">' + esc(P.opener.title) + '</span> <span class="tiny">· 15–18 min</span></span>' +
      '<span class="opener-count"><span class="badge"><span class="opener-n">' + openerChecked + '</span> ✓</span><span class="chev">' + (openerOpen ? '▾' : '▸') + '</span></span>' +
      '</button>' +
      '<div class="opener-body"' + (openerOpen ? '' : ' hidden') + '><div class="tiny" style="margin-top:4px">' + esc(P.opener.sub) + '</div></div>' +
      '</div>');
    var openerBody = opener.querySelector('.opener-body');
    var openerToggle = opener.querySelector('.opener-toggle');
    openerToggle.addEventListener('click', function () {
      var open = openerBody.hidden;
      openerBody.hidden = !open;
      UI.openerOpen = open ? skeyOpener : null;
      openerToggle.setAttribute('aria-expanded', open);
      opener.querySelector('.chev').textContent = open ? '▾' : '▸';
    });
    P.opener.blocks.forEach(function (block) {
      // een blok zonder items voor vandaag niet tonen
      if (!block.items.some(function (oi) { return !oi.days || oi.days.indexOf(dayKey) >= 0; })) return;
      var blockEl = el('<div class="opener-block"><div class="opener-head"><span class="h2">' + esc(block.title) + '</span><span class="tiny">' + esc(block.sub) + '</span></div><div class="chiprow"></div></div>');
      if (block.key === 'power' && (dayKey === 'ma' || dayKey === 'do')) {
        blockEl.insertBefore(el('<div class="callout" style="margin:2px 0 8px"><span class="ic">⚠</span><span>Zware til-dag: houd power licht of sla over.</span></div>'), blockEl.querySelector('.chiprow'));
      }
      var row = blockEl.querySelector('.chiprow');
      // vast voorgeschreven per dag: toon alleen wat vandaag aan de beurt is
      block.items.filter(function (oi) {
        return !oi.days || oi.days.indexOf(dayKey) >= 0;
      }).forEach(function (oi) {
        var naam = oi.name, why = oi.why || '';
        var on = !!(sess && sess.opener && sess.opener[block.key] && sess.opener[block.key][naam]);
        var chip = el('<button class="oitem' + (on ? ' on' : '') + '">' +
          '<span class="oitem-box">✓</span>' +
          '<span class="oitem-txt"><b>' + esc(naam) + '</b>' + (why ? '<small>' + esc(why) + '</small>' : '') + '</span>' +
          '</button>');
        chip.addEventListener('click', function () {
          var s2 = getSession(date, dayKey, true);
          if (!s2.opener[block.key]) s2.opener[block.key] = {};
          s2.opener[block.key][naam] = !s2.opener[block.key][naam];
          if (!s2.opener[block.key][naam]) delete s2.opener[block.key][naam];
          markSessionDirty(date, dayKey);
          chip.classList.toggle('on');
          var n = 0;
          Object.keys(s2.opener).forEach(function (bk) { n += Object.keys(s2.opener[bk]).length; });
          opener.querySelector('.opener-n').textContent = n;
        });
        row.appendChild(chip);
        // een <a> mag niet in een <button>, dus de techniek-link komt naast de chip
        if (oi.video) {
          row.appendChild(el('<a class="oitem-video" href="' + esc(oi.video) +
            '" target="_blank" rel="noopener noreferrer">▶ techniek</a>'));
        }
      });
      openerBody.appendChild(blockEl);
    });
    root.appendChild(opener);

    var groups = [];
    day.items.forEach(function (it) {
      if (groups.indexOf(it.group) < 0) groups.push(it.group);
    });
    groups.forEach(function (g) {
      root.appendChild(el('<div class="section-title">' + esc(g) + '</div>'));
      day.items.filter(function (it) { return it.group === g; }).forEach(function (it) {
        root.appendChild(it.type === 'strength' ? strengthCard(date, dayKey, it) : checkCard(date, dayKey, it));
      });
    });

    root.appendChild(el('<div class="section-title">Sessie</div>'));
    var noteCard = el('<div class="card"><textarea class="ex-note" rows="2" placeholder="Hoe ging de sessie? (energie, pijntjes, opmerkingen)"></textarea></div>');
    var ta = noteCard.querySelector('textarea');
    ta.value = (sess && sess.note) || '';
    ta.addEventListener('input', function () {
      var s2 = getSession(date, dayKey, true);
      s2.note = ta.value;
      markSessionDirty(date, dayKey);
    });
    root.appendChild(noteCard);

    // primaire actie: plakt onderaan het scherm boven de tabbar, verdwijnt in workout-modus
    var startBtn = el('<button class="cta-start">▶ Start workout-modus</button>');
    startBtn.addEventListener('click', function () { enterFocus(0); });
    root.appendChild(startBtn);

    updateDayProgress();
  }

  /* Naam-doel-cue-blok. `doel` zegt waaróm, `cue` wat je nu doet. De cue is afgekapt
     op 3 regels met een "meer…"-knop; zo staat het eerste invulveld altijd binnen bereik. */
  function cueBlok(item) {
    if (!item.doel && !item.cue) return null;
    var wrap = el('<div class="ex-text">' +
      (item.doel ? '<div class="ex-doel">' + esc(item.doel) + '</div>' : '') +
      (item.cue ? '<div class="ex-cue clamp">' + esc(item.cue) + '</div>' : '') +
      '</div>');
    var cue = wrap.querySelector('.ex-cue');
    if (cue) {
      var more = el('<button class="cue-more">meer…</button>');
      more.hidden = true; // pas tonen als de tekst echt niet past
      more.addEventListener('click', function () {
        var open = cue.classList.toggle('open');
        cue.classList.toggle('clamp', !open);
        more.textContent = open ? 'minder' : 'meer…';
      });
      wrap.appendChild(more);
      // meerdere keren meten: vlak na het tekenen zijn de fontmetrics soms nog niet klaar
      // en lijkt een cue van 2 regels er 4 — de knop mag dan weer verdwijnen.
      function meet() {
        if (!cue.classList.contains('clamp')) return; // uitgeklapt door de gebruiker
        more.hidden = !(cue.scrollHeight - cue.clientHeight > 2);
      }
      requestAnimationFrame(meet);
      setTimeout(meet, 350);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(meet).catch(function () {});
    }
    return wrap;
  }

  // reps-voorstel uit het programma-target, maar nooit uit een afstand/tijd-target
  function repsVoorstel(item) {
    var t = String(item.target || '');
    if (!t || /\bm\b|sec|min/i.test(t)) return '';
    var r = parseTarget(t);
    return r ? String(r.min) : '';
  }

  function strengthCard(date, dayKey, item) {
    var skey = sessKey(date, dayKey);
    var sess = getSession(date, dayKey, false);
    var logged = sess && sess.items && sess.items[item.key];
    var unit = item.unit || 'kg'; // CMJ logt centimeters in plaats van kilo's

    var card = el('<div class="card ex">' +
      '<div class="ex-head"><div class="ex-name">' + esc(item.name) + '</div>' +
      '<span class="badge badge-target">' + esc(String(item.sets || '')) + ' × ' + (item.target ? esc(item.target) : 'vrij') + '</span></div>' +
      '</div>');
    var tekst = cueBlok(item);
    if (tekst) card.appendChild(tekst);

    var vrs = videoRegel(item);
    if (vrs) card.appendChild(vrs);

    var prev = prevSessionFor(item.key, date, skey);
    var prevItem = prev ? prev.items[item.key] : null;
    if (prevItem) {
      var summary = setsSummary(prevItem, unit);
      if (summary) card.appendChild(el('<div class="ex-prev">Vorige (' + esc(fmtDate(prev.date)) + '): <b>' + esc(summary) + '</b>' +
        (prevItem.note ? ' · „' + esc(prevItem.note) + '”' : '') + '</div>'));
    }
    // alleen adviseren zolang je vandaag nog niets gelogd hebt
    var alGelogd = logged && (logged.sets || []).some(function (s) { return num(s.kg) != null || num(s.reps) != null; });
    var advies = null;
    if (!alGelogd) {
      advies = progressieAdvies(item, prevItem);
      if (advies) card.appendChild(el('<div class="ex-next' + (advies.op ? ' ex-next-up' : '') + (advies.power ? ' ex-next-power' : '') + '">' +
        (advies.op ? '▲ ' : '→ ') + esc(advies.tekst) + '</div>'));
    }

    var rows = el('<div class="setrows"></div>');
    card.appendChild(rows);

    var nSets = Math.max(item.sets || 0, logged && logged.sets ? logged.sets.length : 0);
    function prevSet(i) {
      if (!prevItem) return null;
      var ps = prevItem.sets || [];
      return ps[i] && (ps[i].kg !== '' || ps[i].reps !== '') ? ps[i] : null;
    }

    // Wat de app voorstelt in het eerste veld: het advies, anders wat je vorige keer deed.
    // Bij een andere eenheid dan kg (hoogte) stelt de app NIETS voor — die meet je vers,
    // anders log je stilzwijgend de hoogte van vorige week.
    function suggestieKg(ph) {
      if (unit !== 'kg') return '';
      if (advies && advies.kg != null) return fmtNum(advies.kg);
      if (ph && ph.kg !== '' && ph.kg != null) return fmtNum(num(ph.kg));
      return '';
    }
    function suggestieReps(ph) {
      if (ph && ph.reps !== '' && ph.reps != null) return fmtNum(num(ph.reps));
      return repsVoorstel(item);
    }
    function voorstelLabel(ph) {
      var fk = suggestieKg(ph), fr = suggestieReps(ph);
      if (fk && fr) return '✓ ' + fk + ' × ' + fr;
      if (fk) return '✓ ' + fk;
      if (fr) return '✓ ' + fr;
      return '✓';
    }
    // FR-001: de ✓-knop laat zien wát hij logt. De kolombreedte zetten we één keer vast
    // op het langste voorstel, zodat de rijen niet verspringen zodra je er een afvinkt.
    var maxChars = 1;
    for (var j = 0; j < nSets; j++) {
      var lj = voorstelLabel(prevSet(j));
      if (lj.length > maxChars) maxChars = lj.length;
    }
    rows.style.setProperty('--donew', Math.round(Math.max(56, 18 + maxChars * 7.4)) + 'px');

    function setRow(i) {
      var st = (logged && logged.sets && logged.sets[i]) || { kg: '', reps: '', done: false };
      var ph = prevSet(i);
      var valPh = unit === 'kg' ? (suggestieKg(ph) || 'kg') : unit;
      var valAria = (unit === 'kg' ? 'Gewicht set ' : 'Hoogte set ') + (i + 1) + ' in ' + unit;
      var row = el('<div class="setrow">' +
        '<span class="setnum">' + (i + 1) + '</span>' +
        '<input class="in-val" type="text" inputmode="decimal" placeholder="' + esc(valPh) + '" aria-label="' + esc(valAria) + '">' +
        '<input class="in-reps" type="text" inputmode="numeric" placeholder="' + esc(suggestieReps(ph) || 'reps') + '" aria-label="Reps set ' + (i + 1) + '">' +
        '<button class="setdone' + (st.done ? ' on' : '') + '" aria-label="Set ' + (i + 1) + ' loggen">✓</button>' +
        '</div>');
      var kgIn = row.querySelector('.in-val'), repsIn = row.querySelector('.in-reps'), doneBtn = row.querySelector('.setdone');
      kgIn.value = st.kg === '' ? '' : fmtNum(num(st.kg));
      repsIn.value = st.reps === '' ? '' : fmtNum(num(st.reps));

      function paintBtn() {
        var aan = doneBtn.classList.contains('on');
        var leeg = kgIn.value === '' && repsIn.value === '';
        var lab = (!aan && leeg) ? voorstelLabel(ph) : '✓';
        doneBtn.textContent = lab;
        doneBtn.classList.toggle('has-sug', lab.length > 1);
        row.classList.toggle('row-done', aan);
      }
      paintBtn();

      function write(field, value) {
        var s2 = getSession(date, dayKey, true);
        var it2 = ensureItem(s2, item);
        while (it2.sets.length <= i) it2.sets.push({ kg: '', reps: '', done: false });
        it2.sets[i][field] = value;
        logged = it2;
        markSessionDirty(date, dayKey);
      }
      kgIn.addEventListener('input', function () { write('kg', kgIn.value.trim()); paintBtn(); });
      repsIn.addEventListener('input', function () { write('reps', repsIn.value.trim()); paintBtn(); });
      doneBtn.addEventListener('click', function () {
        var turningOn = !doneBtn.classList.contains('on');
        // snelle log: leeg veld → neem over wat de knop aankondigde
        var fillKg = suggestieKg(ph), fillReps = suggestieReps(ph);
        if (turningOn && kgIn.value === '' && fillKg) { kgIn.value = fillKg; write('kg', kgIn.value); }
        if (turningOn && repsIn.value === '' && fillReps) { repsIn.value = fillReps; write('reps', repsIn.value); }
        write('done', turningOn);
        doneBtn.classList.toggle('on', turningOn);
        doneBtn.classList.add('pop');
        setTimeout(function () { doneBtn.classList.remove('pop'); }, 160);
        paintBtn();
        refreshDoneState();
        if (turningOn) onSetCompleted(); // rust-timer start automatisch (indien aan)
      });
      return row;
    }

    // lime rand zodra alle programma-sets afgevinkt zijn — voortgang in één oogopslag
    function refreshDoneState() {
      var prog = logged && logged.sets ? logged.sets.slice(0, item.sets || 0) : [];
      card.classList.toggle('ex-done', prog.length > 0 && prog.every(function (st) { return st.done; }));
    }

    for (var i = 0; i < nSets; i++) {
      rows.appendChild(setRow(i));
    }
    refreshDoneState();

    var foot = el('<div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px">' +
      '<span><button class="linkbtn">+ extra set</button><button class="linkbtn" style="margin-left:14px">– set</button></span>' +
      '<button class="linkbtn">notitie</button></div>');
    var btns = foot.querySelectorAll('.linkbtn');
    var addBtn = btns[0], delBtn = btns[1], noteBtn = btns[2];
    addBtn.addEventListener('click', function () {
      var s2 = getSession(date, dayKey, true);
      var it2 = ensureItem(s2, item);
      it2.sets.push({ kg: '', reps: '', done: false });
      logged = it2;
      markSessionDirty(date, dayKey);
      rows.appendChild(setRow(it2.sets.length - 1));
      refreshDoneState();
    });
    delBtn.addEventListener('click', function () {
      var s2 = getSession(date, dayKey, false);
      var it2 = s2 && s2.items && s2.items[item.key];
      if (!it2 || it2.sets.length <= (item.sets || 0)) { toast('Alleen extra sets kun je verwijderen'); return; }
      var last = it2.sets[it2.sets.length - 1];
      if (num(last.kg) != null || num(last.reps) != null || last.done) { toast('Laatste set is niet leeg — maak hem eerst leeg'); return; }
      it2.sets.pop();
      logged = it2;
      markSessionDirty(date, dayKey);
      if (rows.lastElementChild) rows.lastElementChild.remove();
      refreshDoneState();
    });
    card.appendChild(foot);

    var noteTa = el('<textarea class="ex-note" rows="1" placeholder="Notitie bij ' + esc(item.name) + '…"></textarea>');
    noteTa.value = (logged && logged.note) || '';
    noteTa.hidden = !noteTa.value;
    noteBtn.addEventListener('click', function () {
      noteTa.hidden = false;
      noteTa.focus();
    });
    noteTa.addEventListener('input', function () {
      var s2 = getSession(date, dayKey, true);
      var it2 = ensureItem(s2, item);
      it2.note = noteTa.value;
      logged = it2;
      markSessionDirty(date, dayKey);
    });
    card.appendChild(noteTa);
    return card;
  }

  /* Techniek-link + aandachtspunt. Staat bij oefeningen waar "hoe doe ik dit"
     de rem is (sprint, COD, shuffle, reactief, carry) — niet bij squat en bank. */
  function videoRegel(item) {
    if (!item.video && !item.let) return null;
    var html = '<div class="ex-video">';
    if (item.video) {
      html += '<a href="' + esc(item.video) + '" target="_blank" rel="noopener noreferrer">▶ techniek</a>';
      if (item.let) html += '<span class="sep">·</span>';
    }
    if (item.let) html += '<span class="let">' + esc(item.let) + '</span>';
    return el(html + '</div>');
  }

  function checkCard(date, dayKey, item) {
    var sess = getSession(date, dayKey, false);
    var logged = sess && sess.items && sess.items[item.key];
    var on = !!(logged && logged.done);

    var card = el('<div class="card ex check"><div class="checkline">' +
      '<button class="bigcheck' + (on ? ' on' : '') + '" aria-label="' + esc(item.name) + ' klaar">✓</button>' +
      '<div class="ex-main">' +
      '<div class="ex-head"><div class="ex-name">' + esc(item.name) + '</div>' +
      (item.target ? '<span class="badge badge-target">' + esc(item.target) + '</span>' : '') + '</div>' +
      '<textarea class="ex-note" rows="1" placeholder="Notitie (bv. afstand, tijd, gewicht)…"></textarea></div>' +
      '</div></div>');
    var tav = card.querySelector('textarea');
    var tekst = cueBlok(item);
    if (tekst) tav.parentNode.insertBefore(tekst, tav);
    var vr = videoRegel(item);
    // vóór het notitieveld, zodat de cue en de techniek bij elkaar staan
    if (vr) tav.parentNode.insertBefore(vr, tav);

    var btn = card.querySelector('.bigcheck');
    var ta = card.querySelector('textarea');
    ta.value = (logged && logged.note) || '';

    btn.addEventListener('click', function () {
      var s2 = getSession(date, dayKey, true);
      var it2 = ensureItem(s2, item);
      it2.done = !it2.done;
      markSessionDirty(date, dayKey);
      btn.classList.toggle('on', it2.done);
      card.classList.toggle('ex-done', it2.done);
    });
    ta.addEventListener('input', function () {
      var s2 = getSession(date, dayKey, true);
      var it2 = ensureItem(s2, item);
      it2.note = ta.value;
      markSessionDirty(date, dayKey);
    });
    card.classList.toggle('ex-done', on);
    return card;
  }

  /* ---------------- View: Week ---------------- */
  // datums van de lopende ISO-week (maandag t/m zondag) bij een gegeven dag
  function weekDatums(vanDatum) {
    var d = new Date(vanDatum + 'T12:00:00');
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // terug naar maandag
    var out = {};
    P.weekOrder.forEach(function (dk, i) {
      var x = new Date(d.getTime());
      x.setDate(d.getDate() + i);
      out[dk] = x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
    });
    return out;
  }
  /* FR-008 — ✓ gedaan · – voorbij zonder data · ○ nog te doen · rustdag zegt "rust". */
  function dagStatus(dk, datum, vandaag) {
    var d = P.days[dk];
    if (sessionHasData(getSession(datum, dk, false))) return { g: '✓', kl: 'st-done', txt: 'gedaan' };
    if (d.rest) return { g: '–', kl: 'st-rest', txt: 'rust' };
    if (datum < vandaag) return { g: '–', kl: 'st-miss', txt: 'niet gelogd' };
    return { g: '○', kl: 'st-todo', txt: datum === vandaag ? 'vandaag' : 'gepland' };
  }

  /* Bijsturing — wekelijkse terugkoppeling op training, herstel en voeding. Komt binnen als
     metric 'bijsturing': de tekst staat in note, één punt per regel, de eerste regel is de
     focus van de week. Alleen-lezen in de app; de tekst gaat altijd door esc(). */
  function bijsturingKaart() {
    var s = Object.keys(S.metrics).map(function (k) { return S.metrics[k]; })
      .filter(function (m) { return m.key === 'bijsturing' && m.note; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (!s.length) return null;
    var m = s[s.length - 1];
    var regels = String(m.note).slice(0, 600).split('\n')
      .map(function (r) { return r.trim(); }).filter(Boolean).slice(0, 4);
    if (!regels.length) return null;
    var html = '<div class="card bij"><div class="dag-kop"><span class="seth-thema">Bijsturing</span>' +
      '<span class="tiny">' + esc(fmtDate(m.date)) + '</span></div>' +
      '<div class="bij-focus">' + esc(regels[0]) + '</div>';
    regels.slice(1).forEach(function (r) { html += '<div class="tiny bij-regel">' + esc(r) + '</div>'; });
    return el(html + '</div>');
  }

  // inklapbare sectie: uitleg die je zelden nodig hebt staat dicht
  function meer(titel) {
    return el('<details class="meer"><summary>' + esc(titel) + '</summary></details>');
  }

  function renderWeek() {
    var root = $('#view');
    clear(root);
    var vandaag = todayStr();

    var bij = bijsturingKaart();
    if (bij) root.appendChild(bij);
    var datums = weekDatums(vandaag);
    var wp = isoWeekParts(vandaag);

    root.appendChild(el('<div class="section-title">Week ' + wp.week + ' · deze week</div>'));
    var card = el('<div class="card"><div class="weeklist"></div></div>');
    var list = card.querySelector('.weeklist');
    P.weekOrder.forEach(function (dk) {
      var d = P.days[dk];
      var datum = datums[dk];
      var st = dagStatus(dk, datum, vandaag);
      var meta = d.rest
        ? ((d.items && d.items.length) ? 'optioneel: ' + d.items.map(function (i) { return i.name; }).join(', ') : 'rust')
        : d.compound + ' · ' + d.power + ' · erector ' + d.erector;
      var row = el('<button class="weekrow' + (datum === vandaag ? ' wnow' : '') + '">' +
        '<span class="wstat ' + st.kl + '" aria-label="' + esc(st.txt) + '">' + esc(st.g) + '</span>' +
        '<span class="wbody">' +
        '<span class="wtop"><b>' + esc(d.label) + '</b><span class="wdate">' + esc(fmtDate(datum).slice(3)) + '</span>' +
        '<span class="wtag ' + st.kl + '">' + esc(st.txt) + '</span></span>' +
        '<span class="wtitle">' + esc(d.rest ? 'Vrij — rust of inhalen' : d.title) + '</span>' +
        '<span class="wmeta">' + esc(meta) + '</span>' +
        '</span></button>');
      row.addEventListener('click', function () {
        UI.date = datum;
        UI.dayKey = dk;
        UI.view = 'vandaag';
        setActiveTab();
        renderVandaag();
        window.scrollTo(0, 0);
      });
      list.appendChild(row);
    });
    root.appendChild(card);

    var regel = meer('Weekregel');
    regel.appendChild(el('<div class="card"><div class="tiny">' + esc(P.weekRule) + '</div></div>'));
    root.appendChild(regel);

    var fase = meer(P.opener.title);
    var op = el('<div class="card"><div class="tiny">' + esc(P.opener.sub) + '</div></div>');
    P.opener.blocks.forEach(function (b) {
      op.appendChild(el('<div style="margin-top:10px"><div class="opener-head"><span class="h2">' + esc(b.title) + '</span><span class="tiny">' + esc(b.sub) + '</span></div>' +
        '<div class="sub">' + esc(b.items.map(function (i) { return i.name; }).join(' · ')) + '</div>' +
        (b.warn ? '<div class="callout"><span class="ic">⚠</span><span>' + esc(b.warn) + '</span></div>' : '') + '</div>'));
    });
    fase.appendChild(op);
    root.appendChild(fase);
  }

  /* ---------------- View: Historie ---------------- */
  function renderHistorie() {
    var root = $('#view');
    clear(root);

    var seg = el('<div class="segrow">' +
      '<button class="seg' + (UI.histMode === 'sessies' ? ' active' : '') + '">Sessies</button>' +
      '<button class="seg' + (UI.histMode === 'oefening' ? ' active' : '') + '">Per oefening</button></div>');
    seg.children[0].addEventListener('click', function () { UI.histMode = 'sessies'; renderHistorie(); });
    seg.children[1].addEventListener('click', function () { UI.histMode = 'oefening'; renderHistorie(); });
    root.appendChild(seg);

    if (UI.histMode === 'sessies') {
      var list = sessionsSorted().filter(sessionHasData);
      if (!list.length) {
        root.appendChild(el('<div class="card"><div class="sub">Nog geen sessies gelogd. Je eerste ingevulde workout verschijnt hier.</div></div>'));
        return;
      }
      list.forEach(function (s) {
        var day = P.days[s.dayKey] || { title: s.dayKey, label: s.dayKey };
        var nSets = 0;
        Object.keys(s.items || {}).forEach(function (k) {
          var it = s.items[k];
          (it.sets || []).forEach(function (st) {
            if (num(st.kg) != null || num(st.reps) != null) nSets++;
          });
        });
        var card = el('<div class="card histcard">' +
          '<div class="hist-head"><span class="h2">' + esc(fmtDate(s.date)) + ' — ' + esc(day.title) + '</span><span class="tiny">›</span></div>' +
          '<div class="hist-sets">' + nSets + ' sets gelogd' + (s.note ? ' · „' + esc(s.note.length > 70 ? s.note.slice(0, 70) + '…' : s.note) + '”' : '') + '</div>' +
          '</div>');
        card.addEventListener('click', function () {
          UI.date = s.date;
          UI.dayKey = s.dayKey;
          UI.view = 'vandaag';
          setActiveTab();
          renderVandaag();
          window.scrollTo(0, 0);
        });
        root.appendChild(card);
      });
      root.appendChild(el('<div class="tiny" style="margin:4px 4px 10px">Tik een sessie om te bekijken of te corrigeren.</div>'));
    } else {
      var items = allStrengthItems();
      var selCard = el('<div class="card"><select class="input" aria-label="Kies oefening"></select></div>');
      var sel = selCard.querySelector('select');
      items.forEach(function (it) {
        var o = document.createElement('option');
        o.value = it.key;
        o.textContent = it.name + ' (' + it.day + ')';
        if (it.key === UI.histEx) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', function () { UI.histEx = sel.value; renderHistorie(); });
      root.appendChild(selCard);

      var hits = sessionsSorted().filter(function (s) {
        return s.items && s.items[UI.histEx] && itemHasData(s.items[UI.histEx]);
      });
      if (!hits.length) {
        root.appendChild(el('<div class="card"><div class="sub">Nog niets gelogd voor deze oefening.</div></div>'));
        return;
      }
      var histUnit = unitForKey(UI.histEx);
      hits.slice(0, 12).forEach(function (s) {
        var it = s.items[UI.histEx];
        root.appendChild(el('<div class="card">' +
          '<div class="hist-head"><span class="h2">' + esc(fmtDate(s.date)) + '</span></div>' +
          '<div class="hist-sets">' + esc(setsSummary(it, histUnit) || '—') + (it.note ? '<br>„' + esc(it.note) + '”' : '') + '</div></div>'));
      });
    }
  }

  /* ---------------- View: Ankers ---------------- */
  function metricAddRow(key, unit, defaultDate) {
    var row = el('<div class="metric-add">' +
      '<input type="date" value="' + esc(defaultDate) + '" aria-label="Datum">' +
      '<input type="text" inputmode="decimal" placeholder="' + esc(unit) + '" aria-label="Waarde">' +
      '<button class="btn">Log</button></div>');
    var dateIn = row.children[0], valIn = row.children[1], btn = row.children[2];
    btn.addEventListener('click', function () {
      var v = num(valIn.value);
      if (v == null || !dateIn.value) { toast('Vul een waarde in'); return; }
      var k = dateIn.value + '|' + key;
      S.metrics[k] = { date: dateIn.value, key: key, value: v, note: '', updatedAt: nowIso() };
      markMetricDirty(k);
      toast('Gelogd: ' + fmtNum(v) + ' ' + unit);
      renderAnkers();
    });
    return row;
  }

  function renderAnkers() {
    var root = $('#view');
    clear(root);
    var today = todayStr();

    root.appendChild(el('<div class="section-title">Functie-ankers · elke 4 weken</div>'));
    root.appendChild(el('<div class="tiny" style="margin:-4px 4px 10px">Dragen, hangen, duwen en volhouden. Meet ze binnen je gewone training.</div>'));
    P.anchors.athletic.forEach(function (a) {
      var card = el('<div class="card"><div class="h2">' + esc(a.label) + '</div><div class="tiny">' + esc(a.hint) + '</div></div>');
      card.appendChild(metricAddRow(a.key, a.unit, today));
      var series = metricSeries(a.key);
      card.appendChild(lineChart(series.map(function (m) { return { label: fmtDate(m.date), value: m.value }; }), a.unit));
      root.appendChild(card);
    });

    root.appendChild(el('<div class="section-title">Lichaam · wekelijks</div>'));
    var wCard = el('<div class="card"><div class="h2">Lichaamsgewicht</div><div class="tiny">Doel: +0,2 kg per week bij dezelfde taille</div></div>');
    wCard.appendChild(metricAddRow('weight', 'kg', today));
    var wSeries = metricSeries('weight');
    wCard.appendChild(lineChart(wSeries.map(function (m) { return { label: fmtDate(m.date), value: m.value }; }), 'kg'));
    if (wSeries.length) {
      var wt = el('<table class="minitable"><tbody></tbody></table>');
      var wtb = wt.querySelector('tbody');
      wSeries.slice(-5).reverse().forEach(function (m) {
        wtb.appendChild(el('<tr><td>' + esc(fmtDate(m.date)) + '</td><td>' + fmtNum(m.value) + ' kg</td></tr>'));
      });
      wCard.appendChild(wt);
    }
    root.appendChild(wCard);

    var tCard = el('<div class="card"><div class="h2">Taille</div><div class="tiny">Meet bij elke weging: op navelhoogte, na uitademen. Het doel is zwaarder worden bij dezelfde taille.</div></div>');
    tCard.appendChild(metricAddRow('waist', 'cm', today));
    tCard.appendChild(lineChart(metricSeries('waist').map(function (m) { return { label: fmtDate(m.date), value: m.value }; }), 'cm'));
    root.appendChild(tCard);

    root.appendChild(el('<div class="section-title">Kracht — ondersteunend</div>'));
    root.appendChild(el('<div class="tiny" style="margin:-4px 4px 10px">Afgeleid uit je sets: het zwaarste van elke week.</div>'));
    var noData = [];
    P.anchors.strength.forEach(function (a) {
      var series = weeklyTopSets(a.key);
      if (!series.length) { noData.push(a.label); return; }
      var laatste = series[series.length - 1];
      // bodyweight-oefening (alles op 0 kg) → volg de reps i.p.v. het gewicht
      var bw = series.every(function (t) { return t.kg === 0; });
      var u = unitForKey(a.key); // CMJ staat hier in cm, niet in kg
      var card = el('<div class="card"><div class="ex-head"><div class="h2">' + esc(a.label) + '</div>' +
        '<span class="badge badge-target">' + (bw
          ? esc(fmtNum(laatste.reps) + ' reps')
          : esc(fmtNum(laatste.kg) + ' ' + u + ' × ' + fmtNum(laatste.reps))) + '</span>' +
        '</div></div>');
      card.appendChild(lineChart(series.map(function (t) {
        return bw
          ? { label: 'wk ' + t.week, value: t.reps, sub: fmtNum(t.reps) + ' reps bodyweight (' + fmtDate(t.date) + ')' }
          : { label: 'wk ' + t.week, value: t.kg, sub: fmtNum(t.kg) + ' ' + u + ' × ' + fmtNum(t.reps) + ' (' + fmtDate(t.date) + ')' };
      }), bw ? 'reps' : u));
      root.appendChild(card);
    });
    if (noData.length) {
      // lege ankers samenvouwen: geen muur van "nog geen data"-kaarten
      root.appendChild(el('<div class="card"><div class="tiny">Nog zonder data (vullen zichzelf zodra je sets logt): <b>' + esc(noData.join(' · ')) + '</b></div></div>'));
    }

    root.appendChild(el('<div class="section-title">12-weken evaluatie</div>'));
    var rem = el('<div class="card"><ul class="infolist"></ul></div>');
    P.anchors.reminders.forEach(function (r) {
      rem.querySelector('ul').appendChild(el('<li>◆ ' + esc(r) + '</li>'));
    });
    var exRow = el('<div class="exportrow"><button class="btn btn-ghost">Export CSV</button><button class="btn btn-ghost">Export JSON</button></div>');
    exRow.children[0].addEventListener('click', exportCSV);
    exRow.children[1].addEventListener('click', exportJSON);
    rem.appendChild(exRow);
    root.appendChild(rem);
  }

  /* ---------------- Export ---------------- */
  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }
  function exportJSON() {
    download('piekatleet-export-' + todayStr() + '.json',
      JSON.stringify({ exported: nowIso(), program: 'PiekAtleet ' + P.meta.version, sessions: S.sessions, metrics: S.metrics }, null, 2),
      'application/json');
    toast('JSON-export gedownload');
  }
  function exportCSV() {
    var lines = ['datum;dag;oefening;set;kg;reps;klaar;notitie'];
    sessionsSorted().reverse().forEach(function (s) {
      var day = P.days[s.dayKey] || { title: s.dayKey };
      Object.keys(s.items || {}).forEach(function (k) {
        var found = findProgramItem(k);
        var name = found ? found.item.name : ((P.retired && P.retired[k]) || k);
        var it = s.items[k];
        if (it.sets && it.sets.length) {
          it.sets.forEach(function (st, i) {
            if (num(st.kg) == null && num(st.reps) == null && !st.done) return;
            lines.push([s.date, day.title, name, i + 1, fmtNum(num(st.kg)), fmtNum(num(st.reps)), st.done ? 'ja' : '', (it.note || '').replace(/[;\n\r]/g, ' ')].join(';'));
          });
        } else if (it.done || it.note) {
          lines.push([s.date, day.title, name, '', '', '', it.done ? 'ja' : '', (it.note || '').replace(/[;\n\r]/g, ' ')].join(';'));
        }
      });
      if (s.note) lines.push([s.date, day.title, 'SESSIE-NOTITIE', '', '', '', '', s.note.replace(/[;\n\r]/g, ' ')].join(';'));
    });
    lines.push('');
    lines.push('datum;meting;waarde;notitie');
    Object.keys(S.metrics).sort().forEach(function (k) {
      var m = S.metrics[k];
      var label = m.key;
      [].concat(P.anchors.athletic, P.anchors.body).forEach(function (a) { if (a.key === m.key) label = a.label; });
      if (m.key === 'seth_kaart') label = 'Seth-kaart gedaan';
      if (m.key === 'seth_avond') label = 'Avondcheck gedaan';
      if (DAG && m.key.indexOf('dag_') === 0) {
        DAG.taken.forEach(function (t) { if ('dag_' + t.id === m.key) label = 'Vaste dingen: ' + t.kort; });
      }
      lines.push([m.date, label, fmtNum(m.value), (m.note || '').replace(/[;\n\r]/g, ' ')].join(';'));
    });
    download('piekatleet-export-' + todayStr() + '.csv', '﻿' + lines.join('\r\n'), 'text/csv');
    toast('CSV-export gedownload');
  }

  /* ---------------- View: Info ---------------- */
  function renderInfo() {
    var root = $('#view');
    clear(root);

    var m = P.meta;
    root.appendChild(el('<div class="card">' +
      '<div class="h1">' + esc(m.name) + ' <span style="color:var(--accent)">' + esc(m.version) + '</span></div>' +
      '<div class="sub" style="margin-bottom:8px">— ' + esc(m.motto) + '</div>' +
      '<div class="kv"><b>Atleet</b><span>' + esc(m.athlete) + '</span></div>' +
      '<div class="kv"><b>Blok</b><span>' + esc(m.block) + '</span></div>' +
      '<div class="kv"><b>Voeding</b><span>' + esc(m.nutritionShort) + '</span></div>' +
      '<div class="kv"><b>Zwakke punten</b><span>' + esc(m.weakPoints) + '</span></div>' +
      '</div>'));

    root.appendChild(el('<div class="section-title">Instellingen</div>'));
    var setCard = el('<div class="card"></div>');
    var autoRow = el('<div class="set-row"><div><b>Rust-timer automatisch</b><div class="tiny">Start zodra je een set afvinkt</div></div><button class="toggle" role="switch" aria-label="Rust-timer automatisch"></button></div>');
    var tg = autoRow.querySelector('.toggle');
    function paintTg() { tg.classList.toggle('on', autoRestOn()); tg.setAttribute('aria-checked', autoRestOn()); }
    paintTg();
    tg.addEventListener('click', function () { if (!SETH_TEST) { try { localStorage.setItem(LS_AUTOREST, autoRestOn() ? '0' : '1'); } catch (e) {} } paintTg(); });
    setCard.appendChild(autoRow);
    var restRow = el('<div class="set-row" style="border-top:1px solid var(--border);padding-top:12px;margin-top:12px"><div><b>Standaard rusttijd</b><div class="tiny">Tussen sets</div></div><div class="rest-presets"></div></div>');
    var pr = restRow.querySelector('.rest-presets');
    [60, 90, 120, 180].forEach(function (s) {
      var lbl = (s % 60 === 0) ? (s / 60) + 'm' : fmtClock(s);
      var b = el('<button class="preset' + (restDefault === s ? ' on' : '') + '">' + lbl + '</button>');
      b.addEventListener('click', function () {
        restDefault = s;
        if (!SETH_TEST) { try { localStorage.setItem(LS_REST, String(s)); } catch (e) {} }
        pr.querySelectorAll('.preset').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        toast('Standaard rust: ' + lbl);
      });
      pr.appendChild(b);
    });
    setCard.appendChild(restRow);

    var verRow = el('<div class="set-row" style="border-top:1px solid var(--border);padding-top:12px;margin-top:12px">' +
      '<div><b>App-versie</b><div class="tiny">' + esc(APP_VERSION) + ' · programma ' + esc(P.meta.version) + '</div></div>' +
      '<button class="preset" style="min-width:76px">Bijwerken</button></div>');
    verRow.querySelector('button').addEventListener('click', function () {
      toast('Bijwerken…');
      var done = function () { location.reload(); };
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(function (reg) {
          if (!reg) return done();
          reg.update().then(done).catch(done);
        }).catch(done);
      } else { done(); }
    });
    setCard.appendChild(verRow);
    root.appendChild(setCard);

    var regels = meer('De vier regels');
    var rules = el('<div class="card"></div>');
    P.rules.forEach(function (r, i) {
      rules.appendChild(el('<div class="sub" style="margin:8px 0"><span class="rulenum">0' + (i + 1) + '</span>' + esc(r) + '</div>'));
    });
    regels.appendChild(rules);

    root.appendChild(el('<div class="section-title">' + esc(P.nutrition.title) + '</div>'));
    var nut = el('<div class="card"><div class="h2" style="margin-bottom:4px;color:var(--accent)">' + esc(P.nutrition.goal) + '</div></div>');
    P.nutrition.system.forEach(function (it) {
      nut.appendChild(el('<div style="margin:9px 0"><b style="font-size:14px">' + esc(it.title) + '</b><div class="tiny">' + esc(it.text) + '</div></div>'));
    });
    root.appendChild(nut);
    root.appendChild(regels);

    var volume = meer(P.volumeCheck.title);
    var vol = el('<div class="card"><div class="tiny" style="margin-bottom:6px">' + esc(P.volumeCheck.sub) + '</div></div>');
    P.volumeCheck.rows.forEach(function (r) {
      vol.appendChild(el('<div class="kv"><b>' + esc(r.name) + '</b><span>' + esc(r.sets) + '</span></div>'));
    });
    volume.appendChild(vol);
    root.appendChild(volume);
  }

  /* ---------------- Navigatie + init ---------------- */
  var VIEWS = { vandaag: renderVandaag, week: renderWeek, historie: renderHistorie, ankers: renderAnkers, info: renderInfo };

  function setActiveTab() {
    $all('.tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.view === UI.view);
    });
  }
  function show(view) {
    UI.view = view;
    if (view === 'vandaag') {
      var today = todayStr();
      if (UI.date !== today) {
        // andere datum stond open (historie-edit) → terug naar vandaag
        UI.date = today;
        UI.dayKey = dayKeyForDate(today);
      }
      // zelfde datum: gekozen workout-dag behouden (geschoven schema raakt niet kwijt)
    }
    setActiveTab();
    VIEWS[view]();
    window.scrollTo(0, 0);
  }

  $all('.tab').forEach(function (t) {
    t.addEventListener('click', function () { show(t.dataset.view); });
  });

  window.addEventListener('online', function () {
    refreshSyncUI();
    pushDirty();
    pullAll().then(function (ok) { if (ok) VIEWS[UI.view](); });
  });
  window.addEventListener('offline', refreshSyncUI);

  // app over middernacht open laten en terugkomen → Seth-kaart (en training) naar de nieuwe dag
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible' || UI.view !== 'vandaag' || !sethGetekend) return;
    var nu = sethVandaag();
    if (nu === sethGetekend) return;
    if (UI.date === sethGetekend) { UI.date = nu; UI.dayKey = dayKeyForDate(nu); }
    renderVandaag();
  });

  // testhaak: bestaat alleen in de testmodus (?sethdatum=) en bewaart niets
  if (SETH_TEST) {
    window.PA_TEST = {
      datum: function (d) { if (d) SETH_TEST = d; return SETH_TEST; },
      zet: metricZet, waarde: metricWaarde,
      wis: function () { sethTest = {}; sethTestOp = {}; },
      vorige: sethVorige, antwoord: sethAntwoord, actief: sethActief, herhaling: sethHerhaling,
      consistentie: consistentie, rugVrij: rugVrij, advies: progressieAdvies, teken: renderVandaag,
      // sessies alleen in het geheugen (opslaan en syncen staan uit in de testmodus)
      sessie: function (d, dk, data) { if (data === null) delete S.sessions[sessKey(d, dk)]; else S.sessions[sessKey(d, dk)] = data; },
      sessies: function () { return Object.keys(S.sessions); }
    };
  }

  loadLocal();
  initSupabase();
  // programma-versie in de header uit program.js, niet hardcoded in de HTML
  var brandV = $('#brandV');
  if (brandV) brandV.textContent = P.meta.version;
  setActiveTab();
  renderVandaag();
  refreshSyncUI();
  pullAll().then(function (ok) {
    if (ok) VIEWS[UI.view]();
    pushDirty();
  });
})();
