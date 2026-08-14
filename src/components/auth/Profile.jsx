import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchProfile,
  saveUserToStorage,
  resolveAssetUrl,
  handleApiError,
  PageShell,
  Button,
  styles,
} from "./AuthCommon";

export function Profile() {
  const { token, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const initial = (profile?.name || profile?.username || "V")
    .charAt(0)
    .toUpperCase();

  return (
    <PageShell
      badge="Profile"
      title="Your Profile"
      subtitle="View your account details."
      wide
      className="profile-grid"
    >
      <div style={styles.profileWrap}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/")}
          style={{ width: "fit-content" }}
        >
          ← Home
        </Button>

        <div style={styles.profileGrid} className="profile-grid">
          <aside style={styles.profileSidebar}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>
                {profile?.profile_pic ? (
                  <img
                    src={resolveAssetUrl(profile.profile_pic)}
                    alt="Profile"
                    style={styles.avatarImage}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>

              <div style={styles.profileMeta}>
                <div style={styles.profileName}>{profile?.name || "User"}</div>
                <div style={styles.profileUsername}>
                  @{profile?.username || "username"}
                </div>
                <div style={styles.profileEmail}>{profile?.email || ""}</div>
              </div>
            </div>

            <div style={styles.profileJoined}>
              {profile?.bio || "No bio added yet."}
            </div>

            <br />

            <Button
              onClick={() => navigate("/profile/edit")}
              style={{ width: "100%" }}
            >
              Edit Profile
            </Button>

            <br />
            <br />

            <Button
              type="button"
              variant="danger"
              onClick={handleLogout}
              style={{ width: "100%" }}
            >
              Logout
            </Button>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

export default Profile;
