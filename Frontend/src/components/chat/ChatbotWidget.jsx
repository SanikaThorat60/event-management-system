import { useState, useEffect, useRef } from "react";
import axios from "axios";

const SUGGESTED_QUESTIONS = [
  "What events are available?",
  "Recommend a music or concert event.",
  "Which events are free?",
  "What is the venue for the events?"
];

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am your Eventify AI assistant. Ask me anything about our events, dates, venues, or ticket prices!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive or loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    if (!textToSend) {
      setInput("");
    }

    const userMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: text
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Map message history to the format expected by the controller, skipping welcome message so the history starts with user
      const chatHistory = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text
        }));

      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message: text,
        history: chatHistory
      });

      const botMessage = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: res.data.response || "I didn't receive a response. Please try again."
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot request failed:", err);
      const errorMessage = {
        id: "err-" + Date.now(),
        sender: "bot",
        text: "Sorry, I am having trouble connecting to the server. Please try again later."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Helper to format bot responses nicely with bullet points and bold formatting
  const renderMessageContent = (text) => {
    if (!text) return null;
    const formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const lines = formatted.split("\n");

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const cleanContent = trimmed.replace(/^[-*]\s*/, "");
        return (
          <li
            key={idx}
            className="chat-bullet"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        );
      }
      return (
        <p
          key={idx}
          className="chat-paragraph"
          dangerouslySetInnerHTML={{ __html: line }}
        />
      );
    });
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Chat Trigger Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-trigger ${isOpen ? "active" : ""}`}
        aria-label="Toggle Chatbot"
        title="Ask Eventify AI"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chatbot-panel">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <span className="chatbot-avatar">✨</span>
              <div>
                <h4 className="chatbot-title">Eventify Assistant</h4>
                <div className="chatbot-status">
                  <span className="status-dot"></span>
                  AI Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="chatbot-close-btn">
              &times;
            </button>
          </div>

          {/* Messages Logs */}
          <div className="chatbot-logs">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-container ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.sender === "bot" ? renderMessageContent(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble-container bot">
                <div className="chat-bubble bot loading">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Predefined Quick Questions */}
          {messages.length === 1 && (
            <div className="chatbot-suggestions">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="suggestion-btn"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input Bar */}
          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Ask me about events..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="chatbot-input"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="chatbot-send-btn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotWidget;
