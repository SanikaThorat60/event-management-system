import React from "react";

const EventCard = React.memo(({ event, userRole, onBook, onPay, onDelete, onGenerate }) => {
  return (
    <div className="event-card">
      {event.image_url ? (
        <div className="event-banner-container">
          <img src={event.image_url} alt={event.name} className="event-banner-img" />
        </div>
      ) : (
        <div className="event-banner-container default">
          <div className="default-banner-placeholder">
            <span>{event.name ? event.name.substring(0, 2).toUpperCase() : "EV"}</span>
          </div>
        </div>
      )}
      <h3 className="event-title">{event.name}</h3>
      <p className="event-desc">{event.description}</p>
      <div className="event-meta">
        <div className="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {event.date}
        </div>
        <div className="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {event.time}
        </div>
        <div className="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {event.venue}
        </div>
        <div className="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M6 3h12M6 8h12M6 13h5a4 4 0 0 0 0-8M6 13l7 8M12 13h5" />
          </svg>
          Ticket: ₹{event.ticket_price || 0}
        </div>
      </div>
      <div className="event-actions">
        {userRole === "manager" ? (
          <div style={{ display: "flex", flexDirection: "row", gap: "12px", width: "100%" }}>
            <button
              onClick={() => onGenerate?.(event)}
              className="action-btn generate"
              style={{ flex: 1 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                <path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
              </svg>
              AI Rewrite
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="action-btn delete"
              style={{ flex: 1 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={() => onBook(event)}
            className="action-btn book"
            style={{ width: "100%" }}
          >
            {event.ticket_price > 0 ? `Book & Pay (₹${event.ticket_price})` : "Book Slot"}
          </button>
        )}
      </div>
    </div>
  );
});

EventCard.displayName = "EventCard";

export default EventCard;
