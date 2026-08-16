import { QRCodeSVG } from "qrcode.react";

const getGoogleCalendarUrl = (bkg) => {
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  
  let datesParam = "";
  if (bkg.event_date && bkg.event_time) {
    try {
      // Safely parse ISO date
      const start = new Date(`${bkg.event_date}T${bkg.event_time}:00`);
      if (!isNaN(start.getTime())) {
        const end = new Date(start.getTime() + (2 * 60 * 60 * 1000));
        const format = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
        datesParam = `&dates=${format(start)}/${format(end)}`;
      }
    } catch (err) {
      console.error("Error formatting calendar date:", err);
    }
  }
  
  const text = encodeURIComponent(bkg.event_name || "Booked Event");
  const details = encodeURIComponent(`Booking Confirmation ID: #${bkg.id}\nName: ${bkg.name}\nPhone: ${bkg.phone}`);
  const location = encodeURIComponent(bkg.event_venue || "Venue");

  return `${baseUrl}&text=${text}${datesParam}&details=${details}&location=${location}`;
};

function BookingsView({ bookings }) {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">Current Bookings</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <h3>No Bookings Record Found</h3>
          <p>Go to the Events tab to register slots for available events.</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {bookings.map((bkg) => {
            const qrData = JSON.stringify({
              id: bkg.id,
              event: bkg.event_name,
              name: bkg.name,
              email: bkg.email
            });

            return (
              <div className="ticket-card" key={bkg.id}>
                <div className="ticket-inner">
                  {/* Front: Pass Details */}
                  <div className="ticket-front">
                    <div className="ticket-header-strip">
                      <span className="pass-badge">CONFIRMED PASS</span>
                      <span className="pass-id">#{bkg.id}</span>
                    </div>
                    <div className="ticket-body">
                      <h3 className="t-event-name">{bkg.event_name || `Event #${bkg.event_id}`}</h3>
                      <div className="t-meta-row">
                        <div className="t-info-block">
                          <span className="t-label">ATTENDEE</span>
                          <span className="t-value">{bkg.name}</span>
                        </div>
                        <div className="t-info-block">
                          <span className="t-label">PHONE</span>
                          <span className="t-value">{bkg.phone}</span>
                        </div>
                      </div>
                      <div className="t-info-block single">
                        <span className="t-label">EMAIL ADDRESS</span>
                        <span className="t-value">{bkg.email}</span>
                      </div>
                    </div>
                    <div className="ticket-footer">
                      <span className="t-hint">Hover to View QR Code 🔄</span>
                    </div>
                  </div>

                  {/* Back: QR Code and Calendar link */}
                  <div className="ticket-back">
                    <div className="qr-box">
                      <QRCodeSVG value={qrData} size={110} bgColor="#ffffff" fgColor="#0c0f1d" />
                    </div>
                    <div className="ticket-actions">
                      <a
                        href={getGoogleCalendarUrl(bkg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="calendar-link-btn"
                      >
                        📅 Add to Google Calendar
                      </a>
                    </div>
                    <div className="ticket-footer-back">
                      <span>Scan at venue check-in desk</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookingsView;
