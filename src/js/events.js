function loadEvent(eventId) {
  const container = document.getElementById('event-details');
  
  fetch(`api/events/${eventId}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(event) {
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      container.innerHTML = `
        <div class="event-detail-card">
          ${event.image ? `<img src="uploads/${event.image}" alt="${event.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">` : ''}
          <h2>${event.title}</h2>
          <div class="event-meta">
            <p class="event-date"><strong>Date:</strong> ${formattedDate}</p>
            ${event.location ? `<p class="event-location"><strong>Location:</strong> ${event.location}</p>` : ''}
          </div>
          <div class="event-description-full">
            <p>${event.description}</p>
          </div>
          <a href="#" onclick="window.loadPageContent('home'); return false;" class="btn-back">← Back to Events</a>
        </div>
      `;
    });
}

module.exports = { loadEvent };

