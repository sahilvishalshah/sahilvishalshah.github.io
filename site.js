(function () {
  var EMAIL = 'sahilshah4040@gmail.com';
  var items = [
    { g: 'Go to', t: 'Home', h: '/' },
    { g: 'Go to', t: 'Projects', h: '/projects/' },
    { g: 'Go to', t: 'Work', h: '/work/' },
    { g: 'Go to', t: 'About', h: '/about/' },
    { g: 'Go to', t: 'Contact', h: 'mailto:' + EMAIL },
    { g: 'Projects', t: 'Scramjet isolator optimization', h: '/projects/#scramjet-bo' },
    { g: 'Projects', t: '5-DOF robotic arm', h: '/projects/#robotic-arm' },
    { g: 'Projects', t: 'Gun barrel heat transfer', h: '/projects/#gun-barrel' },
    { g: 'Projects', t: 'Scramjet CFD', h: '/projects/#scramjet-cfd' },
    { g: 'Projects', t: 'Fighter jet engine review paper', h: '/projects/#review-paper' },
    { g: 'Projects', t: 'Drag Reduction System', h: '/projects/#more-work' },
    { g: 'Links', t: 'LinkedIn', h: 'https://www.linkedin.com/in/sahilvishalshah', ext: 1 },
    { g: 'Actions', t: 'Copy email address', act: 'copy' }
  ];

  var ov = document.createElement('div');
  ov.className = 'pal';
  ov.hidden = true;
  ov.innerHTML =
    '<div class="pal-box" role="dialog" aria-modal="true" aria-label="Search the site">' +
    '<div class="pal-in"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
    '<input type="text" placeholder="Jump to a page, link, or action..." aria-label="Search" autocomplete="off" spellcheck="false"></div>' +
    '<ul class="pal-list" role="listbox"></ul>' +
    '<div class="pal-ft"><span><kbd>\u2191</kbd><kbd>\u2193</kbd> navigate</span><span><kbd>\u21b5</kbd> select</span><span><kbd>esc</kbd> close</span></div></div>';
  document.body.appendChild(ov);

  var input = ov.querySelector('input');
  var list = ov.querySelector('.pal-list');
  var shown = [];
  var sel = 0;
  var opener = null;

  function render() {
    var q = input.value.trim().toLowerCase();
    shown = items.filter(function (i) { return !q || i.t.toLowerCase().indexOf(q) > -1; });
    if (sel >= shown.length) sel = 0;
    list.innerHTML = '';
    if (!shown.length) {
      var e = document.createElement('li');
      e.className = 'pal-empty';
      e.textContent = 'No match. Try a project name or a page.';
      list.appendChild(e);
      return;
    }
    var last = '';
    shown.forEach(function (it, n) {
      if (it.g !== last) {
        var g = document.createElement('li');
        g.className = 'pal-grp';
        g.setAttribute('role', 'presentation');
        g.textContent = it.g;
        list.appendChild(g);
        last = it.g;
      }
      var li = document.createElement('li');
      li.className = 'pal-item';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', n === sel ? 'true' : 'false');
      li.textContent = it.t;
      if (it.ext) { var s = document.createElement('small'); s.textContent = 'opens in new tab'; li.appendChild(s); }
      li.addEventListener('mousemove', function () { if (sel !== n) { sel = n; mark(); } });
      li.addEventListener('click', function () { run(it); });
      list.appendChild(li);
    });
  }

  function mark() {
    var els = list.querySelectorAll('.pal-item');
    els.forEach(function (el, n) { el.setAttribute('aria-selected', n === sel ? 'true' : 'false'); });
    if (els[sel]) els[sel].scrollIntoView({ block: 'nearest' });
  }

  function open(from) {
    opener = from || document.activeElement;
    input.value = '';
    sel = 0;
    ov.hidden = false;
    document.body.style.overflow = 'hidden';
    render();
    input.focus();
  }

  function close() {
    ov.hidden = true;
    document.body.style.overflow = '';
    if (opener && opener.focus) opener.focus();
  }

  function run(it) {
    if (it.act === 'copy') {
      if (navigator.clipboard) navigator.clipboard.writeText(EMAIL);
      close();
      return;
    }
    close();
    if (it.ext) window.open(it.h, '_blank', 'noopener');
    else window.location.href = it.h;
  }

  input.addEventListener('input', function () { sel = 0; render(); });

  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if ((e.metaKey || e.ctrlKey) && k.toLowerCase() === 'k') {
      e.preventDefault();
      if (ov.hidden) open(); else close();
      return;
    }
    if (ov.hidden) {
      var tag = (document.activeElement || {}).tagName;
      if (k === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); open(); }
      return;
    }
    if (k === 'Escape') { e.preventDefault(); close(); }
    else if (k === 'ArrowDown') { e.preventDefault(); if (shown.length) { sel = (sel + 1) % shown.length; mark(); } }
    else if (k === 'ArrowUp') { e.preventDefault(); if (shown.length) { sel = (sel - 1 + shown.length) % shown.length; mark(); } }
    else if (k === 'Enter') { e.preventDefault(); if (shown[sel]) run(shown[sel]); }
    else if (k === 'Tab') { e.preventDefault(); }
  });

  ov.addEventListener('mousedown', function (e) { if (e.target === ov) close(); });

  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll('[data-palette]').forEach(function (b) {
    var kb = b.querySelector('kbd');
    if (kb) kb.textContent = mac ? '\u2318K' : 'Ctrl K';
    b.addEventListener('click', function () { open(b); });
  });
})();
