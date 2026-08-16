/**
 * Header bar displaying logo, user greeting, theme toggle, and logout button.
 * @param {Object} props
 * @param {string} props.userName - The logged in user's name.
 * @param {string} props.theme - Current theme ('light' or 'dark').
 * @param {Function} props.onToggleTheme - Callback to switch theme mode.
 * @param {Function} props.onLogout - Callback to handle logout.
 */
function Header({ userName, theme, onToggleTheme, onLogout }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-logo">EMS</div>
        <h1 className="brand-title">Eventify</h1>
      </div>
      <div className="user-profile">
        <span className="user-name">Welcome, {userName}</span>
        
        {/* Premium Theme Toggle Switch */}
        <button
          onClick={onToggleTheme}
          className="theme-toggle-btn"
          aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? (
            // Moon Icon (Switch to Dark)
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            // Sun Icon (Switch to Light)
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

        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
