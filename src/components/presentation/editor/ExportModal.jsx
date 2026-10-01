import React from "react";
import { createPortal } from "react-dom";
import { Download, CheckCircle, X } from "lucide-react";

export default function ExportModal({ isOpen, onClose, onConfirmExport, isSaving }) {
  if (!isOpen) return null;

  const modalJSX = (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <div className="export-title">
            <Download size={18} />
            <span>Export Presentation Deck</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="export-options-list">
          <button
            className="export-option-card active"
            onClick={() => {
              onConfirmExport?.("pptx");
              onClose();
            }}
          >
            <div className="option-icon pptx-icon">PPTX</div>
            <div className="option-info">
              <span className="option-name">Microsoft PowerPoint (.pptx)</span>
              <span className="option-desc">Editable presentation slides with native shapes, text & charts.</span>
            </div>
            <CheckCircle size={18} className="option-check" />
          </button>

          <button
            className="export-option-card"
            onClick={() => {
              onConfirmExport?.("pdf");
              onClose();
            }}
          >
            <div className="option-icon pdf-icon">PDF</div>
            <div className="option-info">
              <span className="option-name">PDF Document (.pdf)</span>
              <span className="option-desc">High quality document format for printing & sharing.</span>
            </div>
          </button>

          <button
            className="export-option-card"
            onClick={() => {
              onConfirmExport?.("json");
              onClose();
            }}
          >
            <div className="option-icon" style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", fontWeight: 700, padding: "8px 12px", borderRadius: "6px" }}>JSON</div>
            <div className="option-info">
              <span className="option-name">Deck Backup / Project (.json)</span>
              <span className="option-desc">Raw presentation canvas state for importing or restoring later.</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalJSX, document.body) : modalJSX;
}
