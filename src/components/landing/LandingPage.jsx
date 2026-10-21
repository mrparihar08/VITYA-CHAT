import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "../common/SEOHead";
import "./LandingPage.css";

export default function LandingPage() {
  const landingStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Vitya AI",
    "applicationCategory": "BusinessApplication, ProductivityApplication, FinanceApplication",
    "operatingSystem": "Web, iOS, Android, macOS, Windows",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Autonomous multimodal AI workstation integrating AI presentation generation, personal wealth tracking, receipt scanning, and clinical health triage."
  };

  return (
    <div className="landing-container">
      <SEOHead
        title="Autonomous Multimodal AI Workstation & Wealth Intelligence"
        description="Experience Vitya AI: An autonomous multimodal workspace combining AI Presentation Studio with Edge-TTS voiceovers, Vidya double-entry wealth intelligence, AI vision receipt OCR, and DORA health triage."
        keywords="AI presentation generator, automated pitch deck maker, personal finance AI, double-entry accounting software, receipt OCR scanner, DORA health AI, symptom triage, deep research lab, autonomous AI agent"
        canonicalUrl="https://vitya-chat.onrender.com/"
        structuredData={landingStructuredData}
      />

      {/* Header Navigation */}
      <header className="landing-nav" role="banner">
        <Link to="/" className="landing-brand" aria-label="Vitya AI Home">
          <img
            src="/logo.png"
            alt="Vitya AI Logo"
            className="landing-brand-logo"
            width="38"
            height="38"
          />
          <span className="landing-brand-text">Vitya AI</span>
        </Link>

        <nav className="landing-nav-links" aria-label="Main Navigation">
          <Link to="/presentation" className="landing-nav-link">Presentation Studio</Link>
          <Link to="/finance" className="landing-nav-link">Wealth & Finance</Link>
          <Link to="/scan-ledger" className="landing-nav-link">Receipt Scanner</Link>
          <Link to="/dora" className="landing-nav-link">DORA Health</Link>
          <Link to="/research" className="landing-nav-link">Research Lab</Link>
        </nav>

        <div className="landing-nav-actions">
          <Link to="/login" className="btn-secondary">Sign In</Link>
          <Link to="/register" className="btn-primary">Get Started Free</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="landing-pill">
            <span className="landing-pill-dot" aria-hidden="true"></span>
            <span>Next-Gen Enterprise Personal Intelligence</span>
          </div>

          <h1 id="hero-title" className="landing-title">
            The Autonomous AI Workstation for <span className="landing-title-gradient">Presentations, Wealth & Clinical Intelligence</span>
          </h1>

          <p className="landing-subtitle">
            Consolidate your digital workflow. Generate executive pitch decks with AI voice narration, automate double-entry personal finance, scan receipts with computer vision, and triage health questions in one unified system.
          </p>

          <div className="landing-cta-row">
            <Link to="/register" className="btn-primary landing-cta-btn-lg">
              Launch Workspace Free
            </Link>
            <Link to="/login" className="btn-secondary landing-cta-btn-lg">
              Explore Live Demo
            </Link>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="landing-features-section" aria-labelledby="features-title">
          <div className="section-header">
            <span className="section-tag">Core Modules</span>
            <h2 id="features-title" className="section-title">Engineered for Precision & Real-World Utility</h2>
            <p className="section-desc">
              Every engine inside Vitya AI runs on specialized neural algorithms and mathematical solvers rather than generic text prompts.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">🎨</div>
              <h3 className="feature-heading">AI Presentation Studio</h3>
              <p className="feature-text">
                Generate production-grade 16:9 PowerPoint decks from natural language. Features a spatial layout solver, 21 content plugins, CC image discovery, and automated Edge-TTS narration.
              </p>
              <div className="feature-badges">
                <span className="feature-badge">.PPTX Export</span>
                <span className="feature-badge">16:9 Spatial Solver</span>
                <span className="feature-badge">Edge-TTS Narration</span>
              </div>
            </article>

            {/* Feature 2 */}
            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">📈</div>
              <h3 className="feature-heading">Vidya Wealth Advisor</h3>
              <p className="feature-text">
                Full double-entry personal accounting with machine-learning cashflow forecasting, 0–100 financial health scoring, automated budget capping, and subscription leak detection.
              </p>
              <div className="feature-badges">
                <span className="feature-badge">Double-Entry</span>
                <span className="feature-badge">ML Forecasts</span>
                <span className="feature-badge">0-100 Health Score</span>
              </div>
            </article>

            {/* Feature 3 */}
            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">🧾</div>
              <h3 className="feature-heading">AI Vision Receipt Ledger</h3>
              <p className="feature-text">
                Snap photos of paper invoices or upload PDFs. The computer vision engine extracts line items, taxes, merchant names, and posts them directly to your verified ledger.
              </p>
              <div className="feature-badges">
                <span className="feature-badge">Optical Character OCR</span>
                <span className="feature-badge">Tax Categorization</span>
                <span className="feature-badge">Instant Sync</span>
              </div>
            </article>

            {/* Feature 4 */}
            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">🩺</div>
              <h3 className="feature-heading">DORA Clinical Health AI</h3>
              <p className="feature-text">
                Pre-trained clinical triage classifier trained on 130+ symptom vectors. Provides instant differential insights, triage urgency levels, and specialty referrals.
              </p>
              <div className="feature-badges">
                <span className="feature-badge">TF-IDF Classifier</span>
                <span className="feature-badge">130+ Symptoms</span>
                <span className="feature-badge">Clinical Triage</span>
              </div>
            </article>

            {/* Feature 5 */}
            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">🔬</div>
              <h3 className="feature-heading">Research & Deep Document Lab</h3>
              <p className="feature-text">
                Conduct multi-document syntheses, RAG vector searches, and cross-source analysis. Ideal for technical literature, legal briefs, and financial filings.
              </p>
              <div className="feature-badges">
                <span className="feature-badge">Multimodal RAG</span>
                <span className="feature-badge">Document Synthesis</span>
                <span className="feature-badge">Fast Retrieval</span>
              </div>
            </article>

            {/* Feature 6 */}
            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">⚡</div>
              <h3 className="feature-heading">Neural Automations & Audio Brain</h3>
              <p className="feature-text">
                Record thoughts and meetings with Whisper speech recognition, extract actionable tasks, and run autonomous scheduled background routines.
              </p>
              <div className="feature-badges">
                <span className="feature-badge">Whisper Audio</span>
                <span className="feature-badge">Smart Routines</span>
                <span className="feature-badge">Calendar Sync</span>
              </div>
            </article>
          </div>
        </section>

        {/* High-Intent FAQ Section (Matches Schema.org FAQPage) */}
        <section className="landing-faq-section" aria-labelledby="faq-title">
          <div className="section-header">
            <span className="section-tag">Frequently Asked Questions</span>
            <h2 id="faq-title" className="section-title">Answers to Common Inquiries</h2>
            <p className="section-desc">
              Everything you need to know about Vitya AI architecture, capabilities, and security.
            </p>
          </div>

          <div className="faq-list">
            <article className="faq-item">
              <h3 className="faq-question">What is Vitya AI and who is it designed for?</h3>
              <p className="faq-answer">
                Vitya AI is an autonomous multimodal productivity and intelligence platform designed for founders, knowledge workers, freelancers, and analysts. It unifies presentation creation, double-entry financial planning, receipt OCR scanning, and clinical triage into a single web application.
              </p>
            </article>

            <article className="faq-item">
              <h3 className="faq-question">How does Vitya AI compare to standalone presentation tools?</h3>
              <p className="faq-answer">
                Unlike surface-level presentation generators that produce non-editable images or locked web slides, Vitya AI compiles clean, standard Microsoft PowerPoint (.pptx) decks using a 16:9 spatial layout solver with 21 content plugins and synchronized Edge-TTS voiceovers.
              </p>
            </article>

            <article className="faq-item">
              <h3 className="faq-question">How does Vidya calculate my Financial Health Score?</h3>
              <p className="faq-answer">
                The Vidya scoring engine evaluates your debt-to-savings ratio, recurring subscription burn rate, savings consistency, and expense volatility to output an objective score from 0 to 100 alongside actionable optimization recommendations.
              </p>
            </article>

            <article className="faq-item">
              <h3 className="faq-question">Is my private data encrypted and secure?</h3>
              <p className="faq-answer">
                Yes. Vitya AI utilizes industry-standard cryptographic practices including salted password hashing, JWT bearer token authorization, encrypted database storage, and strict tenant isolation.
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer" role="contentinfo">
        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/presentation" className="footer-link">Presentation Studio</Link>
          <Link to="/finance" className="footer-link">Personal Finance</Link>
          <Link to="/scan-ledger" className="footer-link">Receipt Scanner</Link>
          <Link to="/dora" className="footer-link">DORA Health</Link>
          <Link to="/research" className="footer-link">Research Lab</Link>
          <Link to="/register" className="footer-link">Sign Up</Link>
          <Link to="/login" className="footer-link">Sign In</Link>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} Vitya AI. All rights reserved. Multimodal Omnipresent Technology for Enterprise & Research.
        </p>
      </footer>
    </div>
  );
}
