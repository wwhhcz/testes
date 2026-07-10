/* =============================================================
   RADAR DA BARRA — app.js
   Script único compartilhado por todas as páginas do site.
   Carregado depois de data.js em todo HTML.
   Elementos que só existem em uma página específica são sempre
   checados antes de usar (ex: "if(priceGrid){...}") para que este
   mesmo arquivo funcione em qualquer uma das abas sem erros.
============================================================= */

function pctChange(o,c){ return ((c-o)/o)*100; }

/* ===================== HEADER: menu mobile ===================== */
const burgerBtn = document.getElementById('burgerBtn');
const mainNav = document.getElementById('mainNav');
if(burgerBtn && mainNav){
  burgerBtn.addEventListener('click', ()=> mainNav.classList.toggle('open'));
}

/* ===================== TICKER (aparece no header, todas as páginas) ===================== */
const tickerTrack = document.getElementById('tickerTrack');
function buildTicker(){
  if(!tickerTrack) return;
  const set = foods.map(f=>{
    const delta = pctChange(f.old,f.cur); const up = delta>0;
    return `<span class="tick-item">${f.n.split('(')[0].trim()} <span class="${up?'tick-up':'tick-down'}">${up?'▲':'▼'} ${Math.abs(delta).toFixed(1)}% · R$ ${f.cur.toFixed(2)}</span></span>`;
  }).join('');
  tickerTrack.innerHTML = set + set; // duplicado para o loop ficar contínuo
}

/* ===================== SCROLL REVEAL (todas as páginas) ===================== */
const revealObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); revealObs.unobserve(e.target); } });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

/* ===================== PÁGINA: PREÇOS (index.html) ===================== */
const grid = document.getElementById('priceGrid');
const emptyMsg = document.getElementById('emptyMsg');
let currentCat = 'todos', currentVari = 'todos', currentSearch = '';

function renderPrices(){
  if(!grid) return;
  const term = currentSearch.trim().toLowerCase();
  let items = foods.filter(f=>{
    const matchCat = currentCat==='todos' || f.c===currentCat;
    const matchSearch = f.n.toLowerCase().includes(term);
    const delta = pctChange(f.old,f.cur);
    const matchVari = currentVari==='todos' || (currentVari==='up' && delta>0) || (currentVari==='down' && delta<0);
    return matchCat && matchSearch && matchVari;
  });
  grid.innerHTML = '';
  if(emptyMsg) emptyMsg.style.display = items.length? 'none':'block';
  items.forEach(f=>{
    const delta = pctChange(f.old,f.cur);
    const up = delta>0;
    const card = document.createElement('div');
    card.className = 'price-card';
    card.innerHTML = `
      <span class="cat">${f.c}</span>
      <h4>${f.n}</h4>
      <div class="price-row">
        <span class="price-old mono">R$ ${f.old.toFixed(2)}</span>
        <span class="price-new mono">R$ ${f.cur.toFixed(2)}</span>
      </div>
      <span class="badge ${up?'up':'down'}">${up?'▲':'▼'} ${Math.abs(delta).toFixed(1)}%</span>
    `;
    grid.appendChild(card);
  });
}

function updateCounts(){
  const upEl = document.getElementById('upCount'), downEl = document.getElementById('downCount');
  if(!upEl || !downEl) return;
  upEl.textContent = foods.filter(f=>pctChange(f.old,f.cur)>0).length;
  downEl.textContent = foods.filter(f=>pctChange(f.old,f.cur)<0).length;
}

const searchInput = document.getElementById('searchInput');
if(searchInput) searchInput.addEventListener('input', e=>{currentSearch=e.target.value; renderPrices();});
const catFilter = document.getElementById('catFilter');
if(catFilter) catFilter.addEventListener('change', e=>{currentCat=e.target.value; renderPrices();});
document.querySelectorAll('#variSeg button').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('#variSeg button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); currentVari=b.dataset.vari; renderPrices();
  });
});

/* ===================== PÁGINA: MERCADOS ===================== */
const marketGrid = document.getElementById('marketGrid');
function renderMarkets(){
  if(!marketGrid) return;
  marketGrid.innerHTML = markets.map(m=>`
    <div class="market-card">
      <div class="top-row">
        <h4>${m.n}</h4>
        <span class="rating mono">★ ${m.rating.toFixed(1)}</span>
      </div>
      <span class="market-tag ${m.best?'best':''}">${m.best?'★ Melhor custo-benefício':m.tag}</span>
      <div class="addr">${m.addr}</div>
      <a class="maplink" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lng}">Ver no mapa →</a>
    </div>
  `).join('');
}

/* ===================== PÁGINA: TUTORIAL (FAQ) ===================== */
const faqList = document.getElementById('faqList');
function renderFaq(){
  if(!faqList) return;
  faqList.innerHTML = faqs.map((f,i)=>`
    <div class="faq-item" data-i="${i}">
      <button class="faq-q">${f.q}<span class="plus">+</span></button>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>
  `).join('');
  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.parentElement;
      const ans = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(o=>{o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight=null;});
      if(!isOpen){ item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight+'px'; }
    });
  });
}

