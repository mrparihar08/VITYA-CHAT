import React from "react";
import { 
  Sparkles, 
  Edit3, 
  Minimize2, 
  Maximize2, 
  Image as ImageIcon, 
  Activity, 
  BarChart2, 
  MessageSquare, 
  Globe, 
  CheckCircle2 
} from "lucide-react";

export default function AICommandMenu({ isOpen, onClose, onSelectAction }) {
  if (!isOpen) return null;

  const actions = [
    { id: "improve_slide", label: "Improve Slide", icon: <Sparkles size={14} className="text-purple-400" />, desc: "Auto-enhance slide layout & wording" },
    { id: "rewrite", label: "Rewrite Text", icon: <Edit3 size={14} className="text-blue-400" />, desc: "Rephrase for clarity & impact" },
    { id: "shorten", label: "Shorten Content", icon: <Minimize2 size={14} className="text-amber-400" />, desc: "Make text punchy & concise" },
    { id: "expand", label: "Expand Content", icon: <Maximize2 size={14} className="text-emerald-400" />, desc: "Elaborate with detailed bullet points" },
    { id: "generate_image", label: "Generate Image", icon: <ImageIcon size={14} className="text-pink-400" />, desc: "Create visual illustration using AI" },
    { id: "create_diagram", label: "Create Diagram", icon: <Activity size={14} className="text-indigo-400" />, desc: "Convert text into process/flow chart" },
    { id: "create_chart", label: "Create Chart", icon: <BarChart2 size={14} className="text-cyan-400" />, desc: "Generate data visualization chart" },
    { id: "change_tone", label: "Change Tone", icon: <MessageSquare size={14} className="text-violet-400" />, desc: "Professional, Persuasive, or Executive" },
    { id: "translate", label: "Translate", icon: <Globe size={14} className="text-sky-400" />, desc: "Translate slide into another language" },
    { id: "fix_layout", label: "Fix Layout & Alignment", icon: <CheckCircle2 size={14} className="text-teal-400" />, desc: "Align elements & balance spacing" }
  ];

  return (
    <div className="ai-command-menu-overlay" onClick={onClose}>
      <div className="ai-command-menu-dropdown" onClick={(e) => e.stopPropagation()}>
        <div className="menu-header">
          <Sparkles size={15} style={{ color: "#c084fc" }} />
          <span>AI COMMAND MENU</span>
        </div>
        <div className="menu-items-scroll">
          {actions.map((act) => (
            <button
              key={act.id}
              className="ai-menu-item"
              onClick={() => {
                onSelectAction?.(act.id);
                onClose();
              }}
            >
              <span className="item-icon">{act.icon}</span>
              <div className="item-text-wrap">
                <span className="item-label">{act.label}</span>
                <span className="item-desc">{act.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
