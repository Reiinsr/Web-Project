function initAdminPage() {
  const form = document.getElementById('event-form');
  const messageDiv = document.getElementById('form-message');
  
  loadAdminEvents();
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      title: document.getElementById('title').value.trim(),
      date: document.getElementById('date').value,
      location: document.getElementById('location').value.trim(),
      description: document.getElementById('description').value.trim()
    };
    
    if (!formData.title || !formData.date || !formData.description) {
      return;
    }
    
    if (editingEventId) {
      messageDiv.innerHTML = '<div class="info-message">Updating event...</div>';
      
      fetch(`api/events/${editingEventId}`, {
        method: 'PUT',
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
          messageDiv.innerHTML = '<div class="success-message">✓ Event updated successfully!</div>';
          form.reset();
          editingEventId = null;
          loadAdminEvents();
          setTimeout(function() {
            messageDiv.innerHTML = '';
          }, 5000);
        }
      });
    } else {
      messageDiv.innerHTML = '<div class="info-message">Adding event...</div>';
      
      fetch('api/events', {
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
          messageDiv.innerHTML = '<div class="success-message">✓ Event added successfully! (ID: ' + (data.id || 'N/A') + ')</div>';
          form.reset();
          loadAdminEvents();
          setTimeout(function() {
            messageDiv.innerHTML = '';
          }, 5000);
        }
      });
    }
  });
}

function loadAdminEvents() {
  fetch('api/events')
    .then(function(response) {
      return response.json();
    })
    .then(function(events) {
      const container = document.getElementById('admin-event-list');
      
      if (events.length === 0) {
        container.innerHTML = '<p>No events found. Add your first event above!</p>';
        return;
      }
      
      container.innerHTML = events.map(function(event) {
        return `
          <div class="admin-event-card">
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}
            <p>${event.description}</p>
            <small style="color: #666;">ID: ${event.id}</small>
            <div style="margin-top: 15px;">
              <button onclick="editEvent(${event.id})" class="btn btn-primary" style="margin-right: 10px;">Edit</button>
              <button onclick="deleteEvent(${event.id})" class="btn btn-secondary">Delete</button>
            </div>
          </div>
        `;
      }).join('');
    });
}

let editingEventId = null;

function editEvent(eventId) {
  fetch(`api/events/${eventId}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(event) {
      document.getElementById('title').value = event.title;
      document.getElementById('date').value = event.date;
      document.getElementById('location').value = event.location || '';
      document.getElementById('description').value = event.description;
      editingEventId = eventId;
    });
}

function deleteEvent(eventId) {
  if (!confirm('Are you sure you want to delete this event?')) {
    return;
  }
  
  fetch(`api/events/${eventId}`, {
    method: 'DELETE'
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        loadAdminEvents();
      }
    });
}

setTimeout(initAdminPage, 100);