/* ===================== PÁGINA: REPORTAR ===================== */
const pAlimento = document.getElementById('p-alimento');
const pMercado = document.getElementById('p-mercado');
const vMercado = document.getElementById('v-mercado');
if(pAlimento && pMercado && vMercado){
  foods.forEach(f=>{ const o=document.createElement('option'); o.textContent=f.n; pAlimento.appendChild(o); });
  markets.forEach(m=>{
    const o1=document.createElement('option'); o1.textContent=m.n; pMercado.appendChild(o1);
    const o2=document.createElement('option'); o2.textContent=m.n; vMercado.appendChild(o2);
  });
}

const reportTabs = document.querySelectorAll('.report-tabs button');
reportTabs.forEach(b=>{
  b.addEventListener('click', ()=>{
    reportTabs.forEach(x=>x.classList.remove('active')); b.classList.add('active');
    document.querySelectorAll('#form-preco, #form-venc').forEach(p=>p.classList.remove('active'));
    document.getElementById('form-'+b.dataset.form).classList.add('active');
  });
});

const reportsList = document.getElementById('reportsList');
function loadReports(){ return dbGet(DB_KEYS.reports); }
function saveReports(list){ dbSet(DB_KEYS.reports, list); renderDbPanel(); }
function renderReports(){
  if(!reportsList) return;
  const list = loadReports();
  if(!list.length){ reportsList.innerHTML = '<p style="color:var(--gray); font-size:.86rem;">Nenhum reporte ainda. Seja o primeiro a contribuir!</p>'; return; }
  reportsList.innerHTML = list.slice().reverse().slice(0,12).map(r=>`
    <div class="report-item">
      <span>${r.text}</span>
      <span class="who">${r.who} · ${r.date}</span>
    </div>
  `).join('');
}

const formPreco = document.getElementById('formPreco');
if(formPreco) formPreco.addEventListener('submit', e=>{
  e.preventDefault();
  const alimento = pAlimento.value, mercado = pMercado.value, preco = document.getElementById('p-preco').value;
  const nome = document.getElementById('p-nome').value.trim() || 'Anônimo';
  const list = loadReports();
  list.push({text:`💰 ${alimento} — R$ ${parseFloat(preco).toFixed(2)} no ${mercado}`, who:nome, date:new Date().toLocaleDateString('pt-BR')});
  saveReports(list); renderReports();
  document.getElementById('confirmPreco').style.display='block';
  e.target.reset();
  setTimeout(()=>document.getElementById('confirmPreco').style.display='none', 4000);
});

const formVenc = document.getElementById('formVenc');
if(formVenc) formVenc.addEventListener('submit', e=>{
  e.preventDefault();
  const produto = document.getElementById('v-produto').value, mercado = vMercado.value, data = document.getElementById('v-data').value;
  const list = loadReports();
  list.push({text:`⏰ ${produto} vence em ${new Date(data+'T00:00:00').toLocaleDateString('pt-BR')} — ${mercado}`, who:'Comunidade', date:new Date().toLocaleDateString('pt-BR')});
  saveReports(list); renderReports();
  document.getElementById('confirmVenc').style.display='block';
  e.target.reset();
  setTimeout(()=>document.getElementById('confirmVenc').style.display='none', 4000);
});

/* ===================== ACESSIBILIDADE (todas as páginas) ===================== */
const a11yBtn = document.getElementById('a11yBtn');
const a11yPanel = document.getElementById('a11yPanel');
const a11yCloseBtn = document.getElementById('a11yCloseBtn');

function loadA11y(){
  try{ return JSON.parse(localStorage.getItem('radarBarraA11y')||'{}'); }catch(e){ return {}; }
}
function saveA11y(state){ localStorage.setItem('radarBarraA11y', JSON.stringify(state)); }

let a11y = Object.assign({fontStep:0, contrast:false, underline:false, dyslexia:false, cursor:false, pause:false, guide:false, speech:false}, loadA11y());

const a11yToggles = {
  contrast:{id:'toggleContrast', cls:'a11y-contrast'},
  underline:{id:'toggleUnderline', cls:'a11y-underline'},
  dyslexia:{id:'toggleDyslexia', cls:'a11y-dyslexia'},
  cursor:{id:'toggleCursor', cls:'a11y-bigcursor'},
  pause:{id:'togglePause', cls:'a11y-pause'},
  guide:{id:'toggleGuide', cls:'a11y-reading-guide'},
};

