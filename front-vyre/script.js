/* ══════════════════════════════════════════
   VYRE NEXT — script.js
══════════════════════════════════════════ */

/* ── CURSOR ── */
(function(){
  const cur = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  if(!cur||!trail) return;
  let mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx-5+'px'; cur.style.top=my-5+'px';
  });
  setInterval(()=>{
    tx+=(mx-tx)*.14; ty+=(my-ty)*.14;
    trail.style.left=tx-14+'px'; trail.style.top=ty-14+'px';
  },14);
})();

/* ── NAV ── */
(function(){
  const nav=document.getElementById('nav');
  if(!nav) return;
  function check(){
    const heroH=document.getElementById('hero')?.offsetHeight||window.innerHeight;
    nav.classList.toggle('nav-scrolled', window.scrollY > heroH - 80);
  }
  window.addEventListener('scroll',check,{passive:true});
  check();
})();

/* ── TYPEWRITER ── */
function initTypewriter(id, words) {
  const el = document.getElementById(id);
  if (!el) return;
  let i=0, j=0, deleting=false;
  function loop() {
    const word = words[i];
    if (!deleting) {
      el.textContent = word.substring(0, j++);
      if (j > word.length) { deleting=true; setTimeout(loop,1500); return; }
    } else {
      el.textContent = word.substring(0, j--);
      if (j===0) { deleting=false; i=(i+1)%words.length; }
    }
    setTimeout(loop, deleting?40:80);
  }
  loop();
}

document.addEventListener("DOMContentLoaded", () => {
  initTypewriter("typewriter", ["ESCALA","AUTOMAÇÃO","TECNOLOGIA","RESULTADOS"]);
});

/* ── INTERSECTION OBSERVER ── */
(function(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
      else entry.target.classList.remove("visible");
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.pilar-card,.step,.value-card,.visual-card,.depo-card').forEach((el,i)=>{
    el.style.transitionDelay=(i%4)*0.1+'s';
    io.observe(el);
  });
})();

/* ══════════════════════════════════════════
   VISUAIS INTERATIVOS DOS MODAIS
══════════════════════════════════════════ */

/* ── 1. DASHBOARD INTERATIVO (Dados) ── */
function buildDashboard() {
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul'];
  const baseData = [28,42,35,61,54,78,83];
  let currentData = [...baseData];
  let animFrame;

  const bars = currentData.map((v,i) => `
    <div class="idash-bar-wrap" data-idx="${i}">
      <div class="idash-bar" style="height:${v}%" data-val="${v}"></div>
      <span class="idash-bar-label">${months[i]}</span>
    </div>`).join('');

  return `
  <div class="idash-root" id="idash">
    <div class="idash-topbar">
      <div class="idash-topbar-left">
        <span class="idash-dot"></span>
        <span class="idash-title">Dashboard de Resultados</span>
      </div>
      <div class="idash-tabs">
        <button class="idash-tab active" data-metric="receita">Receita</button>
        <button class="idash-tab" data-metric="leads">Leads</button>
        <button class="idash-tab" data-metric="clientes">Clientes</button>
      </div>
    </div>
    <div class="idash-kpis">
      <div class="idash-kpi">
        <div class="idash-kpi-label">Receita Total</div>
        <div class="idash-kpi-val" id="kpi-total">R$ 48.200</div>
        <div class="idash-kpi-delta up">↑ 22% vs mês ant.</div>
      </div>
      <div class="idash-kpi">
        <div class="idash-kpi-label">Novos Clientes</div>
        <div class="idash-kpi-val" id="kpi-clientes">37</div>
        <div class="idash-kpi-delta up">↑ 14 este mês</div>
      </div>
      <div class="idash-kpi">
        <div class="idash-kpi-label">Ticket Médio</div>
        <div class="idash-kpi-val" id="kpi-ticket">R$ 1.302</div>
        <div class="idash-kpi-delta up">↑ 6%</div>
      </div>
      <div class="idash-kpi">
        <div class="idash-kpi-label">Churn</div>
        <div class="idash-kpi-val" id="kpi-churn">2.1%</div>
        <div class="idash-kpi-delta down">↓ 0.4pp</div>
      </div>
    </div>
    <div class="idash-chart-area">
      <div class="idash-chart-title" id="idash-chart-title">Receita mensal (R$ mil)</div>
      <div class="idash-bars" id="idash-bars">${bars}</div>
    </div>
    <div class="idash-progress-row">
      <span class="idash-prog-label">Meta mensal</span>
      <div class="idash-prog-bg"><div class="idash-prog-fill" id="idash-prog" style="width:80%"></div></div>
      <span class="idash-prog-pct" id="idash-prog-pct">80%</span>
    </div>
  </div>`;
}

