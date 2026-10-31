// Terminal portrait: a blinking ASCII hamster + typed "commands" + click easter eggs.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ----- the hamster (ASCII frames made from the meme image) -----
  const OPEN = ["                :-=-----", "               *=:.....:++", "            :=#*==-      .+==:", "       .=###*%%##+**#= =##%@@@%#*+%%", "      =@%:.+%%@+%@#.=*.%=:%@%@##=@@#.", "       =@-:@*%%@@@%%#@%@+#%@@@@*:@*", "        *%:*-#%%%#==@#=@*+%@@@%%%@-", "        .%@=  .:. :##  +@=:++=.:@#", "        -*+#*===+*#+:.  =#%%#**%**:", "       =*   :---:.:---       ... .*.", "     .*=         -+----           :*", "    =+:           -+-+-            -+", "  .*: +:                          +==+", " :*:   :  .=-                .== .-  -*", "=+         .-+=           .:=+-       -*", "=             -#+=-::::-====:          +-", "                :-=++++=-:             .#.", "                                        .*"].join('\n');
  const SHUT = ["                :-=-----", "               *=:.....:++", "            :=#*==-      .+==:", "       .=###*#=---**#= =##%@@@%#*+%%", "      =@%:.++       =*.%=:+:  .==@@#.", "       =@-:@%#: .=%%#@%@+#=    :-@*", "        *%:*:+###*:=@#=@*+#%+=*%@@-", "        .%@=      :##  +@=.-==-:@#", "        -*+#*===+*#+:.  =#%%#**%**:", "       =*   :---:.:---       ... .*.", "     .*=         -+----           :*", "    =+:           -+-+-            -+", "  .*: +:                          +==+", " :*:   :  .=-                .== .-  -*", "=+         .-+=           .:=+-       -*", "=             -#+=-::::-====:          +-", "                :-=++++=-:             .#.", "                                        .*"].join('\n');

  function runPet(pre) {
    pre.textContent = OPEN;
    if (reduce) return;
    const blink = (done) => {
      pre.textContent = SHUT;
      setTimeout(() => { pre.textContent = OPEN; if (done) done(); }, 150);
    };
    const tick = () => {
      blink(() => {
        if (Math.random() < 0.3) setTimeout(blink, 180);   // sometimes a double blink
      });
      setTimeout(tick, 2000 + Math.random() * 3500);
    };
    setTimeout(tick, 1500);
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

  document.querySelectorAll('.pet').forEach(runPet);
  document.querySelectorAll('.term').forEach(runTerm);
})();
