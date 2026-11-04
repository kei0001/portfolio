(() => {
  const requested = new URLSearchParams(location.search).get('theme');
  let theme = requested === 'light' ? 'light' : 'dark';
  try {
    if (!requested) theme = sessionStorage.getItem('portfolio-theme') || 'dark';
    sessionStorage.setItem('portfolio-theme', theme);
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
})();