function initDashboard() {
  const root = document.getElementById('idash');
  if(!root) return;

  const metrics = {
    receita:  { data:[28,42,35,61,54,78,83], kpis:['R$ 48.200','37','R$ 1.302','2.1%'], title:'Receita mensal (R$ mil)', prog:'80%' },
    leads:    { data:[12,18,14,27,22,38,45], kpis:['843 leads','4.2× ROAS','R$ 0,84','3.7%'], title:'Leads gerados por mês', prog:'92%' },
    clientes: { data:[5,8,6,11,9,14,18],    kpis:['18 novos','R$ 1.800','94%','1.2%'],   title:'Novos clientes por mês', prog:'65%' },
  };

  const kpiIds = ['kpi-total','kpi-clientes','kpi-ticket','kpi-churn'];

  root.querySelectorAll('.idash-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      root.querySelectorAll('.idash-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const m = metrics[tab.dataset.metric];
      document.getElementById('idash-chart-title').textContent = m.title;
      document.getElementById('idash-prog').style.width = m.prog;
      document.getElementById('idash-prog-pct').textContent = m.prog;
      kpiIds.forEach((id,i) => { document.getElementById(id).textContent = m.kpis[i]; });
      const barsEl = root.querySelectorAll('.idash-bar');
      barsEl.forEach((b,i) => {
        b.style.transition = 'height .5s ease';
        b.style.height = m.data[i] + '%';
      });
    });
  });

  /* hover tooltip */
  root.querySelectorAll('.idash-bar-wrap').forEach(wrap => {
    const bar = wrap.querySelector('.idash-bar');
    wrap.addEventListener('mouseenter', () => { bar.style.opacity = '1'; bar.style.filter = 'brightness(1.3)'; });
    wrap.addEventListener('mouseleave', () => { bar.style.opacity = '.75'; bar.style.filter = ''; });
  });
}

