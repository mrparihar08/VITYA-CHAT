import axios from "axios";

const getApiBaseUrl = () => {
  const viteUrl =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL;

  const craUrl =
    typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_URL;

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

export default api;
