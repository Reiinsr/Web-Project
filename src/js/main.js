const { loadEventList } = require('./events-list');
const { loadEvent } = require('./events');
const { initAdminPage } = require('./admin');
const { initContactPage } = require('./contact');

document.addEventListener('DOMContentLoaded', function() {
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
          if (eventId) {
            setTimeout(function() {
              loadEvent(eventId);
            }, 100);
          }
        }

        if (page === 'home') {
          setTimeout(function() {
            loadEventList();
          }, 10);
        }
        
        if (page === 'admin') {
          setTimeout(function() {
            initAdminPage();
          }, 100);
        }
        
        if (page === 'contact') {
          setTimeout(function() {
            initContactPage();
          }, 100);
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

window.loadPageContent = loadPageContent;

module.exports = { loadPageContent, loadComponent, attachNavListeners };

