(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W = 21;
  const pad = (s) => {
    const n = Math.max(0, W - s.length), l = n >> 1;
    return ' '.repeat(l) + s + ' '.repeat(n - l);
  };
 
  // ----- the eye -----
  const open = (px) => {                 // px: -1 left, 0 centre, 1 right
    const L = 7 + px * 3, R = 14 - L;
    return [
      '.-"""""-.',
      '.-"         "-.',
      '(' + ' '.repeat(L) + '(@)' + ' '.repeat(R) + ')',
      '"-.         .-"',
      '"-.....-"'
    ].map(pad).join('\n');
  };
  const shut = () => ['', '', '(' + '_'.repeat(17) + ')', '', ''].map(pad).join('\n');
 
  function runEye(pre) {
    pre.textContent = open(0);
    if (reduce) return;
    const tick = () => {
      const r = Math.random();
      if (r < 0.6) {                      // blink
        pre.textContent = shut();
        setTimeout(() => { pre.textContent = open(0); }, 140);
      } else {                            // look aside
        pre.textContent = open(r < 0.8 ? -1 : 1);
        setTimeout(() => { pre.textContent = open(0); }, 900);
      }
      setTimeout(tick, 2200 + Math.random() * 3000);
    };
    setTimeout(tick, 1800);
  }
 
  // ----- the terminal -----
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
 
  function runTerm(box) {
    const list = (s) => (s || '').split('|').map((x) => x.trim()).filter(Boolean);
    const lines = list(box.dataset.lines);
    const eggs = list(box.dataset.eggs);
    const MAX = 6;
    let eggI = 0;
 
    const cur = document.createElement('span');
    cur.className = 'cur';
 
    const row = (cls) => {
      const d = document.createElement('div');
      const t = document.createElement('span');
      if (cls) d.className = cls;
      d.append(t, cur);                   // the cursor always sits on the newest line
      box.append(d);
      while (box.children.length > MAX) box.firstChild.remove();
      return t;
    };
 
    const type = (el, text) => new Promise((res) => {
      if (reduce) { el.textContent = text; return res(); }
      let i = 0;
      const step = () => {
        el.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(step, 45 + Math.random() * 40); else res();
      };
      step();
    });
 
    (async () => {
      for (;;) {
        box.textContent = '';
        for (const l of lines) {
          await type(row(), '> ' + l);
          if (!reduce) await sleep(700);
        }
        if (reduce) return;
        await sleep(4000);
      }
    })();
 
    // click the screen to find an easter egg
    const screen = box.closest('.screen') || box;
    screen.addEventListener('click', () => {
      if (!eggs.length) return;
      row('egg').textContent = eggs[eggI++ % eggs.length];
    });
  }
 
  document.querySelectorAll('.eye').forEach(runEye);
  document.querySelectorAll('.term').forEach(runTerm);
})();
 