/* ── 2. SITE E-COMMERCE INTERATIVO (Automação) ── */
function buildEcommerce() {
  return `
  <div class="isite-root" id="isite">
    <div class="isite-browser">
      <div class="isite-chrome">
        <div class="isite-chrome-dots"><span></span><span></span><span></span></div>
        <div class="isite-chrome-url">vyrenext.com.br/loja</div>
      </div>
      <div class="isite-page">
        <div class="isite-nav">
          <span class="isite-logo">VyreShop</span>
          <div class="isite-nav-links">
            <span>Produtos</span><span>Sobre</span><span>Contato</span>
          </div>
          <div class="isite-cart-btn">🛒 <span id="isite-cart-count">0</span></div>
        </div>
        <div class="isite-hero-strip">Frete grátis acima de R$ 199 · Entrega em 24h 🚀</div>
        <div class="isite-products">
          <div class="isite-product" data-name="Plano Start" data-price="R$ 97/mês">
            <div class="isite-product-img" style="background:linear-gradient(135deg,#4a1a8f,#7c3aff)">
              <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="10" width="24" height="18" rx="3" stroke="#fff" stroke-width="1.5"/><line x1="14" y1="32" x2="26" y2="32" stroke="#c084fc" stroke-width="1.5" stroke-linecap="round"/><line x1="20" y1="28" x2="20" y2="32" stroke="#c084fc" stroke-width="1.5" stroke-linecap="round"/></svg>
            </div>
            <div class="isite-product-info">
              <div class="isite-product-name">Plano Start</div>
              <div class="isite-product-price">R$ 97<span>/mês</span></div>
              <button class="isite-add-btn" onclick="isiteAddCart(this,'Plano Start')">+ Adicionar</button>
            </div>
          </div>
          <div class="isite-product" data-name="Plano Pro" data-price="R$ 197/mês">
            <div class="isite-product-img" style="background:linear-gradient(135deg,#2d0a5e,#c084fc)">
              <svg viewBox="0 0 40 40" fill="none"><polygon points="20,6 24,16 35,16 26,23 29,34 20,27 11,34 14,23 5,16 16,16" stroke="#fff" stroke-width="1.5" fill="rgba(255,255,255,0.1)"/></svg>
            </div>
            <div class="isite-product-info">
              <div class="isite-product-name">Plano Pro</div>
              <div class="isite-product-price">R$ 197<span>/mês</span></div>
              <button class="isite-add-btn" onclick="isiteAddCart(this,'Plano Pro')">+ Adicionar</button>
            </div>
          </div>
          <div class="isite-product" data-name="Plano Enterprise" data-price="R$ 497/mês">
            <div class="isite-product-img" style="background:linear-gradient(135deg,#1a0533,#9b59ff)">
              <svg viewBox="0 0 40 40" fill="none"><rect x="6" y="14" width="28" height="18" rx="2" stroke="#fff" stroke-width="1.5"/><path d="M13 14v-3a7 7 0 0 1 14 0v3" stroke="#c084fc" stroke-width="1.5" stroke-linecap="round"/></svg>
            </div>
            <div class="isite-product-info">
              <div class="isite-product-name">Enterprise</div>
              <div class="isite-product-price">R$ 497<span>/mês</span></div>
              <button class="isite-add-btn" onclick="isiteAddCart(this,'Enterprise')">+ Adicionar</button>
            </div>
          </div>
        </div>
        <div class="isite-cart-panel" id="isite-cart" style="display:none">
          <div class="isite-cart-header">🛒 Carrinho</div>
          <div class="isite-cart-items" id="isite-cart-items"></div>
          <div class="isite-cart-total" id="isite-cart-total"></div>
          <button class="isite-checkout-btn">Finalizar Compra →</button>
        </div>
      </div>
    </div>
  </div>`;
}

let isiteCartItems = [];
function isiteAddCart(btn, name) {
  btn.textContent = '✓ Adicionado';
  btn.style.background = '#16a34a';
  setTimeout(() => { btn.textContent = '+ Adicionar'; btn.style.background = ''; }, 1500);

  isiteCartItems.push(name);
  document.getElementById('isite-cart-count').textContent = isiteCartItems.length;
  document.getElementById('isite-cart').style.display = 'block';

  const prices = {'Plano Start':97,'Plano Pro':197,'Enterprise':497};
  const total = isiteCartItems.reduce((s,n) => s + (prices[n]||0), 0);
  document.getElementById('isite-cart-items').innerHTML = isiteCartItems.map(n => `<div class="isite-cart-item"><span>${n}</span><span>R$ ${prices[n]}/mês</span></div>`).join('');
  document.getElementById('isite-cart-total').textContent = `Total: R$ ${total}/mês`;
}
window.isiteAddCart = isiteAddCart;

