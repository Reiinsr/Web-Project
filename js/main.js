document.addEventListener('DOMContentLoaded', () => {
  loadComponent('components/header.html', '#header');
  loadComponent('components/footer.html', '#footer');
  loadPageContent('home');
});

async function loadComponent(url, selector) {
  const data = await (await fetch(url)).text();
  document.querySelector(selector).innerHTML = data;
  if (selector === '#header') attachNavListeners();
}

async function loadPageContent(page, eventId) {
  const html = await (await fetch(`pages/${page}.html`)).text();
  document.querySelector('#content').innerHTML = html;

  setTimeout(() => {
    if (page === 'event') {
      const script = document.createElement('script');
      script.src = 'js/events.js';
      document.body.appendChild(script);
      if (eventId) {
        setTimeout(() => loadEvent(eventId), 100);
      }
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
}

function attachNavListeners() {
  document.querySelectorAll('nav a').forEach(link => {
    link.onclick = function() {
      const page = this.getAttribute('data-page');
      loadPageContent(page);
      return false;
    };
  });
}
