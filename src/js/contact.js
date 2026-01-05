function initContactPage() {
  const form = document.getElementById('contact-form');
  const messageDiv = document.createElement('div');
  messageDiv.id = 'contact-message';
  messageDiv.style.marginTop = '15px';
  form.appendChild(messageDiv);
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    messageDiv.innerHTML = '<div class="info-message">Sending message...</div>';
    
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };
    
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }
    
    fetch('api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        messageDiv.innerHTML = '<div class="success-message">✓ Message sent successfully!</div>';
        form.reset();
        setTimeout(function() {
          messageDiv.innerHTML = '';
        }, 5000);
      }
    });
  });
}

module.exports = { initContactPage };

