function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || "success"}`}>
          {t.type === "confirm" ? (
            <div className="toast-content-confirm">
              <span className="toast-message">{t.message}</span>
              <div className="toast-actions">
                <button
                  className="toast-btn confirm"
                  onClick={() => t.onConfirm?.()}
                >
                  Yes
                </button>
                <button
                  className="toast-btn cancel"
                  onClick={() => t.onCancel?.()}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            t.message
          )}
        </div>
      ))}
    </div>
  );
}

export default Toast;
