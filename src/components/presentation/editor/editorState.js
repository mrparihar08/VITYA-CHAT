// Default sample slides for realistic PPT Presentation Editor demonstration
export const SAMPLE_SLIDES = [
  {
    id: "slide-1",
    layout: "title_slide",
    title: "Artificial Intelligence & Enterprise Future Tech",
    subtitle: "Strategic Blueprint, Growth Metrics & Operational Roadmap for 2026",
    bg_color: "#0f172a",
    background_theme: "dark_gradient",
    bg_gradient_start: "#0f172a",
    bg_gradient_end: "#1e1b4b",
    text_color: "#ffffff",
    accent_color: "#c084fc",
    elements: [
      {
        id: "el-title-1",
        type: "text",
        x: 10,
        y: 25,
        width: 80,
        height: 25,
        content: "Artificial Intelligence & Enterprise Future Tech",
        fontSize: 42,
        fontWeight: "800",
        color: "#ffffff",
        align: "center",
        valign: "middle",
        fontFamily: "Inter",
        letterSpacing: "-0.5px"
      },
      {
        id: "el-sub-1",
        type: "text",
        x: 15,
        y: 52,
        width: 70,
        height: 15,
        content: "Strategic Blueprint, Growth Metrics & Operational Roadmap for 2026",
        fontSize: 20,
        fontWeight: "400",
        color: "#c084fc",
        align: "center",
        valign: "middle",
        fontFamily: "Inter"
      },
      {
        id: "el-badge-1",
        type: "shape",
        shape_type: "rounded_rectangle",
        x: 35,
        y: 12,
        width: 30,
        height: 8,
        fill_color: "rgba(192, 132, 252, 0.15)",
        stroke_color: "#c084fc",
        stroke_width: 1.5,
        radius: 20,
        text: "✦ EXECUTIVE KEYNOTE DECK ✦",
        text_color: "#c084fc",
        fontSize: 13,
        fontWeight: "700"
      },
      {
        id: "el-presenter-1",
        type: "text",
        x: 20,
        y: 78,
        width: 60,
        height: 10,
        content: "Prepared by Vitya AI Systems • Confidential & Proprietary",
        fontSize: 13,
        fontWeight: "500",
        color: "#94a3b8",
        align: "center"
      }
    ],
    notes: "Welcome the audience and give a brief overview of today's executive briefing on AI enterprise deployment."
  },
  {
    id: "slide-2",
    layout: "mixed_content",
    title: "Executive Summary & Core Pillars",
    subtitle: "Accelerating Digital Transformation Through Autonomous Agents",
    bg_color: "#0f172a",
    background_theme: "dark_gradient",
    bg_gradient_start: "#0f172a",
    bg_gradient_end: "#1e1b4b",
    text_color: "#ffffff",
    accent_color: "#38bdf8",
    elements: [
      {
        id: "el-title-2",
        type: "text",
        x: 6,
        y: 8,
        width: 88,
        height: 12,
        content: "Executive Summary & Core Pillars",
        fontSize: 32,
        fontWeight: "700",
        color: "#ffffff",
        align: "left"
      },
      {
        id: "el-para-2",
        type: "text",
        x: 6,
        y: 22,
        width: 44,
        height: 20,
        content: "Enterprise AI adoption has transitioned from experimental chatbots to autonomous multi-agent workflows that run mission-critical infrastructure.",
        fontSize: 16,
        fontWeight: "400",
        color: "#cbd5e1",
        align: "left",
        lineHeight: 1.5
      },
      {
        id: "el-bullets-2",
        type: "bullets",
        x: 6,
        y: 45,
        width: 44,
        height: 45,
        points: [
          "Real-time Automated Decision Intelligence",
          "Sub-50ms Multi-modal Query Processing",
          "Zero-Trust Enterprise Data Encryption",
          "300% ROI in Operational Efficiency"
        ],
        fontSize: 15,
        color: "#f8fafc"
      },
      {
        id: "el-img-2",
        type: "image",
        x: 54,
        y: 22,
        width: 40,
        height: 68,
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        caption: "Neural Network Infrastructure",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.15)",
        shadow: "heavy"
      }
    ],
    notes: "Emphasize how autonomous AI agents reduce operational friction by 3x across engineering and finance teams."
  },
  {
    id: "slide-3",
    layout: "chart",
    title: "Global Enterprise AI Adoption Growth",
    subtitle: "Year-over-Year Enterprise Scaling Metrics (2023 - 2026)",
    bg_color: "#0f172a",
    background_theme: "dark_gradient",
    bg_gradient_start: "#0f172a",
    bg_gradient_end: "#1e1b4b",
    text_color: "#ffffff",
    accent_color: "#10b981",
    elements: [
      {
        id: "el-title-3",
        type: "text",
        x: 6,
        y: 8,
        width: 88,
        height: 12,
        content: "Global Enterprise AI Adoption Growth",
        fontSize: 32,
        fontWeight: "700",
        color: "#ffffff",
        align: "left"
      },
      {
        id: "el-chart-3",
        type: "chart",
        x: 6,
        y: 24,
        width: 58,
        height: 66,
        chart_type: "bar",
        title: "Adoption Rate (%)",
        labels: ["2023", "2024", "2025", "2026 (Est.)"],
        values: [34, 58, 82, 96],
        showLabels: true,
        showGrid: true,
        color: "#10b981"
      },
      {
        id: "el-stat-1",
        type: "stat",
        x: 68,
        y: 24,
        width: 26,
        height: 28,
        number: "96%",
        label: "Market Penetration",
        sublabel: "Target for Fortune 500",
        color: "#10b981"
      },
      {
        id: "el-stat-2",
        type: "stat",
        x: 68,
        y: 56,
        width: 26,
        height: 28,
        number: "4.2x",
        label: "Efficiency Multiplier",
        sublabel: "Average Productivity Boost",
        color: "#38bdf8"
      }
    ],
    notes: "Point out the sharp jump between 2024 and 2025 when generative workflow tools matured."
  },
  {
    id: "slide-4",
    layout: "diagram",
    title: "Strategic Product Roadmap",
    subtitle: "Execution Timeline Across Key Engineering Milestones",
    bg_color: "#0f172a",
    background_theme: "dark_gradient",
    bg_gradient_start: "#0f172a",
    bg_gradient_end: "#1e1b4b",
    text_color: "#ffffff",
    accent_color: "#f59e0b",
    elements: [
      {
        id: "el-title-4",
        type: "text",
        x: 6,
        y: 8,
        width: 88,
        height: 12,
        content: "Strategic Product Roadmap",
        fontSize: 32,
        fontWeight: "700",
        color: "#ffffff",
        align: "left"
      },
      {
        id: "el-roadmap-4",
        type: "roadmap",
        x: 6,
        y: 26,
        width: 88,
        height: 62,
        phases: [
          { phase: "Q1 2026", title: "Core Architecture", status: "COMPLETED", desc: "Multi-agent engine & model routing setup" },
          { phase: "Q2 2026", title: "Enterprise Pilot", status: "IN PROGRESS", desc: "Deploy with top 20 Fortune 500 partners" },
          { phase: "Q3 2026", title: "Autonomous Actions", status: "PLANNED", desc: "Self-healing pipelines & auto-remediation" },
          { phase: "Q4 2026", title: "Global Expansion", status: "PLANNED", desc: "Multi-region low latency deployments" }
        ]
      }
    ],
    notes: "Highlight that Q1 milestones are 100% complete ahead of schedule."
  },
  {
    id: "slide-5",
    layout: "table",
    title: "Platform Feature Matrix",
    subtitle: "Comparative Analysis: Legacy PPT vs Vitya AI Studio",
    bg_color: "#0f172a",
    background_theme: "dark_gradient",
    bg_gradient_start: "#0f172a",
    bg_gradient_end: "#1e1b4b",
    text_color: "#ffffff",
    accent_color: "#ec4899",
    elements: [
      {
        id: "el-title-5",
        type: "text",
        x: 6,
        y: 8,
        width: 88,
        height: 12,
        content: "Platform Feature Matrix",
        fontSize: 32,
        fontWeight: "700",
        color: "#ffffff",
        align: "left"
      },
      {
        id: "el-table-5",
        type: "table",
        x: 6,
        y: 24,
        width: 88,
        height: 64,
        headers: ["Feature Capability", "Legacy PowerPoint", "Canva Design", "Vitya AI Studio"],
        rows: [
          ["AI Slide Generation", "Basic Copilot", "Templates Only", "Instant Multi-Modal AI"],
          ["Contextual Properties", "Fixed Ribbons", "Static Sidebars", "Dynamic Contextual Panel"],
          ["Auto Layout Intelligence", "Manual Drag", "Manual Snapping", "Smart Anti-Overlap Flow"],
          ["Export Quality", "Standard PPTX", "PDF / PNG", "Native PPTX + PDF + Web"]
        ]
      }
    ],
    notes: "Focus on our dynamic contextual panel as the key differentiator over traditional fixed ribbons."
  }
];

