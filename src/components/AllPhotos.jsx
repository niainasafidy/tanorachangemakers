import { useState, useEffect } from "react";
import { getPhotos, API_BASE } from "../api";
import "./AllPhotos.css";

const FILTERS = ["All", "STEM", "English", "French", "German"];
function Lightbox({ photo, onClose, onPrev, onNext }) {
  return (
    <div className="ap-lightbox" onClick={onClose}>
      <div className="ap-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button className="ap-lightbox-close" onClick={onClose}>
          ✕
        </button>
        <button className="ap-lightbox-prev" onClick={onPrev}>
          ‹
        </button>
        <button className="ap-lightbox-next" onClick={onNext}>
          ›
        </button>
        <img src={photo.src} alt={photo.caption} />
        <div className="ap-lightbox-footer">
          <p className="ap-lightbox-caption">{photo.caption}</p>
        </div>
      </div>
    </div>
  );
}

export default function AllPhotos({ onBack }) {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPhotos({ limit: 100 });
        const normalized = (data.photos || []).map((p) => ({
          src: p.url, 
          caption: p.caption || "No caption",
          program: p.album_title || "All", 
          date: new Date(p.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        }));
        setPhotos(normalized);
      } catch (e) {
        setError("Failed to load photos.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = photos.filter((p) => {
    const matchFilter = filter === "All" || p.program === filter;
    const matchSearch = p.caption.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () =>
    setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length);
  const nextPhoto = () => setLightboxIndex((i) => (i + 1) % filtered.length);

  return (
    <div className="ap-root">
      <div className="ap-controls">
        <div className="ap-controls-inner">
          <button className="ap-back" onClick={onBack}>
            <img src="/back_.png" alt="" />
          </button>
          <div className="ap-search-wrap">
            <span className="ap-search-icon">
              <img src="/search.png" alt="" className="ap-search-icon" />
            </span>
            <input
              className="ap-search"
              type="text"
              placeholder="Search photos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="ap-search-clear" onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>
          <div className="ap-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`ap-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
                <span className="ap-filter-count">
                  {f === "All"
                    ? photos.length
                    : photos.filter((p) => p.program === f).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ap-body">
        {loading ? (
          <div className="ap-empty">
            <span>
              <img src="/loading.png" alt="" />
            </span>
            <p>Loading photos…</p>
          </div>
        ) : error ? (
          <div className="ap-empty">
            <span>...</span>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty">
            <p>No photos found for this filter.</p>
          </div>
        ) : (
          <div className="ap-grid">
            {filtered.map((photo, i) => (
              <div
                key={i}
                className="ap-photo-item"
                onClick={() => openLightbox(i)}
              >
                <img src={photo.src} alt={photo.caption} loading="lazy" />
                <div className="ap-photo-hover">
                  <p className="ap-photo-caption">{photo.caption}</p>
                  <div className="ap-photo-meta-row">
                    <span className="ap-photo-program">{photo.program}</span>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photo={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  );
}