function applyA11y(){
  const fontValEl = document.getElementById('fontVal');
  if(fontValEl) fontValEl.textContent = (100 + a11y.fontStep*10) + '%';
  document.documentElement.style.fontSize = (100 + a11y.fontStep*10) + '%';
  Object.keys(a11yToggles).forEach(key=>{
    const t = a11yToggles[key];
    document.body.classList.toggle(t.cls, !!a11y[key]);
    const el = document.getElementById(t.id);
    if(el) el.classList.toggle('active', !!a11y[key]);
  });
  const speechEl = document.getElementById('toggleSpeech');
  if(speechEl) speechEl.classList.toggle('active', !!a11y.speech);
  saveA11y(a11y);
}

const fontPlus = document.getElementById('fontPlus');
if(fontPlus) fontPlus.addEventListener('click', ()=>{ if(a11y.fontStep<5){ a11y.fontStep++; applyA11y(); } });
const fontMinus = document.getElementById('fontMinus');
if(fontMinus) fontMinus.addEventListener('click', ()=>{ if(a11y.fontStep>-3){ a11y.fontStep--; applyA11y(); } });

Object.keys(a11yToggles).forEach(key=>{
  const el = document.getElementById(a11yToggles[key].id);
  if(el) el.addEventListener('click', ()=>{ a11y[key] = !a11y[key]; applyA11y(); });
});

const toggleSpeechBtn = document.getElementById('toggleSpeech');
if(toggleSpeechBtn) toggleSpeechBtn.addEventListener('click', ()=>{ a11y.speech = !a11y.speech; applyA11y(); });

document.addEventListener('mouseup', ()=>{
  if(!a11y.speech) return;
  const text = window.getSelection().toString().trim();
  if(text && 'speechSynthesis' in window){
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    window.speechSynthesis.speak(utter);
  }
});

const readingGuide = document.getElementById('readingGuide');
document.addEventListener('mousemove', e=>{
  if(a11y.guide && readingGuide){ readingGuide.style.top = (e.clientY - 18) + 'px'; }
});

const a11yResetBtn = document.getElementById('a11yReset');
if(a11yResetBtn) a11yResetBtn.addEventListener('click', ()=>{
  a11y = {fontStep:0, contrast:false, underline:false, dyslexia:false, cursor:false, pause:false, guide:false, speech:false};
  applyA11y();
});

if(a11yBtn) a11yBtn.addEventListener('click', ()=>{
  const open = a11yPanel.classList.toggle('open');
  a11yBtn.setAttribute('aria-expanded', open);
});
if(a11yCloseBtn) a11yCloseBtn.addEventListener('click', ()=>{
  a11yPanel.classList.remove('open');
  a11yBtn.setAttribute('aria-expanded','false');
});
document.addEventListener('click', e=>{
  if(a11yPanel && a11yBtn && !a11yPanel.contains(e.target) && !a11yBtn.contains(e.target)){
    a11yPanel.classList.remove('open'); a11yBtn.setAttribute('aria-expanded','false');
  }
});

applyA11y();

/* ===================== BANCO DE DADOS TEMPORÁRIO (sessionStorage) ===================== */
// Usuários, pedidos e reportes ficam salvos só durante esta aba do navegador.
// Ao fechar a aba, tudo some — ideal pra testar o site sem deixar dado permanente.
const DB_KEYS = {users:'radarBarraUsers', orders:'radarBarraOrders', reports:'radarBarraReports', session:'radarBarraSession'};
function dbGet(key){ try{ return JSON.parse(sessionStorage.getItem(key)||'[]'); }catch(e){ return []; } }
function dbSet(key, val){ sessionStorage.setItem(key, JSON.stringify(val)); }

function simpleHash(str){
  let hash = 0;
  for(let i=0;i<str.length;i++){ hash = ((hash<<5)-hash) + str.charCodeAt(i); hash |= 0; }
  return Math.abs(hash).toString(36);
}
function hashPass(email, senha){ return simpleHash(email.trim().toLowerCase()+'::'+senha); }

function getUsers(){ return dbGet(DB_KEYS.users); }
function saveUsers(list){ dbSet(DB_KEYS.users, list); renderDbPanel(); }
function getSessionEmail(){ return sessionStorage.getItem(DB_KEYS.session); }
function setSessionEmail(email){ sessionStorage.setItem(DB_KEYS.session, email); }
function clearSession(){ sessionStorage.removeItem(DB_KEYS.session); }
function currentUser(){
  const email = getSessionEmail();
  if(!email) return null;
  return getUsers().find(u=>u.email===email) || null;
}

/* ===================== CARRINHO — estado persistente entre páginas ===================== */
let selectedMarket = null;
let cart = [];

function loadCartState(){
  try{
    const s = JSON.parse(sessionStorage.getItem('radarBarraCartState')||'null');
    if(s){ selectedMarket = s.selectedMarket; cart = s.cart || []; }
  }catch(e){ selectedMarket = null; cart = []; }
}
function saveCartState(){
  sessionStorage.setItem('radarBarraCartState', JSON.stringify({selectedMarket, cart}));
}
loadCartState();