export const LAYOUT_OPTIONS = [
  { id: "title_slide", name: "Title Slide", icon: "🎴", desc: "Hero header & subtitle cover" },
  { id: "title_content", name: "Title + Content", icon: "📑", desc: "Header with structured text" },
  { id: "two_column", name: "Two Columns", icon: "⚖️", desc: "Side-by-side comparison" },
  { id: "image", name: "Image Slide", icon: "🖼️", desc: "Visual focused layout" },
  { id: "chart", name: "Chart Slide", icon: "📊", desc: "Data & metrics visualization" },
  { id: "table", name: "Table Slide", icon: "📋", desc: "Structured data matrix" },
  { id: "section", name: "Section Slide", icon: "📌", desc: "Topic break & chapter cover" },
  { id: "blank", name: "Blank Slide", icon: "⬜", desc: "Empty canvas canvas" }
];

export const AI_ACTIONS = [
  { id: "gen_slide", name: "Generate Slide", icon: "✨", desc: "Create complete slide from topic" },
  { id: "gen_section", name: "Generate Section", icon: "🚀", desc: "Add 3-4 structured slides" },
  { id: "improve_content", name: "Improve Content", icon: "💡", desc: "Refine copy & tone" },
  { id: "create_diagram", name: "Create Diagram", icon: "🧠", desc: "Auto-generate visual flowchart" }
];

