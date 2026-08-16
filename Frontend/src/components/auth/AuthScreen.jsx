import { useState } from "react";

function AuthScreen({ onLogin, onRegister }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isRegistering) {
        const success = await onRegister(name, email, password, role);
        if (success) {
          // Reset forms and switch to login
          setName("");
          setPassword("");
          setIsRegistering(false);
        }
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="auth-subtitle">
          {isRegistering
            ? "Join the ultimate Event Management System"
            : "Manage your events, bookings, and payments"}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label htmlFor="auth-name">Name</label>
                <input
                  id="auth-name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="auth-role">Register As</label>
                <select
                  id="auth-role"
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                  style={{
                    cursor: "pointer",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--panel-border)"
                  }}
                >
                  <option value="user">User (Attend Events)</option>
                  <option value="manager">Manager (Create &amp; Manage Events)</option>
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              className="form-input"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : isRegistering ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="auth-footer">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <span
                className="auth-link"
                onClick={() => !isLoading && setIsRegistering(false)}
              >
                Log In
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                className="auth-link"
                onClick={() => !isLoading && setIsRegistering(true)}
              >
                Sign Up
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