/* ── 3. INSTAGRAM ADS INTERATIVO (Marketing) ── */
function buildInstagramAds() {
  return `
  <div class="iads-root" id="iads">
    <div class="iads-phone">
      <div class="iads-phone-notch"></div>
      <div class="iads-screen">
        <div class="iads-stories-bar">
          <div class="iads-story active"><div class="iads-story-ring"></div><span>Você</span></div>
          <div class="iads-story"><div class="iads-story-ring"></div><span>Ana</span></div>
          <div class="iads-story"><div class="iads-story-ring"></div><span>João</span></div>
          <div class="iads-story ad-story"><div class="iads-story-ring ad"></div><span>Ad</span></div>
        </div>

        <!-- POST ORGÂNICO -->
        <div class="iads-post" id="iads-post-1">
          <div class="iads-post-header">
            <div class="iads-post-avatar" style="background:linear-gradient(135deg,#7c3aff,#c084fc)">VN</div>
            <div>
              <div class="iads-post-user">vyrenext</div>
              <div class="iads-post-sub">São Paulo, SP</div>
            </div>
            <span class="iads-post-more">···</span>
          </div>
          <div class="iads-post-img" style="background:linear-gradient(135deg,#1a0533 0%,#4a1a8f 50%,#7c3aff 100%)">
            <div class="iads-post-overlay-text">
              <div class="iads-ad-tag">PATROCINADO</div>
              <div style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff;line-height:1.2">Sua empresa<br>no próximo nível</div>
              <div style="font-size:.7rem;color:rgba(255,255,255,.7);margin-top:6px">Infraestrutura · Marketing · Dados</div>
            </div>
            <div class="iads-post-cta-strip">
              <span>Saiba mais</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
          <div class="iads-post-actions">
            <span class="iads-action" id="iads-like" onclick="iadsToggleLike()">🤍</span>
            <span class="iads-action">💬</span>
            <span class="iads-action">↗️</span>
            <span class="iads-action bookmark">🔖</span>
          </div>
          <div class="iads-post-likes" id="iads-likes">1.847 curtidas</div>
          <div class="iads-post-caption"><b>vyrenext</b> Automatize, cresça e escale. 🚀 Conheça nossos pilares de tecnologia. #trafegopago #marketing</div>
        </div>
      </div>
    </div>

    <!-- Métricas ao lado -->
    <div class="iads-metrics">
      <div class="iads-metrics-title">📊 Performance do Anúncio</div>
      <div class="iads-metric-row">
        <span class="iads-metric-label">Alcance</span>
        <span class="iads-metric-val" id="iads-reach">48.200</span>
      </div>
      <div class="iads-metric-row">
        <span class="iads-metric-label">Impressões</span>
        <span class="iads-metric-val">127.540</span>
      </div>
      <div class="iads-metric-row">
        <span class="iads-metric-label">Cliques</span>
        <span class="iads-metric-val green">4.731</span>
      </div>
      <div class="iads-metric-row">
        <span class="iads-metric-label">CTR</span>
        <span class="iads-metric-val green">3.71%</span>
      </div>
      <div class="iads-metric-row">
        <span class="iads-metric-label">CPC</span>
        <span class="iads-metric-val">R$ 0,84</span>
      </div>
      <div class="iads-metric-row">
        <span class="iads-metric-label">ROAS</span>
        <span class="iads-metric-val purple">4.2×</span>
      </div>
      <div class="iads-budget-wrap">
        <div class="iads-budget-label">Orçamento utilizado</div>
        <div class="iads-budget-bar"><div class="iads-budget-fill" style="width:68%"></div></div>
        <span class="iads-budget-pct">68% · R$ 340 / R$ 500</span>
      </div>
    </div>
  </div>`;
}

let iadsLiked = false;
function iadsToggleLike() {
  iadsLiked = !iadsLiked;
  const el = document.getElementById('iads-like');
  const likes = document.getElementById('iads-likes');
  if(el) el.textContent = iadsLiked ? '❤️' : '🤍';
  if(likes) likes.textContent = iadsLiked ? '1.848 curtidas' : '1.847 curtidas';
}
window.iadsToggleLike = iadsToggleLike;

/* Simula alcance crescendo */
function startReachCounter() {
  const el = document.getElementById('iads-reach');
  if(!el) return;
  let n = 48200;
  setInterval(() => {
    n += Math.floor(Math.random() * 8) + 1;
    el.textContent = n.toLocaleString('pt-BR');
  }, 1200);
}

