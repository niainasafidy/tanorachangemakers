import { useState } from "react";
import "./Gallery.css";

const PROGRAMS_DETAIL = [
  {
    id: "STEM",
    title: "STEM",
    tagline: "Robotics, coding & programming",
    color: "#000",
    emoji: "/launchpad.png",
    cover: "/stemarduino.jpg",
    description:
      "Our STEM program at LMA prepares high school students for higher education or competitions (regional, national, or international) by building foundational skills in technology, logical thinking, and problem-solving. Through hands-on learning, students gain confidence using digital tools, working on real projects, and developing creativity and independence for their future endeavors.",
    highlights: [
      "Robotics Arduino",
      "Python & Scratch coding",
      "C programming",
      "Web Development",
    ],
    photos: [
      {
        src: "/stem1.jpg",
        caption:
          "Students collaborate to assemble and program simple robotics projects.",
      },
      {
        src: "/stem2.jpg",
        caption:
          "Hands-on coding session where students explore circuits and programming.",
      },
    ],
  },
  {
    id: "english",
    title: "Spoken English",
    tagline: "Confidence through communication",
    color: "#000",
    emoji: "/raise.png",
    cover: "/EnglishS.jpg",
    description:
      "The Spoken English program builds confident communication skills in English. Through conversation practice, storytelling, and debate, our volunteers help students unlock global opportunities.",
    highlights: [
      "Daily conversation practice",
      "Debate & public speaking",
      "English storytelling",
    ],
    photos: [
      {
        src: "/lagrace1 (9).jpg",
        caption: "Learners engage by answering questions and sharing ideas.",
      },
      {
        src: "/eng4.jpg",
        caption: "Students learn together in a lively classroom environment.",
      },
    ],
  },
  {
    id: "french",
    title: "Spoken French",
    tagline: "Opening doors across the Francophone world",
    color: "#000",
    emoji: "/collaboration.png",
    cover: "French.jpg",
    description:
      "French is spoken by over 300 million people worldwide. Our program helps students master conversational French through immersive activities, songs, and daily practice that makes learning feel natural and fun.",
    highlights: ["Immersive conversation", "French songs & culture"],
    photos: [
      {
        src: "/f.jpg",
        caption: "Students focus on learning and practicing French together.",
      },
      {
        src: "/lagrace1 (23).jpg",
        caption:
          "Learners actively take part in class activities and discussions.",
      },
    ],
  },
  {
    id: "german",
    title: "Spoken German",
    tagline: "A gateway to European opportunities",
    color: "#000",
    emoji: "/listen.png",
    cover: "/german.jpg",
    description:
      "German is one of the most valuable languages for academic and career opportunities in Europe. Our German program introduces students to the basics through fun games, music, and guided conversation sessions.",
    highlights: [
      "Basic to intermediate German",
      "German music & culture",
      "Grammar & vocabulary",
      "Interactive games",
    ],
    photos: [
      {
        src: "/germ.jpg",
        caption: "Students learn and practice new German words.",
      },
      {
        src: "/germann.jpg",
        caption: "Learners discover meanings and usage of new vocabulary.",
      },
    ],
  },
];
// student photo
const ALL_PHOTOS = [
  {
    src: "/stem1.jpg",
    location: "LMA",
  },
  {
    src: "/kids.jpg",
    location: "Ecole La Grâce",
  },
  {
    src: "/f.jpg",
    location: "LMA",
  },
  {
    src: "/germ.jpg",
    location: "LMA",
  },
  {
    src: "/eng10.jpg",
    location: "LMA",
  },
  {
    src: "/lagrace1 (26).jpg",
    location: "Ecole La Grâce",
  },
  {
    src: "/lagrace1 (20).jpg",
    location: "LMA",
  },
  {
    src: "eng3.jpg",
    location: "LMA",
  },
  {
    src: "/lagrace1 (9).jpg",
    location: "Ecole La Grâce",
  },
  {
    src: "/lagrace1 (25).jpg",
    location: "Ecole La Grâce",
  },
  {
    src: "/lagrace1 (23).jpg",
    location: "Ecole La Grâce",
  },
  {
    src: "/LiantsoaEng.jpg",
    location: "LMA",
  },
  {
    src: "/lagrace1 (21).jpg",
    location: "Ecole La Grâce",
  },
  {
    src: "/lma (8).jpg",
    location: "Ecole La Grâce",
  },
  {
    src: "/eng10.jpg",
    location: "LMA",
  },
  {
    src: "/stem.jpg",
    location: "LMA",
  },
  {
    src: "/Change.png",
    location: "LMA",
  },
  {
    src: "/lagrace1 (15).jpg",
    location: "Ecole La Grâce",
  },
  {
    src: "/lma (7).jpg",
    location: "LMA",
  },
];

