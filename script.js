/* ══════════════════════════════════════════
   VYRE NEXT — script.js
══════════════════════════════════════════ */

let reachCounterInterval = null;
let anydeskCursorInterval = null;
let taskManagerInterval = null;

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */

const $ = (selector) => document.querySelector(selector);

function safeText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function safeHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

/* ══════════════════════════════════════════
   CURSOR
══════════════════════════════════════════ */

(function () {

  const cur = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');

  if (!cur || !trail) return;

  let mx = 0;
  let my = 0;

  let tx = 0;
  let ty = 0;

  document.addEventListener('mousemove', (e) => {

    mx = e.clientX;
    my = e.clientY;

    cur.style.left = `${mx - 5}px`;
    cur.style.top = `${my - 5}px`;

  });

  setInterval(() => {

    tx += (mx - tx) * 0.14;
    ty += (my - ty) * 0.14;

    trail.style.left = `${tx - 14}px`;
    trail.style.top = `${ty - 14}px`;

  }, 14);

})();

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */

(function () {

  const nav = document.getElementById('nav');

  if (!nav) return;

  function checkScroll() {

    const hero =
      document.getElementById('hero')?.offsetHeight ||
      window.innerHeight;

    nav.classList.toggle(
      'nav-scrolled',
      window.scrollY > hero - 80
    );

  }

  window.addEventListener(
    'scroll',
    checkScroll,
    { passive: true }
  );

  checkScroll();

})();

/* ══════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════ */

function initTypewriter(id, words) {

  const el = document.getElementById(id);

  if (!el || !words?.length) return;

  let i = 0;
  let j = 0;
  let deleting = false;

  function loop() {

    const word = words[i];

    if (!deleting) {

      el.textContent = word.substring(0, j++);

      if (j > word.length) {

        deleting = true;

        setTimeout(loop, 1500);

        return;

      }

    } else {

      el.textContent = word.substring(0, j--);

      if (j <= 0) {

        deleting = false;

        i = (i + 1) % words.length;

      }

    }

    setTimeout(loop, deleting ? 40 : 80);

  }

  loop();

}

/* ══════════════════════════════════════════
   ANIMAÇÕES DE SCROLL
══════════════════════════════════════════ */

(function () {

  const io = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }

      });

    },
    {
      threshold: 0.15
    }
  );

  const elements = document.querySelectorAll(
    '.pilar-card,.step,.value-card,.visual-card,.depo-card'
  );

  elements.forEach((el, i) => {

    el.style.transitionDelay = `${(i % 4) * 0.1}s`;

    io.observe(el);

  });

})();

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  initTypewriter(
    'typewriter',
    [
      'ESCALA',
      'AUTOMAÇÃO',
      'TECNOLOGIA',
      'RESULTADOS'
    ]
  );

});

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */

function buildDashboard() {

  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul'
  ];

  const values = [
    28,
    42,
    35,
    61,
    54,
    78,
    83
  ];

  const bars = values.map((v, i) => `
    <div class="idash-bar-wrap">
      <div
        class="idash-bar"
        style="height:${v}%"
      ></div>

      <span class="idash-bar-label">
        ${months[i]}
      </span>
    </div>
  `).join('');

  return `
    <div class="idash-root" id="idash">

      <div class="idash-topbar">

        <div class="idash-topbar-left">
          <span class="idash-dot"></span>
          <span class="idash-title">
            Dashboard de Resultados
          </span>
        </div>

        <div class="idash-tabs">
          <button
            class="idash-tab active"
            data-metric="receita"
          >
            Receita
          </button>

          <button
            class="idash-tab"
            data-metric="leads"
          >
            Leads
          </button>

          <button
            class="idash-tab"
            data-metric="clientes"
          >
            Clientes
          </button>
        </div>

      </div>

      <div class="idash-kpis">

        <div class="idash-kpi">
          <div class="idash-kpi-label">
            Receita Total
          </div>

          <div class="idash-kpi-val" id="kpi-total">
            R$ 48.200
          </div>
        </div>

        <div class="idash-kpi">
          <div class="idash-kpi-label">
            Novos Clientes
          </div>

          <div class="idash-kpi-val" id="kpi-clientes">
            37
          </div>
        </div>

        <div class="idash-kpi">
          <div class="idash-kpi-label">
            Ticket Médio
          </div>

          <div class="idash-kpi-val" id="kpi-ticket">
            R$ 1.302
          </div>
        </div>

        <div class="idash-kpi">
          <div class="idash-kpi-label">
            Churn
          </div>

          <div class="idash-kpi-val" id="kpi-churn">
            2.1%
          </div>
        </div>

      </div>

      <div class="idash-chart-area">

        <div
          class="idash-chart-title"
          id="idash-chart-title"
        >
          Receita mensal (R$ mil)
        </div>

        <div class="idash-bars">
          ${bars}
        </div>

      </div>

      <div class="idash-progress-row">

        <span class="idash-prog-label">
          Meta mensal
        </span>

        <div class="idash-prog-bg">
          <div
            class="idash-prog-fill"
            id="idash-prog"
            style="width:80%"
          ></div>
        </div>

        <span
          class="idash-prog-pct"
          id="idash-prog-pct"
        >
          80%
        </span>

      </div>

    </div>
  `;

}