/* ---- Catálogo (só existe em pedidos.html) ---- */
const pedidoMarketSelect = document.getElementById('pedidoMarketSelect');
const orderGrid = document.getElementById('orderGrid');
const catalogHead = document.getElementById('catalogHead');
const catalogMarketName = document.getElementById('catalogMarketName');
let orderCatCurrent = 'todos', orderSearchCurrent = '';

function renderMarketChips(){
  if(!pedidoMarketSelect) return;
  pedidoMarketSelect.innerHTML = markets.map((m,i)=>`
    <button class="market-chip ${selectedMarket===i?'active':''}" data-i="${i}">
      ${m.n} <span class="stars">★${m.rating.toFixed(1)}</span>
    </button>
  `).join('');
  pedidoMarketSelect.querySelectorAll('.market-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      const i = parseInt(chip.dataset.i);
      if(selectedMarket!==i && cart.length){
        if(!confirm('Trocar de mercado vai esvaziar sua sacola atual. Continuar?')) return;
        cart = [];
      }
      selectedMarket = i;
      saveCartState();
      renderMarketChips();
      if(catalogHead) catalogHead.style.display = 'block';
      if(catalogMarketName) catalogMarketName.textContent = 'Catálogo — ' + markets[i].n;
      renderOrderGrid();
      renderCart();
    });
  });
  if(selectedMarket!==null && catalogHead){
    catalogHead.style.display = 'block';
    catalogMarketName.textContent = 'Catálogo — ' + markets[selectedMarket].n;
  }
}

function renderOrderGrid(){
  if(!orderGrid) return;
  if(selectedMarket===null){
    orderGrid.innerHTML = '<div class="catalog-placeholder">Escolha um mercado acima para ver os produtos disponíveis para pedido.</div>';
    return;
  }
  const term = orderSearchCurrent.trim().toLowerCase();
  const items = foods.filter(f=> (orderCatCurrent==='todos'||f.c===orderCatCurrent) && f.n.toLowerCase().includes(term));
  orderGrid.innerHTML = items.map(f=>{
    const inCart = cart.find(c=>c.name===f.n);
    const qty = inCart? inCart.qty : 0;
    return `
      <div class="order-card">
        <span class="cat">${f.c}</span>
        <h4>${f.n}</h4>
        <span class="price mono">R$ ${f.cur.toFixed(2)}</span>
        <div class="add-row">
          ${qty>0 ? `
            <div class="qty-stepper">
              <button class="qty-minus" data-name="${f.n}">−</button>
              <span class="q">${qty}</span>
              <button class="qty-plus" data-name="${f.n}">+</button>
            </div>
          ` : `<button class="add-btn" data-name="${f.n}" data-price="${f.cur}">+ Adicionar</button>`}
        </div>
      </div>
    `;
  }).join('');

  orderGrid.querySelectorAll('.add-btn').forEach(b=>b.addEventListener('click', ()=>{
    cart.push({name:b.dataset.name, price:parseFloat(b.dataset.price), qty:1});
    saveCartState(); renderOrderGrid(); renderCart();
  }));
  orderGrid.querySelectorAll('.qty-plus').forEach(b=>b.addEventListener('click', ()=>{
    const item = cart.find(c=>c.name===b.dataset.name); if(item) item.qty++;
    saveCartState(); renderOrderGrid(); renderCart();
  }));
  orderGrid.querySelectorAll('.qty-minus').forEach(b=>b.addEventListener('click', ()=>{
    const item = cart.find(c=>c.name===b.dataset.name);
    if(item){ item.qty--; if(item.qty<=0) cart = cart.filter(c=>c.name!==b.dataset.name); }
    saveCartState(); renderOrderGrid(); renderCart();
  }));
}

const orderSearchEl = document.getElementById('orderSearch');
if(orderSearchEl) orderSearchEl.addEventListener('input', e=>{orderSearchCurrent=e.target.value; renderOrderGrid();});
const orderCatFilterEl = document.getElementById('orderCatFilter');
if(orderCatFilterEl) orderCatFilterEl.addEventListener('change', e=>{orderCatCurrent=e.target.value; renderOrderGrid();});

/* ---- Carrinho flutuante / drawer (aparece em todas as páginas) ---- */
const cartFab = document.getElementById('cartFab');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartSummaryEl = document.getElementById('cartSummary');
const cartMarketTag = document.getElementById('cartMarketTag');

function cartSubtotal(){ return cart.reduce((s,c)=>s+c.price*c.qty,0); }

