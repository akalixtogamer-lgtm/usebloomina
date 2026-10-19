/* Bloomina · vitrine: tema, menu móvel, busca/filtro/ordenação e detalhes da peça. Sem dependências. */
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'bloomina-theme';
  var WA = '5521981264144';
  var CAT_LABEL = { brincos: 'Brincos', colares: 'Colares', pulseiras: 'Pulseiras', aneis: 'Anéis' };

  /* ---------- tema (preservado da versão anterior) ---------- */
  var toggles = document.querySelectorAll('[data-theme-toggle]');
  function currentTheme() {
    return root.getAttribute('data-theme') || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function syncTheme() {
    var dark = currentTheme() === 'dark';
    toggles.forEach(function (b) {
      b.setAttribute('aria-pressed', String(dark));
      var l = b.querySelector('[data-theme-label]');
      if (l) l.textContent = dark ? 'Tema claro' : 'Tema escuro';
    });
  }
  toggles.forEach(function (b) {
    b.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      syncTheme();
    });
  });
  syncTheme();

  /* ---------- cabeçalho ---------- */
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- menu móvel ---------- */
  var menuBtn = document.querySelector('[data-menu-btn]');
  var menu = document.getElementById('menu-movel');
  function setMenu(open, returnFocus) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('[data-menu-label]').textContent = open ? 'Fechar menu' : 'Abrir menu';
    menuBtn.querySelector('[data-icon-open]').toggleAttribute('hidden', open);
    menuBtn.querySelector('[data-icon-close]').toggleAttribute('hidden', !open);
    if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
    else if (returnFocus) menuBtn.focus();
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden, true); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false, false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false, true); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (m) { if (m.matches && !menu.hidden) setMenu(false, false); });

  /* ---------- vitrine ---------- */
  var grid = document.querySelector('[data-grid]');
  var items = Array.prototype.slice.call(grid.querySelectorAll('.product'));
  var search = document.getElementById('busca');
  var sort = document.getElementById('ordem');
  var chips = document.querySelectorAll('[data-filter]');
  var countEl = document.querySelector('[data-count]');
  var empty = document.querySelector('[data-empty]');
  var clearBtns = document.querySelectorAll('[data-clear]');
  var state = { cat: 'todas', q: '', sort: 'destaque' };

  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }

  function readUrl() {
    var p = new URLSearchParams(location.search);
    var c = p.get('categoria');
    state.cat = c && CAT_LABEL[c] ? c : 'todas';
    state.q = p.get('busca') || '';
    var s = p.get('ordem');
    state.sort = ['destaque', 'menor', 'maior', 'nome'].indexOf(s) > -1 ? s : 'destaque';
  }
  function writeUrl() {
    var p = new URLSearchParams();
    if (state.cat !== 'todas') p.set('categoria', state.cat);
    if (state.q) p.set('busca', state.q);
    if (state.sort !== 'destaque') p.set('ordem', state.sort);
    var qs = p.toString();
    try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash); } catch (e) {}
  }

  function apply() {
    var q = norm(state.q);
    var shown = items.filter(function (el) {
      var okCat = state.cat === 'todas' || el.dataset.cat === state.cat;
      var hay = norm(el.dataset.name + ' ' + el.dataset.mat + ' ' + (CAT_LABEL[el.dataset.cat] || '') + ' ' + el.dataset.desc);
      var ok = okCat && (!q || q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; }));
      el.hidden = !ok;
      return ok;
    });
    var sorted = items.slice().sort(function (a, b) {
      if (state.sort === 'menor') return a.dataset.price - b.dataset.price;
      if (state.sort === 'maior') return b.dataset.price - a.dataset.price;
      if (state.sort === 'nome') return a.dataset.name.localeCompare(b.dataset.name, 'pt-BR');
      return a.dataset.order - b.dataset.order;
    });
    sorted.forEach(function (el) { grid.appendChild(el); });

    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === state.cat)); });
    if (search.value !== state.q) search.value = state.q;
    sort.value = state.sort;

    var n = shown.length;
    var where = state.cat !== 'todas' ? ' em ' + CAT_LABEL[state.cat] : '';
    var term = state.q ? ' para “' + state.q + '”' : '';
    countEl.textContent = n === 0 ? 'Nenhuma peça' + where + term : n + (n === 1 ? ' peça' : ' peças') + where + term;
    empty.hidden = n !== 0;
    grid.hidden = n === 0;
    var filtered = state.cat !== 'todas' || !!state.q;
    clearBtns.forEach(function (b) { if (!b.closest('[data-empty]')) b.hidden = !filtered; });
    writeUrl();
  }

  var t;
  search.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = search.value.trim(); apply(); }, 180); });
  document.querySelector('[data-toolbar]').addEventListener('submit', function (e) { e.preventDefault(); state.q = search.value.trim(); apply(); });
  sort.addEventListener('change', function () { state.sort = sort.value; apply(); });
  chips.forEach(function (c) { c.addEventListener('click', function () { state.cat = c.dataset.filter; apply(); }); });
  clearBtns.forEach(function (b) { b.addEventListener('click', function () { state.cat = 'todas'; state.q = ''; state.sort = 'destaque'; apply(); search.focus(); }); });

  // categorias: links reais (?categoria=x#pecas); com JS, filtram sem recarregar
  document.querySelectorAll('[data-cat-link]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      state.cat = a.dataset.catLink; state.q = '';
      apply();
      var target = document.getElementById('pecas');
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      try { history.replaceState(null, '', location.pathname + location.search + '#pecas'); } catch (err) {}
      var chip = document.querySelector('[data-filter="' + state.cat + '"]');
      if (chip) chip.focus({ preventScroll: true });
    });
  });

  // busca no cabeçalho
  document.querySelectorAll('[data-open-search]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!menu.hidden) setMenu(false, false);
      document.getElementById('pecas').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      setTimeout(function () { search.focus({ preventScroll: true }); }, 350);
    });
  });

  readUrl(); apply();

  /* ---------- detalhes da peça ---------- */
  var dlg = document.getElementById('detalhe');
  var lastTrigger = null;
  function fill(el) {
    var price = 'R$ ' + el.dataset.price;
    dlg.querySelector('[data-d-img]').src = el.dataset.img;
    dlg.querySelector('[data-d-img]').alt = el.dataset.alt;
    dlg.querySelector('[data-d-mat]').textContent = el.dataset.mat;
    dlg.querySelector('[data-d-name]').textContent = el.dataset.name;
    dlg.querySelector('[data-d-price]').textContent = price;
    dlg.querySelector('[data-d-desc]').textContent = el.dataset.desc;
    dlg.querySelector('[data-d-cat]').textContent = CAT_LABEL[el.dataset.cat] || '';
    dlg.querySelector('[data-d-wa]').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Olá! Vi no site a peça ' + el.dataset.name + ' (' + price + ') e queria saber mais.');
  }
  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-detail]');
    if (!btn) return;
    lastTrigger = btn;
    fill(btn.closest('.product'));
    if (typeof dlg.showModal === 'function') { dlg.showModal(); dlg.querySelector('[data-close]').focus(); }
  });
  dlg.querySelector('[data-close]').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // clique no fundo
  dlg.addEventListener('close', function () { if (lastTrigger) lastTrigger.focus(); });
})();
