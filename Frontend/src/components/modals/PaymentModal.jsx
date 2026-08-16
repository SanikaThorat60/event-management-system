import { useState, useEffect } from "react";
import Modal from "../common/Modal";

function PaymentModal({ isOpen, onClose, event, onPaymentSubmit }) {
  const [amount, setAmount] = useState(() => String(event?.ticket_price || "5000"));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize/reset price whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(String(event?.ticket_price || "5000"));
    }
  }, [isOpen, event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0 || !event) return;

    setIsSubmitting(true);
    try {
      const success = await onPaymentSubmit(numericAmount);
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
      title={event ? `Purchase Ticket: ${event.name}` : "Purchase Ticket"}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pay-amount">Ticket Price (₹)</label>
          <input
            id="pay-amount"
            type="number"
            className="form-input"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          {isSubmitting ? "Simulating Payment..." : "Simulate Payment Order"}
        </button>
      </form>
    </Modal>
  );
}

export default PaymentModal;