function renderCart(){
  const cartCountEl = document.getElementById('cartCount');
  if(cartCountEl) cartCountEl.textContent = cart.reduce((s,c)=>s+c.qty,0);
  if(cartMarketTag) cartMarketTag.textContent = selectedMarket!==null ? '🛒 ' + markets[selectedMarket].n : '';
  if(!cartItemsEl) return;
  if(!cart.length){
    cartItemsEl.innerHTML=''; cartEmptyEl.style.display='block'; cartSummaryEl.style.display='none';
    return;
  }
  cartEmptyEl.style.display='none'; cartSummaryEl.style.display='flex';
  cartItemsEl.innerHTML = cart.map(c=>`
    <div class="cart-item">
      <div>
        <div class="ci-name">${c.qty}x ${c.name}</div>
        <div class="ci-price mono">R$ ${(c.price*c.qty).toFixed(2)}</div>
      </div>
      <button class="remove-btn" data-name="${c.name}">🗑️</button>
    </div>
  `).join('');
  cartItemsEl.querySelectorAll('.remove-btn').forEach(b=>b.addEventListener('click', ()=>{
    cart = cart.filter(c=>c.name!==b.dataset.name); saveCartState(); renderCart(); renderOrderGrid();
  }));
  const sub = cartSubtotal();
  const fee = deliveryMode==='entrega' ? 5 : 0;
  document.getElementById('cartSubtotal').textContent = 'R$ '+sub.toFixed(2);
  document.getElementById('cartFee').textContent = fee? 'R$ '+fee.toFixed(2) : 'Grátis';
  document.getElementById('cartTotal').textContent = 'R$ '+(sub+fee).toFixed(2);
}

function openCart(){ if(cartOverlay && cartDrawer){ cartOverlay.classList.add('open'); cartDrawer.classList.add('open'); } }
function closeCart(){ if(cartOverlay && cartDrawer){ cartOverlay.classList.remove('open'); cartDrawer.classList.remove('open'); } }
if(cartFab) cartFab.addEventListener('click', openCart);
const cartCloseBtn = document.getElementById('cartCloseBtn');
if(cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
if(cartOverlay) cartOverlay.addEventListener('click', closeCart);

/* ---- Checkout (modal compartilhado em todas as páginas) ---- */
const checkoutOverlay = document.getElementById('checkoutOverlay');
let deliveryMode = 'retirada';
const goCheckoutBtn = document.getElementById('goCheckoutBtn');
if(goCheckoutBtn) goCheckoutBtn.addEventListener('click', ()=>{
  if(!cart.length) return;
  closeCart();
  if(!requireLogin('checkout')) return;
  prefillCheckout();
  checkoutOverlay.classList.add('open');
});
const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
if(checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', ()=>checkoutOverlay.classList.remove('open'));
if(checkoutOverlay) checkoutOverlay.addEventListener('click', e=>{ if(e.target===checkoutOverlay) checkoutOverlay.classList.remove('open'); });

document.querySelectorAll('#deliverySeg button').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('#deliverySeg button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    deliveryMode = b.dataset.mode;
    document.getElementById('addressField').classList.toggle('hidden', deliveryMode==='retirada');
    document.getElementById('co-endereco').required = deliveryMode==='entrega';
    renderCart();
  });
});
const addressFieldEl = document.getElementById('addressField');
if(addressFieldEl) addressFieldEl.classList.add('hidden');

function loadOrders(){ return dbGet(DB_KEYS.orders); }
function saveOrders(list){ dbSet(DB_KEYS.orders, list); renderDbPanel(); }

const checkoutForm = document.getElementById('checkoutForm');
if(checkoutForm) checkoutForm.addEventListener('submit', e=>{
  e.preventDefault();
  const orders = loadOrders();
  const id = 'RB' + Math.floor(1000+Math.random()*9000);
  const order = {
    id, market: markets[selectedMarket].n, items: cart.map(c=>({name:c.name, qty:c.qty, price:c.price})),
    total: cartSubtotal() + (deliveryMode==='entrega'?5:0), mode: deliveryMode,
    nome: document.getElementById('co-nome').value, endereco: document.getElementById('co-endereco').value,
    pagamento: document.getElementById('co-pagamento').value, date: new Date().toLocaleDateString('pt-BR'),
    time: new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}), status: 0,
    email: currentUser() ? currentUser().email : null
  };
  orders.push(order); saveOrders(orders);
  cart = []; saveCartState(); renderCart(); renderOrderGrid();
  checkoutOverlay.classList.remove('open');
  e.target.reset();
  document.querySelectorAll('#deliverySeg button')[0].click();
  openStatusModal(order.id);
  simulateOrderProgress(order.id);
});

/* ---- Simulação de status do pedido (compartilhado) ---- */
function simulateOrderProgress(id){
  const delays = [3500, 5000, 5500];
  delays.forEach((d,i)=>{
    setTimeout(()=>{
      const orders = loadOrders();
      const o = orders.find(x=>x.id===id);
      if(!o) return;
      o.status = i+1;
      saveOrders(orders);
      if(statusOverlay.classList.contains('open') && document.getElementById('statusOrderId').textContent==='#'+id){
        renderStatus(o);
      }
    }, delays.slice(0,i+1).reduce((a,b)=>a+b,0));
  });
}

