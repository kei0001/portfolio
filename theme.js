(() => {
  const requested = new URLSearchParams(location.search).get('theme');
  let theme = requested === 'dark' ? 'dark' : 'light';
  try {
    if (!requested) theme = sessionStorage.getItem('portfolio-theme') || 'light';
    sessionStorage.setItem('portfolio-theme', theme);
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
})();
