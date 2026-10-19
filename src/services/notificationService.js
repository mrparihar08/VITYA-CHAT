import { api } from "./api";

/**
 * Converts URL-safe base64 string to Uint8Array for PushManager subscription.
 */
export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const notificationApi = {
  // 1. Notifications List
  getNotifications: async ({ cursor = null, limit = 20, unreadOnly = false } = {}) => {
    const params = { limit, unread_only: unreadOnly };
    if (cursor) params.cursor = cursor;
    const res = await api.get("/api/v1/notifications", { params });
    return res.data;
  },

  // 2. Unread Count
  getUnreadCount: async () => {
    const res = await api.get("/api/v1/notifications/unread-count");
    return res.data?.unread_count || 0;
  },

  // 3. Mark Single Read
  markAsRead: async (notificationId) => {
    const res = await api.patch(`/api/v1/notifications/${notificationId}/read`);
    return res.data;
  },

  // 4. Mark All Read
  markAllAsRead: async () => {
    const res = await api.post("/api/v1/notifications/read-all");
    return res.data;
  },

  // 5. Delete Notification
  deleteNotification: async (notificationId) => {
    await api.delete(`/api/v1/notifications/${notificationId}`);
    return true;
  },

  // 6. VAPID Public Key
  getVapidPublicKey: async () => {
    const res = await api.get("/api/v1/push/public-key");
    return res.data?.public_key || "";
  },

  // 7. Subscribe to Push Backend
  subscribePush: async (subscription, deviceName = null) => {
    const key = subscription.getKey ? subscription.getKey("p256dh") : null;
    const auth = subscription.getKey ? subscription.getKey("auth") : null;

    const p256dhStr = key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : "";
    const authStr = auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : "";

    const payload = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: p256dhStr,
        auth: authStr,
      },
      device_name: deviceName || navigator.userAgent.substring(0, 80),
    };

    const res = await api.post("/api/v1/push/subscribe", payload);
    return res.data;
  },

  // 8. Unsubscribe Push Backend
  unsubscribePush: async (endpoint) => {
    const res = await api.delete("/api/v1/push/subscribe", { data: { endpoint } });
    return res.data;
  },

  // 9. Preferences
  getPreferences: async () => {
    const res = await api.get("/api/v1/notification-preferences");
    return res.data;
  },

  updatePreferences: async (preferences) => {
    const res = await api.patch("/api/v1/notification-preferences", preferences);
    return res.data;
  },

  // 10. Send Test Notification
  sendTestPush: async ({ title, body } = {}) => {
    const res = await api.post("/api/v1/notifications/test-send", { title, body });
    return res.data;
  },
};

/**
 * Register Service Worker in browser
 */
export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js", {
      scope: "/",
    });
    return registration;
  } catch (err) {
    console.error("Service Worker registration failed:", err);
    return null;
  }
}

/**
 * Get active PushSubscription from browser
 */
export async function getExistingPushSubscription() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    return await reg.pushManager.getSubscription();
  } catch (err) {
    return null;
  }
}

/**
 * Request notification permission and subscribe to PushManager
 */
export async function subscribeToPushNotifications() {
  if (typeof window === "undefined" || !("Notification" in window) || !("PushManager" in window)) {
    throw new Error("Web Push is not supported by your browser");
  }

  // 1. Request Permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(`Notification permission ${permission}`);
  }

  // 2. Register Service Worker
  const reg = await registerServiceWorker();
  if (!reg) throw new Error("Could not register service worker");

  // 3. Fetch VAPID Public Key from Backend (with fallback)
  let vapidPublicKey = "";
  try {
    vapidPublicKey = await notificationApi.getVapidPublicKey();
  } catch (err) {
    console.warn("Failed to fetch VAPID key from backend, using fallback:", err);
  }
  if (!vapidPublicKey) {
    vapidPublicKey = "BK0JaC7kPGJ-29eQUTkpO3nV_mSBjGKMl53qAZMh1eoCYYk9o78Hn5F9ErJx5CK9AQNYiMR2_ZkDeJLwjLPyw6g";
  }

  // 4. Subscribe with PushManager
  const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  // 5. Send subscription to Backend
  await notificationApi.subscribePush(subscription);
  return subscription;
}

/**
 * Unsubscribe from push notifications in browser and backend
 */
export async function unsubscribeFromPushNotifications() {
  const subscription = await getExistingPushSubscription();
  if (subscription) {
    try {
      await notificationApi.unsubscribePush(subscription.endpoint);
    } catch (e) {
      console.warn("Failed to notify backend of unsubscription:", e);
    }
    await subscription.unsubscribe();
  }
  return true;
}
