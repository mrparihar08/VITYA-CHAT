import React, { useState } from "react";
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  BarChart2, 
  Table as TableIcon, 
  Network, 
  ChevronUp, 
  FileText, 
  TrendingUp, 
  Lightbulb,
  LayoutGrid,
  Scale,
  Code,
  UserCheck,
  Columns
} from "lucide-react";

export default function BottomToolbar({ onAddElement }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <div className="ppt-bottom-toolbar">
      <div className="toolbar-buttons-row">
        <button 
          className="insert-btn"
          onClick={() => onAddElement("text", { content: "New Text Box", fontSize: 24 })}
          title="Add Text Box"
        >
          <Type size={14} />
          <span>Text</span>
        </button>

        <button 
          className="insert-btn"
          onClick={() => onAddElement("image")}
          title="Add Image Element"
        >
          <ImageIcon size={14} />
          <span>Image</span>
        </button>

        <button 
          className="insert-btn"
          onClick={() => onAddElement("chart", { chart_type: "bar" })}
          title="Add Chart Element"
        >
          <BarChart2 size={14} />
          <span>Chart</span>
        </button>

        <button 
          className="insert-btn"
          onClick={() => onAddElement("table")}
          title="Add Data Table"
        >
          <TableIcon size={14} />
          <span>Table</span>
        </button>

        <button 
          className="insert-btn"
          onClick={() => onAddElement("roadmap")}
          title="Add Process Diagram"
        >
          <Network size={14} />
          <span>Diagram</span>
        </button>

        {/* MORE FEATURES DROPDOWN */}
        <div className="more-toolbar-wrapper">
          <button 
            className="insert-btn more-btn"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            title="More Feature Elements"
          >
            <span>More Features</span>
            <ChevronUp size={13} className={showMoreMenu ? "rotate-180" : ""} />
          </button>

          {showMoreMenu && (
            <div className="toolbar-more-menu">
              <button onClick={() => { setShowMoreMenu(false); onAddElement("callout"); }}>
                <Lightbulb size={14} style={{ color: "#c084fc" }} />
                <span>Callout Insight</span>
              </button>

              <button onClick={() => { setShowMoreMenu(false); onAddElement("kpi_grid"); }}>
                <LayoutGrid size={14} style={{ color: "#38bdf8" }} />
                <span>KPI Grid</span>
              </button>

              <button onClick={() => { setShowMoreMenu(false); onAddElement("stat"); }}>
                <TrendingUp size={14} style={{ color: "#10b981" }} />
                <span>Big Metric Stat</span>
              </button>

              <button onClick={() => { setShowMoreMenu(false); onAddElement("bullets"); }}>
                <FileText size={14} />
                <span>Bullets List</span>
              </button>

              <button onClick={() => { setShowMoreMenu(false); onAddElement("pros_cons"); }}>
                <Scale size={14} style={{ color: "#4ade80" }} />
                <span>Pros & Cons Analysis</span>
              </button>

              <button onClick={() => { setShowMoreMenu(false); onAddElement("code_block"); }}>
                <Code size={14} style={{ color: "#38bdf8" }} />
                <span>Code Block Snippet</span>
              </button>

              <button onClick={() => { setShowMoreMenu(false); onAddElement("speaker_card"); }}>
                <UserCheck size={14} style={{ color: "#c084fc" }} />
                <span>Speaker Profile Card</span>
              </button>

              <button onClick={() => { setShowMoreMenu(false); onAddElement("paragraph_2col"); }}>
                <Columns size={14} />
                <span>2-Column Narrative</span>
              </button>

              <button onClick={() => { setShowMoreMenu(false); onAddElement("shape", { shape_type: "rounded_rectangle" }); }}>
                <Square size={14} />
                <span>Shape Element</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

