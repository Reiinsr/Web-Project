async function loadEventList() {
  const container = document.getElementById('event-list');
  if (!container) return;

  const events = await (await fetch('api/events')).json();
  
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
        <a href="#" onclick="loadPageContent('event', ${event.id}); return false;" class="btn-view-details">View Details</a>
      </div>
    `;
  }).join('');
}

setTimeout(loadEventList, 10);