const statusOverlay = document.getElementById('statusOverlay');
function renderStatus(order){
  document.getElementById('statusOrderId').textContent = '#'+order.id;
  document.getElementById('statusOrderSummary').textContent =
    `${order.market} · ${order.items.reduce((s,i)=>s+i.qty,0)} itens · R$ ${order.total.toFixed(2)} · ${order.mode==='entrega'?'Entrega':'Retirada'}`;
  document.getElementById('statusStep2Title').textContent = order.mode==='entrega' ? 'Saiu para entrega' : 'Pronto para retirada';
  document.getElementById('statusStep2Sub').textContent = order.mode==='entrega' ? 'A caminho do seu endereço.' : 'Pode buscar no mercado.';
  document.querySelectorAll('#statusTrack .status-step').forEach(step=>{
    const s = parseInt(step.dataset.step);
    step.classList.toggle('done', s < order.status);
    step.classList.toggle('current', s === order.status);
  });
}
function openStatusModal(id){
  const order = loadOrders().find(o=>o.id===id);
  if(!order) return;
  renderStatus(order);
  statusOverlay.classList.add('open');
}
const statusCloseBtn = document.getElementById('statusCloseBtn');
if(statusCloseBtn) statusCloseBtn.addEventListener('click', ()=>statusOverlay.classList.remove('open'));
if(statusOverlay) statusOverlay.addEventListener('click', e=>{ if(e.target===statusOverlay) statusOverlay.classList.remove('open'); });

/* ---- Meus pedidos (modal compartilhado, função acessível de qualquer página) ---- */
const myOrdersOverlay = document.getElementById('myOrdersOverlay');
function openMyOrdersModal(){
  if(!requireLogin('pedidos')) return;
  const orders = loadOrders().slice().reverse().filter(o=>o.email===currentUser().email);
  const list = document.getElementById('myOrdersList');
  list.innerHTML = orders.length ? orders.map(o=>`
    <div class="myorder-item">
      <div class="mo-top"><span>${o.market}</span><span class="mono">R$ ${o.total.toFixed(2)}</span></div>
      <div class="mo-meta">${o.id} · ${o.date} ${o.time} · ${o.items.reduce((s,i)=>s+i.qty,0)} itens · ${o.mode==='entrega'?'Entrega':'Retirada'}</div>
      <span class="mo-status ${o.status>=3?'done':''}">${o.status>=3?'Concluído':['Recebido','Preparando', o.mode==='entrega'?'A caminho':'Pronto p/ retirada'][o.status]}</span>
      <button class="see-status" data-id="${o.id}">Ver acompanhamento →</button>
    </div>
  `).join('') : '<p style="color:var(--gray); font-size:.86rem;">Você ainda não fez nenhum pedido.</p>';
  list.querySelectorAll('.see-status').forEach(b=>b.addEventListener('click', ()=>{
    myOrdersOverlay.classList.remove('open'); openStatusModal(b.dataset.id);
  }));
  myOrdersOverlay.classList.add('open');
}
const openMyOrdersBtn = document.getElementById('openMyOrders');
if(openMyOrdersBtn) openMyOrdersBtn.addEventListener('click', openMyOrdersModal);

const myOrdersCloseBtn = document.getElementById('myOrdersCloseBtn');
if(myOrdersCloseBtn) myOrdersCloseBtn.addEventListener('click', ()=>myOrdersOverlay.classList.remove('open'));
if(myOrdersOverlay) myOrdersOverlay.addEventListener('click', e=>{ if(e.target===myOrdersOverlay) myOrdersOverlay.classList.remove('open'); });

document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){
    closeCart();
    if(checkoutOverlay) checkoutOverlay.classList.remove('open');
    if(statusOverlay) statusOverlay.classList.remove('open');
    if(myOrdersOverlay) myOrdersOverlay.classList.remove('open');
  }
});

/* ===================== HEADER: pill de conta (todas as páginas) ===================== */
const authArea = document.getElementById('authArea');
let pendingAction = sessionStorage.getItem('radarBarraPendingAction') || null;

