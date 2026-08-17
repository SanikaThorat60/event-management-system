import { useState } from "react";
import EventCard from "./EventCard";

function EventsView({ events, userRole, onCreateEventClick, onBookClick, onPayClick, onDeleteClick, onGenerate }) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  // Filter events based on criteria
  const filteredEvents = events.filter((evt) => {
    // 1. Keyword search (matches name or description)
    const matchesSearch =
      !searchQuery ||
      (evt.name && evt.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (evt.description && evt.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Location search (matches venue)
    const matchesLocation =
      !locationQuery ||
      (evt.venue && evt.venue.toLowerCase().includes(locationQuery.toLowerCase()));

    // 3. Price filter
    let matchesPrice = true;
    const price = Number(evt.ticket_price) || 0;
    if (priceFilter === "free") {
      matchesPrice = price === 0;
    } else if (priceFilter === "paid") {
      matchesPrice = price > 0;
    } else if (priceFilter === "500") {
      matchesPrice = price <= 500;
    } else if (priceFilter === "1000") {
      matchesPrice = price <= 1000;
    } else if (priceFilter === "5000") {
      matchesPrice = price <= 5000;
    }

    return matchesSearch && matchesLocation && matchesPrice;
  });

  return (
    <div className="section-card">
      <div className="section-header" style={{ marginBottom: "20px" }}>
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

      {/* Premium Glassmorphic Search & Filter Bar */}
      <div className="events-filter-bar">
        {/* Search Query Input */}
        <div className="filter-input-wrapper">
          <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="form-input filter-input"
            placeholder="Search events by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Location / Venue Query Input */}
        <div className="filter-input-wrapper">
          <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <input
            type="text"
            className="form-input filter-input"
            placeholder="Filter by venue / location..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
        </div>

        {/* Price Dropdown Selector */}
        <div className="filter-input-wrapper price-select">
          <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M6 3h12M6 8h12M6 13h5a4 4 0 0 0 0-8M6 13l7 8M12 13h5" />
          </svg>
          <select
            className="form-input filter-input"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            style={{ paddingLeft: "36px", cursor: "pointer" }}
          >
            <option value="all">All Prices</option>
            <option value="free">Free (₹0)</option>
            <option value="paid">Paid Events</option>
            <option value="500">Max ₹500</option>
            <option value="1000">Max ₹1000</option>
            <option value="5000">Max ₹5000</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <h3>No Matching Events Found</h3>
          <p>Try adjusting your search terms or filter constraints.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((evt) => (
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
