(() => {
  const translations = window.ELYARA_TRANSLATIONS || {};
  const config = window.ELYARA_CONFIG || {};
  const fallback = translations.en || {};
  let currentLang = localStorage.getItem('elyara-language') || 'en';
  if (!translations[currentLang]) currentLang = 'en';
  const t = key => translations[currentLang]?.[key] ?? fallback[key] ?? key;

  function applyLanguage(lang){
    currentLang = translations[lang] ? lang : 'en';
    localStorage.setItem('elyara-language', currentLang);
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
    const label = document.getElementById('languageLabel');
    if (label) label.textContent = translations[currentLang]?.language_name || 'English';
  }
  applyLanguage(currentLang);

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const languageButton = document.getElementById('languageButton');
  const languageMenu = document.getElementById('languageMenu');
  languageButton?.addEventListener('click', e => {
    e.stopPropagation();
    const open = languageMenu.classList.toggle('is-open');
    languageButton.setAttribute('aria-expanded', String(open));
  });
  languageMenu?.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    applyLanguage(btn.dataset.lang);
    languageMenu.classList.remove('is-open');
    languageButton?.setAttribute('aria-expanded','false');
  }));
  document.addEventListener('click', e => {
    if (!e.target.closest('.language-wrap')) {
      languageMenu?.classList.remove('is-open');
      languageButton?.setAttribute('aria-expanded','false');
    }
  });

  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  menuToggle?.addEventListener('click', () => mobileNav?.classList.toggle('is-open'));
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('is-open')));

  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-page]').forEach(a => {
    if ((a.getAttribute('href') || '').toLowerCase() === currentFile) a.classList.add('active');
  });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    let target;
    try { target = new URL(href, location.href); } catch { return; }
    if (target.origin !== location.origin) return;
    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => { location.href = target.href; }, 180);
    });
  });

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, {threshold:.12}) : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('is-visible'));

  const emailNodes = document.querySelectorAll('[data-contact-email]');
  if (config.email) emailNodes.forEach(el => { el.textContent = config.email; if (el.tagName === 'A') el.href = `mailto:${config.email}`; });

  let supabaseClient = null;
  if (config.supabaseUrl && config.supabaseAnonKey && window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  }
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    if (!supabaseClient) { status.textContent = t('form_setup'); return; }
    status.textContent = '...';
    const { error } = await supabaseClient.from('inquiries').insert([{
      name: values.name,
      email: values.email,
      business: values.business || null,
      service: values.service,
      message: values.message,
      language: currentLang,
      source: 'elyara-website'
    }]);
    if (error) { status.textContent = error.message; return; }
    form.reset();
    status.textContent = t('form_success');
  });
})();