function renderAuthArea(){
  if(!authArea) return;
  const user = currentUser();
  if(!user){
    authArea.innerHTML = `<button class="auth-btn-login" id="authLoginBtn">Entrar</button>`;
    document.getElementById('authLoginBtn').addEventListener('click', ()=>goToConta());
    renderContaSection();
    return;
  }
  const initials = user.name.trim().split(/\s+/).slice(0,2).map(w=>w[0].toUpperCase()).join('');
  authArea.innerHTML = `
    <button class="user-pill" id="userPillBtn">
      <span class="user-avatar">${initials}</span>
      <span class="uname">${user.name.split(' ')[0]}</span>
    </button>
    <div class="user-dropdown" id="userDropdown">
      <button id="ddMeusPedidos">📦 Meus pedidos</button>
      <button class="logout" id="ddLogout">Sair</button>
    </div>
  `;
  document.getElementById('userPillBtn').addEventListener('click', e=>{
    e.stopPropagation();
    document.getElementById('userDropdown').classList.toggle('open');
  });
  document.getElementById('ddMeusPedidos').addEventListener('click', ()=>{
    document.getElementById('userDropdown').classList.remove('open');
    openMyOrdersModal();
  });
  document.getElementById('ddLogout').addEventListener('click', ()=>{
    clearSession(); renderAuthArea(); renderCart();
    document.getElementById('userDropdown').classList.remove('open');
  });
  renderContaSection();
}
document.addEventListener('click', ()=>{
  const dd = document.getElementById('userDropdown');
  if(dd) dd.classList.remove('open');
});

/* ===================== PÁGINA: CONTA ===================== */
function renderContaSection(){
  const loggedOut = document.getElementById('contaLoggedOut');
  const loggedIn = document.getElementById('contaLoggedIn');
  if(!loggedOut || !loggedIn) return; // não estamos em conta.html
  const user = currentUser();
  if(user){
    loggedOut.style.display = 'none';
    loggedIn.style.display = 'block';
    document.getElementById('contaWelcome').textContent = 'Olá, ' + user.name.split(' ')[0] + '!';
    document.getElementById('contaEmailShow').textContent = user.email;
  } else {
    loggedOut.style.display = 'block';
    loggedIn.style.display = 'none';
  }
}

function goToConta(){
  if(document.getElementById('contaLoggedOut')) return; // já estamos na página Conta
  window.location.href = 'conta.html';
}

// Se o carrinho ou "meus pedidos" precisar de login, manda pra página Conta.
function requireLogin(action){
  if(currentUser()) return true;
  pendingAction = action;
  sessionStorage.setItem('radarBarraPendingAction', action);
  goToConta();
  return false;
}

const contaTabs = document.querySelectorAll('#contaTabs button');
contaTabs.forEach(b=>{
  b.addEventListener('click', ()=>{
    contaTabs.forEach(x=>x.classList.remove('active')); b.classList.add('active');
    document.getElementById('form-login').classList.toggle('active', b.dataset.form==='login');
    document.getElementById('form-cadastro').classList.toggle('active', b.dataset.form==='cadastro');
  });
});

function proceedAfterAuth(){
  renderAuthArea();
  const action = pendingAction;
  pendingAction = null;
  sessionStorage.removeItem('radarBarraPendingAction');
  if(action==='checkout' && checkoutOverlay){
    prefillCheckout();
    checkoutOverlay.classList.add('open');
  } else if(action==='pedidos'){
    openMyOrdersModal();
  } else {
    renderContaSection();
  }
}

const loginForm = document.getElementById('loginForm');
if(loginForm) loginForm.addEventListener('submit', e=>{
  e.preventDefault();
  const email = document.getElementById('li-email').value.trim().toLowerCase();
  const senha = document.getElementById('li-senha').value;
  const user = getUsers().find(u=>u.email===email);
  const errEl = document.getElementById('loginError');
  if(!user || user.passHash !== hashPass(email, senha)){
    errEl.style.display='block'; return;
  }
  errEl.style.display='none';
  setSessionEmail(email);
  e.target.reset();
  proceedAfterAuth();
});

const cadastroForm = document.getElementById('cadastroForm');
if(cadastroForm) cadastroForm.addEventListener('submit', e=>{
  e.preventDefault();
  const nome = document.getElementById('ca-nome').value.trim();
  const email = document.getElementById('ca-email').value.trim().toLowerCase();
  const tel = document.getElementById('ca-tel').value.trim();
  const endereco = document.getElementById('ca-endereco').value.trim();
  const senha = document.getElementById('ca-senha').value;
  const senha2 = document.getElementById('ca-senha2').value;
  const errEl = document.getElementById('cadastroError');

  const users = getUsers();
  if(users.some(u=>u.email===email)){
    errEl.textContent = 'Já existe uma conta com esse e-mail. Faça login.'; errEl.style.display='block'; return;
  }
  if(senha !== senha2){
    errEl.textContent = 'As senhas não coincidem.'; errEl.style.display='block'; return;
  }
  errEl.style.display='none';
  users.push({name:nome, email, phone:tel, address:endereco, passHash:hashPass(email, senha)});
  saveUsers(users);
  setSessionEmail(email);
  e.target.reset();
  proceedAfterAuth();
});

const contaGoOrdersBtn = document.getElementById('contaGoOrdersBtn');
if(contaGoOrdersBtn) contaGoOrdersBtn.addEventListener('click', openMyOrdersModal);
const contaLogoutBtn = document.getElementById('contaLogoutBtn');
if(contaLogoutBtn) contaLogoutBtn.addEventListener('click', ()=>{ clearSession(); renderAuthArea(); renderCart(); });

