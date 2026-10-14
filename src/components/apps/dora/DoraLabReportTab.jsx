import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Activity,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import {
  getDoraSampleLabReports,
  interpretDoraLabReport,
} from "../../../services/api";
import "./DoraLabReportTab.css";

export default function DoraLabReportTab() {
  const [samples, setSamples] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState(null);
  const [customReportText, setCustomReportText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState(null);

  // 1. Fetch Sample Lab Reports on load
  useEffect(() => {
    async function loadSamples() {
      try {
        const res = await getDoraSampleLabReports();
        if (res && Array.isArray(res)) {
          setSamples(res);
          // Set first sample by default
          if (res.length > 0) {
            setSelectedSampleId(res[0].id);
            setReportData(res[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch sample lab reports:", err);
      }
    }
    loadSamples();
  }, []);

  // 2. Handle File Upload (PDF or Image)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setSelectedSampleId(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("panel_title", file.name.replace(/\.[^/.]+$/, ""));

      const res = await interpretDoraLabReport(formData);
      if (res) {
        setReportData(res);
      }
    } catch (err) {
      console.error("Failed to interpret uploaded lab report:", err);
      alert("Failed to parse report file. Showing sample lipid panel preview.");
      if (samples.length > 0) setReportData(samples[0]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. Handle Manual Text Analysis
  const handleAnalyzeText = async () => {
    if (!customReportText.trim()) return;

    setIsAnalyzing(true);
    setSelectedSampleId(null);

    try {
      const formData = new FormData();
      formData.append("raw_text", customReportText);
      formData.append("panel_title", "Custom Patient Blood Panel");

      const res = await interpretDoraLabReport(formData);
      if (res) {
        setReportData(res);
      }
    } catch (err) {
      console.error("Failed to interpret custom text:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setUploadedFileName(null);
    setCustomReportText("");
    setReportData(sample);
  };

  const copyQuestion = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIdx(idx);
    setTimeout(() => setCopiedQuestionIdx(null), 2000);
  };

  const getBadgeClass = (badge) => {
    switch (badge) {
      case "danger":
        return "badge-danger";
      case "warning":
        return "badge-warning";
      case "success":
      default:
        return "badge-success";
    }
  };

  return (
    <div className="dora-lab-container">
      {/* ================= TOP COMMAND BAR ================= */}
      <header className="dora-lab-header">
        <div className="dora-lab-header-left">
          <div className="dora-lab-icon-box">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="dora-lab-title">
              Medical Lab Report Interpreter
              <span className="dora-lab-badge">Clinical AI Biomarker Engine</span>
            </h2>
            <p className="dora-lab-subtitle">
              Upload blood work, lipid panels, or CBC reports to parse biomarkers, flag abnormal
              values, and formulate targeted doctor questions.
            </p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="dora-lab-samples-strip">
          <span className="dora-lab-samples-label">Preloaded Clinical Tests:</span>
          {samples.map((s) => (
            <button
              key={s.id}
              className={`dora-sample-pill ${selectedSampleId === s.id ? "active" : ""}`}
              onClick={() => handleSelectSample(s)}
            >
              {s.title}
            </button>
          ))}
        </div>
      </header>

      {/* ================= WORKBENCH GRID ================= */}
      <div className="dora-lab-grid">
        {/* LEFT COLUMN: FILE UPLOADER & SUMMARY */}
        <div className="dora-lab-left-col">
          {/* File Upload Box */}
          <div className="dora-lab-upload-card">
            <label className="dora-lab-dropzone">
              <Upload size={24} color="#38bdf8" />
              <div className="dora-lab-dropzone-title">
                {uploadedFileName || "Upload Lab Report PDF or Image"}
              </div>
              <div className="dora-lab-dropzone-hint">
                Supports Lipid Panels, CBC, CMP, Liver & Kidney Function PDFs
              </div>
              <input
                type="file"
                accept=".pdf,image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </label>

            {/* Quick Text Paste Expander */}
            <details className="dora-lab-text-details">
              <summary>Or paste raw lab test values manually</summary>
              <textarea
                className="dora-lab-textarea"
                rows={3}
                placeholder="e.g. Total Cholesterol: 245 mg/dL, LDL: 162 mg/dL, Triglycerides: 210 mg/dL, Fasting Glucose: 108 mg/dL..."
                value={customReportText}
                onChange={(e) => setCustomReportText(e.target.value)}
              />
              <button
                className="dora-lab-analyze-btn"
                onClick={handleAnalyzeText}
                disabled={isAnalyzing || !customReportText.trim()}
              >
                <Sparkles size={13} />
                Analyze Text
              </button>
            </details>
          </div>

          {/* Clinical Interpretation Summary Box */}
          {reportData && (
            <div className="dora-lab-summary-card">
              <div className="dora-lab-summary-head">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={16} color="#c084fc" />
                  <span className="dora-lab-summary-title">Clinical Physician Summary</span>
                </div>
                {reportData.abnormal_count > 0 && (
                  <span className="dora-lab-abnormal-pill">
                    <AlertTriangle size={12} />
                    {reportData.abnormal_count} Out-of-Range Markers
                  </span>
                )}
              </div>

              <div className="dora-lab-meta-row">
                <span><strong>Patient:</strong> {reportData.patient || "Patient Profile"}</span>
                <span><strong>Lab:</strong> {reportData.lab_provider || "Diagnostic Lab"}</span>
                <span><strong>Date:</strong> {reportData.test_date || "Recent"}</span>
              </div>

              <p className="dora-lab-summary-text">{reportData.clinical_summary}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: BIOMARKERS TABLE & QUESTIONS FOR DOCTOR */}
        <div className="dora-lab-right-col">
          {isAnalyzing ? (
            <div className="dora-lab-loading-state">
              <RefreshCw size={36} className="animate-spin" color="#38bdf8" />
              <h4>DORA Clinical Engine Parsing Biomarkers...</h4>
              <p>Evaluating reference ranges, lipid ratios, and metabolic indicators.</p>
            </div>
          ) : reportData ? (
            <>
              {/* BIOMARKERS QUANTITATIVE GRID */}
              <div className="dora-lab-biomarkers-card">
                <div className="dora-lab-biomarkers-head">
                  <h3 className="dora-lab-biomarkers-title">
                    Extracted Quantitative Biomarkers ({(reportData.biomarkers || []).length})
                  </h3>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Standard Clinical Range Verification
                  </span>
                </div>

                <div className="dora-lab-biomarkers-list">
                  {(reportData.biomarkers || []).map((marker, i) => (
                    <div key={i} className="dora-lab-biomarker-row">
                      <div className="dora-bm-left">
                        <div className="dora-bm-name">{marker.name}</div>
                        <div className="dora-bm-interp">{marker.interpretation}</div>
                      </div>

                      <div className="dora-bm-center">
                        <span className="dora-bm-value">
                          {marker.value} <span className="dora-bm-unit">{marker.unit}</span>
                        </span>
                        <span className="dora-bm-ref">Ref: {marker.reference_range}</span>
                      </div>

                      <div className="dora-bm-right">
                        <span className={`dora-bm-badge ${getBadgeClass(marker.badge)}`}>
                          {marker.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TARGETED QUESTIONS FOR YOUR PHYSICIAN */}
              <div className="dora-lab-questions-card">
                <div className="dora-lab-questions-head">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <HelpCircle size={16} color="#34d399" />
                    <h3 className="dora-lab-questions-title">Targeted Questions for Your Doctor</h3>
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#6ee7b7" }}>
                    Prepared for your next clinical consultation
                  </span>
                </div>

                <div className="dora-lab-questions-list">
                  {(reportData.targeted_questions_for_doctor || []).map((q, idx) => (
                    <div key={idx} className="dora-lab-question-item">
                      <span className="dora-lab-q-num">Q{idx + 1}</span>
                      <p className="dora-lab-q-text">{q}</p>
                      <button
                        className="dora-lab-q-copy"
                        onClick={() => copyQuestion(q, idx)}
                        title="Copy question for doctor"
                      >
                        {copiedQuestionIdx === idx ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
