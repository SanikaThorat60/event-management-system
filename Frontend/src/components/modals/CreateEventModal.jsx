import { useState } from "react";
import axios from "axios";
import Modal from "../common/Modal";

function CreateEventModal({ isOpen, onClose, onCreateEvent }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleAiGenerate = async () => {
    if (!name || !date || !time || !venue) {
      alert("Please fill in Event Name, Date, Time, and Venue first to generate a description.");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/generate-description", {
        name,
        date,
        time,
        venue
      });
      if (res.data && res.data.description) {
        setDescription(res.data.description);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate description: " + (err.response?.data?.error || err.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result); // Base64 Data URL
    };
    reader.readAsDataURL(file);
  };

  const handleAiImageGenerate = async () => {
    if (!description) {
      alert("Please generate or enter a Description first so the AI knows what theme of image to create.");
      return;
    }
    setIsGeneratingImage(true);
    try {
      // Get auth token from localStorage
      const userStr = localStorage.getItem("ems_user");
      const token = userStr ? JSON.parse(userStr)?.token : null;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const res = await axios.post("http://localhost:5000/api/ai/generate-image", {
        name,
        description,
        date,
        time,
        venue
      }, config);
      if (res.data && res.data.imageUrl) {
        setImageUrl(res.data.imageUrl);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate image: " + (err.response?.data?.error || err.message));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !date || !time || !venue) return;

    setIsSubmitting(true);
    try {
      const success = await onCreateEvent({
        name,
        description,
        date,
        time,
        venue,
        ticket_price: Number(ticketPrice) || 0,
        image_url: imageUrl
      });
      if (success) {
        // Reset form fields
        setName("");
        setDescription("");
        setDate("");
        setTime("");
        setVenue("");
        setTicketPrice("");
        setImageUrl("");
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="evt-name">Event Name</label>
          <input
            id="evt-name"
            type="text"
            className="form-input"
            placeholder="e.g. Neon Horizon Hackathon"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label htmlFor="evt-desc" style={{ marginBottom: 0 }}>Description</label>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGenerating || isSubmitting}
              style={{
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 8px var(--accent-glow)",
                transition: "all 0.2s ease"
              }}
            >
              {isGenerating ? "Generating..." : "✨ Auto-Generate"}
            </button>
          </div>
          <textarea
            id="evt-desc"
            className="form-input"
            rows="5"
            placeholder="Tell us about the event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ resize: "none" }}
            disabled={isSubmitting || isGenerating}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label htmlFor="evt-date">Date</label>
            <input
              id="evt-date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="evt-time">Time</label>
            <input
              id="evt-time"
              type="text"
              className="form-input"
              placeholder="e.g. 10:00 AM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label htmlFor="evt-venue">Venue</label>
            <input
              id="evt-venue"
              type="text"
              className="form-input"
              placeholder="e.g. Silicon Valley Suite 5"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="evt-price">Ticket Price (₹)</label>
            <input
              id="evt-price"
              type="number"
              className="form-input"
              placeholder="e.g. 50"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Banner image options */}
        <div className="form-group" style={{ borderTop: "1px dashed var(--panel-border)", paddingTop: "16px", marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ marginBottom: 0 }}>Event Banner Image</label>
            <button
              type="button"
              onClick={handleAiImageGenerate}
              disabled={isGeneratingImage || isSubmitting}
              style={{
                background: "rgba(99, 102, 241, 0.15)",
                color: "var(--accent-primary)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {isGeneratingImage ? "Analyzing Theme..." : "🎨 AI Generate Banner"}
            </button>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", alignItems: "center" }}>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting || isGeneratingImage}
                style={{ fontSize: "0.8rem", width: "100%" }}
              />
              <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "4px", marginBottom: 0 }}>
                Upload from your computer or let the AI select a theme matching your description.
              </p>
            </div>
            <div className="image-preview-box" style={{
              border: "1px dashed var(--panel-border)",
              borderRadius: "10px",
              height: "70px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              background: "rgba(255,255,255,0.02)"
            }}>
              {imageUrl ? (
                <img src={imageUrl} alt="Banner Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>No Image</span>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Publish Event"}
        </button>
      </form>
    </Modal>
  );
}

export default CreateEventModal;
