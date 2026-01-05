function initLoginPage() {
  const form = document.getElementById('login-form');
  const messageDiv = document.getElementById('login-message');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    messageDiv.innerHTML = '<div class="info-message">Logging in...</div>';
    
    const formData = {
      username: document.getElementById('login-username').value.trim(),
      password: document.getElementById('login-password').value
    };
    
    if (!formData.username || !formData.password) {
      return;
    }
    
    fetch('api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        messageDiv.innerHTML = '<div class="success-message">✓ Login successful! Redirecting...</div>';
        setTimeout(function() {
          window.location.reload();
        }, 1000);
      } else {
        messageDiv.innerHTML = '<div class="error-message">' + (data.error || 'Login failed') + '</div>';
      }
    });
  });
}

function initSignupPage() {
  const form = document.getElementById('signup-form');
  const messageDiv = document.getElementById('signup-message');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    messageDiv.innerHTML = '<div class="info-message">Creating account...</div>';
    
    const formData = {
      username: document.getElementById('signup-username').value.trim(),
      email: document.getElementById('signup-email').value.trim(),
      password: document.getElementById('signup-password').value,
      isAdmin: document.getElementById('signup-is-admin').checked
    };
    
    if (!formData.username || !formData.email || !formData.password) {
      return;
    }
    
    fetch('api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        messageDiv.innerHTML = '<div class="success-message">✓ Account created! Redirecting...</div>';
        setTimeout(function() {
          window.location.reload();
        }, 1000);
      } else {
        messageDiv.innerHTML = '<div class="error-message">' + (data.error || 'Signup failed') + '</div>';
      }
    });
  });
}

function logout() {
  fetch('api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    if (data.success) {
      window.location.reload();
    }
  });
}

function checkAuth() {
  return fetch('api/auth/me', {
    credentials: 'include'
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    return data;
  });
}

module.exports = { initLoginPage, initSignupPage, logout, checkAuth };

