function loadEventFromHash() {
  const hash = location.hash;
  const params = new URLSearchParams(hash.split('?')[1]);
  const eventId = params.get('id');
  const container = document.getElementById('event-details');
  if (!eventId || !container) return;

  fetch(`api/get_event.php?id=${eventId}`)
    .then(res => res.json())
    .then(event => {
      if (event.error) {
        container.innerHTML = '<div class="error-message"><p>Event not found.</p></div>';
        return;
      }
      
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      container.innerHTML = `
        <div class="event-detail-card">
          <h2>${event.title}</h2>
          <div class="event-meta">
            <p class="event-date"><strong>Date:</strong> ${formattedDate}</p>
            ${event.location ? `<p class="event-location"><strong>Location:</strong> ${event.location}</p>` : ''}
          </div>
          <div class="event-description-full">
            <p>${event.description}</p>
          </div>
          <a href="#home" data-page="home" class="btn-back">← Back to Events</a>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error loading event:', error);
      container.innerHTML = '<div class="error-message"><p>Unable to load event details. Please try again later.</p></div>';
    });
}

setTimeout(loadEventFromHash, 10);
