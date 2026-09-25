import axios from "axios";

const getApiBaseUrl = () => {
  const viteUrl =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL;

  const craUrl =
    typeof process !== "undefined" &&
    process.env &&
    (process.env.REACT_APP_API_URL || process.env.REACT_APP_VITYA_API_URL);

  const fallback = "https://mother-8599.onrender.com";
  const url = viteUrl || craUrl || fallback;

  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1200000,
});

// Automatic JWT Token Attachment
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatic 401 Token Expiry Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      const isAuthRoute =
        window.location.pathname.startsWith("/login") ||
        window.location.pathname.startsWith("/register") ||
        window.location.pathname.startsWith("/forgot-password") ||
        window.location.pathname.startsWith("/reset-password");

      if (!isAuthRoute) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const getAuthHeaders = (token) => {
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

export const resolveAssetUrl = (path) => {
  if (!path) return "/profile.png";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const handleApiError = (err) => {
  const status = err?.response?.status;
  const data = err?.response?.data;

  if (status === 429) {
    return (
      (typeof data === "object" && (data?.error || data?.detail)) ||
      "Too many requests. Please slow down and try again later."
    );
  }

  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return `Server error (${status}). Please try again later.`;
  }

  if (typeof data === "string" && data.trim().startsWith("<")) {
    return `Unexpected server error (${status || "Network"}).`;
  }

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item) => item?.msg || item?.message || "Validation error")
      .join(", ");
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;

  return err?.message || "An unexpected error occurred.";
};

export const safeFetchJSON = async (res) => {
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    if (contentType.includes("application/json")) {
      const data = await res.json();
      throw new Error(data.detail || data.error || data.message || `HTTP Error ${res.status}`);
    }
    await res.text();
    throw new Error(`Server returned status ${res.status}`);
  }

  if (contentType.includes("application/json")) {
    return await res.json();
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
};

export const refineSlideText = async ({ text, action = "polish", slide_title = "", presentation_title = "" }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentation/refine-slide`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ text, action, slide_title, presentation_title }),
    });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("refineSlideText error, using local fallback", err);
    return { refined_text: text };
  }
};

export default api;
