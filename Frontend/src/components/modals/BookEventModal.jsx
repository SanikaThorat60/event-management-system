import { useState, useEffect } from "react";
import Modal from "../common/Modal";

function BookEventModal({ isOpen, onClose, event, user, onBook }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize/reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setPhone("");
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !event) return;

    setIsSubmitting(true);
    try {
      const success = await onBook({
        name,
        email,
        phone,
        event_id: event.id,
      });
      if (success) {
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? (event.ticket_price > 0 ? `Book & Pay: ${event.name} (₹${event.ticket_price})` : `Book Seat: ${event.name}`) : "Book Slot"}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bkg-name">Full Name</label>
          <input
            id="bkg-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bkg-email">Email Address</label>
          <input
            id="bkg-email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bkg-phone">Phone Number</label>
          <input
            id="bkg-phone"
            type="tel"
            className="form-input"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          {isSubmitting
            ? "Processing..."
            : event?.ticket_price > 0
            ? "Pay & Confirm Booking"
            : "Confirm Booking"}
        </button>
      </form>
    </Modal>
  );
}

export default BookEventModal;
