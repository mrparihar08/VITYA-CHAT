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

  const fallback =
    typeof process !== "undefined" && process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://mother-8599.onrender.com";
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

export const synthesizeVoiceover = async ({ text, language = "en-US", voice = null, slide_index = 0 }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentation/voiceover/synthesize`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ text, language, voice, slide_index }),
    });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("synthesizeVoiceover error", err);
    throw err;
  }
};

export const getUserPresentations = async (limit = 50) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentation/my-presentations?limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("getUserPresentations error", err);
    return { status: "error", presentations: [] };
  }
};

export const deleteUserPresentation = async (presentationId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentation/${presentationId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("deleteUserPresentation error", err);
    throw err;
  }
};

export const getShapesCatalog = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentation/shapes/catalog`, {
      headers: getAuthHeaders(),
    });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("getShapesCatalog error", err);
    return null;
  }
};

export const getUnsplashPhotos = async (query, perPage = 9) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentation/unsplash/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
      headers: getAuthHeaders(),
    });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("getUnsplashPhotos error", err);
    return null;
  }
};

export const searchPresentationImages = async ({ query, provider = null, page = 1, pageSize = 20, visualType = null }) => {
  try {
    let url = `${API_BASE_URL}/api/presentation/images/search?query=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`;
    if (provider) url += `&provider=${encodeURIComponent(provider)}`;
    if (visualType) url += `&visual_type=${encodeURIComponent(visualType)}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("searchPresentationImages error", err);
    return { status: "error", results: [] };
  }
};

export const suggestPresentationImages = async ({ presentation_topic, slide_title = "", slide_content = "", visual_type = null, slide_index = 0, used_urls = [] }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentation/images/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ presentation_topic, slide_title, slide_content, visual_type, slide_index, used_urls }),
    });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("suggestPresentationImages error", err);
    return { query: "", visual_type: "photo", suggested_images: [] };
  }
};

export const getTemplatesCatalog = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentation/templates`, {
      headers: getAuthHeaders(),
    });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("getTemplatesCatalog error", err);
    return { status: "error", templates: [] };
  }
};

export const generateAiPresentationImage = async ({ prompt, style = "Professional", aspect_ratio = "16:9", topic = "", slide_title = "" }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/presentation/ai-image/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ prompt, style, aspect_ratio, topic, slide_title }),
    });
    return await safeFetchJSON(res);
  } catch (err) {
    console.warn("generateAiPresentationImage error", err);
    throw err;
  }
};


// ================= SAVINGS GOALS API =================
export const getSavingsGoals = async () => {
  const res = await api.get("/api/savings");
  return res.data;
};

export const createSavingsGoal = async (data) => {
  const res = await api.post("/api/savings", data);
  return res.data;
};

export const updateSavingsGoal = async (id, data) => {
  const res = await api.put(`/api/savings/${id}`, data);
  return res.data;
};

export const deleteSavingsGoal = async (id) => {
  const res = await api.delete(`/api/savings/${id}`);
  return res.data;
};

export const depositToSavingsGoal = async (id, amount) => {
  const res = await api.post(`/api/savings/${id}/deposit`, { amount });
  return res.data;
};

// ================= RECURRING SUBSCRIPTIONS API =================
export const getSubscriptions = async () => {
  const res = await api.get("/api/subscriptions");
  return res.data;
};

export const getSubscriptionSummary = async () => {
  const res = await api.get("/api/subscriptions/summary");
  return res.data;
};

export const createSubscription = async (data) => {
  const res = await api.post("/api/subscriptions", data);
  return res.data;
};

export const updateSubscription = async (id, data) => {
  const res = await api.put(`/api/subscriptions/${id}`, data);
  return res.data;
};

export const deleteSubscription = async (id) => {
  const res = await api.delete(`/api/subscriptions/${id}`);
  return res.data;
};

// ================= AI FINANCIAL HEALTH & SUMMARY API =================
export const getFinancialHealthScore = async () => {
  const res = await api.get("/api/ai/health-score");
  return res.data;
};

export const getFinancialExecutiveSummary = async () => {
  const res = await api.get("/api/ai/executive-summary");
  return res.data;
};

// ================= INCOME & EXPENSE MANAGEMENT API =================
export const getIncomes = async () => {
  const res = await api.get("/api/income/");
  return res.data;
};

export const createIncome = async (data) => {
  const res = await api.post("/api/income/", data);
  return res.data;
};

export const updateIncome = async (id, data) => {
  const res = await api.put(`/api/income/${id}`, data);
  return res.data;
};

export const deleteIncome = async (id) => {
  const res = await api.delete(`/api/income/${id}`);
  return res.data;
};

export const getExpenses = async () => {
  const res = await api.get("/api/expense/");
  return res.data;
};

