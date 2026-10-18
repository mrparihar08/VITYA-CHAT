import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reusable SEO Head Manager
 * Dynamically updates document title, meta descriptions, canonical URLs,
 * OpenGraph, Twitter cards, robots directives, and JSON-LD structured data.
 */
export default function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = "website",
  ogImage = "https://vitya-chat.onrender.com/logo.png",
  robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  structuredData = null,
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    const finalTitle = title ? `${title} | Vitya AI` : "Vitya AI | Autonomous Multimodal Workstation";
    document.title = finalTitle;

    // Helper: update or create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // 2. Standard Meta Tags
    if (description) {
      setMetaTag("name", "description", description);
    }
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }
    if (robots) {
      setMetaTag("name", "robots", robots);
    }

    // 3. Canonical Tag
    const resolvedCanonical = canonicalUrl || `https://vitya-chat.onrender.com${location.pathname === "/" ? "" : location.pathname}`;
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", resolvedCanonical);

    // 4. OpenGraph Tags
    setMetaTag("property", "og:title", finalTitle);
    if (description) setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", resolvedCanonical);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:site_name", "Vitya AI");

    // 5. Twitter Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", finalTitle);
    if (description) setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);
    setMetaTag("name", "twitter:creator", "@vitya_ai");

    // 6. Dynamic JSON-LD Structured Data
    const SCRIPT_ID = "vitya-dynamic-seo-jsonld";
    let scriptEl = document.getElementById(SCRIPT_ID);
    if (structuredData) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = SCRIPT_ID;
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(structuredData);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, keywords, canonicalUrl, ogType, ogImage, robots, structuredData, location]);

  return null;
}