/* ── 4. ANYDESK INTERATIVO (Infraestrutura) ── */
function buildAnydesk() {
  return `
  <div class="iany-root" id="iany">
    <div class="iany-window">
      <div class="iany-titlebar">
        <div class="iany-win-dots"><span style="background:#ff5f57"></span><span style="background:#febc2e"></span><span style="background:#28c840"></span></div>
        <span class="iany-win-title">AnyDesk — Suporte Remoto Vyre Next</span>
        <div class="iany-win-status"><span class="iany-conn-dot"></span> Conectado</div>
      </div>
      <div class="iany-toolbar">
        <button class="iany-tool active" onclick="ianySetTool(this,'cursor')">🖱️ Cursor</button>
        <button class="iany-tool" onclick="ianySetTool(this,'chat')">💬 Chat</button>
        <button class="iany-tool" onclick="ianySetTool(this,'files')">📁 Arquivos</button>
        <button class="iany-tool" onclick="ianySetTool(this,'perf')">📊 Performance</button>
      </div>
      <div class="iany-screen" id="iany-screen">
        <!-- Tela remota simulada -->
        <div class="iany-desktop" id="iany-desktop">
          <div class="iany-desktop-topbar">
            <span style="font-size:.55rem;color:rgba(255,255,255,.5)">PC Remoto — Windows 11</span>
            <span style="font-size:.55rem;color:#4ade80">● Online</span>
          </div>
          <div class="iany-taskmanager" id="iany-tm">
            <div class="iany-tm-header">Gerenciador de Tarefas</div>
            <div class="iany-tm-row">
              <span>CPU</span>
              <div class="iany-tm-bar-bg"><div class="iany-tm-bar" id="iany-cpu" style="width:87%;background:linear-gradient(90deg,#7c3aff,#c084fc)"></div></div>
              <span id="iany-cpu-val">87%</span>
            </div>
            <div class="iany-tm-row">
              <span>RAM</span>
              <div class="iany-tm-bar-bg"><div class="iany-tm-bar" id="iany-ram" style="width:72%;background:linear-gradient(90deg,#4a1a8f,#7c3aff)"></div></div>
              <span id="iany-ram-val">72%</span>
            </div>
            <div class="iany-tm-row">
              <span>Disco</span>
              <div class="iany-tm-bar-bg"><div class="iany-tm-bar" id="iany-disk" style="width:45%;background:linear-gradient(90deg,#2d0a5e,#9b59ff)"></div></div>
              <span id="iany-disk-val">45%</span>
            </div>
          </div>
          <!-- Cursor animado se movendo na tela remota -->
          <div class="iany-remote-cursor" id="iany-cursor">↖</div>
        </div>
        <!-- Painel de chat (oculto por padrão) -->
        <div class="iany-chat-panel" id="iany-chat-panel" style="display:none">
          <div class="iany-chat-msgs" id="iany-msgs">
            <div class="iany-msg tech"><b>Técnico Vyre:</b> Olá! Conectei no seu PC. Vou verificar o desempenho agora.</div>
            <div class="iany-msg client"><b>Cliente:</b> Obrigado! O PC está lento há alguns dias.</div>
            <div class="iany-msg tech"><b>Técnico Vyre:</b> Já identifiquei o problema — CPU em 87%. Vou otimizar agora. ✔</div>
          </div>
          <div class="iany-chat-input-row">
            <input id="iany-input" class="iany-chat-input" placeholder="Digite uma mensagem..." onkeydown="ianyMsg(event)">
            <button class="iany-send-btn" onclick="ianySend()">→</button>
          </div>
        </div>
        <!-- Painel de performance (oculto) -->
        <div class="iany-perf-panel" id="iany-perf-panel" style="display:none">
          <div class="iany-perf-title">📊 Diagnóstico do Sistema</div>
          <div class="iany-perf-item ok">✅ Antivírus atualizado</div>
          <div class="iany-perf-item ok">✅ Sistema operacional OK</div>
          <div class="iany-perf-item warn">⚠️ 14 programas na inicialização</div>
          <div class="iany-perf-item warn">⚠️ Disco com 89% de uso</div>
          <div class="iany-perf-item err">❌ CPU acima de 80% (otimizar)</div>
          <button class="iany-fix-btn" id="iany-fix-btn" onclick="ianyFix()">🔧 Otimizar agora</button>
        </div>
        <!-- Painel de arquivos (oculto) -->
        <div class="iany-files-panel" id="iany-files-panel" style="display:none">
          <div class="iany-files-title">📁 Transferência de Arquivos</div>
          <div class="iany-file-row"><span>📄 backup_config.zip</span><span class="iany-file-size">2.4 MB</span></div>
          <div class="iany-file-row"><span>📄 driver_rede.exe</span><span class="iany-file-size">8.1 MB</span></div>
          <div class="iany-file-row"><span>📄 relatorio_pc.pdf</span><span class="iany-file-size">512 KB</span></div>
          <button class="iany-fix-btn">⬆️ Enviar arquivo</button>
        </div>
      </div>
    </div>
  </div>`;
}

