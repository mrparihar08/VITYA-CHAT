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
} from "./AuthCommon";
import "./Auth.css";

export function ProfileEdit({ insideDashboard = false }) {
  const { token, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profile_pic: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filePreview, setFilePreview] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchProfile(token);
        setProfile(data);
        setForm({
          name: data?.name || "",
          username: data?.username || "",
          email: data?.email || "",
          bio: data?.bio || "",
          profile_pic: data?.profile_pic || "",
        });
        saveUserToStorage(data);
        updateUser(data);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401) {
          alert("Session expired, please login again!");
          logout();
          navigate("/login");
        } else {
          showToast(handleApiError(err));
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, navigate, logout, updateUser]);

  useEffect(() => {
    if (form.profile_pic instanceof File) {
      const url = URL.createObjectURL(form.profile_pic);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setFilePreview("");
    return undefined;
  }, [form.profile_pic]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      const payload = new FormData();

      if (form.name.trim() !== (profile?.name || "")) {
        payload.append("name", form.name.trim());
      }
      if (form.username.trim() !== (profile?.username || "")) {
        payload.append("username", form.username.trim());
      }
      if (form.email.trim() !== (profile?.email || "")) {
        payload.append("email", form.email.trim());
      }
      if ((form.bio || "").trim() !== (profile?.bio || "")) {
        payload.append("bio", form.bio.trim());
      }
      if (form.profile_pic instanceof File) {
        payload.append("profile_pic", form.profile_pic);
      }

      const res = await api.put("/api/users/profile/edit", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = res?.data?.user || null;

      if (updated) {
        setProfile(updated);
        setForm((prev) => ({
          ...prev,
          name: updated.name || "",
          username: updated.username || "",
          email: updated.email || "",
          bio: updated.bio || "",
          profile_pic: updated.profile_pic || "",
        }));
        saveUserToStorage(updated);
        updateUser(updated);
      }

      showToast(res.data?.message || "Profile updated successfully!");
    } catch (err) {
      showToast(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const previewSrc =
    filePreview || resolveAssetUrl(profile?.profile_pic || "/profile.png");
  const userInitial = (form.name || form.username || "P").charAt(0).toUpperCase();

  if (loading) {
    return (
      <PageShell
        title="Loading Profile..."
        subtitle="Fetching user details."
        plain={insideDashboard}
        hideBrandRow={insideDashboard}
        wide
      >
        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.7)" }}>
          Loading profile...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Edit Account Profile"
      subtitle="Update your personal details, avatar, bio, and credentials."
      plain={insideDashboard}
      hideBrandRow={insideDashboard}
      wide={true}
    >
      <div className="vitya-profile-edit-container">
        {toastMsg && <div className="vitya-settings-toast">✓ {toastMsg}</div>}

        {/* TOP BAR WITH BACK BUTTON */}
        <div className="vitya-profile-top-nav">
          <button
            type="button"
            className="backBtn"
            onClick={() => navigate(insideDashboard ? "/dashboard?tab=profile" : "/profile")}
          >
            ← Back to Profile
          </button>
          <div className="appBreadcrumb">
            <span>Profile</span> <span className="bcSep">/</span> <strong className="bcCurrent">Edit Account</strong>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="vitya-profile-edit-form">
          {/* HEADER CARD: AVATAR EDIT & NAME HEADER */}
          <div className="vitya-profile-card vitya-edit-avatar-card">
            <div className="vitya-user-header">
              <div className="vitya-main-avatar-wrapper">
                <div className="vitya-avatar-box">
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt="Avatar Preview"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="vitya-camera-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload new profile picture"
                >
                  📷
                </button>
              </div>

              <div className="vitya-user-meta" style={{ flex: 1 }}>
                <h2 className="vitya-user-name">{form.name || "User Profile"}</h2>
                <div className="vitya-username">@{form.username || "username"}</div>
                <div className="vitya-avatar-hint">
                  Click the camera icon on your avatar to upload a new profile image (JPG, PNG up to 5MB).
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, profile_pic: e.target.files?.[0] || null })
                }
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* FORM GRID SECTION */}
          <div className="vitya-settings-card">
            <div className="vitya-card-header">
              <div className="vitya-header-icon bg-purple">👤</div>
              <div className="vitya-header-title-block">
                <h3>Personal Details</h3>
                <p>Update your public display name, email, and handle</p>
              </div>
            </div>

            <div className="vitya-edit-form-grid">
              <div className="vitya-input-group">
                <label className="vitya-input-label">Full Name</label>
                <input
                  type="text"
                  className="vitya-edit-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="vitya-input-group">
                <label className="vitya-input-label">Username</label>
                <div className="vitya-input-prefix-wrap">
                  <span className="vitya-prefix">@</span>
                  <input
                    type="text"
                    className="vitya-edit-input with-prefix"
                    placeholder="username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="vitya-input-group">
                <label className="vitya-input-label">Email Address</label>
                <input
                  type="email"
                  className="vitya-edit-input"
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="vitya-input-group">
                <label className="vitya-input-label">Role / Account Tier</label>
                <input
                  type="text"
                  className="vitya-edit-input"
                  value={profile?.role || "Founder & AI Developer"}
                  disabled
                  style={{ opacity: 0.75 }}
                />
              </div>

              <div className="vitya-input-group full-width">
                <label className="vitya-input-label">Bio / Personal Description</label>
                <textarea
                  rows={4}
                  className="vitya-edit-textarea"
                  placeholder="Write a brief bio about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS ROW */}
          <div className="vitya-edit-actions-row">
            <button
              type="submit"
              className="vitya-save-btn"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "💾 Save Profile Changes"}
            </button>

            <button
              type="button"
              className="vitya-cancel-btn"
              onClick={() => navigate(insideDashboard ? "/dashboard?tab=profile" : "/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

export default ProfileEdit;
