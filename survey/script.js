/* ═══════════════════════════════════════════════════════════════
   AI vs Human Service Provider Study — script.js
   Between-subjects (condition) × Within-subjects (5 scenarios)
═══════════════════════════════════════════════════════════════ */

/* ── SCENARIO DATA ── */
const SCENARIOS = {
  Transportation: {
    images: {
      AI: "photos/ai_car.png",
      Human: "photos/human_car.png"
    },
    wtpPlaceholder: "e.g. 300 – 1,500",
    wtpRange: { min: 300, max: 1500 },
    AI: {
      text: "You need to get from the airport to your hotel (approximately 15 Kms). An AI-powered autonomous vehicle offers the trip. The system uses real-time traffic data, machine learning route optimisation, and sensor arrays to navigate safely. The vehicle displays its route and ETA on an in-app screen. No human driver is involved."
    },
    Human: {
      text: "You need to get from the airport to your hotel (approximately 15 Kms). A professional taxi driver with 12 years of experience offers the trip. The driver is licensed, insured, and familiar with local roads. They communicate with you throughout the journey and can respond to your questions and preferences in real time."
    }
  },
  Art: {
    images: {
      AI: "photos/ai_art.png",
      Human: "photos/human_art.png"
    },
    wtpPlaceholder: "e.g. 2,000 – 20,000",
    wtpRange: { min: 2000, max: 20000 },
    AI: {
      text: "You commission a piece of artwork for your home. An AI generative-art platform creates the work from a text description you provide. Trained on millions of artworks, it applies diffusion algorithms to produce a unique, high-resolution digital print tailored to your specifications."
    },
    Human: {
      text: "You commission a piece of artwork for your home. A artist with 15 years of experience creates the work from a brief you provide. They sketch drafts, consult with you on colour and style, and hand-paint the final piece, imbuing it with personal craftsmanship and creative intent."
    }
  },
  Finance: {
    images: {
      AI: "photos/ai_finance.png",
      Human: "photos/human_finance.png"
    },
    wtpPlaceholder: "",
    wtpRange: { min: 600, max: 6000 },
    AI: {
      text: "You want your investment portfolio of ₹10 lakh to be professionally managed. An AI-powered robo-advisor analyses your financial goals, risk tolerance, and market conditions using algorithms that process thousands of data points. It automatically rebalances your holdings and generates plain-language reports explaining its recommendations. The quoted service charge is a monthly payment."
    },
    Human: {
      text: "You want your investment portfolio of ₹10 lakh to be professionally managed. A certified financial planner with 20 years of experience reviews your goals and situation. They provide personalised recommendations, explain the rationale behind each decision, and are available by phone or email throughout the year. The quoted service charge is a monthly payment."
    }
  },
  Medical: {
    images: {
      AI: "photos/ai_xray.png",
      Human: "photos/human_xray.png"
    },
    wtpPlaceholder: "e.g. 200 – 2,000",
    wtpRange: { min: 200, max: 2000 },
    AI: {
      text: "You have concerning symptoms and need a preliminary health assessment. An AI diagnostic system analyses your reported symptoms, medical history, and lab results using deep-learning models trained on millions of clinical records. It provides a ranked list of possible conditions and recommended next steps."
    },
    Human: {
      text: "You have concerning symptoms and need a preliminary health assessment. A licensed physician with 18 years of clinical experience reviews your symptoms and history. They conduct a physical examination, ask follow-up questions, and provide a diagnosis with a treatment plan based on clinical judgement."
    }
  },
  Security: {
    images: {
      AI: "photos/ai_security.png",
      Human: "photos/human_security.png"
    },
    wtpPlaceholder: "e.g. 1,000 – 8,000",
    wtpRange: { min: 1000, max: 8000 },
    AI: {
      text: "Your home requires security monitoring. An AI-powered system continuously analyses camera and sensor feeds using computer vision and anomaly-detection models. It distinguishes routine activity from genuine threats, sends real-time alerts, and can automatically contact emergency services if a breach is detected. The quoted service charge is a monthly payment."
    },
    Human: {
      text: "Your home requires security monitoring. A trained professional security guard with 8 years of experience monitors your property during overnight hours. They conduct regular patrols, respond to unusual activity, and can immediately contact emergency services and communicate with you if an incident occurs. The quoted service charge is a monthly payment."
    }
  }
};

const DOMAINS = Object.keys(SCENARIOS);

/* ── UTILITIES ── */
function uid() { return 'p_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now(); }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── STATE ── */
let state = {};

function initState() {
  state = {
    participant_id: uid(),
    condition: Math.random() < 0.5 ? 'AI' : 'Human',
    scenario_order: shuffle(DOMAINS),
    current_scenario_idx: 0,
    responses: [],
    page_times: {},
    final_answers: null
  };
  saveState();
}
function saveState() { localStorage.setItem('study_state', JSON.stringify(state)); }

/* ── TIMER ── */
let pageStartTime = null;
let timerInterval = null;

function startTimer() {
  pageStartTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - pageStartTime) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = (elapsed % 60).toString().padStart(2, '0');
    const el = document.getElementById('timer-badge');
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
}
function stopTimer(domain) {
  clearInterval(timerInterval);
  if (pageStartTime) {
    state.page_times[domain] = Date.now() - pageStartTime;
    pageStartTime = null;
  }
}