function ProgramModal({ program, onClose }) {
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <div className="gal-overlay" onClick={onClose}>
      <div className="prog-modal" onClick={(e) => e.stopPropagation()}>
        <button className="prog-close" onClick={onClose}>
          ✕
        </button>
        <div
          className="prog-cover"
          style={{ backgroundImage: `url(${program.cover})` }}
        >
          <div className="prog-cover-overlay" />
          <div className="prog-cover-content">
            <h2 className="prog-title">{program.title}</h2>
            <p className="prog-tagline">{program.tagline}</p>
          </div>
        </div>

        <div className="prog-body">
          <div className="prog-desc-block">
            <h3 className="prog-block-title" style={{ color: program.color }}>
              About This Program
            </h3>
            <p className="prog-desc">{program.description}</p>
          </div>

          <div className="prog-highlights">
            <h3 className="prog-block-title" style={{ color: program.color }}>
              What Students Learn
            </h3>
            <div className="prog-highlight-grid">
              {program.highlights.map((h) => (
                <div
                  key={h}
                  className="prog-highlight-item"
                  style={{
                    borderColor: program.color + "44",
                    background: program.colorLight,
                  }}
                >
                  <span
                    style={{
                      color: program.color,
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    ✓
                  </span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="prog-photos">
            <h3 className="prog-block-title" style={{ color: program.color }}>
              Program Photos
            </h3>
            <div className="prog-photo-grid">
              {program.photos.map((p, i) => (
                <div
                  key={i}
                  className="prog-photo-item"
                  onClick={() => setActivePhoto(p)}
                >
                  <img src={p.src} alt={p.caption} />
                  <div className="prog-photo-caption">{p.caption}</div>
                  <div className="prog-photo-overlay">
                    <span>
                      <img src="/eye.png" alt="" className="prog-photo" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {activePhoto && (
        <div className="lightbox" onClick={() => setActivePhoto(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setActivePhoto(null)}
            >
              ✕
            </button>
            <img src={activePhoto.src} alt={activePhoto.caption} />
            <p className="lightbox-caption">{activePhoto.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoLightbox({ photo, onClose, onPrev, onNext }) {
  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>
          ✕
        </button>
        <button className="lightbox-prev" onClick={onPrev}>
          ‹
        </button>
        <button className="lightbox-next" onClick={onNext}>
          ›
        </button>
        <img src={photo.src} alt={photo.caption} />
        <div className="lightbox-footer">
          <span className="lightbox-meta">
            {photo.program} · {photo.date}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GalleryAndPrograms({ onSeeMore }) {
  const [activeProgram, setActiveProgram] = useState(null);
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered =
    filter === "All"
      ? ALL_PHOTOS
      : ALL_PHOTOS.filter((p) => p.program === filter);

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () =>
    setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length);
  const nextPhoto = () => setLightboxIndex((i) => (i + 1) % filtered.length);

  return (
    <>
      <section id="programs" className="gal-section gray">
        <div className="r">
          <div className="gal-tag">What We Do</div>
          <h2 className="gal-title">Our Programs</h2>
          <p className="gal-subtitle">
            Click on any program to explore the details, student stories, and
            photos.
          </p>

          <div className="gal-prog-grid">
            {PROGRAMS_DETAIL.map((p) => (
              <div
                key={p.id}
                className="gal-prog-card"
                onClick={() => setActiveProgram(p)}
                style={{ "--prog-color": p.color }}
              >
                <div
                  className="gal-prog-img"
                  style={{ backgroundImage: `url(${p.cover})` }}
                >
                  <div
                    className="gal-prog-img-overlay"
                    style={{
                      background: `linear-gradient(to bottom, transparent 30%, ${p.color}cc 100%)`,
                    }}
                  />
                  <span className="gal-prog-emoji">
                    <img src={p.emoji} alt="" />
                  </span>
                </div>
                <div className="gal-prog-body">
                  <h3 className="gal-prog-name">{p.title}</h3>
                  <p className="gal-prog-tag">{p.tagline}</p>
                  <div className="gal-prog-highlights-preview">
                    {p.highlights.slice(0, 2).map((h) => (
                      <span
                        key={h}
                        className="gal-prog-chip"
                        style={{ background: p.colorLight, color: p.color }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="gal-prog-footer">
                  <span className="gal-prog-cta" style={{ color: p.color }}>
                    See Program Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="impact" className="gal-section white">
        <div className="gal-inner">
          <div className="gal-tag">Student Life</div>
          <h2 className="gal-title1">
            Photo <span className="Gallery">Gallery</span>
          </h2>
          <div className="gal-photo-grid">
            {filtered.map((photo, i) => (
              <div
                key={i}
                className="gal-photo-item"
                onClick={() => openLightbox(i)}
              >
                <img src={photo.src} alt={photo.caption} loading="lazy" />
                <div className="gal-photo-hover">
                  <span className="gal-photo-meta">
                    {photo.program} · {photo.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="gal-add-hint">
            <div>
              <button className="gal-see-more" onClick={onSeeMore}>
                More Photos
                <img src="/right.png" alt="" className="more-photos" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {activeProgram && (
        <ProgramModal
          program={activeProgram}
          onClose={() => setActiveProgram(null)}
        />
      )}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photo={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </>
  );
}
