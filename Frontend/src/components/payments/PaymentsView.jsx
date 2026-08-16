function PaymentsView({ payments }) {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">Transaction Log</h2>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          <h3>No Transactions Record Found</h3>
          <p>Process a payment using the Buy Ticket CTA on event listings.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Event Reference</th>
                <th>Amount Paid</th>
                <th>Transaction Time</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => (
                <tr key={pay.id}>
                  <td>#{pay.id}</td>
                  <td style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                    {pay.event_name || `Event #${pay.event_id}`}
                  </td>
                  <td style={{ color: "var(--accent-primary)", fontWeight: "600" }}>
                    ₹{pay.amount}
                  </td>
                  <td>
                    {pay.created_at ? new Date(pay.created_at).toLocaleString() : "Just Now"}
                  </td>
                  <td>
                    <span className="badge success">Paid</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentsView;
