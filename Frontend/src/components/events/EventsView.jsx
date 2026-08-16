import EventCard from "./EventCard";


function EventsView({ events, userRole, onCreateEventClick, onBookClick, onPayClick, onDeleteClick, onGenerate }) {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">Available Events</h2>
        {userRole === "manager" && (
          <button className="create-btn" onClick={onCreateEventClick}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Event
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h3>No Events Created Yet</h3>
          <p>Be the first to list a premium conference or concert!</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              userRole={userRole}
              onBook={onBookClick}
              onPay={onPayClick}
              onDelete={onDeleteClick}
              onGenerate={onGenerate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsView;
