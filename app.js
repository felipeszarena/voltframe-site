// Shared header/footer + page widgets for the VoltFrame static site.
const C = ['#FFD800', '#FFAF00', '#FF8205', '#FA500F', '#E10500'];
const page = document.body.dataset.page;
const $ = (s) => document.querySelector(s);

const NAV = [
  ['index.html', 'Início', 'home'],
  ['jogos.html', 'Jogos', 'jogos'],
  ['planos.html', 'Planos', 'planos'],
  ['guia-fps.html', 'Guia FPS', 'guia'],
  ['index.html#ajuda', 'Ajuda', 'ajuda'],
];

document.body.insertAdjacentHTML('afterbegin', `
<div class="stripe"><i></i><i></i><i></i><i></i><i></i></div>
<header class="top"><div class="wrap"><nav class="main">
  <a class="brand" href="index.html" aria-label="VoltFrame — início"><span class="wm">VOLT<b>FRAME</b></span></a>
  <div class="links" id="links">${NAV.map(([h, t, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</div>
  <div class="row navcta"><a class="btn gh" href="#">Entrar</a><a class="btn pri" href="planos.html">Baixar grátis</a><button class="menu" id="menu" aria-expanded="false" aria-controls="links">Menu</button></div>
</nav></div></header>`);

document.body.insertAdjacentHTML('beforeend', `
<footer class="foot"><div class="wrap">
  <div class="fgrid">
    <div><span class="wm">VOLT<b>FRAME</b></span><p>Otimização gamer brasileira para Windows 10 e 11. Mais controle, métricas claras e ajustes reversíveis.</p></div>
    <div><span class="mono">Produto</span><a href="index.html#modulos">Módulos</a><a href="planos.html">Planos</a><a href="jogos.html">Jogos</a><a href="index.html#modulos">Central de manutenção</a></div>
    <div><span class="mono">Aprenda</span><a href="guia-fps.html">Guia de FPS</a><a href="guia-fps.html#diagnostico">Diagnóstico rápido</a><a href="jogos.html#roblox">Roblox travando</a><a href="guia-fps.html#metodo">Metodologia</a></div>
    <div><span class="mono">VoltFrame</span><a href="#">Sobre o projeto</a><a href="#">Parceiros</a><a href="#">Meu painel</a></div>
    <div><span class="mono">Legal</span><a href="#">Termos de uso</a><a href="#">Termos de compra</a><a href="#">Privacidade</a><a href="#">Créditos</a></div>
  </div>
  <div class="legal mono"><span>© 2026 VoltFrame · Windows 10 / 11</span><span>Proposta conceitual · marca fictícia</span></div>
</div></footer>`);

$('#menu').onclick = (e) => {
  const open = $('#links').classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', open);
};

const GAMES = [
  { id: 'roblox', n: 'Roblox', c: ['#FFD800', '#FF8205'], cat: ['casual', 'competitivo'], star: true, h: 'Perfis gráficos dentro do app.', p: 'Escolha Desempenho, Equilibrado ou Automático e restaure quando quiser.', t: ['FPS', 'Travamentos', 'Ping'] },
  { id: 'valorant', n: 'VALORANT', c: ['#FA500F', '#E10500'], cat: ['competitivo', 'fps'], h: 'Seu desempenho começa no Windows.', p: 'Compare CPU, GPU e PFPS antes e depois do Boost.', t: ['CPU', 'GPU', 'PFPS'] },
  { id: 'cs2', n: 'Counter-Strike 2', c: ['#FFAF00', '#FA500F'], cat: ['competitivo', 'fps'], h: 'Frametime estável, mira estável.', p: 'Leitura de CPU, capturas em segundo plano e frametime.', t: ['CPU', 'Frametime'] },
  { id: 'minecraft', n: 'Minecraft', c: ['#3DDC84', '#1B8F55'], cat: ['casual'], h: 'Mundos grandes, sessão fluida.', p: 'Memória, entidades, shaders e distância de renderização.', t: ['Memória', 'CPU'] },
  { id: 'pointblank', n: 'Point Blank', c: ['#FF8205', '#FFD800'], cat: ['competitivo', 'fps'], h: 'Mais foco na partida.', p: 'CPU, RAM e processos em segundo plano sob controle.', t: ['Boost', 'Estabilidade'] },
  { id: 'crossfire', n: 'CrossFire', c: ['#E10500', '#7A0300'], cat: ['competitivo', 'fps'], h: 'Ajustes externos, partida intacta.', p: 'Detecção do jogo e métricas sem tocar nos comandos.', t: ['Detecção', 'Métricas'] },
  { id: 'fortnite', n: 'Fortnite', c: ['#4FB7FF', '#7B5CFF'], cat: ['competitivo', 'casual'], h: 'Detectado e pronto para o Boost.', p: 'O IntelliGame conecta o jogo aos seus módulos.', t: ['Detecção', 'Boost'] },
];

