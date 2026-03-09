/* ═══════════════════════════════════════════════════════════
   Protective Put Strategy — Interactive Visualizer
   app.js
═══════════════════════════════════════════════════════════ */

/* ── State ─────────────────────────────────────────────── */
const state = {
  S0: 100, K: 95, P: 5, N: 10,
  finalPrice: 80,
  showStock: true, showPut: true, showPortfolio: true, showProfit: true,
};

/* ── Colour palette ────────────────────────────────────── */
const C = {
  gold:   '#c8993a',
  goldLt: '#e8c46a',
  red:    '#c0392b',
  green:  '#1a7a4a',
  blue:   '#1e5f9c',
  ink:    '#0e0e12',
  muted:  '#b8b0a0',
};

/* ══════════════════════════════════════════════════════════
   TABS
══════════════════════════════════════════════════════════ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Ripple effect
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(200,153,58,.3);
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      animation: ripple .6s ease-out;
      pointer-events: none;
    `;
    
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
    
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + id).classList.add('active');
    if (id === 'payoff') drawPayoffChart();
    if (id === 'compare') { updateCompare(); drawTradeoffChart(); }
  });
});

// Add CSS for ripple animation
if (!document.querySelector('#ripple-style')) {
  const style = document.createElement('style');
  style.id = 'ripple-style';
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════════════════════════
   SLIDERS — TAB 1
══════════════════════════════════════════════════════════ */
function bindSlider(id, valId, fmt, key) {
  const el = document.getElementById(id);
  const vEl = document.getElementById(valId);
  el.addEventListener('input', () => {
    state[key] = parseFloat(el.value);
    vEl.textContent = fmt(state[key]);
    updateSliderGradient(el);
    updateConstruct();
    if (document.getElementById('tab-payoff').classList.contains('active')) drawPayoffChart();
    if (document.getElementById('tab-compare').classList.contains('active')) { updateCompare(); drawTradeoffChart(); }
  });
  updateSliderGradient(el);
}

function updateSliderGradient(el) {
  const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.background = `linear-gradient(to right, 
    rgba(200,153,58,1) 0%, 
    rgba(232,196,106,1) ${pct * 0.7}%, 
    rgba(200,153,58,1) ${pct}%, 
    #d6d0c4 ${pct}%)`;
}

bindSlider('stockPrice',  'stockPriceVal',  v => `$${v}`,        'S0');
bindSlider('strikePrice', 'strikePriceVal', v => `$${v}`,        'K');
bindSlider('putPremium',  'putPremiumVal',  v => `$${v.toFixed(2)}`, 'P');
bindSlider('numShares',   'numSharesVal',   v => `${v}`,         'N');

// Compare tab slider
const fpEl = document.getElementById('finalPrice');
fpEl.addEventListener('input', () => {
  state.finalPrice = parseFloat(fpEl.value);
  document.getElementById('finalPriceVal').textContent = `$${state.finalPrice}`;
  updateSliderGradient(fpEl);
  updateCompare();
});
updateSliderGradient(fpEl);

/* ── Chart checkboxes ──────────────────────────────────── */
['showStock','showPut','showPortfolio','showProfit'].forEach(id => {
  document.getElementById(id).addEventListener('change', e => {
    state[id] = e.target.checked;
    drawPayoffChart();
  });
});

/* ══════════════════════════════════════════════════════════
   CONSTRUCT UPDATE
══════════════════════════════════════════════════════════ */
function updateConstruct() {
  const { S0, K, P, N } = state;
  const stockCost  = S0 * N;
  const putCost    = P  * N;
  const total      = stockCost + putCost;
  const maxLoss    = (S0 - K) * N + putCost;
  const breakEven  = S0 + P;
  const protection = (K / S0) * 100;
  
  // Animate number changes
  animateValue('totalStockCost', stockCost);
  animateValue('totalPutCost', putCost);
  animateValue('totalInvestment', total);
  animateValue('maxLoss', maxLoss, true);
  animateValue('breakEven', breakEven);
  animateValue('protectionFloor', K);

  const pct = Math.max(0, Math.min(100, protection));
  document.getElementById('protectionBarFill').style.width = pct + '%';
  document.getElementById('protectionPct').textContent = pct.toFixed(1) + '%';
}

