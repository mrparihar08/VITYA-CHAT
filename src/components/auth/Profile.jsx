import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  api,
  fetchProfile,
  saveUserToStorage,
  resolveAssetUrl,
  handleApiError,
  PageShell,
  styles,
} from "./AuthCommon";

export function Profile({ insideDashboard = false }) {
  const { token, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchProfile(token);
        setProfile(data);
        saveUserToStorage(data);
        updateUser(data);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401) {
          alert("Session expired, please login again!");
          logout();
          navigate("/login");
        } else {
          alert(handleApiError(err));
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, navigate, logout, updateUser]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const payload = new FormData();
      payload.append("profile_pic", file);

      const res = await api.put("/api/users/profile/edit", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = res?.data?.user || null;
      if (updated) {
        setProfile(updated);
        saveUserToStorage(updated);
        updateUser(updated);
        alert("Profile picture updated successfully!");
      }
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <PageShell
        title="Your Profile"
        subtitle="View and manage your account details."
        headerExtra={
          <button
            className="vitya-settings-btn"
            onClick={() => navigate("/apps/settings")}
            title="Settings"
          >
            ⚙️
          </button>
        }
        titleExtra={<div className="pro-badge">👑 Pro User</div>}
      >
        <div style={styles.loadingBlock}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>Loading profile…</div>
        </div>
      </PageShell>
    );
  }

  const name = profile?.name || "Pradeep Parihar";
  const username = profile?.username || "pradeep08";
  const email = profile?.email || "pradeep0810parihar@gmail.com";
  const bio = profile?.bio || "I am the founder of this app.";
  const initial = (name || username || "P").charAt(0).toUpperCase();

  const formattedJoined = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Aug 2025";

  const accountType = profile?.role || "Founder";
  const status = "Active";

  const menuItems = [
    {
      id: "account",
      icon: "👤",
      bg: "rgba(59, 130, 246, 0.15)",
      title: "Account Settings",
      sub: "Manage your personal information",
      action: () => navigate("/profile/edit"),
    },
    {
      id: "security",
      icon: "🛡️",
      bg: "rgba(16, 185, 129, 0.15)",
      title: "Security & Privacy",
      sub: "Password, 2FA, data control",
      action: () => navigate("/settings/security"),
    },
    {
      id: "subscription",
      icon: "👑",
      bg: "rgba(245, 158, 11, 0.15)",
      title: "Subscription",
      sub: "Manage your plan and billing",
      action: () => navigate("/settings/subscription"),
    },
    {
      id: "notifications",
      icon: "🔔",
      bg: "rgba(239, 68, 68, 0.15)",
      title: "Notifications",
      sub: "Manage alerts and updates",
      action: () => navigate("/settings/notifications"),
    },
    {
      id: "appearance",
      icon: "🎨",
      bg: "rgba(168, 85, 247, 0.15)",
      title: "Appearance",
      sub: "Theme, language, display",
      action: () => navigate("/settings/appearance"),
    },
    {
      id: "help",
      icon: "❓",
      bg: "rgba(16, 185, 129, 0.15)",
      title: "Help & Support",
      sub: "FAQs, AI support & contact",
      action: () => navigate("/settings/help"),
    },
    {
      id: "about",
      icon: "ℹ️",
      bg: "rgba(14, 165, 233, 0.15)",
      title: "About Vitya.AI",
      sub: "Version, release notes & legal",
      action: () => navigate("/settings/about"),
    },
  ];

  return (
    <PageShell
      title="Your Profile"
      subtitle="View and manage your account details."
      hideBrandRow={insideDashboard}
      wide={true}
      plain={insideDashboard}
      headerExtra={
        !insideDashboard ? (
          <button
            className="vitya-settings-btn"
            onClick={() => navigate("/apps/settings")}
            title="Settings"
          >
            ⚙️
          </button>
        ) : null
      }
      titleExtra={<div className="pro-badge">👑 Pro User</div>}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* MAIN USER PROFILE CARD */}
      <div className="vitya-profile-card">
        <div className="vitya-user-header">
          <div className="vitya-main-avatar-wrapper">
            <div className="vitya-avatar-box">
              {profile?.profile_pic ? (
                <img
                  src={resolveAssetUrl(profile.profile_pic)}
                  alt={name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <button
              type="button"
              className="vitya-camera-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Update profile picture"
              disabled={uploadingPhoto}
            >
              📷
            </button>
          </div>

          <div className="vitya-user-meta">
            <div className="vitya-user-name-row">
              <h2 className="vitya-user-name">{name}</h2>
            </div>
            <div className="vitya-username">@{username}</div>
            <div className="vitya-email-row">
              <span>✉️</span> {email}
            </div>
            <div className="vitya-bio-row">
              <span>{bio}</span>
              <button
                type="button"
                className="vitya-edit-icon-btn"
                onClick={() => navigate("/profile/edit")}
                title="Edit bio"
              >
                ✏️
              </button>
            </div>
          </div>
        </div>

        {/* 3 STAT TILES */}
        <div className="vitya-stat-tiles">
          <div className="vitya-stat-tile">
            <div className="vitya-stat-icon">📅</div>
            <div className="vitya-stat-content">
              <div className="vitya-stat-label">Member Since</div>
              <div className="vitya-stat-value">{formattedJoined}</div>
            </div>
          </div>

          <div className="vitya-stat-tile">
            <div className="vitya-stat-icon">👤</div>
            <div className="vitya-stat-content">
              <div className="vitya-stat-label">Account Type</div>
              <div className="vitya-stat-value">{accountType}</div>
            </div>
          </div>

          <div className="vitya-stat-tile">
            <div className="vitya-stat-icon">🛡️</div>
            <div className="vitya-stat-content">
              <div className="vitya-stat-label">Status</div>
              <div className="vitya-stat-value">
                <span className="vitya-green-dot" /> {status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="vitya-action-row">
        <button
          type="button"
          className="vitya-btn-outline"
          onClick={() => navigate("/profile/edit")}
        >
          <span>📝</span> Edit Profile
        </button>

        <button
          type="button"
          className="vitya-btn-purple"
          onClick={handleLogout}
        >
          <span>🚪</span> Logout
        </button>
      </div>

      {/* FULL WIDTH SETTINGS MENU LIST */}
      <div className="vitya-menu-list">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="vitya-menu-item"
            onClick={item.action}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && item.action()}
          >
            <div className="vitya-menu-left">
              <div
                className="vitya-menu-icon-box"
                style={{ background: item.bg }}
              >
                {item.icon}
              </div>
              <div>
                <div className="vitya-menu-title">{item.title}</div>
                <div className="vitya-menu-sub">{item.sub}</div>
              </div>
            </div>
            <div className="vitya-menu-chevron">›</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="vitya-footer-tagline">
        Smarter Finance. Brighter Future.
      </div>
    </PageShell>
  );
}

export default Profile;
