// Motion layer: runs after app.js has injected header/footer and rendered lists.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const vh = () => innerHeight;

  // scroll progress bar
  const prog = document.createElement('div');
  prog.className = 'sprog';
  document.body.appendChild(prog);

  // hero headline: split into words that rise in
  const h1 = document.querySelector('.hero h1');
  if (h1 && !reduce) {
    let i = 0;
    const split = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) return frag.append(t);
            const w = document.createElement('span');
            w.className = 'w';
            w.innerHTML = `<span style="--i:${i++}">${t}</span>`;
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeName === 'EM') {
          // keep the gradient on each word of the accent line
          const cls = n.className;
          const words = n.textContent.split(/\s+/).filter(Boolean);
          const em = document.createElement('em');
          em.innerHTML = words.map((t) => `<span class="w"><span class="${cls}" style="--i:${i++}">${t}</span></span>`).join(' ');
          n.replaceWith(em);
        }
      });
    };
    split(h1);
    // the rest of the hero fades up after the headline
    [...document.querySelectorAll('.hero .in > *:not(h1)')].forEach((el, k) => {
      el.classList.add('intro');
      el.style.setProperty('--d', 350 + i * 40 + k * 90);
    });
  }

  // scroll reveal: only things that start below the fold get hidden
  const targets = [
    '.head', '.pillar', '.lg', '.bx', '.steps > div', '.faq details', '.plan', '.tablewrap',
    '.prose section', '.bt > div', '.gd', '.diag', '.gfilter', '.cta .in', '.fgrid > div',
  ];
  const els = document.querySelectorAll(targets.join(','));
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('show');
        e.target.classList.remove('pre');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach((el) => {
      el.classList.add('rv');
      // stagger siblings in the same grid
      const sibs = [...el.parentElement.children].filter((c) => c.matches(targets.join(',')));
      el.style.setProperty('--s', Math.min(sibs.indexOf(el), 8));
      if (el.getBoundingClientRect().top > vh() * 0.92) {
        el.classList.add('pre');
        io.observe(el);
      }
    });
    // safety: never leave content hidden
    setTimeout(() => document.querySelectorAll('.rv.pre').forEach((el) => {
      if (el.getBoundingClientRect().top < vh()) el.classList.remove('pre');
    }), 2500);
  }

  // scroll-linked effects
  const hero = document.querySelector('.hero');
  const tele = document.querySelector('.tele');
  const ctas = document.querySelectorAll('.cta');
  const steps = document.querySelectorAll('.steps');
  let lastY = scrollY, ticking = false;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const onScroll = () => {
    ticking = false;
    const y = scrollY;
    const max = root.scrollHeight - vh();
    prog.style.setProperty('--p', max > 0 ? y / max : 0);

    root.classList.toggle('scrolled', y > 20);
    root.classList.toggle('hide-nav', y > 400 && y > lastY && !document.querySelector('#links.open'));
    lastY = y;

    if (reduce) return;
    if (hero) {
      const r = hero.getBoundingClientRect();
      const t = clamp(-r.top / r.height, 0, 1);
      hero.style.setProperty('--py', `${t * 120}px`);
      hero.style.setProperty('--ho', 1 - t * 0.9);
    }
    if (tele) {
      const r = tele.getBoundingClientRect();
      const t = clamp((vh() - r.top) / (vh() * 0.7), 0, 1);
      tele.style.setProperty('--tx', `${(1 - t) * 18}deg`);
      tele.style.setProperty('--ts', 0.94 + t * 0.06);
    }
    ctas.forEach((c) => {
      const r = c.getBoundingClientRect();
      const t = clamp((vh() - r.top) / (vh() + r.height), 0, 1);
      c.style.setProperty('--cs', 0.88 + t * 0.2);
      c.style.setProperty('--py', `${(t - 0.5) * -80}px`);
    });
    steps.forEach((s) => {
      const r = s.getBoundingClientRect();
      s.style.setProperty('--sp', clamp((vh() * 0.85 - r.top) / (r.height + vh() * 0.3), 0, 1));
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  if (reduce || !matchMedia('(hover: hover)').matches) return;

  // cursor spotlight on cards
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.pillar,.bx,.gc,.gd,.plan');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  // magnetic buttons: pull toward the cursor, spring back on leave
  document.querySelectorAll('.btn, .boost').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--bx', `${(e.clientX - r.left - r.width / 2) * 0.18}px`);
      b.style.setProperty('--by', `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
    });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
  });

  // games page: animate cards each time the filter re-renders
  const gcards = document.querySelector('#gcards');
  if (gcards) {
    const tag = () => gcards.querySelectorAll('.gc').forEach((c, k) => { c.classList.add('enter'); c.style.setProperty('--s', k); });
    new MutationObserver(tag).observe(gcards, { childList: true });
  }

  // guide: pulse the verdict when it changes
  const vh4 = document.querySelector('#vh');
  if (vh4) {
    const box = vh4.closest('.verdict');
    new MutationObserver(() => { box.classList.remove('pulse'); void box.offsetWidth; box.classList.add('pulse'); })
      .observe(vh4, { childList: true });
  }
})();
