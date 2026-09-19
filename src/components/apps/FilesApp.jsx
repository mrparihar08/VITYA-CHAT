import React, { useCallback, useEffect, useState } from "react";
import { api, handleApiError } from "../../services/api";

const FilesApp = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("token");

  // =========================
  // FETCH DOCUMENTS
  // =========================
  const fetchDocuments = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setMessage("Please login to access uploaded workspace files.");
      return;
    }

    setFetching(true);
    try {
      const res = await api.get("/api/rag/documents");
      if (res.data && Array.isArray(res.data.documents)) {
        setDocuments(res.data.documents);
      } else {
        setDocuments([]);
      }
      setMessage("");
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to load documents.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // =========================
  // HANDLE FILE SELECTION
  // =========================
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setMessage("");
  };

  // =========================
  // UPLOAD FILES
  // =========================
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      setMessage("Please select at least one file to upload.");
      return;
    }

    const token = getToken();
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await api.post("/api/rag/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data && Array.isArray(res.data.documents)) {
        setDocuments(res.data.documents);
      }
      setSelectedFiles([]);
      setMessage("Files uploaded and indexed successfully into workspace knowledge base!");
      await fetchDocuments();
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to upload files.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLEAR ALL DOCUMENTS
  // =========================
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all uploaded workspace documents?")) {
      return;
    }

    const token = getToken();
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    setLoading(true);
    try {
      await api.delete("/api/rag/documents");
      setDocuments([]);
      setMessage("All workspace files cleared successfully.");
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to clear documents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="miniApp">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>📁 Workspace Files & Documents</h3>
        {documents.length > 0 && (
          <button
            className="deleteBtn"
            onClick={handleClearAll}
            disabled={loading}
            title="Clear all workspace documents"
            style={{ fontSize: 12, padding: "4px 8px" }}
          >
            Clear All
          </button>
        )}
      </div>

      <p className="mutedText" style={{ marginTop: 0, marginBottom: 12 }}>
        Upload PDF, CSV, TXT, or DOCX documents to connect them with MOTHER&apos;s Knowledge Base and AI Chat.
      </p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <input
          type="file"
          className="inputBox"
          multiple
          accept=".pdf,.txt,.docx,.csv"
          onChange={handleFileChange}
          style={{ flex: 1, minWidth: 200 }}
        />
        <button
          className="smallBtn"
          onClick={handleUpload}
          disabled={loading || !selectedFiles.length}
        >
          {loading ? "Uploading..." : "Upload & Index"}
        </button>
      </div>

      {message && (
        <p
          style={{
            fontSize: 13,
            color: message.toLowerCase().includes("failed") || message.toLowerCase().includes("error") ? "#ef4444" : "#10b981",
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          {message}
        </p>
      )}

      <div className="listBox" style={{ marginTop: 12 }}>
        {fetching ? (
          <p className="mutedText">Loading files...</p>
        ) : documents.length === 0 ? (
          <p className="mutedText">No files uploaded yet. Select files above to add them to your workspace.</p>
        ) : (
          documents.map((doc, idx) => (
            <div
              key={idx}
              className="listItem"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                marginBottom: 8,
              }}
            >
              <div>
                <strong>📄 {doc.filename}</strong>
                <div style={{ fontSize: 11, color: "var(--text-muted, #888)", marginTop: 2 }}>
                  {doc.chunk_count} chunk{doc.chunk_count === 1 ? "" : "s"} • {doc.char_count.toLocaleString()} characters
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                Indexed
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FilesApp;