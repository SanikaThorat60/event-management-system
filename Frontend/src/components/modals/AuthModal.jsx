import { useState, useEffect } from "react";
import Modal from "../common/Modal";

/**
 * AuthModal displays either a Login or Sign Up form inside a modal.
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {string} props.initialMode - "login" or "signup"
 * @param {Function} props.onLogin - Login submission handler.
 * @param {Function} props.onRegister - Registration submission handler.
 */
function AuthModal({ isOpen, onClose, initialMode = "login", onLogin, onRegister }) {
  const [isRegistering, setIsRegistering] = useState(initialMode === "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync mode with prop changes when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsRegistering(initialMode === "signup");
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setErrorMsg("");
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      if (isRegistering) {
        const success = await onRegister(name, email, password, role);
        if (success) {
          // Switch to login tab on successful signup
          setIsRegistering(false);
          setPassword("");
        }
      } else {
        await onLogin(email, password);
        onClose(); // Close modal upon successful login
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegistering ? "Create Your Account" : "Welcome Back"}
    >
      <form onSubmit={handleSubmit} className="auth-modal-form">
        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

        {isRegistering && (
          <>
            <div className="form-group">
              <label htmlFor="modal-auth-name">Name</label>
              <input
                id="modal-auth-name"
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
              <label htmlFor="modal-auth-role">Register As</label>
              <select
                id="modal-auth-role"
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
          <label htmlFor="modal-auth-email">Email Address</label>
          <input
            id="modal-auth-email"
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
          <label htmlFor="modal-auth-password">Password</label>
          <input
            id="modal-auth-password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="auth-btn" style={{ marginTop: "16px" }} disabled={isLoading}>
          {isLoading ? "Processing..." : isRegistering ? "Sign Up" : "Log In"}
        </button>

        <div className="auth-footer" style={{ marginTop: "20px" }}>
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
      </form>
    </Modal>
  );
}

export default AuthModal;
