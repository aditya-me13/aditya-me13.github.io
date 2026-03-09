/* ═══════════════════════════════════════════════════════════
   Protective Put Strategy — Interactive Visualizer
   app.js  ·  Dark finance dashboard edition
═══════════════════════════════════════════════════════════ */

/* ── State ─────────────────────────────────────────────── */
const state = {
  S0: 100, K: 95, P: 5, N: 10,
  finalPrice: 80,
  showStock: true, showPut: true, showPortfolio: true, showProfit: true,
};

/* ── Colour palette (matches CSS vars) ─────────────────── */
const C = {
  cyan:    '#00d4ff',
  teal:    '#00c9a7',
  violet:  '#a78bfa',
  amber:   '#fbbf24',
  rose:    '#f43f5e',
  green:   '#34d399',
  dimText: '#94a3b8',
  grid:    'rgba(255,255,255,0.05)',
  zero:    'rgba(255,255,255,0.15)',
};

/* ══════════════════════════════════════════════════════════
   TABS
══════════════════════════════════════════════════════════ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + id).classList.add('active');
    if (id === 'payoff')  { requestAnimationFrame(drawPayoffChart); }
    if (id === 'compare') { updateCompare(); requestAnimationFrame(drawTradeoffChart); }
  });
});

/* ══════════════════════════════════════════════════════════
   SLIDER HELPERS
══════════════════════════════════════════════════════════ */
function setSliderFill(el) {
  const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.background =
    `linear-gradient(to right, #00d4ff ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
}

function bindSlider(id, valId, fmt, key) {
  const el  = document.getElementById(id);
  const vEl = document.getElementById(valId);
  setSliderFill(el);
  el.addEventListener('input', () => {
    state[key] = parseFloat(el.value);
    vEl.textContent = fmt(state[key]);
    setSliderFill(el);
    updateConstruct();
    if (document.getElementById('tab-payoff').classList.contains('active'))  drawPayoffChart();
    if (document.getElementById('tab-compare').classList.contains('active')) { updateCompare(); drawTradeoffChart(); }
  });
}

bindSlider('stockPrice',  'stockPriceVal',  v => `$${v}`,             'S0');
bindSlider('strikePrice', 'strikePriceVal', v => `$${v}`,             'K');
bindSlider('putPremium',  'putPremiumVal',  v => `$${v.toFixed(2)}`,  'P');
bindSlider('numShares',   'numSharesVal',   v => `${v}`,              'N');

const fpEl = document.getElementById('finalPrice');
setSliderFill(fpEl);
fpEl.addEventListener('input', () => {
  state.finalPrice = parseFloat(fpEl.value);
  document.getElementById('finalPriceVal').textContent = `$${state.finalPrice}`;
  setSliderFill(fpEl);
  updateCompare();
});

/* chart toggles */
['showStock','showPut','showPortfolio','showProfit'].forEach(id => {
  document.getElementById(id).addEventListener('change', e => {
    state[id] = e.target.checked;
    drawPayoffChart();
  });
});

/* ══════════════════════════════════════════════════════════
   CONSTRUCT TAB
══════════════════════════════════════════════════════════ */
function updateConstruct() {
  const { S0, K, P, N } = state;
  const stockCost  = S0 * N;
  const putCost    = P  * N;
  const total      = stockCost + putCost;
  const maxLoss    = (S0 - K + P) * N;
  const breakEven  = S0 + P;
  const protection = Math.max(0, ((S0 - K) / S0) * 100);

  document.getElementById('totalStockCost').textContent  = `$${stockCost.toLocaleString()}`;
  document.getElementById('totalPutCost').textContent    = `$${putCost.toLocaleString()}`;
  document.getElementById('totalInvestment').textContent = `$${total.toLocaleString()}`;
  document.getElementById('maxLoss').textContent         = `-$${maxLoss.toFixed(2)}`;
  document.getElementById('breakEven').textContent       = `$${breakEven.toFixed(2)}`;
  document.getElementById('protectionFloor').textContent = `$${K}`;

  const pct = Math.min(100, protection);
  document.getElementById('protectionBarFill').style.width = pct + '%';
  document.getElementById('protectionPct').textContent     = pct.toFixed(1) + '%';
}

/* ══════════════════════════════════════════════════════════
   PAYOFF CHART
══════════════════════════════════════════════════════════ */
const payoffCanvas = document.getElementById('payoffCanvas');
const payoffCtx    = payoffCanvas.getContext('2d');

function buildPayoffData(range) {
  const { S0, K, P, N } = state;
  return range.map(ST => ({
    ST,
    stockPayoff:     (ST - S0) * N,
    putPayoff:       Math.max(K - ST, 0) * N,
    portfolioPayoff: (ST - S0 + Math.max(K - ST, 0)) * N,
    portfolioProfit: (ST - S0 + Math.max(K - ST, 0) - P) * N,
  }));
}

function drawPayoffChart() {
  const dpr = window.devicePixelRatio || 1;
  const W   = payoffCanvas.parentElement.clientWidth - 32;
  const H   = 400;
  payoffCanvas.width  = W * dpr;
  payoffCanvas.height = H * dpr;
  payoffCanvas.style.width  = W + 'px';
  payoffCanvas.style.height = H + 'px';
  const ctx = payoffCtx;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const PAD = { top: 24, right: 24, bottom: 52, left: 72 };
  const pw  = W - PAD.left - PAD.right;
  const ph  = H - PAD.top  - PAD.bottom;

  const { S0 } = state;
  const sMin = Math.max(10, S0 * 0.4);
  const sMax = S0 * 1.8;
  const N_PT = 200;
  const range = Array.from({ length: N_PT }, (_, i) => sMin + (sMax - sMin) * i / (N_PT - 1));
  const data  = buildPayoffData(range);

  let yMin = Infinity, yMax = -Infinity;
  data.forEach(d => {
    [d.stockPayoff, d.putPayoff, d.portfolioPayoff, d.portfolioProfit].forEach(v => {
      if (v < yMin) yMin = v;
      if (v > yMax) yMax = v;
    });
  });
  const yPad = (yMax - yMin) * 0.13;
  yMin -= yPad; yMax += yPad;

  const xMap = v => PAD.left + (v - sMin) / (sMax - sMin) * pw;
  const yMap = v => PAD.top  + (1 - (v - yMin) / (yMax - yMin)) * ph;

  ctx.clearRect(0, 0, W, H);

  /* — background gradient — */
  const bg = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + ph);
  bg.addColorStop(0,   'rgba(0,212,255,0.025)');
  bg.addColorStop(0.5, 'rgba(12,21,37,0)');
  bg.addColorStop(1,   'rgba(244,63,94,0.025)');
  ctx.fillStyle = bg;
  ctx.fillRect(PAD.left, PAD.top, pw, ph);

  /* — grid lines — */
  const GRID_Y = 7;
  ctx.strokeStyle = C.grid;
  ctx.lineWidth   = 1;
  for (let i = 0; i <= GRID_Y; i++) {
    const y = PAD.top + (i / GRID_Y) * ph;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + pw, y); ctx.stroke();
  }
  const GRID_X = 8;
  for (let i = 0; i <= GRID_X; i++) {
    const x = PAD.left + (i / GRID_X) * pw;
    ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + ph); ctx.stroke();
  }

  /* — zero line — */
  const y0 = yMap(0);
  if (y0 >= PAD.top && y0 <= PAD.top + ph) {
    ctx.strokeStyle = C.zero;
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(PAD.left, y0); ctx.lineTo(PAD.left + pw, y0); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = `11px 'JetBrains Mono'`;
    ctx.textAlign = 'right';
    ctx.fillText('0', PAD.left - 8, y0 + 4);
  }

  /* — profit fill under combined line — */
  if (state.showProfit) {
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = xMap(d.ST), y = yMap(d.portfolioProfit);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(xMap(sMax), y0);
    ctx.lineTo(xMap(sMin), y0);
    ctx.closePath();
    const fillG = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + ph);
    fillG.addColorStop(0, 'rgba(0,201,167,0.12)');
    fillG.addColorStop(1, 'rgba(244,63,94,0.08)');
    ctx.fillStyle = fillG;
    ctx.fill();
  }

  /* — series — */
  const series = [
    { key: 'stockPayoff',     show: state.showStock,     color: C.cyan,   dash: [],    width: 2,   label: 'Stock P&L' },
    { key: 'putPayoff',       show: state.showPut,       color: C.violet, dash: [6,4], width: 2,   label: 'Put Payoff' },
    { key: 'portfolioPayoff', show: state.showPortfolio, color: C.amber,  dash: [],    width: 2.5, label: 'Portfolio Payoff' },
    { key: 'portfolioProfit', show: state.showProfit,    color: C.teal,   dash: [],    width: 3,   label: 'Portfolio Profit (net)' },
  ];

  series.forEach(({ key, show, color, dash, width }) => {
    if (!show) return;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth   = width;
    ctx.shadowColor = color;
    ctx.shadowBlur  = width === 3 ? 10 : 4;
    ctx.setLineDash(dash);
    data.forEach((d, i) => {
      const x = xMap(d.ST), y = yMap(d[key]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  });

  /* — strike price vertical — */
  const xK = xMap(state.K);
  ctx.strokeStyle = 'rgba(251,191,36,0.5)';
  ctx.lineWidth   = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.shadowColor = C.amber;
  ctx.shadowBlur  = 6;
  ctx.beginPath(); ctx.moveTo(xK, PAD.top); ctx.lineTo(xK, PAD.top + ph); ctx.stroke();
  ctx.setLineDash([]); ctx.shadowBlur = 0;

  /* strike label badge */
  const kLabelW = 70, kLabelH = 20;
  const kLx = Math.min(xK + 5, PAD.left + pw - kLabelW - 4);
  ctx.fillStyle = 'rgba(251,191,36,0.15)';
  roundRect(ctx, kLx, PAD.top + 6, kLabelW, kLabelH, 4);
  ctx.fill();
  ctx.fillStyle = C.amber;
  ctx.font = `500 10px 'JetBrains Mono'`;
  ctx.textAlign = 'left';
  ctx.fillText('K = $' + state.K, kLx + 6, PAD.top + 19);

  /* — break-even line — */
  const xBE = xMap(state.S0 + state.P);
  if (xBE >= PAD.left && xBE <= PAD.left + pw) {
    ctx.strokeStyle = 'rgba(0,201,167,0.5)';
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([4, 5]);
    ctx.shadowColor = C.teal; ctx.shadowBlur = 5;
    ctx.beginPath(); ctx.moveTo(xBE, PAD.top); ctx.lineTo(xBE, PAD.top + ph); ctx.stroke();
    ctx.setLineDash([]); ctx.shadowBlur = 0;
    ctx.fillStyle = C.teal;
    ctx.font = `500 10px 'JetBrains Mono'`;
    ctx.fillText('B/E', xBE + 4, PAD.top + 36);
  }

  /* — x axis labels — */
  ctx.fillStyle = C.dimText;
  ctx.font      = `11px 'JetBrains Mono'`;
  ctx.textAlign = 'center';
  for (let i = 0; i <= 8; i++) {
    const v = sMin + (sMax - sMin) * i / 8;
    ctx.fillText('$' + v.toFixed(0), xMap(v), PAD.top + ph + 20);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('Stock Price at Expiry (Sᴛ)', PAD.left + pw / 2, H - 8);

  /* — y axis labels — */
  ctx.textAlign = 'right';
  for (let i = 0; i <= GRID_Y; i++) {
    const v = yMin + (yMax - yMin) * (1 - i / GRID_Y);
    const y = PAD.top + (i / GRID_Y) * ph;
    ctx.fillStyle = v >= 0 ? 'rgba(52,211,153,0.6)' : 'rgba(244,63,94,0.6)';
    ctx.fillText('$' + v.toFixed(0), PAD.left - 8, y + 4);
  }
  ctx.save();
  ctx.translate(14, PAD.top + ph / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('P&L ($)', 0, 0);
  ctx.restore();

  /* — legend — */
  const legendEl = document.getElementById('chartLegend');
  legendEl.innerHTML = '';
  series.forEach(({ show, color, label, dash }) => {
    if (!show) return;
    const item = document.createElement('div');
    item.className = 'legend-item';
    const sw = document.createElement('div');
    sw.className = 'legend-swatch';
    sw.style.background = color;
    sw.style.boxShadow  = `0 0 6px ${color}`;
    if (dash.length) {
      sw.style.background = 'none';
      sw.style.backgroundImage = `repeating-linear-gradient(90deg,${color} 0,${color} 5px,transparent 5px,transparent 9px)`;
    }
    item.appendChild(sw);
    item.appendChild(document.createTextNode(label));
    legendEl.appendChild(item);
  });
}

/* ── roundRect helper ──────────────────────────────────── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ── Crosshair tooltip ─────────────────────────────────── */
payoffCanvas.addEventListener('mousemove', e => {
  const rect  = payoffCanvas.getBoundingClientRect();
  const mx    = e.clientX - rect.left;
  const W     = payoffCanvas.parentElement.clientWidth - 32;
  const PAD   = { left: 72, right: 24 };
  const pw    = W - PAD.left - PAD.right;
  const { S0, K, P, N } = state;
  const sMin  = Math.max(10, S0 * 0.4);
  const sMax  = S0 * 1.8;
  const tip   = document.getElementById('crosshairTooltip');

  if (mx < PAD.left || mx > PAD.left + pw) { tip.style.display = 'none'; return; }

  const ST         = sMin + (mx - PAD.left) / pw * (sMax - sMin);
  const stockPnL   = (ST - S0) * N;
  const putPayoff  = Math.max(K - ST, 0) * N;
  const putProfit  = (Math.max(K - ST, 0) - P) * N;
  const portProfit = stockPnL + putProfit;
  const sign       = v => (v >= 0 ? '+' : '') + '$' + Math.abs(v).toFixed(2);

  tip.style.display = 'block';
  tip.style.left    = (mx + 16 > W - 180 ? mx - 170 : mx + 16) + 'px';
  tip.style.top     = '24px';
  tip.innerHTML =
    `<span style="color:#00d4ff;font-weight:600">Sᴛ = $${ST.toFixed(2)}</span>\n` +
    `<span style="color:#94a3b8">Stock P&L   </span><span style="color:${stockPnL>=0?C.teal:C.rose}">${sign(stockPnL)}</span>\n` +
    `<span style="color:#94a3b8">Put Payoff  </span><span style="color:${C.violet}">${sign(putPayoff)}</span>\n` +
    `<span style="color:#94a3b8">Portfolio   </span><span style="color:${portProfit>=0?C.teal:C.rose};font-weight:600">${sign(portProfit)}</span>`;
});
payoffCanvas.addEventListener('mouseleave', () => {
  document.getElementById('crosshairTooltip').style.display = 'none';
});

/* ══════════════════════════════════════════════════════════
   COMPARE TAB
══════════════════════════════════════════════════════════ */
function updateCompare() {
  const { S0, K, P, N, finalPrice: ST } = state;
  const hInvest = (S0 + P) * N;
  const uInvest = S0 * N;

  const hValue = (ST + Math.max(K - ST, 0)) * N;
  const uValue = ST * N;
  const hPnL   = hValue - hInvest;
  const uPnL   = uValue - uInvest;
  const hPct   = (hPnL / hInvest) * 100;
  const uPct   = (uPnL / uInvest) * 100;
  const savings = hPnL - uPnL;

  const fmtDollar = v => (v >= 0 ? '+' : '') + '$' + Math.abs(v).toFixed(2);
  const fmtPct    = v => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
  const col       = v => v >= 0 ? C.teal : C.rose;

  const set = (id, val, color) => {
    const el = document.getElementById(id);
    el.textContent = val;
    if (color) el.style.color = color;
  };

  set('uValue', '$' + uValue.toFixed(2));
  set('hValue', '$' + hValue.toFixed(2));
  set('uPnL',  fmtDollar(uPnL), col(uPnL));
  set('hPnL',  fmtDollar(hPnL), col(hPnL));
  set('uPct',  fmtPct(uPct),    col(uPct));
  set('hPct',  fmtPct(hPct),    col(hPct));
  set('savings', fmtDollar(savings), col(savings));

  /* insights */
  const premiumCost = P * N;
  const isBelow = ST < K;
  const items = [
    {
      icon: isBelow ? '🛡️' : '📈',
      text: isBelow
        ? `Protection activated — put offset <strong style="color:${C.teal}">$${(Math.max(K-ST,0)*N).toFixed(2)}</strong> of stock losses.`
        : `Stock above strike — put expires worthless. Insurance cost: <strong style="color:${C.amber}">$${premiumCost.toFixed(2)}</strong>.`
    },
    {
      icon: savings >= 0 ? '💰' : '📉',
      text: savings >= 0
        ? `Hedge saved you <strong style="color:${C.teal}">$${savings.toFixed(2)}</strong> vs. unhedged position.`
        : `Unhedged would have outperformed by <strong style="color:${C.rose}">$${Math.abs(savings).toFixed(2)}</strong> in this scenario.`
    },
    {
      icon: '📊',
      text: `Protection cost: <strong style="color:${C.violet}">$${premiumCost.toFixed(2)}</strong> (${(P/S0*100).toFixed(1)}% of stock). Break-even at <strong style="color:${C.cyan}">$${(S0+P).toFixed(2)}</strong>.`
    }
  ];

  document.getElementById('insightBlock').innerHTML = items.map(({ icon, text }) =>
    `<div class="insight-item"><span class="insight-icon">${icon}</span><span>${text}</span></div>`
  ).join('');
}

/* ══════════════════════════════════════════════════════════
   TRADEOFF CHART
══════════════════════════════════════════════════════════ */
const tradeoffCanvas = document.getElementById('tradeoffCanvas');
const tradeoffCtx    = tradeoffCanvas.getContext('2d');

function drawTradeoffChart() {
  const dpr = window.devicePixelRatio || 1;
  const W   = tradeoffCanvas.parentElement.clientWidth - 56;
  const H   = 240;
  tradeoffCanvas.width  = W * dpr;
  tradeoffCanvas.height = H * dpr;
  tradeoffCanvas.style.width  = W + 'px';
  tradeoffCanvas.style.height = H + 'px';
  const ctx = tradeoffCtx;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const PAD = { top: 20, right: 24, bottom: 52, left: 64 };
  const pw  = W - PAD.left - PAD.right;
  const ph  = H - PAD.top  - PAD.bottom;
  const { S0, P } = state;

  const strikes   = Array.from({ length: 80 }, (_, i) => S0 * 0.6 + S0 * 0.4 * i / 79);
  const putCosts  = strikes.map(K => {
    const intrinsic = Math.max(S0 - K, 0);
    return intrinsic + (K / S0) * P * 1.4;
  });

  const xMin = strikes[0], xMax = strikes[79];
  const yMin = 0, yMax = Math.max(...putCosts) * 1.18;
  const xMap = v => PAD.left + (v - xMin) / (xMax - xMin) * pw;
  const yMap = v => PAD.top  + (1 - (v - yMin) / (yMax - yMin)) * ph;

  ctx.clearRect(0, 0, W, H);

  /* grid */
  ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (i / 4) * ph;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + pw, y); ctx.stroke();
  }

  /* fill */
  ctx.beginPath();
  strikes.forEach((s, i) => {
    const x = xMap(s), y = yMap(putCosts[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(xMap(xMax), yMap(0));
  ctx.lineTo(xMap(xMin), yMap(0));
  ctx.closePath();
  const fillG = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + ph);
  fillG.addColorStop(0, 'rgba(251,191,36,0.18)');
  fillG.addColorStop(1, 'rgba(244,63,94,0.06)');
  ctx.fillStyle = fillG;
  ctx.fill();

  /* line */
  ctx.beginPath();
  ctx.strokeStyle = C.amber;
  ctx.lineWidth   = 2.5;
  ctx.shadowColor = C.amber;
  ctx.shadowBlur  = 8;
  strikes.forEach((s, i) => {
    const x = xMap(s), y = yMap(putCosts[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  /* current K dot */
  const kIdx = Math.round((state.K - xMin) / (xMax - xMin) * 79);
  const kCost = putCosts[Math.max(0, Math.min(79, kIdx))] || 0;
  const dotX  = xMap(state.K);
  const dotY  = yMap(kCost);
  ctx.beginPath();
  ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
  ctx.fillStyle   = C.amber;
  ctx.shadowColor = C.amber;
  ctx.shadowBlur  = 16;
  ctx.fill();
  ctx.shadowBlur  = 0;
  ctx.strokeStyle = 'rgba(6,11,20,.9)';
  ctx.lineWidth   = 2.5;
  ctx.stroke();

  /* dot label */
  ctx.fillStyle = C.amber;
  ctx.font      = `500 10px 'JetBrains Mono'`;
  ctx.textAlign = 'left';
  ctx.fillText(`K=$${state.K}  ~$${kCost.toFixed(1)}`, dotX + 10, dotY - 6);

  /* x labels */
  ctx.fillStyle = C.dimText;
  ctx.font      = `11px 'JetBrains Mono'`;
  ctx.textAlign = 'center';
  for (let i = 0; i <= 5; i++) {
    const v = xMin + (xMax - xMin) * i / 5;
    ctx.fillText('$' + v.toFixed(0), xMap(v), PAD.top + ph + 20);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('Strike Price (K)', PAD.left + pw / 2, H - 8);

  /* y labels */
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = yMin + (yMax - yMin) * (1 - i / 4);
    ctx.fillStyle = C.dimText;
    ctx.fillText('$' + v.toFixed(1), PAD.left - 8, PAD.top + (i / 4) * ph + 4);
  }
  ctx.save();
  ctx.translate(14, PAD.top + ph / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('Est. Put Cost', 0, 0);
  ctx.restore();
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
updateConstruct();
drawPayoffChart();

window.addEventListener('resize', () => {
  if (document.getElementById('tab-payoff').classList.contains('active'))  drawPayoffChart();
  if (document.getElementById('tab-compare').classList.contains('active')) drawTradeoffChart();
});