function initDashboard() {

  const root = document.getElementById('idash');

  if (!root) return;

  const metrics = {

    receita: {
      data: [28, 42, 35, 61, 54, 78, 83],
      kpis: ['R$ 48.200', '37', 'R$ 1.302', '2.1%'],
      title: 'Receita mensal (R$ mil)',
      prog: '80%'
    },

    leads: {
      data: [12, 18, 14, 27, 22, 38, 45],
      kpis: ['843 leads', '4.2× ROAS', 'R$ 0,84', '3.7%'],
      title: 'Leads gerados por mês',
      prog: '92%'
    },

    clientes: {
      data: [5, 8, 6, 11, 9, 14, 18],
      kpis: ['18 novos', 'R$ 1.800', '94%', '1.2%'],
      title: 'Novos clientes por mês',
      prog: '65%'
    }

  };

  const ids = [
    'kpi-total',
    'kpi-clientes',
    'kpi-ticket',
    'kpi-churn'
  ];

  root.querySelectorAll('.idash-tab')
    .forEach((tab) => {

      tab.addEventListener('click', () => {

        root.querySelectorAll('.idash-tab')
          .forEach((t) => t.classList.remove('active'));

        tab.classList.add('active');

        const m = metrics[tab.dataset.metric];

        safeText(
          'idash-chart-title',
          m.title
        );

        const prog = document.getElementById('idash-prog');

        if (prog) {
          prog.style.width = m.prog;
        }

        safeText('idash-prog-pct', m.prog);

        ids.forEach((id, i) => {
          safeText(id, m.kpis[i]);
        });

        root.querySelectorAll('.idash-bar')
          .forEach((bar, i) => {

            bar.style.height = `${m.data[i]}%`;

          });

      });

    });

}

/* ══════════════════════════════════════════
   TOASTS
══════════════════════════════════════════ */

function showToast(message, isError = false) {

  const toast = document.getElementById('toast');

  if (!toast) return;

  toast.textContent = message;

  toast.classList.toggle('error', isError);

  toast.classList.add('show');

  setTimeout(() => {

    toast.classList.remove('show');

  }, 5000);

}

function showCenterToast(message, isError = false) {

  const overlay = document.getElementById('toastCenter');
  const box = document.getElementById('toastBox');

  if (!overlay || !box) return;

  box.textContent = message;

  box.classList.toggle('error', isError);

  overlay.classList.add('show');

  setTimeout(() => {

    overlay.classList.remove('show');

  }, 3000);

}

/* ══════════════════════════════════════════
   FORM
══════════════════════════════════════════ */

const API_URL = '/api/send-email';

