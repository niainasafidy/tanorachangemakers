import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./TanoraChangeMakers.css";
import GalleryAndPrograms from "./Gallery";
import AdminDashboard from "./AdminDashboard";
import { adminLogin } from "../api";

const SLIDES = [
  { headline: "Empower Youth.", sub: "Building tomorrow's leaders today." },
  {
    headline: "Make a Change.",
    sub: "One volunteer, one community at a time.",
  },
  {
    headline: "Leave a Legacy.",
    sub: "Your service shapes the future of Madagascar.",
  },
];

const NAV_LINKS = ["About", "Programs", "Impact", "Stories", "Register"];

const STATS = [
  { value: "100+", label: "Volunteers" },
  { value: "700+", label: "Students" },
  { value: "4", label: "Programs" },
  { value: "2023", label: "Founded" },
];

const TESTIMONIALS = [
  {
    quote:
      "Before I joined the English program, I was too shy to speak in class. I would stay quiet even when I had something to say. Now I can stand in front of everyone and present with confidence. This non-profit truly changed my life.",
    name: "Miora R.",
    role: "Student, LMA · English Program",
    initial: "M",
    accent: "#e63946",
  },
  {
    quote:
      "STEM showed me that science is for everyone. I built my first circuit and that’s when I knew I want to be an engineer. The German program also opened new doors for me.",
    name: "Lova Tolotra A.",
    role: "Student, LMA · STEM & German Programs",
    initial: "L",
    accent: "#2d3fc0",
  },
  {
    quote:
      "I learned that science can be fun and practical. When I built my first project, I felt proud and more confident.",
    name: "Elliot R.",
    role: "Student, LMA · STEM & French Programs",
    initial: "E",
    accent: "#1a7a4a",
  },
  {
    quote:
      "Through STEM, English, and German programs, I learned by doing, built small projects, and gained confidence step by step. Now I feel more open and confident. Tanora Changemakers helped me believe in myself.",
    name: "Setra R.",
    role: "Student, LMA · STEM, English & programs",
    initial: "S",
    accent: "#c47d0e",
  },
  {
    quote:
      "I really enjoy the English and German programs at Tanora ChangeMakers. They are simple, fun, and easy to follow. I’ve improved my speaking and feel more confident using both languages. The teachers are supportive and make learning enjoyable.",
    name: "Fenotsiky M.",
    role: "Student, LMA · English & German programs",
    initial: "F",
    accent: "#7b3fc4",
  },
  {
    quote:
      "I’m happy to be in the STEM and English programs at this non-profit. I learn how to think creatively in STEM and express myself better in English. The classes are engaging and help me improve step by step.",
    name: "Joseph B.",
    role: "Student, LMA · STEM & English Programs ",
    initial: "J",
    accent: "#c4273a",
  },
];

function AdminModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    () => !!localStorage.getItem("tanora_token")
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(email, password);
      setLoggedIn(true);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return createPortal(
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#f8f7f4",
          overflow: "auto",
        }}
      >
        <AdminDashboard onClose={onClose} />
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0, 0, 0, 0.43)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
        <button className="tc-modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="tc-modal-logo">
          <span className="tc-logo-mark">
            <img src="/logo.png" alt="" className="tc-img" />
          </span>
        </div>
        <h2 className="tc-modal-title">Admin Portal</h2>
        <p className="tc-modal-sub">Tanora ChangeMakers Assoc. Management</p>
        <form onSubmit={handleLogin}>
          <div className="tc-input-group">
            <label className="tc-label">Email</label>
            <input
              className="tc-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="tc-input-group">
            <label className="tc-label">Password</label>
            <input
              className="tc-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="tc-error-msg">{error}</p>}
          <button
            className={loading ? "tc-btn-loading" : "tc-btn-submit"}
            type="submit"
            disabled={loading}
          >
            {loading ? "Authenticating…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = (index) => {
    setVisible(false);
    setTimeout(() => {
      setActive(index);
      setVisible(true);
    }, 320);
  };

  const next = () => goTo((active + 1) % TESTIMONIALS.length);
  const prev = () =>
    goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((c) => (c + 1) % TESTIMONIALS.length);
        setVisible(true);
      }, 320);
    }, 2000);
    return () => clearInterval(timerRef.current);
  }, [paused, active]);

  const t = TESTIMONIALS[active];

  return (
    <div
      className="tc-slider-wrapper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        className="tc-slider-arrow tc-slider-arrow-left"
        onClick={prev}
        aria-label="Previous"
      >
        &#8592;
      </button>
      <div
        className="tc-tcard tc-tcard-single"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.32s ease, transform 0.32s ease",
        }}
      >
        <div className="tc-tcard-bar" style={{ background: t.accent }} />
        <p className="tc-tcard-quote">"{t.quote}"</p>
        <div className="tc-tcard-author">
          <div className="tc-tcard-avatar" style={{ background: t.accent }}>
            {t.initial}
          </div>
          <div>
            <p className="tc-tcard-name">{t.name}</p>
            <p className="tc-tcard-role">{t.role}</p>
          </div>
        </div>
      </div>
      <button
        className="tc-slider-arrow tc-slider-arrow-right"
        onClick={next}
        aria-label="Next"
      >
        &#8594;
      </button>
      <div className="tc-slider-dots">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            className={`tc-slider-dot ${i === active ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function MilestoneItem({ year, label, desc, index }) {
  const isLeft = index % 2 === 0;
  return (
    <div
      className={`tc-milestone ${
        isLeft ? "tc-milestone-left" : "tc-milestone-right"
      }`}
    >
      <div className="tc-milestone-content">
        <span className="tc-milestone-year">{year}</span>
        <p className="tc-milestone-label">{label}</p>
        <p className="tc-milestone-desc">{desc}</p>
      </div>
      <div className="tc-milestone-dot" />
    </div>
  );
}

export default function TanoraChangeMakers({ onVolunteer, onSeePhotos }) {
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [showAdmin, setShowAdmin] = useState(
    () =>
      localStorage.getItem("lastPage") === "admin" ||
      !!localStorage.getItem("tanora_token")
  );
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTextVisible(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % SLIDES.length);
        setTextVisible(true);
      }, 450);
    }, 4200);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const onScroll = (e) => {
      const top = e.target.scrollTop || document.documentElement.scrollTop;
      setScrolled(top > 60);
    };
    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true,
    });
    return () =>
      document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  return (
    <div className="tc-root">
      <nav className={`tc-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="tc-nav-inner">
          <div className="tc-brand">
            <span className="tc-brand-mark">
              <img src="/logo.png" alt="" className="tc-img" />
            </span>
            <span className="tc-brand-name">
              Tanora<strong> ChangeMakers Assoc.</strong>
            </span>
          </div>
          <div className="tc-nav-links">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="tc-nav-link">
                {l}
              </a>
            ))}
          </div>
          <button
            className="tc-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
        {menuOpen && (
          <div className="tc-mobile-menu">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="tc-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {l}
              </a>
            ))}
            <button
              className="tc-admin-btn-mobile"
              onClick={() => {
                setShowAdmin(true);
                localStorage.setItem("lastPage", "admin");
                setMenuOpen(false);
              }}
            >
              Admin Login
            </button>
          </div>
        )}
      </nav>

      <section className="tc-hero" id="home">
        <div className="tc-hero-overlay" />
        <div className="tc-hero-content">
          <h1
            className="tc-hero-title"
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
            }}
          >
            {SLIDES[current].headline}
            <br />
            <span className="tc-hero-accent">{SLIDES[current].sub}</span>
          </h1>
          <p
            className="tc-hero-desc"
            style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateX(0)" : "translateX(-12px)",
              transition:
                "opacity 0.45s ease 0.08s, transform 0.45s ease 0.08s",
            }}
          >
            Join hundreds of young Malagasy changemakers building stronger
            communities through service, leadership, and compassion.
          </p>
          <div className="tc-hero-cta">
            <a href="#about" className="tc-btn-primary">
              Discover Our Mission
            </a>
            <button
              className="tc-btn-secondary"
              onClick={() => {
                const btn = document.getElementById("contactUS");
                if (btn) {
                  btn.scrollIntoView({ behavior: "smooth", block: "center" });
                  btn.classList.remove("tc-email-pulse");
                  void btn.offsetWidth;
                  btn.classList.add("tc-email-pulse");
                }
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <section className="tc-stats-bar">
        <div className="tc-stats-bar-div">
          {STATS.map((s, i) => (
            <>
              <div key={s.label} className="tc-stat-item">
                <span className="tc-stat-val">{s.value}</span>
                <span className="tc-stat-label">{s.label}</span>
              </div>
              {i === 1 && (
                <img
                  key="tampon"
                  src="/tampon.png"
                  alt=""
                  className="tc-stats-bar-img"
                />
              )}
            </>
          ))}
        </div>
      </section>

      <section id="about" className="tc-section">
        <div className="tc-section-inner">
          <div className="gal-tag">Who We Are</div>
          <div className="tc-about-grid">
            <div className="tc-about-text">
              <p className="tc-para">
                <strong>Tanora ChangeMakers Assoc.</strong> is a youth-led
                non-profit headquatered in Madagascar, dedicated to supporting students at
                every stage of their learning journey, and in the process of expanding its work worldwide. We offer free spoken
                English, French, & German, and STEM programs helping them boost
                their communication abilities and build practical skills in
                science. Our mission is simple: make quality learning accessible
                and empower young people to grow with confidence. Through the
                support of passionate volunteers, we create a positive
                environment where students can learn and share, ask questions,
                and discover their potential.
              </p>
              <a href="#programs" className="tc-btn-primary">
                See Our Programs <img src="/right.png" alt="" />
              </a>
            </div>
            <div className="tc-about-visual">
              <div
                className="floating-badge"
                style={{
                  position: "relative",
                  left: "7%",
                  bottom: "17%",
                  width: 440,
                  height: 250,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "2px solid rgba(222,74,74,0.81)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.32)",
                  zIndex: 3,
                }}
              >
                <video
                  className="tc-video"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                  }}
                >
                  <source src="/Joseph LMA.mp4" type="video/mp4" />
                </video>
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "red",
                    borderRadius: 4,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: "#fff",
                  }}
                >
                  STORY
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GalleryAndPrograms onSeeMore={onSeePhotos} />

      <section id="stories" className="tc-section tc-stories-bg">
        <div className="tc-section-inner">
          <div className="gal-tag">Real Voices</div>
          <h2 className="tc-section-title">
            Stories of <span className="story-of-change">Change</span>{" "}
          </h2>
          <p className="tc-section-sub">
            Behind every statistic is a student whose life was touched. Here are
            their words.
          </p>

          <TestimonialSlider />

          <button
            className="btn-email"
            id="contactUS"
            onClick={() =>
              (window.location.href =
                "mailto:tanorachangemakersassoc@gmail.com")
            }
          >
            <img src="/messaging.png" alt="" style={{ width: 55 }} />
          </button>
        </div>
      </section>

      <section id="register" className="tc-cta-section">
        <div className="tc-cta-inner">
          <h2 className="tc-cta-title">Ready to Make a Change?</h2>
          <p className="tc-cta-desc">
            Join Tanora ChangeMakers Assoc. and start your volunteer journey.
            <br />
            Your impact lasts forever.
          </p>
          <button className="tc-btn-big" onClick={onVolunteer}>
            Become a Volunteer
          </button>
        </div>
        <div className="tc-hero-overlay1" />
      </section>

      <footer className="tc-footer">
        <div className="tc-footer-inner">
          <div>
            <div className="tc-brand">
              <span className="tc-brand-mark">
                <img src="/logo.png" alt="" className="tc-img" />
              </span>
              <span className="tc-brand-name" style={{ color: "white" }}>
                Tanora <strong>ChangeMakers Assoc.</strong>
              </span>
            </div>
            <p className="tc-footer-tagline">
              Empowering Malagasy youth since 2023.
            </p>
            <p className="schoolPartner">School partners: </p>
            <div className="school-partner">
              <img src="/LMA.jpg" alt="" className="LMA" />
              <p className="and">&</p>
              <div className="EcoleLagrace">
                Ecole privée<p className="LaGrace">La Grâce</p>
              </div>
            </div>
          </div>
          <div className="tc-footer-links">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="tc-footer-link"
              >
                {l}
              </a>
            ))}
          </div>
          <button
            className="tc-footer-admin"
            onClick={() => {
              setShowAdmin(true);
              localStorage.setItem("lastPage", "admin");
            }}
          >
            Admin Login
          </button>
        </div>
        <p className="tc-copyright">© 2026 Tanora ChangeMakers Assoc.</p>
      </footer>

      {showAdmin && (
        <AdminModal
          onClose={() => {
            setShowAdmin(false);
            localStorage.removeItem("lastPage");
            localStorage.removeItem("tanora_token");
            localStorage.removeItem("tanora_admin");
          }}
        />
      )}
    </div>
  );
}
