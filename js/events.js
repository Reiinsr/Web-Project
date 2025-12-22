async function loadEvent(eventId) {
  const container = document.getElementById('event-details');
  const event = await (await fetch(`api/events/${eventId}`)).json();
  
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
      <a href="#" onclick="loadPageContent('home'); return false;" class="btn-back">← Back to Events</a>
    </div>
  `;
}
