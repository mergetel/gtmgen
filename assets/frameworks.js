// Reads data/frameworks.json (written weekly by .github/workflows/framework-of-the-week.yml)
// and draws either the latest framework (homepage) or all of them (/frameworks).
(function () {
  const { drawFramework, downloadCanvas, W, H } = window.GTM;

  function card(fw, { headingTag, linkToCatalogue }) {
    const wrap = document.createElement('article');
    wrap.className = 'fw';
    wrap.id = fw.slug;

    const head = document.createElement('div');
    head.className = 'slide-head';
    const h = document.createElement(headingTag);
    h.textContent = fw.name;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Download slide';
    head.append(h, btn);

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `${fw.name}: a made-up framework plotting ${fw.axes.x} against ${fw.axes.y}.`);
    const stage = document.createElement('div');
    stage.className = 'stage';
    stage.append(canvas);

    const meta = document.createElement('p');
    meta.className = 'fw-meta';
    meta.textContent = `Week ${fw.week} · invented ${fw.date}`;

    const body = document.createElement('p');
    body.className = 'fw-body';
    body.textContent = fw.explainer;

    wrap.append(head, stage, meta, body);
    if (linkToCatalogue) {
      const more = document.createElement('p');
      more.innerHTML = '<a href="/frameworks">Every framework so far</a>';
      wrap.append(more);
    }

    drawFramework(canvas.getContext('2d'), fw);
    btn.addEventListener('click', () => downloadCanvas(canvas, `framework-${fw.slug}.png`));
    return wrap;
  }

  async function load() {
    const res = await fetch('/data/frameworks.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`data/frameworks.json answered ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list)) throw new Error('data/frameworks.json is not a list');
    return list;
  }

  function fail(el, err) {
    el.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'error';
    p.textContent = `Couldn't load the frameworks: ${err && err.message ? err.message : err}`;
    el.append(p);
  }

  async function mountLatest(el) {
    try {
      const list = await load();
      el.innerHTML = '';
      if (!list.length) {
        el.textContent = 'No framework yet. The first one lands on Monday.';
        return;
      }
      el.append(card(list[list.length - 1], { headingTag: 'h3', linkToCatalogue: true }));
    } catch (err) {
      fail(el, err);
    }
  }

  async function mountAll(el) {
    try {
      const list = await load();
      el.innerHTML = '';
      if (!list.length) {
        el.textContent = 'No frameworks yet. The first one lands on Monday.';
        return;
      }
      list.slice().reverse().forEach((fw) => el.append(card(fw, { headingTag: 'h2', linkToCatalogue: false })));
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
      }
    } catch (err) {
      fail(el, err);
    }
  }

  window.GTMFrameworks = { mountLatest, mountAll };
})();
