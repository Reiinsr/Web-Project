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
      messageDiv.innerHTML = '<div class="error-message">Please fill in all required fields (Title, Date, Description)</div>';
      return;
    }
    
    console.log('Sending fetch request to api/add_event.php...');
    
    fetch('api/add_event.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => {
      console.log('Response received, status:', res.status);
      return res.text().then(text => {
        console.log('Response text (first 200 chars):', text.substring(0, 200));
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('JSON parse error. Response was:', text);
          throw new Error('Invalid JSON response. Server may not be running. Response: ' + text.substring(0, 200));
        }
      });
    })
    .then(data => {
      console.log('Parsed response:', data);
      if (data.success) {
        messageDiv.innerHTML = '<div class="success-message">✓ Event added successfully! (ID: ' + (data.id || 'N/A') + ')</div>';
        form.reset();
        loadAdminEvents();
        setTimeout(() => {
          messageDiv.innerHTML = '';
        }, 5000);
      } else {
        const errorMsg = data.error || data.message || 'Failed to add event';
        messageDiv.innerHTML = '<div class="error-message">✗ Error: ' + errorMsg + '</div>';
        console.error('API Error:', data);
      }
    })
    .catch(error => {
      const errorMsg = 'Error: ' + error.message;
      messageDiv.innerHTML = '<div class="error-message">✗ ' + errorMsg + '<br><small>Check browser console (F12) for details</small></div>';
      console.error('Fetch Error:', error);
    });
  });
  
  console.log('Admin page initialized successfully');
}

function loadAdminEvents() {
  fetch('api/get_events.php')
    .then(res => {
      return res.text().then(text => {
        return JSON.parse(text);
      });
    })
    .then(events => {
      const container = document.getElementById('admin-event-list');
      if (!container) {
        console.error('Admin event list container not found!');
        return;
      }
      
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
    })
    .catch(error => {
      const container = document.getElementById('admin-event-list');
      if (container) {
        container.innerHTML = '<div class="error-message">Error loading events: ' + error.message + '</div>';
      }
      console.error('Error loading events:', error);
    });
}

setTimeout(initAdminPage, 100);