/* ── LIKERT ── */
function buildLikert(container, field, changeCallback) {
  container.innerHTML = '';
  for (let v = 1; v <= 7; v++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'likert-btn';
    btn.textContent = v;
    btn.dataset.value = v;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.likert-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (changeCallback) changeCallback();
    });
    container.appendChild(btn);
  }
}

function getLikertValue(field) {
  const row = document.querySelector(`.likert-row[data-field="${field}"]`);
  if (!row) return null;
  const sel = row.querySelector('.likert-btn.selected');
  return sel ? parseInt(sel.dataset.value) : null;
}

/* ── SCENARIO VALIDATION ── */
function checkScenarioComplete() {
  const domain = state.scenario_order[state.current_scenario_idx];
  const data = SCENARIOS[domain];
  const trust = getLikertValue('trust');
  const risk  = getLikertValue('risk');
  const comp  = getLikertValue('competence');
  const wtpRaw = document.getElementById('wtp-input').value.trim();
  const wtp = parseFloat(wtpRaw);
  const wtpInRange = !Number.isNaN(wtp)
    && wtp >= data.wtpRange.min
    && wtp <= data.wtpRange.max;
  document.getElementById('btn-next').disabled =
    !(trust && risk && comp && wtpInRange);
}

/* ── RENDER SCENARIO ── */
function renderScenario(idx) {
  const domain = state.scenario_order[idx];
  const isLast = idx === DOMAINS.length - 1;
  const cond   = state.condition;
  const data   = SCENARIOS[domain];

  // Progress bar
  document.getElementById('progress-fill').style.width = (idx / DOMAINS.length * 100) + '%';
  document.getElementById('progress-label').textContent = `${idx + 1} / ${DOMAINS.length}`;

  // Left panel domain tint
  const sceneLeft = document.getElementById('scene-left');
  sceneLeft.setAttribute('data-domain', domain);

  // Pills
  document.getElementById('domain-pill').textContent = domain;
  const cpill = document.getElementById('condition-pill');
  cpill.textContent = cond === 'AI' ? 'AI System' : 'Human Expert';
  cpill.className = 'condition-pill ' + (cond === 'AI' ? 'condition-pill-ai' : 'condition-pill-human');

  // Image from local photos folder
  const img = document.getElementById('scenario-img');
  img.src = data.images[cond];
  img.alt = `${cond} ${domain} scenario`;

  // Text
  document.getElementById('scenario-text').textContent = data[cond].text;

  // Likert rows
  buildLikert(document.querySelector('.likert-row[data-field="trust"]'),      'trust',      checkScenarioComplete);
  buildLikert(document.querySelector('.likert-row[data-field="risk"]'),       'risk',       checkScenarioComplete);
  buildLikert(document.querySelector('.likert-row[data-field="competence"]'), 'competence', checkScenarioComplete);

  // WTP — INR with domain-specific placeholder
  const wtpInput = document.getElementById('wtp-input');
  wtpInput.value = '';
  wtpInput.placeholder = '';
  wtpInput.min = data.wtpRange.min;
  wtpInput.max = data.wtpRange.max;
  wtpInput.oninput = checkScenarioComplete;

  // WTP hint text
  const monthlyDomains = ['Finance', 'Security'];
  document.getElementById('wtp-hint').textContent = monthlyDomains.includes(domain)
    ? `Allowed range: ₹${data.wtpRange.min.toLocaleString()} - ₹${data.wtpRange.max.toLocaleString()} (monthly payment)`
    : `Allowed range: ₹${data.wtpRange.min.toLocaleString()} - ₹${data.wtpRange.max.toLocaleString()}`;

  // Next button label
  document.getElementById('next-label').textContent = isLast ? '(final questions)' : 'scenario';
  document.getElementById('btn-next').disabled = true;

  showScreen('screen-scenario');
  startTimer();
}

/* ── NEXT BUTTON ── */
document.getElementById('btn-next').addEventListener('click', () => {
  const domain = state.scenario_order[state.current_scenario_idx];
  stopTimer(domain);
  state.responses.push({
    domain,
    trust:      getLikertValue('trust'),
    risk:       getLikertValue('risk'),
    competence: getLikertValue('competence'),
    wtp_inr:    parseFloat(document.getElementById('wtp-input').value),
    time_ms:    state.page_times[domain] || 0
  });
  state.current_scenario_idx++;
  saveState();

  if (state.current_scenario_idx < DOMAINS.length) {
    renderScenario(state.current_scenario_idx);
  } else {
    showFinalScreen();
  }
});

