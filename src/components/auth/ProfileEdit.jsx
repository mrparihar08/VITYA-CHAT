import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  api,
  fetchProfile,
  saveUserToStorage,
  resolveAssetUrl,
  handleApiError,
  PageShell,
  FieldLabel,
  Input,
  Textarea,
  Button,
  styles,
} from "./AuthCommon";

export function ProfileEdit() {
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
  const [editing, setEditing] = useState(false);
  const [filePreview, setFilePreview] = useState("");
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
          alert(handleApiError(err));
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
    if (saving || !editing) return;
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
        setForm({
          name: updated.name || "",
          username: updated.username || "",
          email: updated.email || "",
          bio: updated.bio || "",
          profile_pic: updated.profile_pic || "",
        });
        saveUserToStorage(updated);
        updateUser(updated);
      }

      alert(res.data?.message || "Profile updated successfully");
      setEditing(false);
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageShell
        badge="Profile"
        title="Loading..."
        subtitle="Fetching your account details."
        wide
      >
        <div style={styles.loadingBlock}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>Loading profile…</div>
        </div>
      </PageShell>
    );
  }

  const previewSrc = filePreview || resolveAssetUrl(profile?.profile_pic || "/profile.png");

  return (
    <PageShell
      badge="Profile Edit"
      title="Edit Profile"
      subtitle="Update your account information."
      wide
    >
      <Button
        type="button"
        variant="secondary"
        onClick={() => navigate("/")}
        style={{ width: "fit-content" }}
      >
        ← Home
      </Button>

      <br />
      <br />

      <main style={styles.profileMain}>
        <div style={styles.mainTopBar}>
          <div>
            <h3 style={styles.mainHeading}>
              {editing ? "Editing mode" : "Preview mode"}
            </h3>
            <p style={styles.mainSubheading}>
              {editing
                ? "Make your changes and save them."
                : "Click Edit Profile to unlock the fields."}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {!editing && (
              <Button
                type="button"
                onClick={() => setEditing(true)}
                style={{ minWidth: 120 }}
              >
                Edit Profile
              </Button>
            )}
            <div style={styles.mainChip}>
              {editing ? "Unsaved changes allowed" : "Read only"}
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} style={styles.profileForm}>
          <div style={styles.fieldGrid} className="field-grid">
            <FieldLabel label="Full Name">
              <Input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!editing}
              />
            </FieldLabel>

            <FieldLabel label="Username">
              <Input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={!editing}
              />
            </FieldLabel>
          </div>

          <div style={styles.fieldGrid} className="field-grid">
            <FieldLabel label="Email">
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!editing}
              />
            </FieldLabel>

            <FieldLabel label="Profile Picture">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, profile_pic: e.target.files?.[0] || null })
                }
                disabled={!editing}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  cursor: editing ? "pointer" : "not-allowed",
                }}
              />

              {(filePreview || profile?.profile_pic) && (
                <div style={{ marginTop: 12 }}>
                  <img
                    src={previewSrc}
                    alt="Profile Preview"
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(255,255,255,0.2)",
                    }}
                  />
                </div>
              )}
            </FieldLabel>
          </div>

          <FieldLabel label="Bio">
            <Textarea
              rows={4}
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              disabled={!editing}
            />
          </FieldLabel>

          <div style={styles.actionRow}>
            <Button
              type="submit"
              disabled={saving || !editing}
              style={{ flex: 1, minWidth: 160 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditing(false);
                setForm({
                  name: profile?.name || "",
                  username: profile?.username || "",
                  email: profile?.email || "",
                  bio: profile?.bio || "",
                  profile_pic: profile?.profile_pic || "",
                });
              }}
              style={{ flex: 1, minWidth: 160 }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </PageShell>
  );
}

export default ProfileEdit;
