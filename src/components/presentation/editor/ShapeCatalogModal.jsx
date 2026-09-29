import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Shapes } from "lucide-react";
import { getShapesCatalog } from "../../../services/api";

export default function ShapeCatalogModal({ isOpen, onClose, onAddShape }) {
  const [catalog, setCatalog] = useState(null);
  const [activeCategory, setActiveCategory] = useState("basic_shapes");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !catalog) {
      setIsLoading(true);
      getShapesCatalog().then((data) => {
        if (data && Array.isArray(data.categories)) {
          setCatalog(data);
        }
        setIsLoading(false);
      });
    }
  }, [isOpen, catalog]);

  if (!isOpen) return null;

  const defaultCategories = [
    {
      id: "basic_shapes",
      name: "Basic Shapes",
      shapes: [
        { id: "rectangle", name: "Rectangle" },
        { id: "rounded_rectangle", name: "Rounded Rectangle" },
        { id: "circle", name: "Circle" },
        { id: "oval", name: "Oval" },
        { id: "triangle", name: "Triangle" },
        { id: "diamond", name: "Diamond" },
        { id: "pentagon", name: "Pentagon" },
        { id: "hexagon", name: "Hexagon" },
        { id: "octagon", name: "Octagon" },
        { id: "star", name: "Star" },
        { id: "heart", name: "Heart" },
      ],
    },
    {
      id: "lines_connectors",
      name: "Lines & Connectors",
      shapes: [
        { id: "line", name: "Line" },
        { id: "arrow", name: "Arrow" },
        { id: "double_arrow", name: "Double Arrow" },
        { id: "elbow_connector", name: "Elbow Connector" },
        { id: "curved_connector", name: "Curved Connector" },
      ],
    },
    {
      id: "flowchart",
      name: "Flowchart & Diagrams",
      shapes: [
        { id: "process", name: "Process Block" },
        { id: "decision", name: "Decision Diamond" },
        { id: "data", name: "Data (I/O)" },
        { id: "document", name: "Document Node" },
        { id: "database", name: "Database Cylinder" },
        { id: "start_end", name: "Terminator (Start/End)" },
      ],
    },
    {
      id: "callouts",
      name: "Callouts & Speech",
      shapes: [
        { id: "speech_bubble", name: "Speech Bubble" },
        { id: "cloud_callout", name: "Cloud Callout" },
        { id: "rectangular_callout", name: "Rectangular Callout" },
        { id: "rounded_callout", name: "Rounded Callout" },
      ],
    },
  ];

  const categories = catalog?.categories || defaultCategories;
  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];

  const handleSelectShape = (shape) => {
    onAddShape?.({
      shape_type: shape.id,
      name: shape.name,
      fill_color: catalog?.default_style?.fill || "#3B82F6",
      stroke_color: catalog?.default_style?.stroke || "#1E40AF",
      stroke_width: catalog?.default_style?.stroke_width || 2,
      text: shape.name,
    });
    onClose();
  };

  const modalJSX = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: "rgba(9, 13, 26, 0.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#0f172a",
          border: "1px solid rgba(192, 132, 252, 0.3)",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(139, 92, 246, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Shapes size={20} style={{ color: "#38bdf8" }} />
            <div>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
                Shapes & Diagram Library
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#94a3b8" }}>
                Insert geometric shapes, flowchart nodes, connectors, and callouts into your slide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* CATEGORIES TABS */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            padding: "12px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            overflowX: "auto",
          }}
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.04)",
                  border: isActive ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                  color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* SHAPES GRID */}
        <div style={{ padding: "20px 22px", minHeight: "260px", maxHeight: "400px", overflowY: "auto" }}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
              <div className="spinner-sm" style={{ margin: "0 auto 10px" }} />
              Loading shapes catalog...
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px" }}>
              {currentCategory?.shapes?.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => handleSelectShape(shape)}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    padding: "16px 10px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.2s ease",
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(56, 189, 248, 0.15)";
                    e.currentTarget.style.borderColor = "#38bdf8";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "32px",
                      borderRadius: shape.id.includes("rounded") ? "8px" : shape.id === "circle" ? "50%" : "3px",
                      background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                      border: "1.5px solid #60a5fa",
                      boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    ✦
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 600, textAlign: "center", color: "#e2e8f0" }}>
                    {shape.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalJSX, document.body) : modalJSX;
}