/* ── FINAL SCREEN ── */
function checkFinalComplete() {
  const ok = getLikertValue('ai_attitude')
    && document.querySelector('input[name="prior_ai"]:checked');
  document.getElementById('btn-submit').disabled = !ok;
}

function showFinalScreen() {
  const aiRow = document.querySelector('.likert-row[data-field="ai_attitude"]');
  buildLikert(aiRow, 'ai_attitude', checkFinalComplete);

  ['age-input', 'field-input'].forEach(id =>
    document.getElementById(id).addEventListener('input', checkFinalComplete));
  document.getElementById('gender-select').addEventListener('change', checkFinalComplete);
  document.querySelectorAll('input[name="prior_ai"]').forEach(r =>
    r.addEventListener('change', checkFinalComplete));

  showScreen('screen-final');
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAWA2KxEb8SdgCRDz8lrE1YuwqTntSztIn2fGgAXHVISetQSJSgWQk-tCMiiIXrtDXsw/exec";

function submitToSheet() {
  const fa = state.final_answers;
  const orderStr = state.scenario_order.join("|");

  // Build one object per scenario row — matches your CSV format exactly
  const rows = state.responses.map(r => ({
    participant_id: state.participant_id,
    condition:      state.condition,
    scenario_order: orderStr,
    domain:         r.domain,
    trust:          r.trust,
    risk:           r.risk,
    competence:     r.competence,
    wtp_inr:        r.wtp_inr,
    time_ms:        r.time_ms,
    ai_attitude:    fa.ai_attitude,
    prior_ai_use:   fa.prior_ai_use,
    age:            fa.age,
    gender:         fa.gender,
    field:          fa.field
  }));

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(rows)
  })
  .then(res => res.json())
  .then(data => console.log("Sheet:", data.status, data.rows + " rows written"))
  .catch(err => console.warn("Sheet submission failed:", err));
}

/* ── SUBMIT ── */
document.getElementById('btn-submit').addEventListener('click', () => {
  const ageRaw = document.getElementById('age-input').value.trim();
  const genderRaw = document.getElementById('gender-select').value;
  const fieldRaw = document.getElementById('field-input').value.trim();
  state.final_answers = {
    ai_attitude:  getLikertValue('ai_attitude'),
    prior_ai_use: document.querySelector('input[name="prior_ai"]:checked').value,
    age:          ageRaw ? parseInt(ageRaw) : '',
    gender:       genderRaw || '',
    field:        fieldRaw || ''
  };
  saveState();
  submitToSheet(); 
  buildCSVBlob();
  showDoneScreen();
});

/* ── CSV EXPORT ── */
function esc(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"' : s;
}

let csvBlob = null;

function buildCSVBlob() {
  const headers = [
    'participant_id', 'condition', 'scenario_order',
    'domain', 'trust', 'risk', 'competence', 'wtp_inr', 'time_ms',
    'ai_attitude', 'prior_ai_use', 'age', 'gender', 'field'
  ];
  const rows = [headers.join(',')];
  const fa = state.final_answers;
  const orderStr = state.scenario_order.join('|');

  state.responses.forEach(r => {
    rows.push([
      state.participant_id, state.condition, orderStr,
      r.domain, r.trust, r.risk, r.competence, r.wtp_inr, r.time_ms,
      fa.ai_attitude, fa.prior_ai_use, fa.age, esc(fa.gender), esc(fa.field)
    ].join(','));
  });

  csvBlob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* ── DONE SCREEN ── */
function showDoneScreen() {
  const fname = state.condition === 'AI' ? 'ai_responses.csv' : 'human_responses.csv';
  document.getElementById('done-meta').textContent =
    `${state.participant_id}  ·  Condition: ${state.condition}  ·  ${fname}`;
  document.getElementById('manual-download').onclick = e => {
    e.preventDefault();
    if (csvBlob) triggerDownload(csvBlob, fname);
  };
  localStorage.removeItem('study_state');
  showScreen('screen-done');
}

/* ── CONSENT ── */
document.getElementById('consent-check').addEventListener('change', function () {
  document.getElementById('btn-start').disabled = !this.checked;
});
document.getElementById('btn-start').addEventListener('click', () => {
  initState();
  renderScenario(0);
});

/* ── RESUME INCOMPLETE SESSION ── */
(function checkResume() {
  const saved = localStorage.getItem('study_state');
  if (!saved) return;
  try {
    const s = JSON.parse(saved);
    if (s && s.responses && s.responses.length < DOMAINS.length) {
      if (confirm('Resume your previous session?')) {
        state = s;
        state.current_scenario_idx < DOMAINS.length
          ? renderScenario(state.current_scenario_idx)
          : showFinalScreen();
        return;
      }
    }
    localStorage.removeItem('study_state');
  } catch (e) {
    localStorage.removeItem('study_state');
  }
})();