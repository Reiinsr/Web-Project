const { loadEventList } = require('./events-list');
const { loadEvent } = require('./events');
const { initAdminPage } = require('./admin');
const { initContactPage } = require('./contact');
const { initLoginPage, initSignupPage, logout, checkAuth } = require('./auth');

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
      if (selector === '#header') {
        setTimeout(function() {
          attachNavListeners();
        }, 50);
      }
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
        
        if (page === 'login') {
          setTimeout(function() {
            initLoginPage();
          }, 100);
        }
        
        if (page === 'signup') {
          setTimeout(function() {
            initSignupPage();
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
  
  setTimeout(function() {
    checkAuth().then(function(authData) {
      updateHeader(authData);
    });
  }, 100);
}

function updateHeader(authData) {
  const nav = document.querySelector('nav');
  if (!nav) {
    setTimeout(function() {
      updateHeader(authData);
    }, 100);
    return;
  }
  
  const adminLink = nav.querySelector('a[data-page="admin"]');
  const loginButton = document.getElementById('login-button');
  const userInfo = document.getElementById('user-info');
  
  if (authData && authData.success && authData.user) {
    const isAdmin = authData.user.isAdmin === true || authData.user.isAdmin === 1 || authData.user.isAdmin === '1';
    
    if (isAdmin && adminLink) {
      adminLink.style.display = '';
    } else if (adminLink) {
      adminLink.style.display = 'none';
    }
    
    if (loginButton) {
      loginButton.style.display = 'none';
    }
    
    if (userInfo) {
      userInfo.innerHTML = `
        <span style="margin-right: 15px;">Welcome, ${authData.user.username}</span>
        <button onclick="window.logout()" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.9rem;">Logout</button>
      `;
      userInfo.style.display = 'flex';
      userInfo.style.alignItems = 'center';
      userInfo.style.gap = '10px';
    }
  } else {
    if (adminLink) {
      adminLink.style.display = 'none';
    }
    
    if (loginButton) {
      loginButton.style.display = '';
    }
    
    if (userInfo) {
      userInfo.style.display = 'none';
    }
  }
}

window.loadPageContent = loadPageContent;
window.logout = logout;

module.exports = { loadPageContent, loadComponent, attachNavListeners, updateHeader };