function prefillCheckout(){
  const user = currentUser();
  if(!user) return;
  document.getElementById('co-nome').value = user.name || '';
  document.getElementById('co-tel').value = user.phone || '';
  if(user.address) document.getElementById('co-endereco').value = user.address;
}

/* ===================== ADMIN — banco de dados temporário (visível só pro admin) ===================== */
// Conta única de administrador (usuário: henry). A senha é comparada por um
// hash simples — como é tudo client-side, isso NÃO é segurança de verdade,
// é só uma trava pra clientes comuns não verem/mexerem no banco de teste.
const ADMIN_USER = 'henry';
const ADMIN_HASH = 'i5gk'; // hash de "henry:23052008"
const ADMIN_SESSION_KEY = 'radarBarraAdminSession';

function renderDbPanel(){
  const usersCountEl = document.getElementById('dbUsersCount');
  if(!usersCountEl) return;
  usersCountEl.textContent = getUsers().length;
  document.getElementById('dbOrdersCount').textContent = loadOrders().length;
  document.getElementById('dbReportsCount').textContent = loadReports().length;
  const jsonView = document.getElementById('dbJsonView');
  if(jsonView.classList.contains('open')){
    jsonView.textContent = JSON.stringify({
      usuarios: getUsers().map(u=>({name:u.name, email:u.email, phone:u.phone, address:u.address, passHash:u.passHash})),
      pedidos: loadOrders(),
      reportes: loadReports()
    }, null, 2);
  }
}

const adminOverlay = document.getElementById('adminOverlay');
const adminLoginBox = document.getElementById('adminLoginBox');
const adminDbBox = document.getElementById('adminDbBox');
function isAdminLogged(){ return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'; }
function openAdminModal(){
  adminOverlay.classList.add('open');
  if(isAdminLogged()){
    adminLoginBox.style.display = 'none'; adminDbBox.style.display = 'block'; renderDbPanel();
  } else {
    adminLoginBox.style.display = 'block'; adminDbBox.style.display = 'none';
  }
}
const adminAccessLink = document.getElementById('adminAccessLink');
if(adminAccessLink) adminAccessLink.addEventListener('click', openAdminModal);
const adminCloseBtn = document.getElementById('adminCloseBtn');
if(adminCloseBtn) adminCloseBtn.addEventListener('click', ()=>adminOverlay.classList.remove('open'));
if(adminOverlay) adminOverlay.addEventListener('click', e=>{ if(e.target===adminOverlay) adminOverlay.classList.remove('open'); });

const adminLoginForm = document.getElementById('adminLoginForm');
if(adminLoginForm) adminLoginForm.addEventListener('submit', e=>{
  e.preventDefault();
  const user = document.getElementById('adm-user').value.trim().toLowerCase();
  const pass = document.getElementById('adm-pass').value;
  const errEl = document.getElementById('adminLoginError');
  if(user !== ADMIN_USER || hashPass(user, pass) !== ADMIN_HASH){
    errEl.style.display = 'block'; return;
  }
  errEl.style.display = 'none';
  sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  e.target.reset();
  adminLoginBox.style.display = 'none';
  adminDbBox.style.display = 'block';
  renderDbPanel();
});

const adminLogoutBtn = document.getElementById('adminLogoutBtn');
if(adminLogoutBtn) adminLogoutBtn.addEventListener('click', ()=>{
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  adminOverlay.classList.remove('open');
});

const dbToggleJson = document.getElementById('dbToggleJson');
if(dbToggleJson) dbToggleJson.addEventListener('click', ()=>{
  document.getElementById('dbJsonView').classList.toggle('open');
  renderDbPanel();
});
const dbResetBtn = document.getElementById('dbResetBtn');
if(dbResetBtn) dbResetBtn.addEventListener('click', ()=>{
  if(!confirm('Isso vai apagar todos os usuários, pedidos e reportes deste banco de teste. Continuar?')) return;
  sessionStorage.removeItem(DB_KEYS.users);
  sessionStorage.removeItem(DB_KEYS.orders);
  sessionStorage.removeItem(DB_KEYS.reports);
  sessionStorage.removeItem(DB_KEYS.session);
  sessionStorage.removeItem('radarBarraCartState');
  cart = []; selectedMarket = null;
  renderCart(); renderOrderGrid(); renderMarketChips();
  renderAuthArea(); renderReports(); renderDbPanel();
});

/* ===================== INIT — cada página só chama o que existe nela ===================== */
buildTicker();
renderAuthArea();
renderDbPanel();
renderCart();

if(grid){ updateCounts(); renderPrices(); }
if(marketGrid){ renderMarkets(); }
if(faqList){ renderFaq(); }
if(reportsList){ renderReports(); }
if(pedidoMarketSelect){ renderMarketChips(); renderOrderGrid(); }
