function initAdminPage() {
  console.log('Initializing admin page...');
  
  const form = document.getElementById('event-form');
  const messageDiv = document.getElementById('form-message');
  
  if (!form) {
    console.error('Event form not found!');
    return;
  }
  
  if (!messageDiv) {
    console.error('Message div not found!');
    return;
  }
  
  console.log('Form found, attaching event listener...');
  
  loadAdminEvents();
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submitted!');
    
    messageDiv.innerHTML = '<div class="info-message">Adding event...</div>';
    
    const formData = {
      title: document.getElementById('title').value.trim(),
      date: document.getElementById('date').value,
      location: document.getElementById('location').value.trim(),
      description: document.getElementById('description').value.trim()
    };
    
    console.log('Form data:', formData);
    
    if (!formData.title || !formData.date || !formData.description) {
      return;
    }
    
    fetch('api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        messageDiv.innerHTML = '<div class="success-message">✓ Event added successfully! (ID: ' + (data.id || 'N/A') + ')</div>';
        form.reset();
        loadAdminEvents();
        setTimeout(() => {
          messageDiv.innerHTML = '';
        }, 5000);
      }
    });
  });
  
  console.log('Admin page initialized successfully');
}

function loadAdminEvents() {
  fetch('api/events')
    .then(res => res.json())
    .then(events => {
      const container = document.getElementById('admin-event-list');
      if (!container) return;
      
      if (events.length === 0) {
        container.innerHTML = '<p>No events found. Add your first event above!</p>';
        return;
      }
      
      container.innerHTML = events.map(event => `
        <div class="admin-event-card">
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}
          <p>${event.description}</p>
          <small style="color: #666;">ID: ${event.id}</small>
        </div>
      `).join('');
    });
}

setTimeout(initAdminPage, 100);


