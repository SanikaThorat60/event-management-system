import { useState } from "react";
import AuthModal from "../modals/AuthModal";
import Toast from "../common/Toast";

/**
 * GuestDashboard displays a landing page about Eventify
 * for unauthenticated visitors. It includes a navigation bar
 * at the top right with Log In / Sign Up buttons.
 */
function GuestDashboard({ onLogin, onRegister, theme, onToggleTheme, toasts }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  return (
    <div className="guest-container">
      {/* Toast alert overlays */}
      <Toast toasts={toasts} />

      {/* Guest Navigation Header */}
      <header className="guest-navbar">
        <div className="brand-section">
          <div className="brand-logo">EMS</div>
          <span className="brand-title">Eventify</span>
        </div>

        {/* Middle quick nav links */}
        <nav className="guest-nav-links">
          <a href="#features">Features</a>
          <a href="#stats">Stats</a>
          <a href="#how-it-works">How It Works</a>
        </nav>

        {/* Right side controls */}
        <div className="guest-actions">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Login and signup triggers */}
          <button className="guest-login-btn" onClick={() => openAuth("login")}>
            Log In
          </button>
          <button className="guest-signup-btn" onClick={() => openAuth("signup")}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="guest-hero">
        <div className="hero-glow-blob"></div>
        <div className="hero-content">
          <h1 className="hero-headline">
            Crafting <span className="gradient-text">Unforgettable</span> Experiences
          </h1>
          <p className="hero-subtext">
            Discover, host, and coordinate state-of-the-art events. Eventify delivers an all-in-one suite built for modern managers and event-goers.
          </p>
          <div className="hero-buttons">
            <button className="cta-primary-btn" onClick={() => openAuth("signup")}>
              Get Started Free
            </button>
            <a href="#features" className="cta-secondary-btn">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="guest-stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-number">500+</h3>
            <p className="stat-desc">Events Scheduled</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">25k+</h3>
            <p className="stat-desc">Tickets Booked</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">99.9%</h3>
            <p className="stat-desc">Satisfaction Rating</p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="guest-features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Eventify?</h2>
          <p className="section-subtitle">Everything you need to orchestrate flawless gatherings, all in one premium portal.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="feature-title">Seamless Ticketing</h3>
            <p className="feature-desc">
              Browse public events and reserve seats in just a few taps. Instantly view confirmations and ticket invoice histories.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3 className="feature-title">Secure Checkouts</h3>
            <p className="feature-desc">
              Safe transaction processing powered by Razorpay test flows. Hassle-free automatic confirmation booking.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="feature-title">AI Content Generation</h3>
            <p className="feature-desc">
              Stuck on event descriptions? Generate catchy, high-conversion marketing content for your listings in one click using AI.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h3 className="feature-title">Host Metrics &amp; Charts</h3>
            <p className="feature-desc">
              Gain clarity with analytics. Managers track total event attendance, ticket revenue statistics, and live performance metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="guest-preview-section">
        <div className="section-header">
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-subtitle">A sneak peek of the categories wait-listed on Eventify</p>
        </div>
        <div className="category-cards">
          <div className="category-card">
            <div className="category-badge">Tech</div>
            <h4>Developers &amp; AI Summits</h4>
            <p>From hackathons to regional panels on generative models.</p>
          </div>
          <div className="category-card">
            <div className="category-badge">Music</div>
            <h4>Concerts &amp; Festivals</h4>
            <p>Acoustic meetups, DJ sessions, and music assemblies.</p>
          </div>
          <div className="category-card">
            <div className="category-badge">Business</div>
            <h4>Product Launch Seminars</h4>
            <p>Professional keynote events, network conferences, and webinars.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="guest-how-it-works">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Start hosting or attending events in four straightforward steps.</p>
        </div>

        <div className="timeline-steps">
          <div className="timeline-step">
            <div className="step-number">1</div>
            <h4 className="step-title">Create Account</h4>
            <p className="step-desc">Sign up as an attendee or choose manager permissions to publish listings.</p>
          </div>
          <div className="timeline-step">
            <div className="step-number">2</div>
            <h4 className="step-title">Set Up or Search</h4>
            <p className="step-desc">Publish events with dates, prices, and locations, or search other listings.</p>
          </div>
          <div className="timeline-step">
            <div className="step-number">3</div>
            <h4 className="step-title">Book &amp; Pay</h4>
            <p className="step-desc">Secure slots easily via integrated sandbox payments. Invoices are recorded.</p>
          </div>
          <div className="timeline-step">
            <div className="step-number">4</div>
            <h4 className="step-title">Attend &amp; Track</h4>
            <p className="step-desc">Show up to the venue and track attendees or monitor performance stats.</p>
          </div>
        </div>
      </section>



      {/* Guest Footer */}
      <footer className="guest-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-section">
              <div className="brand-logo">EMS</div>
              <span className="brand-title">Eventify</span>
            </div>
            <p className="footer-desc">
              Empowering individuals and businesses to organize and discover gatherings of any scale.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <h5>Navigation</h5>
              <a href="#features">Features</a>
              <a href="#stats">Stats</a>
              <a href="#how-it-works">How It Works</a>
            </div>
            <div>
              <h5>Contact &amp; Legal</h5>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Mock Terms: Eventify EMS System demo."); }}>Terms of Service</a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Mock Support: support@eventify.ems"); }}>Support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Eventify EMS. All rights reserved.</p>
        </div>
      </footer>

      {/* The Navbar Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={closeAuth}
        initialMode={authMode}
        onLogin={onLogin}
        onRegister={onRegister}
      />
    </div>
  );
}

export default GuestDashboard;
