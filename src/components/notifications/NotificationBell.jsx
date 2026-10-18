import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notificationApi, registerServiceWorker } from "../../services/notificationService";
import "./NotificationBell.css";

const NOTIF_ICONS = {
  presentation_ready: "🎨",
  receipt_scanned: "🧾",
  task_reminder: "⏰",
  security_alert: "🛡️",
  ai_completed: "🤖",
  system: "🔔",
};

export default function NotificationBell({ onNavigateToSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 1. Initial service worker registration
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // 2. Fetch unread count & periodic poll
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // Ignore background poll errors
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        fetchUnreadCount();
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // 3. Fetch notifications list when opening dropdown
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationApi.getNotifications({ limit: 15 });
      setNotifications(data.items || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.warn("Could not load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleDropdown = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      loadNotifications();
    }
  };

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // 4. Mark single notification as read with optimistic update
  const handleItemClick = async (notif) => {
    if (!notif.read_at) {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await notificationApi.markAsRead(notif.id);
      } catch (err) {
        // Rollback
        loadNotifications();
      }
    }

    setIsOpen(false);

    // Navigate to notification target
    const targetUrl = notif.data?.url || notif.data?.action_url;
    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  // 5. Mark all as read with optimistic update
  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    const previous = [...notifications];
    const prevCount = unreadCount;

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
    setUnreadCount(0);

    try {
      await notificationApi.markAllAsRead();
    } catch (err) {
      setNotifications(previous);
      setUnreadCount(prevCount);
    }
  };

  // 6. Delete notification
  const handleDelete = async (e, notifId) => {
    e.stopPropagation();
    const target = notifications.find((n) => n.id === notifId);
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    if (target && !target.read_at) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await notificationApi.deleteNotification(notifId);
    } catch (err) {
      loadNotifications();
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const sec = Math.floor((now - date) / 1000);
    if (sec < 60) return "just now";
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    return `${day}d ago`;
  };

  return (
    <div className="notif-bell-container" ref={dropdownRef}>
      <button
        className="notif-bell-btn"
        onClick={toggleDropdown}
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="notif-bell-badge" aria-label={`${unreadCount} unread notifications`}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown" role="region" aria-label="Notifications Dropdown">
          <div className="notif-header">
            <div className="notif-header-title">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span style={{ fontSize: "11px", color: "#818cf8" }}>({unreadCount} new)</span>
              )}
            </div>
            <div className="notif-header-actions">
              {unreadCount > 0 && (
                <button
                  className="notif-action-btn"
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                >
                  <Check size={12} style={{ display: "inline", marginRight: 3 }} />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="notif-list">
            {loading ? (
              <div className="notif-empty">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔔</div>
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => {
                const icon = NOTIF_ICONS[notif.type] || "🔔";
                const isUnread = !notif.read_at;
                return (
                  <div
                    key={notif.id}
                    className={`notif-item ${isUnread ? "unread" : ""}`}
                    onClick={() => handleItemClick(notif)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleItemClick(notif)}
                  >
                    <div className="notif-icon-box" aria-hidden="true">
                      {icon}
                    </div>
                    <div className="notif-content">
                      <div className="notif-title-row">
                        <span className="notif-title">{notif.title}</span>
                        <span className="notif-time">{formatTimeAgo(notif.created_at)}</span>
                      </div>
                      <p className="notif-body">{notif.body}</p>
                    </div>
                    <button
                      className="notif-delete-btn"
                      onClick={(e) => handleDelete(e, notif.id)}
                      title="Delete notification"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="notif-footer">
            <span
              className="notif-footer-link"
              onClick={() => {
                setIsOpen(false);
                if (onNavigateToSettings) {
                  onNavigateToSettings();
                } else {
                  navigate("/settings/notifications");
                }
              }}
            >
              Notification Settings & Push →
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
