import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  CheckCircle2,
  Receipt,
  TrendingDown,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  DollarSign,
  AlertCircle,
  Building,
  Calendar,
  Tag,
  Hash,
} from "lucide-react";
import {
  getSampleReceipts,
  scanReceiptDocument,
  postTransactionToLedger,
  getRecentScannedLedger,
} from "../../services/api";
import "./ScanLedgerApp.css";

const CATEGORY_OPTIONS = [
  "Food",
  "Utilities",
  "Transport",
  "Housing",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Freelance",
  "Salary",
  "Investment",
  "Other",
];

export default function ScanLedgerApp({ onNavigateToFinance }) {
  const [activeTab, setActiveTab] = useState("scan"); // 'scan' | 'history'
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [autoPost, setAutoPost] = useState(false);
  
  // Extracted Data Form State
  const [extractedData, setExtractedData] = useState(null);
  const [transactionType, setTransactionType] = useState("expense");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("INR");
  const [tax, setTax] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [lineItems, setLineItems] = useState([]);
  
  // Posting State
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(null);
  const [postError, setPostError] = useState(null);

  // Synced Recent Database Ledger State
  const [recentLedger, setRecentLedger] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);

  const fileInputRef = useRef(null);

  // 1. Fetch Samples and Recent Database Transactions
  const loadRecentTransactions = useCallback(async () => {
    try {
      setLoadingLedger(true);
      const res = await getRecentScannedLedger(25);
      if (res && res.transactions) {
        setRecentLedger(res.transactions);
      }
    } catch (err) {
      console.warn("Could not fetch recent transactions from database", err);
    } finally {
      setLoadingLedger(false);
    }
  }, []);

  useEffect(() => {
    async function initData() {
      try {
        const sampleList = await getSampleReceipts();
        setSamples(sampleList || []);
        if (sampleList && sampleList.length > 0) {
          applySampleToForm(sampleList[0]);
        }
      } catch (err) {
        console.warn("Failed to load sample receipts", err);
      }
      loadRecentTransactions();
    }
    initData();
  }, [loadRecentTransactions]);

  // 2. Apply Pre-Loaded Sample Data
  const applySampleToForm = (sample) => {
    setSelectedSample(sample);
    setPreviewUrl(sample.image_url || null);
    setExtractedData(sample);
    setTransactionType(sample.transaction_type || "expense");
    setMerchant(sample.merchant || "");
    setAmount(String(sample.amount || ""));
    setCategory(sample.category || "Food");
    setDate(sample.date || new Date().toISOString().split("T")[0]);
    setCurrency(sample.currency || "INR");
    setTax(String(sample.tax || 0));
    setInvoiceNumber(sample.invoice_number || "");
    setDescription(sample.description || "");
    setLineItems(sample.items || []);
    setPostSuccess(null);
    setPostError(null);
  };

  // 3. Handle File Upload & Vision Scan
  const handleProcessFile = async (file) => {
    if (!file) return;

    // Show local image preview if image
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    setSelectedSample(null);
    setIsScanning(true);
    setPostSuccess(null);
    setPostError(null);

    try {
      const data = await scanReceiptDocument(file, { autoPost });
      setExtractedData(data);

      const tType = data.transaction_type || (data.category === "Salary" || data.category === "Freelance" ? "income" : "expense");
      setTransactionType(tType);
      setMerchant(data.merchant || file.name.rsplit?.(".", 1)?.[0] || "Scanned Vendor");
      setAmount(String(data.amount || ""));
      setCategory(data.category || (tType === "income" ? "Freelance" : "Shopping"));
      setDate(data.date || new Date().toISOString().split("T")[0]);
      setCurrency(data.currency || "INR");
      setTax(String(data.tax || 0));
      setInvoiceNumber(data.invoice_number || "");
      setDescription(data.description || `Scanned bill: ${file.name}`);
      setLineItems(data.items || []);

      if (data.posted && data.record_id) {
        setPostSuccess({
          message: `⚡ Auto-posted immediately to ${tType.toUpperCase()} table in database!`,
          recordId: data.record_id,
        });
        loadRecentTransactions();
      }
    } catch (err) {
      console.error("Scan failed", err);
      setPostError("Failed to extract data via Multimodal Vision. Please verify image clarity.");
    } finally {
      setIsScanning(false);
    }
  };

  // 4. Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // 5. Line Items Manipulation
  const handleAddItem = () => {
    setLineItems((prev) => [...prev, { name: "New Item", price: 0, qty: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // 6. Post Transaction to SQLAlchemy Backend
  const handlePostTransaction = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please specify a valid transaction amount greater than 0.");
      return;
    }

    setIsPosting(true);
    setPostSuccess(null);
    setPostError(null);

    try {
      const payload = {
        transaction_type: transactionType,
        amount: numAmount,
        category: category,
        source: merchant,
        merchant: merchant,
        description: description || `${merchant} purchase`,
        date: date,
        tax: parseFloat(tax) || 0,
        items: lineItems,
      };

      const res = await postTransactionToLedger(payload);
      if (res && res.success) {
        setPostSuccess({
          message: res.message || `Recorded in ${transactionType.toUpperCase()} table.`,
          recordId: res.record_id,
        });
        loadRecentTransactions();
      }
    } catch (err) {
      console.error("Post failed", err);
      setPostError(err.response?.data?.detail || "Failed to commit transaction to database.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="scanLedgerContainer">
      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={(e) => {
          if (e.target.files?.[0]) handleProcessFile(e.target.files[0]);
        }}
      />

      {/* ================= TOP COMMAND BAR ================= */}
      <header className="scanTopBar">
        <div className="scanBrandGroup">
          <div className="scanIconBox">
            <Receipt size={20} />
          </div>
          <div className="scanTitleCol">
            <div className="scanHeading">
              AI Vision & Smart Receipt Ledger
              <span className="scanBadge">Multimodal OCR</span>
            </div>
            <div className="scanSubtitle">
              Automated invoice scanning, line-item extraction & database auto-posting
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="scanModePills">
          <button
            className={`scanModePill ${activeTab === "scan" ? "active" : ""}`}
            onClick={() => setActiveTab("scan")}
          >
            <Camera size={14} />
            Scan & Review
          </button>
          <button
            className={`scanModePill ${activeTab === "history" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("history");
              loadRecentTransactions();
            }}
          >
            <Clock size={14} />
            Synced Database Ledger ({recentLedger.length})
          </button>
        </div>

        {/* Top Header Actions */}
        <div className="scanHeaderActions">
          <div
            className={`scanAutoPostToggle ${autoPost ? "active" : ""}`}
            onClick={() => setAutoPost((prev) => !prev)}
            title="Automatically post directly to SQLAlchemy database upon receipt scan"
          >
            <Sparkles size={13} color={autoPost ? "#10b981" : "#94a3b8"} />
            <span>Auto-Post to DB</span>
            <input
              type="checkbox"
              checked={autoPost}
              onChange={() => {}}
              style={{ cursor: "pointer", accentColor: "#10b981" }}
            />
          </div>

          <button
            className="scanFinanceAppBtn"
            onClick={onNavigateToFinance}
            title="Open Finance & Expense Tracker App"
          >
            <ExternalLink size={13} />
            View in Finance App
          </button>
        </div>
      </header>

      {/* ================= TAB 1: SCAN & EXTRACT WORKSPACE ================= */}
      {activeTab === "scan" && (
        <div className="scanMainWorkspace">
          {/* LEFT PANE: UPLOAD, CAMERA & SAMPLE PICKER */}
          <section className="scanUploadPane">
            {/* Drag & Drop Box */}
            <div
              className={`scanDropZone ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="scanDropIconCircle">
                <Camera size={26} />
              </div>
              <div className="scanDropTitle">Drop Receipt Image or Utility Bill PDF</div>
              <div className="scanDropDesc">
                Drag & drop your invoice photo, supermarket slip, or broadband PDF here to parse instantly.
              </div>
              <span className="scanFileTypesBadge">JPEG • PNG • WEBP • PDF Invoices</span>
            </div>

            {/* Document Image Preview Box */}
            {previewUrl && (
              <div className="scanPreviewBox">
                <div className="scanPreviewHeader">
                  <span>Document Visual Preview</span>
                  {selectedSample && <span style={{ color: "#a5b4fc" }}>Sample Preset</span>}
                </div>
                <div className="scanPreviewImageWrap">
                  <img src={previewUrl} alt="Receipt Preview" />
                </div>
              </div>
            )}

            {/* Quick Demo Samples */}
            <div className="scanSamplePillsSection">
              <span className="scanSampleSectionTitle">Instant Test Samples</span>
              <div className="scanSampleCardsList">
                {samples.map((s) => (
                  <div
                    key={s.id}
                    className="scanSampleCard"
                    onClick={() => applySampleToForm(s)}
                  >
                    <div className="scanSampleCardLeft">
                      <span className="scanSampleEmoji">
                        {s.transaction_type === "income" ? "💼" : s.category === "Food" ? "☕" : "⚡"}
                      </span>
                      <div className="scanSampleMeta">
                        <span className="scanSampleName">{s.merchant}</span>
                        <span className="scanSampleCategory">
                          {s.category} • {s.items?.length || 0} items
                        </span>
                      </div>
                    </div>
                    <span className={`scanSampleAmount ${s.transaction_type}`}>
                      {s.transaction_type === "income" ? "+" : "-"}₹{s.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT PANE: EXTRACTED LEDGER DATA & CONFIRMATION */}
          <section className="scanDataPane">
            {isScanning ? (
              <div className="scanProcessingBox">
                <div className="scanProcessingSpinner" />
                <h4 style={{ color: "#f8fafc", fontSize: "16px", fontWeight: 700 }}>
                  Multimodal Gemini Vision Analyzing...
                </h4>
                <p style={{ maxWidth: "340px", fontSize: "13px" }}>
                  Extracting merchant name, itemized pricing, taxes, date, and classifying financial category.
                </p>
              </div>
            ) : (
              <div className="scanLedgerCard">
                {/* Header Row: Expense/Income Toggle & Confidence */}
                <div className="scanLedgerCardHeader">
                  <div className="scanTypeSelector">
                    <button
                      className={`scanTypeBtn ${transactionType === "expense" ? "active expense" : ""}`}
                      onClick={() => setTransactionType("expense")}
                    >
                      <TrendingDown size={13} style={{ display: "inline", marginRight: 4 }} />
                      Expense
                    </button>
                    <button
                      className={`scanTypeBtn ${transactionType === "income" ? "active income" : ""}`}
                      onClick={() => setTransactionType("income")}
                    >
                      <TrendingUp size={13} style={{ display: "inline", marginRight: 4 }} />
                      Income
                    </button>
                  </div>

                  <div className="scanConfidenceBadge">
                    <Sparkles size={12} />
                    <span>
                      {extractedData?.confidence
                        ? `${Math.round(extractedData.confidence * 100)}% AI Accuracy`
                        : "Verified Extraction"}
                    </span>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="scanFormGrid">
                  <div className="scanFormField">
                    <label className="scanFormLabel">
                      <Building size={12} style={{ display: "inline", marginRight: 4 }} />
                      Merchant / Vendor / Source
                    </label>
                    <input
                      type="text"
                      className="scanFormInput"
                      placeholder="e.g. Starbucks, Amazon, City Electric"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                    />
                  </div>

                  <div className="scanFormField">
                    <label className="scanFormLabel">
                      <DollarSign size={12} style={{ display: "inline", marginRight: 4 }} />
                      Total Amount ({currency})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="scanFormInput scanAmountHighlight"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="scanFormField">
                    <label className="scanFormLabel">
                      <Tag size={12} style={{ display: "inline", marginRight: 4 }} />
                      Category
                    </label>
                    <select
                      className="scanFormInput"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c} style={{ background: "#0f172a" }}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="scanFormField">
                    <label className="scanFormLabel">
                      <Calendar size={12} style={{ display: "inline", marginRight: 4 }} />
                      Transaction Date
                    </label>
                    <input
                      type="date"
                      className="scanFormInput"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="scanFormField">
                    <label className="scanFormLabel">
                      <Hash size={12} style={{ display: "inline", marginRight: 4 }} />
                      Invoice / Receipt #
                    </label>
                    <input
                      type="text"
                      className="scanFormInput"
                      placeholder="REC-XXXXX"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  </div>

                  <div className="scanFormField">
                    <label className="scanFormLabel">Tax / GST (Included)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="scanFormInput"
                      placeholder="0.00"
                      value={tax}
                      onChange={(e) => setTax(e.target.value)}
                    />
                  </div>
                </div>

                <div className="scanFormField">
                  <label className="scanFormLabel">Summary Description</label>
                  <input
                    type="text"
                    className="scanFormInput"
                    placeholder="Short description of items or services"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Itemized Line Items Table */}
                <div className="scanItemsTableWrap">
                  <div className="scanItemsTableTitle">
                    <span>Itemized Line Items ({lineItems.length})</span>
                    <button
                      onClick={handleAddItem}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#a5b4fc",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Plus size={11} /> Add Item
                    </button>
                  </div>

                  {lineItems.length > 0 ? (
                    <table className="scanItemsTable">
                      <thead>
                        <tr>
                          <th>Item Description</th>
                          <th style={{ width: "60px" }}>Qty</th>
                          <th style={{ width: "100px", textAlign: "right" }}>Price (₹)</th>
                          <th style={{ width: "36px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.map((itm, idx) => (
                          <tr key={idx}>
                            <td>
                              <input
                                type="text"
                                className="scanFormInput"
                                style={{ padding: "4px 8px", fontSize: "12px", width: "100%" }}
                                value={itm.name}
                                onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="scanFormInput"
                                style={{ padding: "4px 8px", fontSize: "12px", width: "100%" }}
                                value={itm.qty || 1}
                                onChange={(e) => handleItemChange(idx, "qty", parseInt(e.target.value) || 1)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                step="0.01"
                                className="scanFormInput"
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  width: "100%",
                                  textAlign: "right",
                                }}
                                value={itm.price}
                                onChange={(e) =>
                                  handleItemChange(idx, "price", parseFloat(e.target.value) || 0)
                                }
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button
                                onClick={() => handleRemoveItem(idx)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#94a3b8",
                                  cursor: "pointer",
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                      No itemized items detected. Click "Add Item" to add breakdown.
                    </div>
                  )}
                </div>

                {/* Status Messages */}
                {postSuccess && (
                  <div className="scanPostSuccessToast">
                    <CheckCircle2 size={18} color="#10b981" />
                    <div>
                      <div>{postSuccess.message}</div>
                      {postSuccess.recordId && (
                        <div style={{ fontSize: "11px", opacity: 0.85 }}>
                          Database Record ID #{postSuccess.recordId}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {postError && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 14px",
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.35)",
                      borderRadius: "8px",
                      color: "#fca5a5",
                      fontSize: "12.5px",
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{postError}</span>
                  </div>
                )}

                {/* Commit Action Button */}
                <div className="scanCommitRow">
                  <button
                    className="scanPostToDatabaseBtn"
                    onClick={handlePostTransaction}
                    disabled={isPosting || !amount}
                  >
                    <CheckCircle2 size={16} />
                    {isPosting
                      ? "Recording to Ledger..."
                      : `Confirm & Post to ${transactionType === "income" ? "Income" : "Expense"} Database`}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ================= TAB 2: SYNCED DATABASE LEDGER FEED ================= */}
      {activeTab === "history" && (
        <div className="scanHistoryContainer">
          <div className="scanHistoryHeader">
            <div className="scanHistoryTitleBlock">
              <h3>Live SQLAlchemy Database Ledger</h3>
              <p>
                Real-time synchronized transactions stored in your backend `Expense` and `Income` tables.
              </p>
            </div>
            <button
              className="scanFinanceAppBtn"
              onClick={loadRecentTransactions}
              disabled={loadingLedger}
            >
              <RefreshCw size={13} className={loadingLedger ? "animate-spin" : ""} />
              Refresh Feed
            </button>
          </div>

          <div className="scanHistoryFeedList">
            {recentLedger.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                <Receipt size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
                <p>No transactions logged yet. Scan a receipt to auto-populate your ledger!</p>
              </div>
            ) : (
              recentLedger.map((item) => (
                <div key={item.id} className="scanFeedCard">
                  <div className="scanFeedLeft">
                    <div className={`scanFeedTypeBadge ${item.transaction_type}`}>
                      {item.transaction_type === "income" ? "+" : "-"}
                    </div>
                    <div className="scanFeedMeta">
                      <span className="scanFeedTitle">{item.title}</span>
                      <div className="scanFeedSub">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Record #{item.raw_id}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`scanFeedAmount ${item.transaction_type}`}>
                    {item.transaction_type === "income" ? "+" : "-"}₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
