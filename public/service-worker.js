/**
 * Vitya AI - Production Web Push Service Worker
 * Handles background push notifications, click navigation, and focus events.
 */

/* eslint-disable no-restricted-globals */

self.addEventListener("install", (event) => {
  // Activate new worker immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Claim all active clients
  event.waitUntil(self.clients.claim());
});

/**
 * Handle incoming Web Push message
 */
self.addEventListener("push", (event) => {
  let payload = {};

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      // Fallback for plain text payloads
      payload = {
        title: "Vitya AI Notification",
        body: event.data.text() || "You have a new notification.",
      };
    }
  } else {
    payload = {
      title: "Vitya AI Notification",
      body: "You have a new notification.",
    };
  }

  const title = payload.title || "Vitya AI Notification";
  const body = payload.body || "New update available in your workspace.";
  const icon = payload.icon || "/logo192.png";
  const badge = payload.badge || "/favicon.ico";
  const data = payload.data || {};

  const options = {
    body: body,
    icon: icon,
    badge: badge,
    vibrate: [100, 50, 100],
    data: data,
    tag: data.notification_id || `vitya-notif-${Date.now()}`,
    renotify: true,
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Handle notification clicks: navigate securely to allowed same-origin path
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let targetUrl = data.url || "/dashboard";

  // Security: Prevent external redirects, enforce same-origin path
  try {
    const parsed = new URL(targetUrl, self.location.origin);
    if (parsed.origin !== self.location.origin) {
      targetUrl = "/dashboard";
    } else {
      targetUrl = parsed.pathname + parsed.search + parsed.hash;
    }
  } catch (err) {
    targetUrl = "/dashboard";
  }

  const fullDestination = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus and navigate it
      for (const client of clientList) {
        if ("focus" in client) {
          if ("navigate" in client) {
            client.navigate(fullDestination);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(fullDestination);
      }
    })
  );
});

/**
 * Handle notification dismissal
 */
self.addEventListener("notificationclose", (event) => {
  // Can be used for analytics or telemetry if needed
});