let ianyActiveTool = 'cursor';
function ianySetTool(btn, tool) {
  ianyActiveTool = tool;
  document.querySelectorAll('.iany-tool').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const panels = ['iany-desktop','iany-chat-panel','iany-perf-panel','iany-files-panel'];
  const map = { cursor:'iany-desktop', chat:'iany-chat-panel', perf:'iany-perf-panel', files:'iany-files-panel' };
  panels.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
  const active = document.getElementById(map[tool]);
  if(active) active.style.display = '';
}
window.ianySetTool = ianySetTool;

function ianyMsg(e) { if(e.key==='Enter') ianySend(); }
function ianySend() {
  const input = document.getElementById('iany-input');
  if(!input||!input.value.trim()) return;
  const msgs = document.getElementById('iany-msgs');
  const div = document.createElement('div');
  div.className = 'iany-msg client';
  div.innerHTML = `<b>Cliente:</b> ${input.value}`;
  msgs.appendChild(div);
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => {
    const reply = document.createElement('div');
    reply.className = 'iany-msg tech';
    reply.innerHTML = '<b>Técnico Vyre:</b> Entendido! Já estou verificando isso para você. ✔';
    msgs.appendChild(reply);
    msgs.scrollTop = msgs.scrollHeight;
  }, 1000);
}
window.ianySend = ianySend;
window.ianyMsg = ianyMsg;

function ianyFix() {
  const btn = document.getElementById('iany-fix-btn');
  if(!btn) return;
  btn.textContent = '⏳ Otimizando...';
  btn.disabled = true;
  let cpu = 87, ram = 72;
  const interval = setInterval(() => {
    cpu = Math.max(22, cpu - 5);
    ram = Math.max(38, ram - 3);
    const cpuEl = document.getElementById('iany-cpu');
    const ramEl = document.getElementById('iany-ram');
    const cpuVal = document.getElementById('iany-cpu-val');
    const ramVal = document.getElementById('iany-ram-val');
    if(cpuEl) { cpuEl.style.width = cpu+'%'; cpuEl.style.background = cpu < 50 ? 'linear-gradient(90deg,#16a34a,#4ade80)' : 'linear-gradient(90deg,#7c3aff,#c084fc)'; }
    if(ramEl) { ramEl.style.width = ram+'%'; }
    if(cpuVal) cpuVal.textContent = cpu+'%';
    if(ramVal) ramVal.textContent = ram+'%';
    if(cpu <= 22) {
      clearInterval(interval);
      btn.textContent = '✅ PC otimizado!';
      btn.style.background = '#16a34a';
      document.querySelectorAll('.iany-perf-item.err').forEach(el => {
        el.className = 'iany-perf-item ok';
        el.textContent = '✅ CPU normalizada (22%)';
      });
      document.querySelectorAll('.iany-perf-item.warn').forEach(el => {
        el.className = 'iany-perf-item ok';
        el.textContent = el.textContent.replace('⚠️','✅');
      });
    }
  }, 300);
}
window.ianyFix = ianyFix;