// Smooth number animation helper
function animateValue(id, targetValue, isNegative = false) {
  const el = document.getElementById(id);
  if (!el) return;
  
  const startValue = parseFloat(el.textContent.replace(/[^0-9.-]/g, '')) || 0;
  const duration = 300;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    
    const current = startValue + (targetValue - startValue) * easeProgress;
    const prefix = isNegative ? '-$' : '$';
    const formatted = Math.abs(current).toLocaleString(undefined, { 
      minimumFractionDigits: id.includes('breakEven') || id.includes('maxLoss') ? 2 : 0,
      maximumFractionDigits: id.includes('breakEven') || id.includes('maxLoss') ? 2 : 0
    });
    el.textContent = prefix + formatted;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/* ══════════════════════════════════════════════════════════
   PAYOFF CHART
══════════════════════════════════════════════════════════ */
const payoffCanvas = document.getElementById('payoffCanvas');
const payoffCtx    = payoffCanvas.getContext('2d');

function payoffValues(range) {
  const { S0, K, P, N } = state;
  return range.map(ST => {
    const stockPayoff    = (ST - S0) * N;
    const putPayoff      = Math.max(K - ST, 0) * N;
    const putProfit      = (Math.max(K - ST, 0) - P) * N;
    const portfolioPayoff = stockPayoff + putPayoff;
    const portfolioProfit = stockPayoff + putProfit;
    return { ST, stockPayoff, putPayoff, portfolioPayoff, portfolioProfit };
  });
}

function drawPayoffChart() {
  const canvas = payoffCanvas;
  const dpr    = window.devicePixelRatio || 1;
  const W      = canvas.parentElement.clientWidth - 40;
  const H      = 380;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = payoffCtx;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const PAD = { top: 20, right: 20, bottom: 50, left: 70 };
  const pw   = W - PAD.left - PAD.right;
  const ph   = H - PAD.top  - PAD.bottom;

  const { S0 } = state;
  const sMin = Math.max(10, S0 * 0.4);
  const sMax = S0 * 1.8;
  const N_POINTS = 160;
  const range = Array.from({ length: N_POINTS }, (_, i) => sMin + (sMax - sMin) * i / (N_POINTS - 1));
  const data  = payoffValues(range);

  // value bounds
  let yMin = Infinity, yMax = -Infinity;
  data.forEach(d => {
    [d.stockPayoff, d.putPayoff, d.portfolioPayoff, d.portfolioProfit].forEach(v => {
      if (v < yMin) yMin = v;
      if (v > yMax) yMax = v;
    });
  });
  const yPad = (yMax - yMin) * 0.12;
  yMin -= yPad; yMax += yPad;

  const xMap = v => PAD.left + (v - sMin) / (sMax - sMin) * pw;
  const yMap = v => PAD.top  + (1 - (v - yMin) / (yMax - yMin)) * ph;

  ctx.clearRect(0, 0, W, H);

  // Background grid
  ctx.strokeStyle = '#ede9e0';
  ctx.lineWidth   = 1;
  const gridY = 6;
  for (let i = 0; i <= gridY; i++) {
    const y = PAD.top + (i / gridY) * ph;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + pw, y); ctx.stroke();
  }

  // Vertical grid lines
  const gridX = 8;
  for (let i = 0; i <= gridX; i++) {
    const x = PAD.left + (i / gridX) * pw;
    ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + ph); ctx.stroke();
  }

  // Zero line
  const y0 = yMap(0);
  if (y0 >= PAD.top && y0 <= PAD.top + ph) {
    ctx.strokeStyle = '#b8b0a0';
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(PAD.left, y0); ctx.lineTo(PAD.left + pw, y0); ctx.stroke();
    ctx.setLineDash([]);
  }

  // Series definitions
  const series = [
    { key: 'stockPayoff',     show: state.showStock,     color: C.blue,   dash: [],    label: 'Stock P&L' },
    { key: 'putPayoff',       show: state.showPut,       color: C.red,    dash: [6,4], label: 'Put Payoff' },
    { key: 'portfolioPayoff', show: state.showPortfolio, color: C.gold,   dash: [],    label: 'Portfolio Payoff' },
    { key: 'portfolioProfit', show: state.showProfit,    color: C.green,  dash: [3,3], label: 'Portfolio Profit' },
  ];

  series.forEach(({ key, show, color, dash }) => {
    if (!show) return;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth   = key === 'portfolioProfit' ? 3 : 2;
    ctx.setLineDash(dash);
    data.forEach((d, i) => {
      const x = xMap(d.ST);
      const y = yMap(d[key]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // Strike line
  const xK = xMap(state.K);
  ctx.strokeStyle = 'rgba(200,153,58,.4)';
  ctx.lineWidth   = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath(); ctx.moveTo(xK, PAD.top); ctx.lineTo(xK, PAD.top + ph); ctx.stroke();
  ctx.setLineDash([]);
  
  // Strike line label with background
  ctx.fillStyle = 'rgba(200,153,58,.9)';
  ctx.fillRect(xK + 2, PAD.top + 4, 60, 20);
  ctx.fillStyle = '#fff';
  ctx.font = `600 11px 'DM Mono'`;
  ctx.fillText('K = $' + state.K, xK + 6, PAD.top + 17);

  // Break-even line
  const xBE = xMap(state.S0 + state.P);
  if (xBE >= PAD.left && xBE <= PAD.left + pw) {
    ctx.strokeStyle = 'rgba(26,122,74,.4)';
    ctx.lineWidth   = 2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(xBE, PAD.top); ctx.lineTo(xBE, PAD.top + ph); ctx.stroke();
    ctx.setLineDash([]);
    
    // Break-even label with background
    ctx.fillStyle = 'rgba(26,122,74,.85)';
    ctx.fillRect(xBE + 2, PAD.top + 28, 28, 18);
    ctx.fillStyle = '#fff';
    ctx.font = `600 10px 'DM Mono'`;
    ctx.fillText('BE', xBE + 7, PAD.top + 40);
  }

  // X axis
  ctx.fillStyle   = '#7a7060';
  ctx.font        = `11px 'DM Mono'`;
  ctx.textAlign   = 'center';
  const xTicks = 8;
  for (let i = 0; i <= xTicks; i++) {
    const v = sMin + (sMax - sMin) * i / xTicks;
    const x = xMap(v);
    ctx.fillText('$' + v.toFixed(0), x, PAD.top + ph + 18);
  }
  ctx.fillStyle = '#0e0e12';
  ctx.fillText('Stock Price at Expiry (ST)', PAD.left + pw / 2, H - 6);

  // Y axis
  ctx.textAlign = 'right';
  for (let i = 0; i <= gridY; i++) {
    const v = yMin + (yMax - yMin) * (1 - i / gridY);
    const y = PAD.top + (i / gridY) * ph;
    ctx.fillStyle = '#7a7060';
    ctx.fillText('$' + v.toFixed(0), PAD.left - 8, y + 4);
  }
  ctx.save();
  ctx.translate(14, PAD.top + ph / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign   = 'center';
  ctx.fillStyle   = '#0e0e12';
  ctx.fillText('P&L ($)', 0, 0);
  ctx.restore();
}

/* ══════════════════════════════════════════════════════════
   CHART INTERACTIVITY
══════════════════════════════════════════════════════════ */
let tooltipTimeout;
payoffCanvas.addEventListener('mousemove', e => {
  clearTimeout(tooltipTimeout);
  const rect = payoffCanvas.getBoundingClientRect();
  const mx   = e.clientX - rect.left;
  const W    = payoffCanvas.parentElement.clientWidth - 40;
  const PAD  = { left: 70, right: 20 };
  const pw   = W - PAD.left - PAD.right;
  const { S0, K, P, N } = state;
  const sMin = Math.max(10, S0 * 0.4);
  const sMax = S0 * 1.8;

  if (mx < PAD.left || mx > PAD.left + pw) {
    document.getElementById('crosshairTooltip').style.display = 'none';
    return;
  }
  
  const ST         = sMin + (mx - PAD.left) / pw * (sMax - sMin);
  const stockPnL   = (ST - S0) * N;
  const putPayoff  = Math.max(K - ST, 0) * N;
  const putProfit  = (Math.max(K - ST, 0) - P) * N;
  const portProfit = stockPnL + putProfit;

  const tip = document.getElementById('crosshairTooltip');
  tip.style.display = 'block';
  
  // Position tooltip intelligently
  const tipWidth = 200;
  const leftPos = mx + 12 + tipWidth > W ? mx - tipWidth - 12 : mx + 12;
  tip.style.left = leftPos + 'px';
  tip.style.top = '20px';
  
  // Color-code values
  const formatValue = (val, label) => {
    const color = val >= 0 ? '#2ecc71' : '#e74c3c';
    return `<span style="color: ${color}">${label}: $${val.toFixed(2)}</span>`;
  };
  
  tip.innerHTML =
    `<b style="color: #e8c46a">ST = $${ST.toFixed(2)}</b>\n` +
    formatValue(stockPnL, 'Stock P&L') + '\n' +
    formatValue(putPayoff, 'Put Payoff') + '\n' +
    `<b>${formatValue(portProfit, 'Portfolio')}</b>`;
});
payoffCanvas.addEventListener('mouseleave', () => {
  document.getElementById('crosshairTooltip').style.display = 'none';
});

/* ══════════════════════════════════════════════════════════
   COMPARE UPDATE
══════════════════════════════════════════════════════════ */
function updateCompare() {
  const { S0, K, P, N, finalPrice: ST } = state;
  const investment = (S0 + P) * N;
  const uInvestment = S0 * N;

  const hValue = (ST + Math.max(K - ST, 0)) * N;
  const uValue = ST * N;
  const hPnL   = hValue - investment;
  const uPnL   = uValue - uInvestment;
  const hPct   = (hPnL / investment)   * 100;
  const uPct   = (uPnL / uInvestment)  * 100;
  const savings = hPnL - uPnL;

  const fmt = v => (v >= 0 ? '+' : '') + '$' + Math.abs(v).toFixed(2);
  const fmtPct = v => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';

  document.getElementById('uValue').textContent = '$' + uValue.toFixed(2);
  document.getElementById('hValue').textContent = '$' + hValue.toFixed(2);
  document.getElementById('uPnL').textContent   = fmt(uPnL);
  document.getElementById('hPnL').textContent   = fmt(hPnL);
  document.getElementById('uPct').textContent   = fmtPct(uPct);
  document.getElementById('hPct').textContent   = fmtPct(hPct);
  document.getElementById('savings').textContent = fmt(savings);

  // colour
  document.getElementById('uPnL').style.color = uPnL >= 0 ? C.green : C.red;
  document.getElementById('hPnL').style.color  = hPnL >= 0 ? C.green : C.red;
  document.getElementById('uPct').style.color  = uPct >= 0 ? C.green : C.red;
  document.getElementById('hPct').style.color  = hPct >= 0 ? C.green : C.red;
  document.getElementById('savings').style.color = savings >= 0 ? C.green : C.red;

  // Insights
  const iBlock = document.getElementById('insightBlock');
  const premiumCost = P * N;
  const isBelow = ST < K;
  const aboveK  = ST > K;
  const items = [
    {
      icon: isBelow ? '🛡️' : '📈',
      text: isBelow
        ? `Protection activated: put option offset $${(Math.max(K - ST, 0) * N).toFixed(2)} of stock losses.`
        : `Stock above strike — put expires worthless. Insurance cost was $${premiumCost.toFixed(2)}.`
    },
    {
      icon: '💰',
      text: savings >= 0
        ? `Hedge saved you $${savings.toFixed(2)} compared to holding stock alone.`
        : `In this scenario, you'd have been $${Math.abs(savings).toFixed(2)} better off unhedged.`
    },
    {
      icon: '📊',
      text: `Total protection cost: $${premiumCost.toFixed(2)} (${(P / S0 * 100).toFixed(1)}% of stock price). Break-even at $${(S0 + P).toFixed(2)}.`
    }
  ];
  iBlock.innerHTML = items.map(({ icon, text }) =>
    `<div class="insight-item"><span class="insight-icon">${icon}</span><span>${text}</span></div>`
  ).join('');
}

/* ══════════════════════════════════════════════════════════
   TRADEOFF CHART
══════════════════════════════════════════════════════════ */
const tradeoffCanvas = document.getElementById('tradeoffCanvas');
const tradeoffCtx    = tradeoffCanvas.getContext('2d');

function drawTradeoffChart() {
  const canvas = tradeoffCanvas;
  const dpr    = window.devicePixelRatio || 1;
  const W      = canvas.parentElement.clientWidth - 48;
  const H      = 240;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = tradeoffCtx;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const PAD = { top: 20, right: 20, bottom: 50, left: 60 };
  const pw  = W - PAD.left - PAD.right;
  const ph  = H - PAD.top  - PAD.bottom;
  const { S0, P } = state;

  // strike range 60%–100% of S0
  const strikes = Array.from({ length: 80 }, (_, i) => S0 * 0.6 + S0 * 0.4 * i / 79);
  // Approx put cost: intrinsic + time (simple model)
  const putCosts = strikes.map(K => {
    const intrinsic = Math.max(S0 - K, 0);
    const timeFactor = (K / S0) * P * 1.4;
    return intrinsic + timeFactor;
  });

  const xMin = strikes[0], xMax = strikes[strikes.length - 1];
  const yMin = 0, yMax = Math.max(...putCosts) * 1.15;
  const xMap = v => PAD.left + (v - xMin) / (xMax - xMin) * pw;
  const yMap = v => PAD.top  + (1 - (v - yMin) / (yMax - yMin)) * ph;

  ctx.clearRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = '#ede9e0'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (i / 4) * ph;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + pw, y); ctx.stroke();
  }

  // Fill under curve
  ctx.beginPath();
  strikes.forEach((s, i) => {
    const x = xMap(s), y = yMap(putCosts[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(xMap(xMax), yMap(0));
  ctx.lineTo(xMap(xMin), yMap(0));
  ctx.closePath();
  ctx.fillStyle = 'rgba(200,153,58,.10)';
  ctx.fill();

  // Curve
  ctx.beginPath();
  ctx.strokeStyle = C.gold;
  ctx.lineWidth   = 2.5;
  strikes.forEach((s, i) => {
    const x = xMap(s), y = yMap(putCosts[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Current K dot
  const kDotX = xMap(state.K);
  const kDotY = yMap(putCosts[Math.round((state.K - xMin) / (xMax - xMin) * 79)] || 0);
  ctx.beginPath();
  ctx.arc(kDotX, kDotY, 6, 0, Math.PI * 2);
  ctx.fillStyle = C.gold;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Axes labels
  ctx.fillStyle  = '#7a7060';
  ctx.font       = '11px "DM Mono", monospace';
  ctx.textAlign  = 'center';
  for (let i = 0; i <= 5; i++) {
    const v = xMin + (xMax - xMin) * i / 5;
    ctx.fillText('$' + v.toFixed(0), xMap(v), PAD.top + ph + 18);
  }
  ctx.fillStyle = '#0e0e12';
  ctx.fillText('Strike Price (K)', PAD.left + pw / 2, H - 6);

  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = yMin + (yMax - yMin) * (1 - i / 4);
    ctx.fillStyle = '#7a7060';
    ctx.fillText('$' + v.toFixed(1), PAD.left - 8, PAD.top + (i / 4) * ph + 4);
  }
  ctx.save();
  ctx.translate(14, PAD.top + ph / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign  = 'center';
  ctx.fillStyle  = '#0e0e12';
  ctx.fillText('Est. Put Cost', 0, 0);
  ctx.restore();
}

/* ══════════════════════════════════════════════════════════
   EVENT LISTENERS
══════════════════════════════════════════════════════════ */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Window resize handler with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (document.getElementById('tab-payoff').classList.contains('active')) drawPayoffChart();
    if (document.getElementById('tab-compare').classList.contains('active')) drawTradeoffChart();
  }, 150);
});

// Add loading animation on page load
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
updateConstruct();
drawPayoffChart();