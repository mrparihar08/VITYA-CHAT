import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, getUserFromStorage } from "../auth/AuthCommon";
import { useAuth } from "../../context/AuthContext";
import "../auth/Auth.css";

const COMPANY_EMAIL = "elva.web.now@gmail.com";

const FAQS = [
  {
    id: 1,
    category: "General",
    question: "What is Vitya.AI and how does it work?",
    answer:
      "Vitya.AI is an all-in-one AI Productivity Platform featuring an AI Assistant Chatbot, AI Presentation Studio, workspace mini-apps (Notes, Tasks, Calendar, Files, Analytics), and custom theme presets.",
  },
  {
    id: 2,
    category: "Presentations",
    question: "How do I generate an AI Presentation?",
    answer:
      "Click on 'Presentation' in the left sidebar or select 'Create Presentation' from Quick Tools. Enter your topic or prompt, select slide count & theme style, and Vitya.AI will generate complete formatted slides in seconds.",
  },
  {
    id: 3,
    category: "Themes & Customization",
    question: "How do I switch theme presets?",
    answer:
      "Click the Theme toggle in the bottom left sidebar or navigate to Settings > Appearance. You can choose from Vitya Dark, Midnight Blue, Cyber Violet, or Obsidian Minimal presets.",
  },
  {
    id: 4,
    category: "Billing & Subscription",
    question: "How do I manage or upgrade my subscription?",
    answer:
      "Go to Profile > Subscription or visit /settings/subscription to view your active plan, usage quotas, and upgrade options for higher API limits.",
  },
  {
    id: 5,
    category: "Security & Privacy",
    question: "Is my chat data kept private?",
    answer:
      "Yes. Your chat logs and generated files are stored securely with enterprise-grade encryption. We do not use your personal private data to train external models.",
  },
];