function startAnydeskCursor() {
  const cur = document.getElementById('iany-cursor');
  if(!cur) return;
  const positions = [{x:20,y:30},{x:60,y:60},{x:40,y:80},{x:70,y:40},{x:30,y:55}];
  let pi = 0;
  setInterval(() => {
    pi = (pi+1) % positions.length;
    cur.style.left = positions[pi].x + '%';
    cur.style.top  = positions[pi].y + '%';
  }, 1800);
}

function startTaskManager() {
  function rand(min,max){ return Math.floor(Math.random()*(max-min))+min; }
  setInterval(() => {
    const cpuEl = document.getElementById('iany-cpu');
    const cpuVal = document.getElementById('iany-cpu-val');
    if(!cpuEl||!cpuVal) return;
    const curW = parseInt(cpuEl.style.width)||87;
    const newW = Math.min(95, Math.max(15, curW + rand(-8,8)));
    cpuEl.style.width = newW+'%';
    cpuVal.textContent = newW+'%';
    if(newW > 80) cpuEl.style.background = 'linear-gradient(90deg,#dc2626,#f97316)';
    else if(newW > 50) cpuEl.style.background = 'linear-gradient(90deg,#7c3aff,#c084fc)';
    else cpuEl.style.background = 'linear-gradient(90deg,#16a34a,#4ade80)';
  }, 2000);
}

/* ══════════════════════════════════════════
   DADOS DOS PILARES
══════════════════════════════════════════ */
const pilarData = {
  infra: {
    tag: 'Pilar 01',
    title: 'Infraestrutura & TI',
    desc: 'Mantemos sua operação rodando com excelência. Checkup completo, suporte remoto via AnyDesk e monitoramento preventivo para que sua equipe nunca pare.',
    buildVisual: buildAnydesk,
    initVisual: () => { startAnydeskCursor(); startTaskManager(); },
    features: [
      'Checkup completo de computadores e periféricos',
      'Gestão e monitoramento de redes corporativas',
      'Suporte remoto com AnyDesk e SLA garantido',
      'Manutenção preventiva com relatório mensal',
      'Gestão de backup e segurança de dados',
      'Atendimento prioritário para problemas críticos',
    ]
  },
  dev: {
    tag: 'Pilar 02',
    title: 'Automação & Sistemas',
    desc: 'Sites profissionais, lojas virtuais, chatbots e automações que trabalham por você 24h — eliminando retrabalho e escalando com o seu negócio.',
    buildVisual: buildEcommerce,
    initVisual: () => { isiteCartItems = []; },
    features: [
      'Sites institucionais e lojas virtuais completas',
      'Bot de atendimento no WhatsApp 24h',
      'Automação de processos operacionais',
      'Integrações via API com ferramentas existentes',
      'ERP e CRM customizados para o seu negócio',
      'Suporte pós-entrega e manutenção contínua',
    ]
  },
  mkt: {
    tag: 'Pilar 03',
    title: 'Visibilidade Digital',
    desc: 'Anúncios no Instagram, Facebook e Google que colocam seu negócio na frente de quem já está procurando o que você vende — com métricas claras de ROI.',
    buildVisual: buildInstagramAds,
    initVisual: () => { iadsLiked = false; setTimeout(startReachCounter, 300); },
    features: [
      'Gestão de Meta Ads (Instagram e Facebook)',
      'Gestão de Google Ads (Search, Display, YouTube)',
      'Criação de criativos e copies de alto impacto',
      'Relatórios semanais de performance e ROI',
      'Otimização contínua baseada em dados reais',
      'Google Meu Negócio otimizado para presença local',
    ]
  },
  dados: {
    tag: 'Pilar 04',
    title: 'Inteligência do Negócio',
    desc: 'Dashboards interativos que mostram receita, leads e clientes em tempo real. Troque as métricas e veja os dados do seu negócio de forma clara e acionável.',
    buildVisual: buildDashboard,
    initVisual: () => { setTimeout(initDashboard, 100); },
    features: [
      'Dashboards interativos com dados em tempo real',
      'Relatórios automatizados de KPIs e métricas',
      'Análise de performance de campanhas de marketing',
      'Indicadores financeiros: receita, ticket médio, churn',
      'Automação de coleta e tratamento de dados',
      'Integração com Google Analytics, CRM e ERPs',
    ]
  }
};

