import React, { useState, useEffect, useCallback } from "react";

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((e) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...e.detail }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    window.addEventListener("app-toast", addToast);
    return () => window.removeEventListener("app-toast", addToast);
  }, [addToast]);

  const icons = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <div style={{ position: "fixed", top: "80px", right: "20px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "14px 20px", borderRadius: "8px", minWidth: "280px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          background: t.type === "success" ? "#1a5c3a" : t.type === "error" ? "#8b1a1a" : "#1a3a5c",
          color: "#fff", fontSize: "15px", fontWeight: 500,
          animation: "slideIn 0.3s ease",
        }}>
          <span style={{ fontSize: "18px", fontWeight: 700 }}>{icons[t.type]}</span>
          <span>{t.msg}</span>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform: translateX(120%); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
    </div>
  );
};

export default Toast;