export const createExpense = async (data) => {
  const res = await api.post("/api/expense/", data);
  return res.data;
};

export const updateExpense = async (id, data) => {
  const res = await api.put(`/api/expense/${id}`, data);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await api.delete(`/api/expense/${id}`);
  return res.data;
};

// ================= FINANCIAL TELEMETRY & CHARTS API =================
export const getFinancialOverview = async () => {
  const res = await api.get("/api/vitya/financial_overview");
  return res.data;
};

export const getExpenseGraph = async () => {
  const res = await api.get("/api/vitya/graph");
  return res.data;
};

export const getExpenseIncomeTrend = async () => {
  const res = await api.get("/api/vitya/expense_income_trend");
  return res.data;
};

export const getExpensesChart = async () => {
  const res = await api.get("/api/vitya/expenses_chart");
  return res.data;
};

export const getRecentTransactions = async () => {
  const res = await api.get("/api/vitya/transactions/recent");
  return res.data;
};

// ================= AI PREDICTIVE & ADVISORY API =================
export const getExpensePrediction = async (category) => {
  const res = await api.get(`/api/ai/predict/${encodeURIComponent(category)}`);
  return res.data;
};

export const getSpendingWasteAnalysis = async () => {
  const res = await api.get("/api/ai/waste-analysis");
  return res.data;
};

export const getFinancialAdvisor = async (category) => {
  const res = await api.get(`/api/ai/advisor/${encodeURIComponent(category)}`);
  return res.data;
};

export const getBudgetCaps = async () => {
  const res = await api.get("/api/ai/budget-cap");
  return res.data;
};

export const createOrUpdateBudgetCap = async (data) => {
  const res = await api.post("/api/ai/budget-cap", data);
  return res.data;
};

export const getBudgetAlerts = async () => {
  const res = await api.get("/api/ai/budget-alerts");
  return res.data;
};

// ================= SETTINGS, SUPPORT & EXPORT API =================
export const getUserSettings = async () => {
  const res = await api.get("/api/settings/");
  return res.data;
};

export const updateUserSettings = async (data) => {
  const res = await api.put("/api/settings/", data);
  return res.data;
};

export const submitSupportTicket = async (data) => {
  const res = await api.post("/api/users/support", data);
  return res.data;
};

export const exportUserData = async () => {
  const res = await api.get("/api/users/export-data");
  return res.data;
};

// ================= DORA MEDICAL INTELLIGENCE API =================
export const getDoraInfo = async () => {
  const res = await api.get("/api/dora/");
  return res.data;
};

export const getDoraSymptoms = async (query = "") => {
  const url = query ? `/api/dora/symptoms?query=${encodeURIComponent(query)}` : "/api/dora/symptoms";
  const res = await api.get(url);
  return res.data;
};

export const getDoraDiseases = async () => {
  const res = await api.get("/api/dora/diseases");
  return res.data;
};

export const predictDoraDisease = async (payload, topK = 5) => {
  const res = await api.post(`/api/dora/predict?top_k=${topK}`, payload);
  return res.data;
};

export const sendDoraChat = async (payload) => {
  const res = await api.post("/api/dora/chat", payload);
  return res.data;
};

export const calculateDoraHealthAssessment = async (payload) => {
  const res = await api.post("/api/dora/health-assessment", payload);
  return res.data;
};

// ================= CHAT & MULTIMODAL RECEIPT API =================
export const scanReceiptImage = async (file, autoSave = true, conversationId = null) => {
  const formData = new FormData();
  formData.append("file", file);
  let url = `/api/chat/receipt?auto_save=${autoSave}`;
  if (conversationId) url += `&conversation_id=${conversationId}`;

  const res = await api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const sendChatMessage = async ({ message, conversation_id = null, use_web_search = false, mode = null, requestType = null }) => {
  const res = await api.post("/api/chat/", {
    message,
    conversation_id,
    use_web_search,
    mode,
    requestType,
  });
  return res.data;
};

export const getChatHistory = async (conversationId = null, limit = 100, offset = 0) => {
  let url = `/api/chat/history?limit=${limit}&offset=${offset}`;
  if (conversationId) url += `&conversation_id=${conversationId}`;
  const res = await api.get(url);
  return res.data;
};

export const getConversations = async (limit = 50) => {
  const res = await api.get(`/api/chat/conversations?limit=${limit}`);
  return res.data;
};

export const createNewConversation = async () => {
  const res = await api.post("/api/chat/new");
  return res.data;
};

export const deleteConversation = async (conversationId) => {
  const res = await api.delete(`/api/chat/conversation/${conversationId}`);
  return res.data;
};

export const clearChatHistory = async () => {
  const res = await api.delete("/api/chat/history");
  return res.data;
};

export default api;