window.handleSubmit = async function (btn) {

  const nomeEl =
    document.getElementById('nome');

  const emailEl =
    document.getElementById('email');

  const whatsappEl =
    document.getElementById('whatsapp');

  const servicoEl =
    document.getElementById('servico');

  const mensagemEl =
    document.getElementById('mensagem');

  if (
    !nomeEl ||
    !emailEl ||
    !servicoEl ||
    !mensagemEl
  ) {
    return;
  }

  const nome = nomeEl.value.trim();
  const email = emailEl.value.trim();
  const whatsapp = whatsappEl?.value.trim() || '';
  const servico = servicoEl.value;
  const mensagem = mensagemEl.value.trim();

  if (!nome || !email || !mensagem || !servico) {

    showCenterToast(
      'Preencha todos os campos obrigatórios.',
      true
    );

    return;

  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {

    showCenterToast(
      'Digite um email válido.',
      true
    );

    return;

  }

  const originalText = btn.textContent;

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {

    controller.abort();

  }, 30000);

  try {

    const response = await fetch(API_URL, {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        nome,
        email,
        whatsapp,
        servico,
        mensagem
      }),

      signal: controller.signal

    });

    clearTimeout(timeoutId);

    if (!response.ok) {

      const data =
        await response.json().catch(() => ({}));

      throw new Error(
        data.error || `Erro ${response.status}`
      );

    }

    showToast(
      'Mensagem enviada com sucesso! ✅'
    );

    nomeEl.value = '';
    emailEl.value = '';
    mensagemEl.value = '';

    if (whatsappEl) {
      whatsappEl.value = '';
    }

    servicoEl.selectedIndex = 0;

  } catch (err) {

    console.error(err);

    if (err.name === 'AbortError') {

      showToast(
        'Servidor demorou para responder.',
        true
      );

    } else {

      showToast(
        err.message || 'Erro ao enviar.',
        true
      );

    }

  } finally {

    clearTimeout(timeoutId);

    btn.disabled = false;
    btn.textContent = originalText;

  }

};

/* ══════════════════════════════════════════
   MODAL
══════════════════════════════════════════ */

const pilarData = {

  dados: {

    tag: 'Pilar 04',

    title: 'Inteligência do Negócio',

    desc:
      'Dashboards interativos e métricas em tempo real.',

    buildVisual: buildDashboard,

    initVisual: () => {

      setTimeout(initDashboard, 100);

    },

    features: [
      'Dashboards em tempo real',
      'KPIs automatizados',
      'Análise de campanhas',
      'Indicadores financeiros',
      'Integrações com CRM',
      'Visualização estratégica'
    ]

  }

};

function abrirModal(id) {

  const data = pilarData[id];

  if (!data) return;

  safeText('modal-tag', data.tag);
  safeText('modal-title', data.title);
  safeText('modal-desc', data.desc);

  safeHTML(
    'modal-visual',
    data.buildVisual()
  );

  safeHTML(
    'modal-features',
    data.features.map((f) => `
      <div class="mf-item">

        <div class="mf-check">
          ✓
        </div>

        <span class="mf-text">
          ${f}
        </span>

      </div>
    `).join('')
  );

  const modal =
    document.getElementById('pilarModal');

  if (!modal) return;

  modal.classList.add('open');

  document.body.style.overflow = 'hidden';

  data.initVisual?.();

}

function closeModal() {

  const modal =
    document.getElementById('pilarModal');

  if (modal) {
    modal.classList.remove('open');
  }

  document.body.style.overflow = '';

  clearInterval(reachCounterInterval);
  clearInterval(anydeskCursorInterval);
  clearInterval(taskManagerInterval);

}

function fecharModal(e) {

  if (
    e.target ===
    document.getElementById('pilarModal')
  ) {

    closeModal();

  }

}

document.addEventListener('keydown', (e) => {

  if (e.key === 'Escape') {

    closeModal();

  }

});

(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Cria botão hamburguer
  const btn = document.createElement('button');
  btn.className = 'nav-hamburger';
  btn.setAttribute('aria-label', 'Menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(btn);

  // Cria menu mobile
  const menu = document.createElement('div');
  menu.className = 'nav-mobile-menu';
  menu.innerHTML = `
    <a href="#sobre" >Quem Somos</a>
    <a href="#pilares">Pilares</a>
    <a href="#processo">Processo</a>
    <a href="#contato" class="nav-mobile-cta">Fale Conosco</a>
  `;
  document.body.appendChild(menu);

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Fecha ao clicar em um link
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();

window.abrirModal = abrirModal;
window.closeModal = closeModal;
window.fecharModal = fecharModal;