/* ── Renderiza modal ── */
function abrirModal(id) {
  const data = pilarData[id];
  if (!data) return;

  document.getElementById('modal-tag').textContent   = data.tag;
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-desc').textContent  = data.desc;
  document.getElementById('modal-visual').innerHTML  = data.buildVisual();

  document.getElementById('modal-features').innerHTML = data.features.map(f => `
    <div class="mf-item">
      <div class="mf-check">
        <svg viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <span class="mf-text">${f}</span>
    </div>`).join('');

  document.getElementById('pilarModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  if (data.initVisual) data.initVisual();
}

function closeModal() {
  document.getElementById('pilarModal').classList.remove('open');
  document.body.style.overflow = '';
}
function fecharModal(e) {
  if (e.target === document.getElementById('pilarModal')) closeModal();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── FORM ── */

window.handleSubmit = async function(btn) {
  const nomeEl     = document.getElementById("nome");
  const emailEl    = document.getElementById("email");
  const whatsappEl = document.getElementById("whatsapp");
  const servicoEl  = document.getElementById("servico");
  const mensagemEl = document.getElementById("mensagem");

  const nome     = nomeEl.value.trim();
  const email    = emailEl.value.trim();
  const whatsapp = whatsappEl.value.trim();
  const servico  = servicoEl.value;
  const mensagem = mensagemEl.value.trim();

  if (!nome || !email || !mensagem) {
    showCenterToast("Preencha nome, email e mensagem!", true);
    return;
  }

  const originalText = btn.textContent;
  btn.textContent = "Enviando...";
  btn.disabled = true;

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 60000);

  const slowId = setTimeout(() => {
    if (btn.disabled) btn.textContent = "Aguarde, conectando...";
  }, 8000);

  try {
    const response = await fetch("http://localhost:3000/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, whatsapp, servico, mensagem }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    clearTimeout(slowId);

    const text = await response.text();
    let data = {};
    try { data = JSON.parse(text); } catch (_) {}

    if (!response.ok) throw new Error(data.error || `Erro ${response.status}`);

    showToast("Mensagem enviada com sucesso! ✅");
    nomeEl.value = emailEl.value = whatsappEl.value = mensagemEl.value = "";
    servicoEl.selectedIndex = 0;

  } catch (err) {
    clearTimeout(timeoutId);
    clearTimeout(slowId);

    if (err.name === "AbortError") {
      showToast("Servidor demorou para responder. Tente novamente.", true);
    } else {
      showToast(err.message || "Erro ao enviar. Tente novamente.", true);
    }
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
};

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  isError ? toast.classList.add("error") : toast.classList.remove("error");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 5000);
}

function showCenterToast(message, isError = false) {
  const overlay = document.getElementById("toastCenter");
  const box     = document.getElementById("toastBox");
  if (!overlay || !box) return;
  box.textContent = message;
  isError ? box.classList.add("error") : box.classList.remove("error");
  overlay.classList.add("show");
  setTimeout(() => overlay.classList.remove("show"), 3000);
}

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  isError ? toast.classList.add("error") : toast.classList.remove("error");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

function showCenterToast(message, isError = false) {
  const overlay = document.getElementById("toastCenter");
  const box     = document.getElementById("toastBox");
  if (!overlay || !box) return;
  box.textContent = message;
  isError ? box.classList.add("error") : box.classList.remove("error");
  overlay.classList.add("show");
  setTimeout(() => overlay.classList.remove("show"), 3000);
}