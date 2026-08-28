/* PiekAtleet — app-logica: state, local-first sync (Supabase), views, grafieken.
   XSS-discipline: ALLE dynamische waarden (notities, namen, labels) gaan door esc()
   vóór ze in een HTML-string belanden; el() mag alleen met ge-escapete input worden
   aangeroepen. Data is bovendien uitsluitend eigen invoer van de enige gebruiker. */
(function () {
  'use strict';

  var P = window.PROGRAM;
  var CFG = window.PA_CONFIG || {};
  // Bump samen met CACHE in sw.js bij elke deploy — zichtbaar in Info zodat je kunt checken
  // of een update binnen is. (Let op: de "v4" in de header is de PROGRAMMA-versie, niet deze.)
  var APP_VERSION = '29 · 28-08-2026';

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

  // live voortgang in de dag-header ("X sets gelogd · Y/Z onderdelen klaar")
  function updateDayProgress() {
    var elP = $('#dayProgress');
    if (!elP) return;
    var day = P.days[UI.dayKey];
    if (!day || day.rest) return;
    var sess = getSession(UI.date, UI.dayKey, false);
    var setsLogged = 0, itemsDone = 0, total = day.items.length;
    day.items.forEach(function (it) {
      var l = sess && sess.items && sess.items[it.key];
      if (!l) return;
      if (it.type === 'strength') {
        (l.sets || []).forEach(function (st) { if (num(st.kg) != null || num(st.reps) != null || st.done) setsLogged++; });
        var prog = (l.sets || []).slice(0, it.sets || 0);
        if (prog.length && prog.every(function (st) { return st.done; })) itemsDone++;
      } else if (l.done) {
        itemsDone++;
      }
    });
    elP.textContent = (setsLogged || itemsDone) ? setsLogged + ' sets gelogd · ' + itemsDone + '/' + total + ' onderdelen klaar' : '';
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
  function setsSummary(it) {
    return (it.sets || [])
      .filter(function (s) { return num(s.kg) != null || num(s.reps) != null; })
      .map(function (s) {
        var kg = num(s.kg), reps = num(s.reps);
        var r = reps == null ? '?' : fmtNum(reps);
        // bodyweight (geen of 0 kg) → alleen de reps, geen lelijke "0×6"
        return (kg == null || kg === 0) ? r : fmtNum(kg) + '×' + r;
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

  function progressieAdvies(item, prevItem) {
    if (!prevItem || item.type !== 'strength') return null;
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
    Object.keys(S.sessions).forEach(function (k) {
      var s = S.sessions[k];
      var it = s.items && s.items[exKey];
      if (!it) return;
      (it.sets || []).forEach(function (st) {
        var kg = num(st.kg), reps = num(st.reps);
        if (reps == null) return;
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
    try { localStorage.setItem(LS_REST, String(sec)); } catch (e) {}
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
      if (last) exitFocus();
      else { UI.focusIdx++; renderFocus(); }
    });
    o.appendChild(nav);

    document.body.appendChild(o);
    o.scrollTop = 0;
  }

  /* ---------------- View: Vandaag (workout-editor) ---------------- */
  /* ---------------- Herstel (Garmin) ----------------
     Bewust één strook, geen dashboard: Kaj wil dit niet bijhouden, alleen weten
     of het springwerk vandaag door kan. De sync draait 's ochtends 08:00, dus
     val terug op de laatste dag mét data en zeg er dan bij van wanneer die is. */
  function garminVoor(date) {
    if (S.garmin[date]) return { row: S.garmin[date], date: date, vers: true };
    var dagen = Object.keys(S.garmin).filter(function (d) { return d <= date; }).sort();
    if (!dagen.length) return null;
    var laatste = dagen[dagen.length - 1];
    return { row: S.garmin[laatste], date: laatste, vers: false };
  }

  // readiness stuurt alleen het explosieve werk aan; kracht blijft bijna altijd staan
  function herstelAdvies(r) {
    var rd = r.readiness_score;
    if (rd == null) return null;
    if (rd >= 80) return { kleur: 'good', tekst: 'Groen. Springwerk en sprints op vol vermogen.' };
    if (rd >= 60) return { kleur: 'good', tekst: 'Normaal. Schema aanhouden zoals het staat.' };
    if (rd >= 40) return { kleur: 'accent', tekst: 'Halveer de sprong-contacts. Kracht mag blijven staan.' };
    return { kleur: 'hot', tekst: 'Geen sprongen, geen sprints. Mobiliteit en techniek, of rust.' };
  }

  /* Conditie-advies uit Garmin's eigen belastingverdeling.
     Garmin splitst je maandlast in aeroob-laag (zone 2), aeroob-hoog (tempo/drempel)
     en anaeroob (sprints). Basketbal en zone-2-werk vullen alleen het eerste bakje —
     het gat zit bij Kaj in het middelste. Vandaar dat dit apart van readiness staat:
     readiness zegt of je vandaag KUNT, dit zegt wat er MIST.
     Tempowerk mag alleen op dagen waar het de vrijdagsprint niet raakt: di en za. */
  var TEMPO_DAGEN = { di: 1, za: 1 };

  function conditieAdvies(r, dayKey) {
    var hoog = num(r.load_aerobic_high);
    var doel = (r.load_targets && r.load_targets.aeroob_hoog) || null;
    if (hoog == null || !doel || doel[0] == null) return null;
    if (hoog >= doel[0]) return null; // op peil, niets toe te voegen

    var tekort = Math.round(doel[0] - hoog);
    if (TEMPO_DAGEN[dayKey]) {
      return { kleur: 'accent', tekst: 'Tempo-slot vandaag: 5 × 3 min op de fiets of roeier, hartslag 150–160, 2 min rustig ertussen. ' +
        'Dit is het enige bakje dat leeg staat (' + tekort + ' tekort) — extra basketbal vult het niet, dat telt als zone 2.' };
    }
    return { kleur: 'muted', tekst: 'Tempowerk ontbreekt nog (' + tekort + ' onder de ondergrens), maar niet vandaag — dat hoort op dinsdag of zaterdag.' };
  }

  function herstelKaart(date) {
    var g = garminVoor(date);
    if (!g) return null;
    var r = g.row;
    var cel = function (label, waarde, sub) {
      return '<div class="hcel"><div class="hlab">' + esc(label) + '</div>' +
        '<div class="hval">' + esc(waarde == null ? '–' : waarde) + '</div>' +
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

  function renderVandaag() {
    var root = $('#view');
    clear(root);
    var date = UI.date, dayKey = UI.dayKey;
    var day = P.days[dayKey];

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

    var head = el('<div class="card">' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">' +
      '<div><div class="h1">' + esc(day.title) + '</div><div class="sub">' + esc(day.sub || '') + '</div></div>' +
      '<span class="badge badge-erector-' + esc(day.erector.toLowerCase().replace(/\s+/g, '-')) + '">erector ' + esc(day.erector) + '</span>' +
      '</div>' +
      '<div class="tiny" style="margin-top:7px">Power: ' + esc(day.power) + '</div>' +
      '<div class="tiny" id="dayProgress" style="margin-top:5px;color:var(--good)"></div>' +
      (day.warn ? '<div class="callout"><span class="ic">⚠</span><span>' + esc(day.warn) + '</span></div>' : '') +
      '</div>');
    root.appendChild(head);

    // workout-modus: oefening-voor-oefening met grote knoppen + rust-timer
    var startBtn = el('<button class="btn btn-focus">▶  Start workout-modus</button>');
    startBtn.addEventListener('click', function () { enterFocus(0); });
    root.appendChild(startBtn);

    // atleet-fase: inklapbaar zodat de compound-kern direct in beeld staat
    var skeyOpener = sessKey(date, dayKey);
    var openerChecked = 0;
    if (sess && sess.opener) Object.keys(sess.opener).forEach(function (bk) { openerChecked += Object.keys(sess.opener[bk]).length; });
    var openerOpen = UI.openerOpen === skeyOpener;
    var opener = el('<div class="card">' +
      '<button class="opener-toggle" aria-expanded="' + openerOpen + '">' +
      '<span><span class="h2">' + esc(P.opener.title) + '</span> <span class="tiny">· 12–15 min</span></span>' +
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
    updateDayProgress();
  }

  function strengthCard(date, dayKey, item) {
    var skey = sessKey(date, dayKey);
    var sess = getSession(date, dayKey, false);
    var logged = sess && sess.items && sess.items[item.key];

    var card = el('<div class="card">' +
      '<div class="ex-head"><div><div class="ex-name">' + esc(item.name) + '</div>' +
      (item.cue ? '<div class="ex-cue">' + esc(item.cue) + '</div>' : '') + '</div>' +
      '<span class="badge badge-target">' + item.sets + ' × ' + (item.target ? esc(item.target) : 'vrij') + '</span></div>' +
      '</div>');

    var vrs = videoRegel(item);
    if (vrs) card.appendChild(vrs);

    var prev = prevSessionFor(item.key, date, skey);
    var advies = null;
    if (prev) {
      var summary = setsSummary(prev.items[item.key]);
      if (summary) card.appendChild(el('<div class="ex-prev">Vorige (' + esc(fmtDate(prev.date)) + '): <b>' + esc(summary) + '</b>' +
        (prev.items[item.key].note ? ' · „' + esc(prev.items[item.key].note) + '”' : '') + '</div>'));
      // alleen adviseren zolang je vandaag nog niets gelogd hebt
      var alGelogd = logged && (logged.sets || []).some(function (s) { return num(s.kg) != null || num(s.reps) != null; });
      if (!alGelogd) {
        advies = progressieAdvies(item, prev.items[item.key]);
        if (advies) card.appendChild(el('<div class="ex-next' + (advies.op ? ' ex-next-up' : '') + '">' +
          (advies.op ? '▲ ' : '→ ') + esc(advies.tekst) + '</div>'));
      }
    }

    var rows = el('<div class="setrows"></div>');
    card.appendChild(rows);

    var nSets = Math.max(item.sets || 0, logged && logged.sets ? logged.sets.length : 0);
    function prevSet(i) {
      if (!prev) return null;
      var ps = prev.items[item.key].sets || [];
      return ps[i] && (ps[i].kg !== '' || ps[i].reps !== '') ? ps[i] : null;
    }

    // wat de app voorstelt in het kg-veld: het advies, anders wat je vorige keer deed
    function suggestieKg(ph) {
      if (advies && advies.kg != null) return fmtNum(advies.kg);
      if (ph && ph.kg !== '') return fmtNum(num(ph.kg));
      return '';
    }

    function setRow(i) {
      var st = (logged && logged.sets && logged.sets[i]) || { kg: '', reps: '', done: false };
      var ph = prevSet(i);
      var row = el('<div class="setrow">' +
        '<span class="setnum">' + (i + 1) + '</span>' +
        '<input type="text" inputmode="decimal" placeholder="' + esc(suggestieKg(ph) || 'kg') + '" aria-label="Gewicht set ' + (i + 1) + '">' +
        '<input type="text" inputmode="numeric" placeholder="' + esc(ph && ph.reps !== '' ? fmtNum(num(ph.reps)) : 'reps') + '" aria-label="Reps set ' + (i + 1) + '">' +
        '<button class="setdone' + (st.done ? ' on' : '') + '" aria-label="Set ' + (i + 1) + ' klaar">✓</button>' +
        '</div>');
      var kgIn = row.children[1], repsIn = row.children[2], doneBtn = row.children[3];
      kgIn.value = st.kg === '' ? '' : fmtNum(num(st.kg));
      repsIn.value = st.reps === '' ? '' : fmtNum(num(st.reps));

      function write(field, value) {
        var s2 = getSession(date, dayKey, true);
        var it2 = ensureItem(s2, item);
        while (it2.sets.length <= i) it2.sets.push({ kg: '', reps: '', done: false });
        it2.sets[i][field] = value;
        logged = it2;
        markSessionDirty(date, dayKey);
      }
      kgIn.addEventListener('input', function () { write('kg', kgIn.value.trim()); });
      repsIn.addEventListener('input', function () { write('reps', repsIn.value.trim()); });
      doneBtn.addEventListener('click', function () {
        var turningOn = !doneBtn.classList.contains('on');
        // snelle log: leeg veld → neem over wat de app voorstelt (advies, anders vorige keer)
        var fillKg = suggestieKg(ph);
        if (turningOn && kgIn.value === '' && fillKg) { kgIn.value = fillKg; write('kg', kgIn.value); }
        if (turningOn && repsIn.value === '' && ph && ph.reps !== '') { repsIn.value = fmtNum(num(ph.reps)); write('reps', repsIn.value); }
        write('done', turningOn);
        doneBtn.classList.toggle('on', turningOn);
        refreshDoneState();
        if (turningOn) onSetCompleted(); // rust-timer start automatisch (indien aan)
      });
      return row;
    }

    // groene rand zodra alle programma-sets afgevinkt zijn — voortgang in één oogopslag
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

    var card = el('<div class="card"><div class="checkline">' +
      '<button class="bigcheck' + (on ? ' on' : '') + '" aria-label="' + esc(item.name) + ' klaar">✓</button>' +
      '<div style="flex:1"><div class="ex-name">' + esc(item.name) + '</div>' +
      (item.cue ? '<div class="ex-cue">' + esc(item.cue) + (item.target ? ' · ' + esc(item.target) : '') + '</div>' : (item.target ? '<div class="ex-cue">' + esc(item.target) + '</div>' : '')) +
      '<textarea class="ex-note" rows="1" placeholder="Notitie (bv. afstand, tijd, gewicht)…"></textarea></div>' +
      '</div></div>');
    var vr = videoRegel(item);
    // vóór het notitieveld, zodat de cue en de techniek bij elkaar staan
    if (vr) { var tav = card.querySelector('textarea'); tav.parentNode.insertBefore(vr, tav); }

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
  function renderWeek() {
    var root = $('#view');
    clear(root);
    root.appendChild(el('<div class="section-title">De week</div>'));
    var card = el('<div class="card"><div class="tiny" style="margin-bottom:8px">' + esc(P.weekRule) + '</div>' +
      '<table class="weektable"><thead><tr><th>dag</th><th>focus</th><th>compound</th><th>power</th><th>erector</th></tr></thead><tbody></tbody></table>' +
      '<div class="tiny" style="margin-top:8px">Tik een dag om te bekijken of in te vullen.</div></div>');
    var tbody = card.querySelector('tbody');
    P.weekOrder.forEach(function (dk) {
      var d = P.days[dk];
      var tr;
      if (d.rest) {
        var restTxt = (d.items && d.items.length)
          ? 'rust · optioneel: ' + d.items.map(function (i) { return i.name; }).join(', ')
          : 'rust';
        tr = el('<tr class="rest" data-day="' + esc(dk) + '"><td class="wd">' + esc(d.label) + '</td><td colspan="4" style="color:var(--muted)">' + esc(restTxt) + '</td></tr>');
        tr.addEventListener('click', function () {
          UI.dayKey = dk;
          UI.view = 'vandaag';
          setActiveTab();
          renderVandaag();
        });
      } else {
        tr = el('<tr data-day="' + esc(dk) + '"><td class="wd">' + esc(d.label) + '</td><td>' + esc(d.title) + '</td><td>' + esc(d.compound) + '</td><td>' + esc(d.power) + '</td><td>' + esc(d.erector) + '</td></tr>');
        tr.addEventListener('click', function () {
          UI.dayKey = dk;
          UI.view = 'vandaag';
          setActiveTab();
          renderVandaag();
        });
      }
      tbody.appendChild(tr);
    });
    root.appendChild(card);

    root.appendChild(el('<div class="section-title">' + esc(P.opener.title) + '</div>'));
    var op = el('<div class="card"><div class="tiny">' + esc(P.opener.sub) + '</div></div>');
    P.opener.blocks.forEach(function (b) {
      op.appendChild(el('<div style="margin-top:10px"><div class="opener-head"><span class="h2">' + esc(b.title) + '</span><span class="tiny">' + esc(b.sub) + '</span></div>' +
        '<div class="sub">' + esc(b.items.map(function (i) { return i.name; }).join(' · ')) + '</div>' +
        (b.warn ? '<div class="callout"><span class="ic">⚠</span><span>' + esc(b.warn) + '</span></div>' : '') + '</div>'));
    });
    root.appendChild(op);
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
      hits.slice(0, 12).forEach(function (s) {
        var it = s.items[UI.histEx];
        root.appendChild(el('<div class="card">' +
          '<div class="hist-head"><span class="h2">' + esc(fmtDate(s.date)) + '</span></div>' +
          '<div class="hist-sets">' + esc(setsSummary(it) || '—') + (it.note ? '<br>„' + esc(it.note) + '”' : '') + '</div></div>'));
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

    root.appendChild(el('<div class="section-title">Prestatie-ankers · hier win je dit blok</div>'));
    root.appendChild(el('<div class="tiny" style="margin:-4px 4px 10px">Hier win of verlies je dit blok. Elke 4 weken meten — sprong omhoog, tijden omlaag.</div>'));
    P.anchors.athletic.forEach(function (a) {
      var card = el('<div class="card"><div class="h2">' + esc(a.label) + '</div><div class="tiny">' + esc(a.hint) + '</div></div>');
      card.appendChild(metricAddRow(a.key, a.unit, today));
      var series = metricSeries(a.key);
      card.appendChild(lineChart(series.map(function (m) { return { label: fmtDate(m.date), value: m.value }; }), a.unit));
      root.appendChild(card);
    });

    root.appendChild(el('<div class="section-title">Lichaam · wekelijks</div>'));
    var wCard = el('<div class="card"><div class="h2">Lichaamsgewicht</div><div class="tiny">Stabiel houden — elke kilo moet zich terugverdienen in sprong of snelheid</div></div>');
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

    root.appendChild(el('<div class="section-title">Kracht — ondersteunend</div>'));
    root.appendChild(el('<div class="tiny" style="margin:-4px 4px 10px">Afgeleid uit je sets. Kracht is het middel: stijgt je squat terwijl je sprong zakt, dan win je dit blok niet.</div>'));
    var noData = [];
    P.anchors.strength.forEach(function (a) {
      var series = weeklyTopSets(a.key);
      if (!series.length) { noData.push(a.label); return; }
      var laatste = series[series.length - 1];
      // bodyweight-oefening (alles op 0 kg) → volg de reps i.p.v. het gewicht
      var bw = series.every(function (t) { return t.kg === 0; });
      var card = el('<div class="card"><div class="ex-head"><div class="h2">' + esc(a.label) + '</div>' +
        '<span class="badge badge-target">' + (bw
          ? fmtNum(laatste.reps) + ' reps'
          : fmtNum(laatste.kg) + ' kg × ' + fmtNum(laatste.reps)) + '</span>' +
        '</div></div>');
      card.appendChild(lineChart(series.map(function (t) {
        return bw
          ? { label: 'wk ' + t.week, value: t.reps, sub: fmtNum(t.reps) + ' reps bodyweight (' + fmtDate(t.date) + ')' }
          : { label: 'wk ' + t.week, value: t.kg, sub: fmtNum(t.kg) + ' kg × ' + fmtNum(t.reps) + ' (' + fmtDate(t.date) + ')' };
      }), bw ? 'reps' : 'kg'));
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
      JSON.stringify({ exported: nowIso(), program: 'PiekAtleet v4', sessions: S.sessions, metrics: S.metrics }, null, 2),
      'application/json');
    toast('JSON-export gedownload');
  }
  function exportCSV() {
    var lines = ['datum;dag;oefening;set;kg;reps;klaar;notitie'];
    sessionsSorted().reverse().forEach(function (s) {
      var day = P.days[s.dayKey] || { title: s.dayKey };
      Object.keys(s.items || {}).forEach(function (k) {
        var found = findProgramItem(k);
        var name = found ? found.item.name : k;
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
    tg.addEventListener('click', function () { try { localStorage.setItem(LS_AUTOREST, autoRestOn() ? '0' : '1'); } catch (e) {} paintTg(); });
    setCard.appendChild(autoRow);
    var restRow = el('<div class="set-row" style="border-top:1px solid var(--border);padding-top:12px;margin-top:12px"><div><b>Standaard rusttijd</b><div class="tiny">Tussen sets</div></div><div class="rest-presets"></div></div>');
    var pr = restRow.querySelector('.rest-presets');
    [60, 90, 120, 180].forEach(function (s) {
      var lbl = (s % 60 === 0) ? (s / 60) + 'm' : fmtClock(s);
      var b = el('<button class="preset' + (restDefault === s ? ' on' : '') + '">' + lbl + '</button>');
      b.addEventListener('click', function () {
        restDefault = s;
        try { localStorage.setItem(LS_REST, String(s)); } catch (e) {}
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

    root.appendChild(el('<div class="section-title">De vier regels</div>'));
    var rules = el('<div class="card"></div>');
    P.rules.forEach(function (r, i) {
      rules.appendChild(el('<div class="sub" style="margin:8px 0"><span class="rulenum">0' + (i + 1) + '</span>' + esc(r) + '</div>'));
    });
    root.appendChild(rules);

    root.appendChild(el('<div class="section-title">' + esc(P.nutrition.title) + '</div>'));
    var nut = el('<div class="card"><div class="sub">' + esc(P.nutrition.context) + '</div>' +
      '<div class="h2" style="margin:10px 0 4px;color:var(--accent)">' + esc(P.nutrition.goal) + '</div>' +
      '<div class="tiny" style="margin-bottom:8px">' + esc(P.nutrition.systemNote) + '</div></div>');
    P.nutrition.system.forEach(function (it) {
      nut.appendChild(el('<div style="margin:9px 0"><b style="font-size:14px">' + esc(it.title) + '</b><div class="tiny">' + esc(it.text) + '</div></div>'));
    });
    root.appendChild(nut);

    root.appendChild(el('<div class="section-title">' + esc(P.volumeCheck.title) + '</div>'));
    var vol = el('<div class="card"><div class="tiny" style="margin-bottom:6px">' + esc(P.volumeCheck.sub) + '</div></div>');
    P.volumeCheck.rows.forEach(function (r) {
      vol.appendChild(el('<div class="kv"><b>' + esc(r.name) + '</b><span>' + esc(r.sets) + '</span></div>'));
    });
    root.appendChild(vol);

    root.appendChild(el('<div class="tiny" style="margin:6px 4px 14px">Weekregel: ' + esc(P.weekRule) + '</div>'));
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

  loadLocal();
  initSupabase();
  setActiveTab();
  renderVandaag();
  refreshSyncUI();
  pullAll().then(function (ok) {
    if (ok) VIEWS[UI.view]();
    pushDirty();
  });
})();
