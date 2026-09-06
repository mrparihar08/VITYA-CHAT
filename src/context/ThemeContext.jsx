import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export const THEME_PRESETS = {
  dark: {
    id: "dark",
    name: "Vitya Dark (Default)",
    desc: "Deep violet gradients with glowing accents.",
    accent: "#8b5cf6",
    accentGradient: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Blue",
    desc: "Calm sapphire & navy tones for late-night viewing.",
    accent: "#3b82f6",
    accentGradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  },
  cyber: {
    id: "cyber",
    name: "Cyber Violet",
    desc: "Vibrant neon fuchsia accents on deep obsidian.",
    accent: "#d946ef",
    accentGradient: "linear-gradient(135deg, #d946ef 0%, #a855f7 100%)",
  },
  obsidian: {
    id: "obsidian",
    name: "Obsidian Minimal",
    desc: "Stealth black theme with emerald highlights.",
    accent: "#10b981",
    accentGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("vitya_theme") || "dark";
  });

  const applyThemeToDocument = useCallback((themeId) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", themeId);
    }
  }, []);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme, applyThemeToDocument]);

  const setTheme = useCallback((newTheme) => {
    if (THEME_PRESETS[newTheme]) {
      setThemeState(newTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem("vitya_theme", newTheme);
      }
      applyThemeToDocument(newTheme);
    }
  }, [applyThemeToDocument]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, presets: THEME_PRESETS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
