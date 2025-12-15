document.addEventListener('DOMContentLoaded', () => {
  loadComponent('components/header.html', '#header');
  loadComponent('components/footer.html', '#footer');
  router();
  window.addEventListener('popstate', router);
  window.addEventListener('hashchange', router);
});

function loadComponent(url, selector) {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      document.querySelector(selector).innerHTML = data;
      if (selector === '#header') attachNavListeners();
    });
}

function loadPageContent(page) {
  fetch(`pages/${page}.html`)
    .then(res => res.text())
    .then(html => {
      document.querySelector('#content').innerHTML = html;

      setTimeout(() => {
        if (page === 'event') {
          const script = document.createElement('script');
          script.src = 'js/events.js';
          document.body.appendChild(script);
        }

        if (page === 'home') {
          const script = document.createElement('script');
          script.src = 'js/events-list.js';
          document.body.appendChild(script);
        }
        
        if (page === 'admin') {
          const script = document.createElement('script');
          script.src = 'js/admin.js';
          document.body.appendChild(script);
        }
      }, 50);
    });
}

function attachNavListeners() {
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.getAttribute('data-page');
      history.pushState({}, '', `#${page}`);
      router();
    });
  });
}

function router() {
  const hash = location.hash;
  const page = hash.split('?')[0].replace('#', '') || 'home';
  loadPageContent(page);
}
