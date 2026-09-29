import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  const toastJSX = (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 100001,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 18px",
        borderRadius: 12,
        background: isSuccess
          ? "rgba(15, 23, 42, 0.95)"
          : isError
          ? "rgba(24, 10, 15, 0.95)"
          : "rgba(15, 23, 42, 0.95)",
        border: isSuccess
          ? "1px solid rgba(34, 197, 94, 0.4)"
          : isError
          ? "1px solid rgba(239, 68, 68, 0.4)"
          : "1px solid rgba(139, 92, 246, 0.4)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(139, 92, 246, 0.2)",
        backdropFilter: "blur(12px)",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: 600,
        maxWidth: 420,
        animation: "toastSlideIn 0.3s ease-out forwards",
      }}
    >
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {isSuccess && <CheckCircle2 size={18} style={{ color: "#4ade80", flexShrink: 0 }} />}
      {isError && <AlertCircle size={18} style={{ color: "#f87171", flexShrink: 0 }} />}
      {!isSuccess && !isError && <Info size={18} style={{ color: "#c084fc", flexShrink: 0 }} />}

      <div style={{ flex: 1, lineHeight: "1.4" }}>
        {toast.title && <div style={{ fontWeight: 700, fontSize: "13px", color: isSuccess ? "#86efac" : isError ? "#fca5a5" : "#e9d5ff" }}>{toast.title}</div>}
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>{toast.message}</div>
      </div>

      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.6)",
          cursor: "pointer",
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
      >
        <X size={15} />
      </button>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(toastJSX, document.body) : toastJSX;
}
