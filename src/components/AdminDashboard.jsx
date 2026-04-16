import { useState, useEffect, useRef } from "react";
import {
  getAdmin,
  adminLogout,
  getVolunteers,
  getPhotos,
  uploadPhoto,
  deletePhoto,
  getAlbums,
  createAlbum,
} from "../api";
import "./AdminDashboard.css";
import VolunteerTable from "./VolunteerTable";

function Badge({ status }) {
  const colors = {
    confirmed: { bg: "#dcfce7", color: "#166534" },
    pending: { bg: "#fef9c3", color: "#854d0e" },
    cancelled: { bg: "#fee2e2", color: "#991b1b" },
  };
  const s = colors[status] || colors.confirmed;
  return (
    <span
      style={{
        ...s,
        padding: "2px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-icon">
        <img src={icon} alt="" className="adm-icon-img" />
      </div>
      <div>
        <div className="adm-stat-val">{value}</div>
        <div className="adm-stat-label">{label}</div>
      </div>
    </div>
  );
}

function PhotoUploadPanel({ albums, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setError("");
    setSuccess("");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a photo first.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const result = await uploadPhoto(file, caption, albumId || null);
      setSuccess("Photo uploaded successfully!");
      setFile(null);
      setPreview(null);
      setCaption("");
      setAlbumId("");
      onUploaded(result.photo);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="adm-upload-panel">
      <h3 className="adm-section-title">Upload New Photo</h3>
      <div
        className={`adm-dropzone ${preview ? "has-preview" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="adm-preview-img" />
        ) : (
          <>
            <div className="adm-drop-icon">
              <img src="/camera.png" alt="" />
            </div>
            <p className="adm-drop-text">Click to choose or drag & drop</p>
            <p className="adm-drop-hint">JPEG, PNG, WebP · max 100 MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {preview && (
        <button
          className="adm-btn-ghost"
          onClick={() => {
            setFile(null);
            setPreview(null);
          }}
        >
          ✕ Remove
        </button>
      )}

      <div className="adm-upload-fields">
        <div className="adm-field">
          <label className="adm-label">Caption (optional)</label>
          <input
            className="adm-input"
            type="text"
            placeholder="Describe this photo…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label">Album (optional)</label>
          <select
            className="adm-input"
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
          >
            <option value="">No album</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="adm-error">{error}</p>}
      {success && <p className="adm-success">{success}</p>}

      <button
        className="adm-btn-primary"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading…" : "Upload Photo"}
      </button>
    </div>
  );
}

function PhotoGrid({ photos, onDelete }) {
  return (
    <div className="adm-photo-grid">
      {photos.length === 0 && (
        <div className="adm-empty">
          <img src="/tiles.png" alt="" />
          <p>No photos yet. Upload your first one!</p>
        </div>
      )}
      {photos.map((p) => (
        <div key={p.id} className="adm-photo-card">
          <img src={p.url} alt={p.caption || ""} className="adm-photo-thumb" />
          <div className="adm-photo-info">
            <p className="adm-photo-caption">
              {p.caption || <em>No caption</em>}
            </p>
            {p.album_title && (
              <p className="adm-photo-album">
                <img src="/album.png" alt="" className="adm-album" />{" "}
                {p.album_title}
              </p>
            )}
          </div>
          <button
            className="adm-photo-delete"
            onClick={() => onDelete(p.id)}
            title="Delete"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard({ onClose }) {
  const admin = getAdmin();
  const [tab, setTab] = useState("overview");

  const [volunteers, setVolunteers] = useState([]);
  const [volTotal, setVolTotal] = useState(0);
  const [volPage, setVolPage] = useState(1);
  const [volPages, setVolPages] = useState(1);
  const [volSearch, setVolSearch] = useState("");
  const [volLoading, setVolLoading] = useState(false);

  const [overviewTotal, setOverviewTotal] = useState(0);
  const [overviewMonthly, setOverviewMonthly] = useState(0);
  const [overviewPrograms, setOverviewPrograms] = useState({});

  const [photos, setPhotos] = useState([]);
  const [photoTotal, setPhotoTotal] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState("");

  const loadOverviewStats = async () => {
    try {
      const data = await getVolunteers({ page: 1, limit: 100 });
      setOverviewTotal(data.total);
      const now = new Date();
      let thisMonth = 0;
      const programs = {};
      (data.volunteers || []).forEach((v) => {
        const d = new Date(v.created_at);
        if (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        )
          thisMonth++;
        programs[v.program] = (programs[v.program] || 0) + 1;
      });
      setOverviewMonthly(thisMonth);
      setOverviewPrograms(programs);
    } catch (e) {
      console.error(e);
    }
  };

  const loadVolunteers = async (page = 1, search = "") => {
    setVolLoading(true);
    try {
      const data = await getVolunteers({ page, search });
      setVolunteers(data.volunteers || []);
      setVolTotal(data.total || 0);
      setVolPage(data.page || 1);
      setVolPages(data.pages || 1);
    } catch (e) {
      console.error(e);
    }
    setVolLoading(false);
  };

  const loadPhotos = async () => {
    try {
      const data = await getPhotos({ limit: 50 });
      setPhotos(data.photos || []);
      setPhotoTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const loadAlbums = async () => {
    try {
      const data = await getAlbums();
      setAlbums(data.albums || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadOverviewStats();
    loadPhotos();
    loadAlbums();
  }, []);
  useEffect(() => {
    if (tab === "volunteers") loadVolunteers(1, "");
  }, [tab]);

  const handleDeletePhoto = async (id) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      setPhotoTotal((t) => t - 1);
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleCreateAlbum = async () => {
    if (!newAlbum.trim()) return;
    try {
      await createAlbum(newAlbum.trim());
      setNewAlbum("");
      loadAlbums();
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  const handleLogout = () => {
    adminLogout();
    onClose();
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: "/overview.png" },
    { id: "volunteers", label: "Volunteers", icon: "/volunteers.png" },
    { id: "photos", label: "Photos", icon: "/photo.png" },
    { id: "albums", label: "Albums", icon: "/albums.png" },
  ];

  const currentLabel = TABS.find((t) => t.id === tab)?.label;

  return (
    <div className="adm-root">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <img src="/logo.png" alt="" className="admin-logo" />
          <span>Tanora ChangeMakers Admin</span>
        </div>
        <nav className="adm-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`adm-nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <div className="adm-div-icon">
                <img src={t.icon} className="tab-icon" alt="" />
                <span className="tab-label">{t.label}</span>
              </div>
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-footer">
          <div className="adm-admin-name">{admin?.name}</div>
          <div className="adm-admin-email">{admin?.email}</div>
          <button className="adm-logout-btn" onClick={handleLogout}>
            Sign Out <img src="/exit.png" alt="" className="sign-out" />
          </button>
        </div>
      </aside>
      <div className="adm-mobile-header">
        <div className="adm-mobile-header-brand">
          <img src="/logo.png" alt="" className="adm-mobile-header-logo" />
          <span>{currentLabel}</span>
        </div>
        <button className="adm-mobile-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <main className="adm-main">
        <header className="adm-header">
          <h1 className="adm-title">{currentLabel}</h1>
        </header>
        {tab === "overview" && (
          <div className="adm-content">
            <div className="adm-stats-grid">
              <StatCard
                icon="/volunteers.png"
                label="Total Volunteers"
                value={overviewTotal}
              />
              <StatCard
                icon="/overview.png"
                label="This Month"
                value={overviewMonthly}
              />
              <StatCard icon="/photo.png" label="Photos" value={photoTotal} />
              <StatCard
                icon="/albums.png"
                label="Albums"
                value={albums.length}
              />
            </div>
            {Object.keys(overviewPrograms).length > 0 && (
              <div className="adm-programs-list">
                <h3 className="adm-section-title">Registrations by Program</h3>
                {Object.entries(overviewPrograms).map(([prog, count]) => (
                  <div key={prog} className="adm-prog-row">
                    <span className="adm-prog-name">{prog}</span>
                    <div className="adm-prog-bar-wrap">
                      <div
                        className="adm-prog-bar"
                        style={{
                          width: `${Math.round(
                            (count / (overviewTotal || 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="adm-prog-count">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "volunteers" && (
          <div className="adm-content">
            <div className="adm-toolbar">
              <input
                className="adm-search"
                type="text"
                placeholder="Search by name or email…"
                value={volSearch}
                onChange={(e) => setVolSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && loadVolunteers(1, volSearch)
                }
              />
              <button
                className="adm-btn-primary1"
                onClick={() => loadVolunteers(1, volSearch)}
              >
                <img
                  src="/search_.png"
                  alt="Search"
                  className="adm-icon-search"
                />
              </button>
              <button
                className="adm-btn-ghost"
                onClick={() => {
                  setVolSearch("");
                  loadVolunteers(1, "");
                }}
              >
                <img src="/reset.png" alt="Reset" className="adm-icon-search" />
              </button>
            </div>
            {volLoading ? (
              <p className="adm-loading">Loading volunteers…</p>
            ) : (
              <VolunteerTable
                volunteers={volunteers}
                total={volTotal}
                page={volPage}
                pages={volPages}
                onPage={(p) => loadVolunteers(p, volSearch)}
              />
            )}
          </div>
        )}
        {tab === "photos" && (
          <div className="adm-content adm-photos-layout">
            <PhotoUploadPanel
              albums={albums}
              onUploaded={(photo) => {
                setPhotos((prev) => [photo, ...prev]);
                setPhotoTotal((t) => t + 1);
              }}
            />
            <div className="adm-photos-right">
              <h3 className="adm-section-title">All Photos ({photoTotal})</h3>
              <PhotoGrid photos={photos} onDelete={handleDeletePhoto} />
            </div>
          </div>
        )}
        {tab === "albums" && (
          <div className="adm-content">
            <div className="adm-create-album">
              <h3 className="adm-section-title">Create New Album</h3>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className="adm-input"
                  placeholder="Album name…"
                  value={newAlbum}
                  onChange={(e) => setNewAlbum(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateAlbum()}
                />
                <button className="adm-btn-primary" onClick={handleCreateAlbum}>
                  Create
                </button>
              </div>
            </div>
            <div className="adm-albums-grid">
              {albums.map((a) => (
                <div key={a.id} className="adm-album-card">
                  {a.cover_url ? (
                    <img
                      src={a.cover_url}
                      alt={a.title}
                      className="adm-album-cover"
                    />
                  ) : (
                    <div className="adm-album-placeholder">
                      <img src="/album.png" alt="" />
                    </div>
                  )}
                  <div className="adm-album-info">
                    <p className="adm-album-title">{a.title}</p>
                    <p className="adm-album-count">
                      {a.photo_count ?? 0} photos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <nav className="adm-mobile-nav">
        <div className="adm-mobile-nav-inner">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`adm-mobile-nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <img src={t.icon} alt={t.label} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