// ---------- home ----------
function telemetry() {
  const grid = $('#tgrid'); if (!grid) return;
  const M = [['CPU', '%', 42], ['GPU', '%', 76], ['RAM', '%', 58], ['PFPS', '', 144], ['PING', 'ms', 18], ['REDE', 'Mbps', 2.4]];
  const BOOST = { 0: 34, 2: 49, 3: 158, 4: 16 };
  const hist = M.map((m) => Array(30).fill(m[2]));
  let boosted = false;
  const spark = (a, col) => {
    const mx = Math.max(...a) * 1.15, mn = Math.min(...a) * 0.85;
    const pts = a.map((v, i) => `${(i / (a.length - 1)) * 100},${34 - ((v - mn) / (mx - mn || 1)) * 30 - 2}`).join(' ');
    return `<svg class="spark" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="${col}" stroke-width="1.5" vector-effect="non-scaling-stroke" points="${pts}"/></svg>`;
  };
  const render = () => {
    grid.innerHTML = M.map((m, i) => {
      const v = hist[i].at(-1);
      const val = m[0] === 'REDE' ? v.toFixed(1).replace('.', ',') : Math.round(v);
      return `<div><span class="mono">${m[0]}</span><strong>${val}<small> ${m[1]}</small></strong>${spark(hist[i], i < 3 ? C[2 + i] : '#4FB7FF')}</div>`;
    }).join('');
  };
  const tick = () => {
    M.forEach((m, i) => {
      const b = boosted && BOOST[i] != null ? BOOST[i] : m[2];
      const j = b * (i === 3 ? 0.04 : 0.08);
      hist[i].push(Math.max(0, b + (Math.random() - 0.5) * 2 * j));
      hist[i].shift();
    });
    render();
  };
  render();
  setInterval(tick, 700);
  $('#boost').onclick = (e) => {
    boosted = !boosted;
    e.currentTarget.setAttribute('aria-pressed', boosted);
    e.currentTarget.textContent = boosted ? '● Boost ativo · desfazer' : '⚡ Ativar Boost';
  };
}

function commandBar() {
  const form = $('#cmd'); if (!form) return;
  const q = $('#q'), out = $('#out');
  const run = (v) => {
    const k = v.trim().toLowerCase();
    if (!k) return (out.innerHTML = '');
    const g = GAMES.find((x) => x.n.toLowerCase().startsWith(k) || k.includes(x.n.toLowerCase()) || k.includes(x.id));
    out.innerHTML = g
      ? `✓ <span>${g.n}</span> tem perfil no VoltFrame → ${g.h} <a href="jogos.html#${g.id}">ver perfil</a>`
      : `→ "${v}" funciona com o Boost geral. <a href="jogos.html">Ver biblioteca</a>`;
    if (g && $('#game')) $('#game').textContent = g.n.replace(/ /g, '') + '.exe';
  };
  form.onsubmit = (e) => { e.preventDefault(); run(q.value); };
  document.querySelectorAll('#chips button').forEach((b) => (b.onclick = () => { q.value = b.textContent; run(b.textContent); }));
  const ph = ['Roblox', 'VALORANT', 'Minecraft', 'Counter-Strike 2'];
  let pi = 0, ci = 0;
  setInterval(() => {
    if (document.activeElement === q) return;
    const s = 'Otimizar ' + ph[pi];
    ci++;
    q.placeholder = s.slice(0, ci) + (ci % 2 ? '▍' : '');
    if (ci > s.length + 10) { ci = 0; pi = (pi + 1) % ph.length; }
  }, 110);
}

function logoGrid() {
  const el = $('#lgrid'); if (!el) return;
  el.innerHTML = GAMES.map((g) => `<a class="lg" href="jogos.html#${g.id}">${g.n === 'Counter-Strike 2' ? 'CS2' : g.n}<span class="pop" role="tooltip"><span class="mono">${g.n}</span><strong>${g.h}</strong><p>${g.p}</p></span></a>`).join('')
    + `<a class="lg" href="jogos.html">+ 8<span class="pop" role="tooltip"><span class="mono">Biblioteca</span><strong>15 perfis compatíveis.</strong><p>Veja todos e como a detecção funciona.</p></span></a>`;
}

