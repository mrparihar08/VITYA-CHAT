import React, { useState, useEffect } from "react";
import { Search, Sparkles, X, Check, Image as ImageIcon, Loader2, ExternalLink } from "lucide-react";
import { getUnsplashPhotos } from "../../../services/api";

// Curated high quality Unsplash CDN photo collections for instant loading (< 50ms)
const SAMPLE_IMAGE_COLLECTIONS = {
  home: [
    { id: "home-1", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", title: "Modern Luxury Home Exterior", source: "Unsplash" },
    { id: "home-2", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", title: "Contemporary Living Room Interior", source: "Unsplash" },
    { id: "home-3", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80", title: "Minimalist Home Interior Design", source: "Unsplash" },
    { id: "home-4", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", title: "Cozy Home Workplace & Study", source: "Unsplash" },
    { id: "home-5", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", title: "Modern Open Plan Kitchen & Living", source: "Unsplash" },
    { id: "home-6", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", title: "Suburban Residence Architecture", source: "Unsplash" },
    { id: "home-7", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", title: "Warm Modern Living Space", source: "Unsplash" },
    { id: "home-8", url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80", title: "Luxury Residential Villa", source: "Unsplash" }
  ],
  real_estate: [
    { id: "re-1", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80", title: "Modern Glass Skyscraper", source: "Unsplash" },
    { id: "re-2", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", title: "Urban Corporate Buildings", source: "Unsplash" },
    { id: "re-3", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", title: "Luxury Property Design", source: "Unsplash" }
  ],
  life: [
    { id: "life-1", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800", title: "Lifelong Learning & Teamwork", source: "Unsplash" },
    { id: "life-2", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800", title: "Knowledge & Educational Development", source: "Unsplash" },
    { id: "life-3", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800", title: "Personal Growth & Skill Building", source: "Unsplash" },
    { id: "life-4", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800", title: "Focus & Continuous Learning", source: "Unsplash" },
    { id: "life-5", url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800", title: "Modern Workplace & Productivity", source: "Unsplash" },
    { id: "life-6", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800", title: "Strategic Personal Development", source: "Unsplash" }
  ],
  education: [
    { id: "edu-1", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800", title: "Academic Excellence & University", source: "Unsplash" },
    { id: "edu-2", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800", title: "Library Research & Books", source: "Unsplash" },
    { id: "edu-3", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800", title: "Digital Classroom & Workshop", source: "Unsplash" },
    { id: "edu-4", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800", title: "Lectures & Professional Growth", source: "Unsplash" }
  ],
  technology: [
    { id: "img-1", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800", title: "Artificial Intelligence & Circuit Nodes", source: "Unsplash" },
    { id: "img-2", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", title: "Global Network Data Connections", source: "Unsplash" },
    { id: "img-3", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800", title: "Cybersecurity Digital Matrix", source: "Unsplash" },
    { id: "img-4", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", title: "Modern Abstract Technology Gradient", source: "Unsplash" },
    { id: "img-5", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800", title: "Cloud Infrastructure & Servers", source: "Unsplash" },
    { id: "img-6", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800", title: "Robotics & Next-Gen Automation", source: "Unsplash" }
  ],
  business: [
    { id: "img-7", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", title: "Financial Analytics Dashboard", source: "Unsplash" },
    { id: "img-8", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800", title: "Executive Strategic Planning", source: "Unsplash" },
    { id: "img-9", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800", title: "Team Collaboration & Workspace", source: "Unsplash" },
    { id: "img-10", url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800", title: "Market Growth Chart Metrics", source: "Unsplash" },
    { id: "img-11", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800", title: "Corporate Strategy Roadmap", source: "Unsplash" },
    { id: "img-12", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800", title: "Digital Enterprise Workshop", source: "Unsplash" }
  ],
  science: [
    { id: "img-13", url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800", title: "Biotech Laboratory Research", source: "Unsplash" },
    { id: "img-14", url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800", title: "Molecular Structure & Chemistry", source: "Unsplash" },
    { id: "img-15", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800", title: "Healthcare Medical Innovations", source: "Unsplash" },
    { id: "img-16", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800", title: "Genomics & DNA Sequencing", source: "Unsplash" }
  ],
  nature: [
    { id: "nat-1", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", title: "Lush Forest & Mountain Nature", source: "Unsplash" },
    { id: "nat-2", url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800", title: "Renewable Solar Panels", source: "Unsplash" },
    { id: "nat-3", url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800", title: "Wind Turbines & Clean Energy", source: "Unsplash" }
  ],
  car: [
    { id: "car-1", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800", title: "Luxury Automobile Design", source: "Unsplash" },
    { id: "car-2", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800", title: "Modern Sports Car", source: "Unsplash" },
    { id: "car-3", url: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800", title: "Electric Vehicle Technology", source: "Unsplash" }
  ],
  food: [
    { id: "food-1", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800", title: "Gourmet Culinary Presentation", source: "Unsplash" },
    { id: "food-2", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", title: "Modern Restaurant Atmosphere", source: "Unsplash" }
  ]
};

// Topic visual domain mapping matching backend unsplash_service.py
const TOPIC_VISUAL_MAP = [
  { pattern: /(home|house|interior|living|kitchen|decor|residence|villa|apartment|furniture)/i, terms: "modern home house interior design living room cozy architecture real estate", fallbackKey: "home" },
  { pattern: /(real_estate|property|building|skyscraper|architecture)/i, terms: "modern architecture skyscraper building property exterior real estate glass facade", fallbackKey: "real_estate" },
  { pattern: /(data_science|data science|analytics|data_analytics|machine_learning|big_data|ai|artificial|neural|data)/i, terms: "data science analytics artificial intelligence machine learning technology chart screen", fallbackKey: "technology" },
  { pattern: /(cyber|security|threat|hack|firewall|encryption|zero_trust)/i, terms: "cybersecurity network server technology data lock dark studio", fallbackKey: "technology" },
  { pattern: /(cloud|server|datacenter|aws|azure|devops|infrastructure)/i, terms: "cloud computing server rack datacenter network technology", fallbackKey: "technology" },
  { pattern: /(finance|stock|money|market|invest|banking|economy|trading|fintech)/i, terms: "finance stock market trading chart business analytics office", fallbackKey: "business" },
  { pattern: /(business|strategy|executive|management|office|meeting|leader|corporate|startup)/i, terms: "business strategy executive presentation team modern office corporate leadership", fallbackKey: "business" },
  { pattern: /(health|medical|doctor|hospital|biotech|pharma|patient|clinical|dna|gene)/i, terms: "healthcare medical technology hospital doctor laboratory research", fallbackKey: "science" },
  { pattern: /(marketing|sales|growth|customer|brand|target|advertising|seo)/i, terms: "marketing strategy digital analytics growth graph team whiteboard", fallbackKey: "business" },
  { pattern: /(code|software|developer|architecture|programming|frontend|backend|api)/i, terms: "software developer code screen data architecture modern office setup", fallbackKey: "technology" },
  { pattern: /(education|learning|university|school|student|training|course|life)/i, terms: "education university campus learning student modern library classroom", fallbackKey: "life" },
  { pattern: /(nature|forest|green|solar|wind|energy|environment)/i, terms: "nature forest green renewable energy environment landscape", fallbackKey: "nature" },
  { pattern: /(car|automobile|vehicle|ev|transport)/i, terms: "electric vehicle automobile car transportation", fallbackKey: "car" },
  { pattern: /(food|dining|restaurant|chef)/i, terms: "gourmet food restaurant dining chef presentation", fallbackKey: "food" }
];

export default function ImageSearchModal({
  isOpen,
  onClose,
  initialQuery = "",
  slideContext = {},
  onSelectImage
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const topic = slideContext.topic || slideContext.presentationTitle || "";
      const title = slideContext.slideTitle || "";
      
      let contextQuery = initialQuery;
      if (!contextQuery || contextQuery === "technology" || contextQuery === "Current Slide") {
        contextQuery = title && title !== "Current Slide" ? `${title} ${topic}`.trim() : (topic || "technology");
      }
      setSearchQuery(contextQuery);
      performSearch(contextQuery);
    }
  }, [isOpen, initialQuery, slideContext]);

  const performSearch = async (query) => {
    const cleanQuery = (query || "").trim();
    if (!cleanQuery) return;

    setIsLoading(true);

    // 1. Attempt backend multi-photo Unsplash / AI endpoint via configured API service
    try {
      const apiData = await getUnsplashPhotos(cleanQuery, 9);
      if (apiData && Array.isArray(apiData.photos) && apiData.photos.length > 0) {
        setResults(apiData.photos);
        setIsLoading(false);
        return;
      }
    } catch (backendErr) {
      console.warn("Backend Unsplash endpoint fallback to client catalog:", backendErr);
    }

    // 2. Check client-side topic visual domain collections
    let matchedFallback = null;
    for (const item of TOPIC_VISUAL_MAP) {
      if (item.pattern.test(cleanQuery)) {
        matchedFallback = item.fallbackKey;
        break;
      }
    }

    if (matchedFallback && SAMPLE_IMAGE_COLLECTIONS[matchedFallback]) {
      setResults(SAMPLE_IMAGE_COLLECTIONS[matchedFallback]);
      setIsLoading(false);
      return;
    }

    // 3. Fallback for custom queries: generate Pollinations FLUX AI images if offline/unmatched
    const aiPhotos = Array.from({ length: 6 }).map((_, idx) => {
      const prompt = encodeURIComponent(`${cleanQuery} professional photo presentation visual ${idx + 1}`);
      const seed = Math.floor(Math.random() * 10000);
      return {
        id: `client-ai-${idx}`,
        url: `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=675&model=flux&nologo=true&seed=${seed}`,
        title: `${cleanQuery} Visual ${idx + 1}`,
        source: "AI Generated"
      };
    });
    setResults(aiPhotos);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="img-modal-overlay" onClick={onClose}>
      <div className="img-search-modal" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="img-modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={18} className="ai-sparkle-glow" />
            <span>CONTEXT-AWARE IMAGE SEARCH</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* DETECTED SLIDE CONTEXT BANNER */}
        <div className="context-banner-row">
          <span className="ctx-badge">SLIDE CONTEXT:</span>
          <span className="ctx-text">
            <strong>{slideContext.slideTitle || "Current Slide"}</strong>
            {slideContext.topic ? ` (${slideContext.topic})` : ""}
          </span>
        </div>

        {/* SEARCH BAR & CATEGORY CHIPS */}
        <div className="img-search-bar-wrap">
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performSearch(searchQuery)}
              placeholder="Search contextual presentation images (e.g., home, interior, technology)..."
              className="modal-search-input"
            />
            <button
              className="search-btn"
              onClick={() => performSearch(searchQuery)}
            >
              <span>Search</span>
            </button>
          </div>

          <div className="category-chips-row">
            {["all", "home", "technology", "business", "science", "life"].map((cat) => (
              <button
                key={cat}
                className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  performSearch(cat === "all" ? searchQuery : cat);
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="img-results-body">
          {isLoading ? (
            <div className="modal-loading-state">
              <Loader2 size={28} className="spin-loader" />
              <span>Analyzing presentation context & fetching high resolution photos...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="modal-empty-state">
              <ImageIcon size={32} />
              <span>No matching images found for this context query.</span>
            </div>
          ) : (
            <div className="img-cards-grid">
              {results.map((img) => (
                <div key={img.id} className="img-card-item">
                  <div className="img-card-preview">
                    <img src={img.url} alt="" loading="lazy" />
                    <div className="img-card-overlay">
                      <button
                        className="card-action-btn primary"
                        onClick={() => {
                          onSelectImage?.(img.url, img.title, img.source);
                          onClose();
                        }}
                      >
                        <Check size={13} />
                        <span>Use Image</span>
                      </button>
                      <button
                        className="card-action-btn secondary"
                        onClick={() => setPreviewImage(img)}
                      >
                        <ExternalLink size={13} />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                  <div className="img-card-caption">
                    <span className="card-title">{img.title}</span>
                    <span className="card-source">{img.source}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FULLSCREEN PREVIEW OVERLAY */}
        {previewImage && (
          <div className="img-full-preview-overlay" onClick={() => setPreviewImage(null)}>
            <div className="img-full-preview-card" onClick={(e) => e.stopPropagation()}>
              <button className="preview-close-btn" onClick={() => setPreviewImage(null)}>
                <X size={16} />
              </button>
              <img src={previewImage.url} alt={previewImage.title} />
              <div className="preview-footer-bar">
                <div>
                  <div className="preview-title">{previewImage.title}</div>
                  <div className="preview-source">Source: {previewImage.source} (High Resolution 16:9)</div>
                </div>
                <button
                  className="top-btn primary-btn"
                  onClick={() => {
                    onSelectImage?.(previewImage.url, previewImage.title, previewImage.source);
                    setPreviewImage(null);
                    onClose();
                  }}
                >
                  <Check size={14} />
                  <span>Insert Into Slide</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
