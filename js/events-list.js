function loadEventList() {
  const container = document.getElementById('event-list');
  if (!container) return;

  // Check if accessing via file:// protocol (won't work with PHP)
  if (window.location.protocol === 'file:') {
    container.innerHTML = `
      <div class="error-message" style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 5px; margin: 20px 0;">
        <h3>⚠️ PHP Not Available</h3>
        <p>You're accessing this page via <code>file://</code> protocol, which cannot execute PHP.</p>
        <p><strong>Solution:</strong> Access via XAMPP web server:</p>
        <ul>
          <li>Make sure XAMPP Apache is running</li>
          <li>Open: <code>http://localhost/Project Phase 1/index.html</code></li>
          <li>Or use: <code>http://localhost/Project%20Phase%201/index.html</code> (with URL encoding)</li>
        </ul>
      </div>
    `;
    return;
  }

  fetch('api/get_events.php')
    .then(res => {
      // Check if response is actually PHP code (not JSON)
      return res.text().then(text => {
        if (text.trim().startsWith('<?php') || text.trim().startsWith('<!DOCTYPE')) {
          throw new Error('PHP is not executing. Server returned PHP code instead of JSON. Make sure you are accessing via http://localhost, not file:// or live-server.');
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Response was:', text.substring(0, 200));
          throw new Error('Invalid JSON response. PHP may not be executing. Response: ' + text.substring(0, 100));
        }
      });
    })
    .then(events => {
      if (events.length === 0) {
        container.innerHTML = '<p class="no-events">No upcoming events at this time. Check back soon!</p>';
        return;
      }
      
      container.innerHTML = events.map(event => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        return `
          <div class="event-card">
            <div class="event-card-header">
              <h3>${event.title}</h3>
              <span class="event-date-badge">${formattedDate}</span>
            </div>
            ${event.location ? `<p class="event-location"><i class="location-icon">📍</i> ${event.location}</p>` : ''}
            <p class="event-description">${event.description}</p>
            <a href="#event?id=${event.id}" data-page="event" class="btn-view-details">View Details</a>
          </div>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('Error loading events:', error);
      container.innerHTML = `
        <div class="error-message" style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 5px; margin: 20px 0;">
          <h3>⚠️ Unable to Load Events</h3>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Current URL:</strong> ${window.location.href}</p>
          <p><strong>Solution:</strong></p>
          <ol>
            <li>Make sure XAMPP Apache is running</li>
            <li>Access via: <code>http://localhost/Project Phase 1/index.html</code></li>
            <li>Test API: <code>http://localhost/Project Phase 1/api/get_events.php</code></li>
          </ol>
        </div>
      `;
    });
}

setTimeout(loadEventList, 10);
