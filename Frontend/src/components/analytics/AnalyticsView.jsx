import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

function AnalyticsView({ analyticsData, totalEventsCount }) {
  if (!analyticsData) {
    return (
      <div className="section-card">
        <div className="empty-state">
          <h3>Loading analytics data...</h3>
        </div>
      </div>
    );
  }

  const { totalRevenue, ticketsSold, eventSales, eventBookings } = analyticsData;

  const averageTicket = ticketsSold > 0 ? Math.round(totalRevenue / ticketsSold) : 0;

  // Curated premium colors for chart bars
  const COLORS = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

  return (
    <div className="analytics-view-wrapper">
      {/* 1. Header */}
      <div className="section-header">
        <h2 className="section-title">Business Analytics</h2>
      </div>

      {/* 2. Stats Cards Grid */}
      <div className="stats-cards-grid">
        <div className="stat-metric-card">
          <div className="stat-icon-wrapper revenue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Revenue</span>
            <h3 className="stat-value">₹{Number(totalRevenue).toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-wrapper sales">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Tickets Sold</span>
            <h3 className="stat-value">{ticketsSold}</h3>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-wrapper average">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Average Order</span>
            <h3 className="stat-value">₹{averageTicket}</h3>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-wrapper events-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Events</span>
            <h3 className="stat-value">{totalEventsCount}</h3>
          </div>
        </div>
      </div>

      {/* 3. Charts and Analytics Details Grid */}
      <div className="analytics-details-grid">
        {/* Revenue Chart Card */}
        <div className="chart-card">
          <h3 className="chart-card-title">Revenue Contribution per Event (₹)</h3>
          <div className="chart-container" style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={eventSales} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--panel-border)" />
                <XAxis dataKey="name" stroke="var(--text-primary)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-primary)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                  contentStyle={{
                    background: "var(--panel-bg)",
                    border: "1px solid var(--panel-border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                  }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {eventSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Stats Table Card */}
        <div className="chart-card">
          <h3 className="chart-card-title">Event Registration Summary</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Bookings Count</th>
                  <th>Tickets Sold</th>
                  <th>Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {eventSales.map((salesEntry) => {
                  const bookingEntry = eventBookings.find((b) => b.name === salesEntry.name);
                  const bookingCount = bookingEntry ? bookingEntry.bookingCount : 0;
                  return (
                    <tr key={salesEntry.name}>
                      <td style={{ color: "var(--text-primary)", fontWeight: "500" }}>{salesEntry.name}</td>
                      <td>{bookingCount} registrations</td>
                      <td>{salesEntry.ticketsSold} paid</td>
                      <td style={{ color: "var(--accent-primary)", fontWeight: "600" }}>
                        ₹{Number(salesEntry.revenue).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsView;