function ram() {
  const el = $('#ramviz'); if (!el) return;
  el.innerHTML = Array.from({ length: 64 }, (_, i) => `<i class="${i < 27 ? 'u' : i < 31 ? 'c' : ''}"></i>`).join('');
}

// ---------- jogos ----------
function gamesPage() {
  const el = $('#gcards'); if (!el) return;
  let cat = 'todos', term = '';
  const render = () => {
    const list = GAMES.filter((g) => (cat === 'todos' || g.cat.includes(cat)) && g.n.toLowerCase().includes(term));
    el.innerHTML = list.map((g) => `
      <article class="gc" id="${g.id}">
        <div class="cover" style="background:linear-gradient(135deg,${g.c[0]},${g.c[1]})"><span style="position:relative;z-index:1;color:#0b0b0b">${g.n}</span></div>
        <div class="body">
          <span class="badge ${g.star ? 'star' : ''}">${g.star ? '★ Perfis gráficos exclusivos' : '● Detecção automática'}</span>
          <h3>${g.h}</h3><p>${g.p}</p>
          <div class="tags">${g.t.map((t) => `<span>${t}</span>`).join('')}</div>
        </div>
      </article>`).join('') || '<p class="mono">Nenhum perfil dedicado ainda — o Boost geral funciona com qualquer jogo.</p>';
  };
  document.querySelectorAll('.fbtn').forEach((b) => (b.onclick = () => {
    document.querySelectorAll('.fbtn').forEach((x) => x.setAttribute('aria-pressed', x === b));
    cat = b.dataset.cat; render();
  }));
  $('#gsearch').oninput = (e) => { term = e.target.value.toLowerCase(); render(); };
  render();

  const P = {
    'Desempenho': 'Prioriza FPS: reduz qualidade gráfica do Roblox para máxima fluidez.',
    'Equilibrado': 'Meio-termo entre visual e fluidez para a maioria dos PCs.',
    'Automático': 'Deixa o Roblox ajustar a qualidade conforme o momento.',
  };
  document.querySelectorAll('#profiles button').forEach((b) => (b.onclick = () => {
    document.querySelectorAll('#profiles button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    $('#pdesc').textContent = P[b.dataset.p];
  }));
}

// ---------- planos ----------
function plansPage() {
  const t = $('#billing'); if (!t) return;
  t.querySelectorAll('button').forEach((b) => (b.onclick = () => {
    t.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    document.querySelectorAll('[data-m]').forEach((p) => (p.textContent = b.dataset.b === 'm' ? p.dataset.m : p.dataset.a));
  }));
}

// ---------- guia ----------
function diagnostic() {
  const f = $('#diag'); if (!f) return;
  const ids = ['cpu', 'gpu', 'ram', 'ping'];
  const run = () => {
    const v = Object.fromEntries(ids.map((i) => [i, +$('#' + i).value]));
    ids.forEach((i) => ($('#' + i + 'o').textContent = v[i] + (i === 'ping' ? ' ms' : '%')));
    let h, p, tone;
    if (v.gpu >= 95) { h = 'GPU no limite'; p = 'Sua placa de vídeo está dando tudo. Reduza resolução, sombras ou efeitos no jogo — é aí que está o ganho.'; tone = 'var(--y1)'; }
    else if (v.cpu >= 85) { h = 'Processador disputado'; p = 'A CPU está ocupada. Fechar processos em segundo plano e ativar o Boost tende a ajudar bastante aqui.'; tone = 'var(--o1)'; }
    else if (v.ram >= 85) { h = 'Memória apertada'; p = 'Pouca RAM livre causa engasgos. Veja o uso no Smart Memory e feche o que não precisa durante a partida.'; tone = 'var(--o2)'; }
    else if (v.ping >= 80) { h = 'Conexão em foco'; p = 'O PC está tranquilo; a latência é o ponto. Priorize cabo, servidor mais próximo e menos downloads paralelos.'; tone = 'var(--cy)'; }
    else { h = 'Tudo equilibrado'; p = 'Nenhum gargalo evidente. Observe o frametime: estabilidade conta mais que picos de FPS.'; tone = 'var(--ok)'; }
    $('#vh').textContent = h; $('#vh').style.color = tone; $('#vp').textContent = p;
  };
  ids.forEach((i) => ($('#' + i).oninput = run));
  run();
}

telemetry(); commandBar(); logoGrid(); ram(); gamesPage(); plansPage(); diagnostic();