export function HelpSupportPage({ insideDashboard = false }) {
  const navigate = useNavigate();
  let authUser = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const authContext = useAuth();
    authUser = authContext?.user;
  } catch (e) {
    // fallback if outside AuthProvider
  }

  const storedUser = getUserFromStorage();
  const initialEmail = authUser?.email || storedUser?.email || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [contactSubject, setContactSubject] = useState("");
  const [contactCategory, setContactCategory] = useState("Technical Issue");
  const [contactMessage, setContactMessage] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (!userEmail && (authUser?.email || storedUser?.email)) {
      setUserEmail(authUser?.email || storedUser?.email);
    }
  }, [authUser, storedUser, userEmail]);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    const subjectText = `[Vitya Support - ${contactCategory}] ${contactSubject}`;
    const bodyText = `From User: ${userEmail || "Not provided"}\nCategory: ${contactCategory}\nSubject: ${contactSubject}\n\nMessage Details:\n${contactMessage}`;

    const mailtoUrl = `mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

    // Open mail client for direct sending to elva.web.now@gmail.com
    window.location.href = mailtoUrl;

    setSentSuccess(true);
  };

  return (
    <PageShell
      title="Help & Support"
      subtitle="Find answers, read documentation, or contact our support team."
      plain={insideDashboard}
      hideBrandRow={insideDashboard}
      wide={true}
    >
      <div className="vitya-subpage-container">
        <div className="vitya-profile-top-nav" style={{ marginBottom: 16 }}>
          <button
            type="button"
            className="backBtn"
            onClick={() => navigate(insideDashboard ? "/dashboard?tab=profile" : "/profile")}
          >
            ← Back to Profile
          </button>
          <div className="appBreadcrumb">
            <span>Profile</span> <span className="bcSep">/</span> <strong className="bcCurrent">Help & Support</strong>
          </div>
        </div>

        {/* QUICK CONTACT / ACTION HERO CARDS */}
        <div className="vitya-help-hero-grid">
          <div
            className="vitya-help-card help-card-chat"
            onClick={() => navigate("/chatbot")}
            role="button"
            tabIndex={0}
          >
            <div className="vitya-help-icon">💬</div>
            <div className="vitya-help-info">
              <h3>Ask AI Assistant</h3>
              <p>Get instant answers 24/7 from Vitya AI.</p>
            </div>
            <span className="vitya-help-arrow">→</span>
          </div>

          <div
            className="vitya-help-card help-card-docs"
            onClick={() => navigate("/settings/about")}
            role="button"
            tabIndex={0}
          >
            <div className="vitya-help-icon">📚</div>
            <div className="vitya-help-info">
              <h3>Guides & Docs</h3>
              <p>Step-by-step tutorials & app walkthroughs.</p>
            </div>
            <span className="vitya-help-arrow">→</span>
          </div>

          <div className="vitya-help-card help-card-status">
            <div className="vitya-help-icon">⚡</div>
            <div className="vitya-help-info">
              <h3>System Status</h3>
              <p>
                <span className="status-live-dot" /> All Systems Operational (100%)
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH & FAQ SECTION */}
        <div className="vitya-card-panel margin-top-20">
          <div className="panel-section-header">
            <div>
              <h2 className="panel-title">Frequently Asked Questions</h2>
              <p className="panel-subtitle">Quick solutions to common questions.</p>
            </div>
          </div>

          <div className="vitya-search-box-wrap">
            <span className="search-glass-icon">🔍</span>
            <input
              type="text"
              placeholder="Search help articles, prompts, themes..."
              className="vitya-help-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="vitya-faq-accordion-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`vitya-faq-item ${isOpen ? "open" : ""}`}
                  >
                    <div
                      className="vitya-faq-question-row"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className="faq-category-tag">{faq.category}</span>
                      <h4 className="faq-question-text">{faq.question}</h4>
                      <span className="faq-toggle-icon">{isOpen ? "−" : "+"}</span>
                    </div>
                    {isOpen && (
                      <div className="vitya-faq-answer-body">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="vitya-empty-faq">
                <p>No matching support articles found for "{searchQuery}".</p>
              </div>
            )}
          </div>
        </div>

        {/* CONTACT SUPPORT FORM */}
        <div className="vitya-card-panel margin-top-20">
          <div className="panel-section-header">
            <div>
              <h2 className="panel-title">Contact Support Team</h2>
              <p className="panel-subtitle">
                Can't find what you need? Send a direct email inquiry to{" "}
                <strong style={{ color: "#a855f7" }}>{COMPANY_EMAIL}</strong>.
              </p>
            </div>
          </div>

          {sentSuccess ? (
            <div className="vitya-success-banner">
              <span className="success-icon">✅</span>
              <div>
                <h4>Ticket Prepared & Email Opened!</h4>
                <p>
                  We have prepared your ticket and opened your default email application to send directly to{" "}
                  <strong>{COMPANY_EMAIL}</strong>.
                </p>
                <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href={`mailto:${COMPANY_EMAIL}?subject=${encodeURIComponent(`[Vitya Support - ${contactCategory}] ${contactSubject}`)}&body=${encodeURIComponent(`From User: ${userEmail || "Not provided"}\nCategory: ${contactCategory}\nSubject: ${contactSubject}\n\nMessage Details:\n${contactMessage}`)}`}
                    className="vitya-btn-purple"
                    style={{ fontSize: "13px", padding: "8px 14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <span>📩</span> Re-open Email App ({COMPANY_EMAIL})
                  </a>
                  <button
                    type="button"
                    className="vitya-btn-purple"
                    style={{
                      fontSize: "13px",
                      padding: "8px 14px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                    onClick={() => {
                      setSentSuccess(false);
                      setContactSubject("");
                      setContactMessage("");
                    }}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form className="vitya-contact-form" onSubmit={handleSubmitContact}>
              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label className="form-label">Your Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="vitya-input-field"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <span style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px", display: "block" }}>
                  Our support team ({COMPANY_EMAIL}) will reply to this email address.
                </span>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of your question"
                    className="vitya-input-field"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="vitya-input-field"
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                  >
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Billing & Subscription">Billing & Subscription</option>
                    <option value="Presentation Studio">Presentation Studio</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
              </div>

              <div className="form-group margin-top-12">
                <label className="form-label">Message Details</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your issue or feedback in detail..."
                  className="vitya-input-field textarea-field"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>

              <div className="form-action-bar">
                <button type="submit" className="vitya-btn-purple">
                  <span>📩</span> Send Email to {COMPANY_EMAIL}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default HelpSupportPage;
