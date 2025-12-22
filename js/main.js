document.addEventListener('DOMContentLoaded', () => {
  loadComponent('components/header.html', '#header');
  loadComponent('components/footer.html', '#footer');
  loadPageContent('home');
});

function loadComponent(url, selector) {
  fetch(url)
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      document.querySelector(selector).innerHTML = data;
      if (selector === '#header') attachNavListeners();
    });
}

function loadPageContent(page, eventId) {
  fetch(`pages/${page}.html`)
    .then(function(response) {
      return response.text();
    })
    .then(function(html) {
      document.querySelector('#content').innerHTML = html;

      setTimeout(function() {
        if (page === 'event') {
          const script = document.createElement('script');
          script.src = 'js/events.js';
          document.body.appendChild(script);
          if (eventId) {
            setTimeout(function() {
              loadEvent(eventId);
            }, 100);
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
        
        if (page === 'contact') {
          const script = document.createElement('script');
          script.src = 'js/contact.js';
          document.body.appendChild(script);
        }
      }, 50);
    });
}

function attachNavListeners() {
  document.querySelectorAll('nav a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      loadPageContent(page);
    });
  });
}
