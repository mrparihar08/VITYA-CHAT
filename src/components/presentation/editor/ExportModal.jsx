import React from "react";
import { Download, CheckCircle, X } from "lucide-react";

export default function ExportModal({ isOpen, onClose, onConfirmExport, isSaving }) {
  if (!isOpen) return null;

  return (
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
        </div>
      </div>
    </div>
  );
}