export const THEME_OPTIONS = [
  { id: "dark_gradient", name: "Midnight Purple", bg: "linear-gradient(135deg, #0f172a, #31104b)", accent: "#c084fc", text: "#ffffff" },
  { id: "ocean_blue", name: "Ocean Breeze", bg: "linear-gradient(135deg, #06101e, #134074)", accent: "#38bdf8", text: "#ffffff" },
  { id: "emerald_dark", name: "Emerald Forest", bg: "linear-gradient(135deg, #022c22, #047857)", accent: "#34d399", text: "#ffffff" },
  { id: "cyberpunk_neon", name: "Cyberpunk Neon", bg: "linear-gradient(135deg, #09090b, #581c87)", accent: "#f43f5e", text: "#ffffff" },
  { id: "wall_street", name: "Wall Street", bg: "linear-gradient(135deg, #022c22, #1e293b)", accent: "#10b981", text: "#ffffff" },
  { id: "executive_gold", name: "Executive Gold", bg: "linear-gradient(135deg, #1c1917, #78350f)", accent: "#fbbf24", text: "#ffffff" },
  { id: "velvet_rose", name: "Velvet Rose", bg: "linear-gradient(135deg, #2a0813, #881337)", accent: "#fb7185", text: "#ffffff" },
  { id: "slate", name: "Slate Charcoal", bg: "linear-gradient(135deg, #18181b, #3f3f46)", accent: "#6366f1", text: "#ffffff" },
  { id: "titanium_white", name: "Titanium White", bg: "linear-gradient(135deg, #ffffff, #f4f4f5)", accent: "#4f46e5", text: "#18181b" },
  { id: "sunset_glow", name: "Sunset Glow", bg: "linear-gradient(135deg, #2e1065, #9f1239)", accent: "#fb7185", text: "#ffffff" },
  { id: "ai", name: "AI Tech Neon", bg: "linear-gradient(135deg, #0f172a, #31104b)", accent: "#c084fc", text: "#f8fafc" },
  { id: "startup", name: "Startup Pitch", bg: "linear-gradient(135deg, #1e1b4b, #7c2d12)", accent: "#f97316", text: "#ffffff" },
  { id: "education", name: "Academic Gold", bg: "linear-gradient(135deg, #fffbeb, #fef3c7)", accent: "#d97706", text: "#451f00" },
  { id: "medical", name: "Healthcare", bg: "linear-gradient(135deg, #fff1f2, #ffe4e6)", accent: "#e11d48", text: "#4c0519" },
  { id: "royal_violet", name: "Royal Violet", bg: "linear-gradient(135deg, #2e1065, #581c87)", accent: "#c084fc", text: "#ffffff" },
  { id: "nordic_frost", name: "Nordic Frost", bg: "linear-gradient(135deg, #082f49, #0c4a6e)", accent: "#38bdf8", text: "#ffffff" },
  { id: "teal_cyan", name: "Teal Cyan", bg: "linear-gradient(135deg, #042f2e, #134e4a)", accent: "#2dd4bf", text: "#ffffff" },
  { id: "monochrome_black", name: "Monochrome Black", bg: "linear-gradient(135deg, #000000, #0f172a)", accent: "#e2e8f0", text: "#ffffff" }
];

export const SHAPE_OPTIONS = [
  { id: "rectangle", name: "Rectangle", icon: "▭" },
  { id: "rounded_rectangle", name: "Rounded Rect", icon: "▢" },
  { id: "circle", name: "Circle", icon: "◯" },
  { id: "triangle", name: "Triangle", icon: "△" },
  { id: "arrow", name: "Arrow", icon: "➔" },
  { id: "line", name: "Line", icon: "―" }
];

export const CHART_TYPES = [
  { id: "bar", name: "Bar Chart" },
  { id: "line", name: "Line Chart" },
  { id: "pie", name: "Pie Chart" },
  { id: "donut", name: "Donut Chart" },
  { id: "area", name: "Area Chart" },
  { id: "radar", name: "Radar / Spider Chart" }
];
