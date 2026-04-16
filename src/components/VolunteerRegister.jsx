import { useState, useEffect, useRef } from "react";
import "./VolunteerRegister.css";
import { registerVolunteer, getSlots } from "../api";

const COUNTRY_CODES = [
  { code: "+261", flag: "🇲🇬", name: "Madagascar" },
  { code: "+213", flag: "🇩🇿", name: "Algeria" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+243", flag: "🇨🇩", name: "DR Congo" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" }, 
  { code: "+255", flag: "🇹🇿", name: "Tanzania" },
  { code: "+216", flag: "🇹🇳", name: "Tunisia" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+1", flag: "🇺🇸", name: "USA / Canada" },
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(n) {
  return String(n).padStart(2, "0");
}
function toKey(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}
function monthKey(year, month) {
  return `${year}-${pad(month + 1)}`;
}

const COLORS = [
  "#e63946",
  "#f4a261",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#fbbf24",
  "#fff",
];

function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pieces = Array.from({ length: 180 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      w: Math.random() * 14 + 5,
      h: Math.random() * 7 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: Math.random() * 4 + 1.5,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 7,
      drift: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.5,
    }));

    let raf;
    const startTime = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = (Date.now() - startTime) / 1000;
      const globalFade = elapsed > 4 ? Math.max(0, 1 - (elapsed - 4) / 1.5) : 1;

      pieces.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.opacity * globalFade;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (p.w > 14) {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();

        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });

      if (elapsed < 5.5) {
        raf = requestAnimationFrame(draw);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}

function Calendar({ year, month, selectedDate, onSelect, slots, loading }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="vr-cal-grid">
      {DAYS_OF_WEEK.map((d) => (
        <div key={d} className="vr-cal-header">
          {d}
        </div>
      ))}
      {loading ? (
        <div
          style={{
            gridColumn: "1/-1",
            textAlign: "center",
            padding: "24px",
            color: "#888",
          }}
        >
          Loading availability…
        </div>
      ) : (
        cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const key = toKey(year, month, day);
          const slot = slots[key];
          const isPast =
            new Date(year, month, day) <
            new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isSelected = selectedDate === key;
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          let cls = "vr-cal-day";
          if (isPast) cls += " past";
          else if (!slot) cls += " none";
          else if (slot.available) cls += " available";
          else cls += " full";
          if (isSelected) cls += " selected";
          if (isToday) cls += " today";

          return (
            <button
              key={key}
              type="button"
              className={cls}
              onClick={() => !isPast && slot && onSelect(key)}
              disabled={isPast || !slot}
              title={
                slot
                  ? slot.available
                    ? `${slot.spots} spots — ${slot.program}`
                    : "Fully booked"
                  : ""
              }
            >
              <span className="vr-cal-num">{day}</span>
              {slot && !isPast && (
                <span
                  className={`vr-cal-dot ${
                    slot.available ? "dot-green" : "dot-red"
                  }`}
                />
              )}
            </button>
          );
        })
      )}
    </div>
  );
}

function SlotDetail({ dateKey, slot }) {
  if (!slot) return null;
  const [y, m, d] = dateKey.split("-");
  const formatted = new Date(
    Number(y),
    Number(m) - 1,
    Number(d)
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`vr-slot-detail ${slot.available ? "slot-open" : "slot-full"}`}
    >
      <div className="vr-slot-top">
        <span
          className={`vr-slot-badge ${
            slot.available ? "badge-open" : "badge-full"
          }`}
        >
          {slot.available ? " Available" : " Full"}
        </span>
        <span className="vr-slot-program">{slot.program}</span>
      </div>
      <p className="vr-slot-date">
        <img src="/calendar.png" alt="" className="img-icon" /> {formatted}
      </p>
      {slot.available ? (
        <p className="vr-slot-spots">
          <strong>{slot.spots}</strong> spot{slot.spots !== 1 ? "s" : ""}{" "}
          remaining
        </p>
      ) : (
        <p className="vr-slot-spots">
          All spots have been filled for this date.
        </p>
      )}
    </div>
  );
}

function SuccessScreen({ firstName, selectedDate, program, onClose }) {
  const [y, m, d] = selectedDate.split("-");
  const formatted = new Date(
    Number(y),
    Number(m) - 1,
    Number(d)
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Confetti />
      <div className="successpage">
        <div className="vr-success">
          <div className="vr-success-icon-wrap">
            <div className="vr-success-ring" />
            <div className="vr-success-icon">
              <img src="/community.png" alt="community" />
            </div>
          </div>
          <h2 className="vr-success-title">You're In, {firstName}!</h2>
          <p className="vr-success-sub">
            Your volunteer registration has been successfully submitted.
            <br />
            Welcome to the <strong>Tanora ChangeMakers</strong> community!
          </p>

          <div className="vr-success-card">
            <div className="vr-success-row">
              <span className="success-flex">
                <img src="/book.png" alt="" className="img-success-icon" />{" "}
                Start Date
              </span>
              <strong>{formatted}</strong>
            </div>
            <div className="vr-success-row">
              <span className="success-flex">
                <img
                  src="/graduation.png"
                  alt=""
                  className="img-success-icon"
                />{" "}
                Program
              </span>
              <strong>{program}</strong>
            </div>
            <div className="vr-success-row">
              <span className="success-flex">
                <img src="/status.png" alt="" className="img-success-icon" />{" "}
                Status
              </span>
              <strong style={{ color: "#22c55e" }}>✓ Confirmed</strong>
            </div>
          </div>

          <div className="vr-success-cert-note">
            You will receive an <strong>official certificate</strong>{" "}
            recognizing your service commitment. A confirmation will be sent to
            you shortly.
          </div>

          <button className="vr-btn-primary" onClick={onClose}>
            ← Back to Home
          </button>
        </div>
      </div>
    </>
  );
}

export default function VolunteerRegister({ onClose }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+261");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [slots, setSlots] = useState({});
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setSlotsLoading(true);
    setSelectedDate(null);
    getSlots(monthKey(year, month))
      .then(setSlots)
      .catch(() => setSlots({}))
      .finally(() => setSlotsLoading(false));
  }, [year, month]);

  const selectedSlot = selectedDate ? slots[selectedDate] : null;

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!lastName.trim()) e.lastName = "Last name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
    else if (!/^\d{6,15}$/.test(whatsapp.replace(/\s/g, "")))
      e.whatsapp = "Enter a valid phone number";
    if (!selectedDate) e.date = "Please select a start date";
    else if (!selectedSlot?.available) e.date = "This date is fully booked";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setApiError("");
    try {
      await registerVolunteer({
        first_name: firstName,
        last_name: lastName,
        email,
        whatsapp: countryCode + whatsapp,
        start_date: selectedDate,
        program: selectedSlot.program,
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SuccessScreen
        firstName={firstName}
        selectedDate={selectedDate}
        program={selectedSlot?.program}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="vr-page">
      <div className="vr-header">
        <p className="vr-subtitle">
          <img src="/heart.png" alt="" className="vr-icon" />
          Fill in your details and pick your start date from the calendar below.
        </p>
        <button className="vr-back-btn" onClick={onClose}>
          <img src="/back_.png" alt="" />
          <span>Back</span>
        </button>
      </div>

      <div className="vr-body">
        <form className="vr-form" onSubmit={handleSubmit} noValidate>
          <h2 className="vr-form-title">Your Information</h2>

          {apiError && (
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 16,
                color: "#991b1b",
                fontSize: 14,
              }}
            >
              {apiError}
            </div>
          )}

          <div className="vr-row-2">
            <div className="vr-field">
              <label className="vr-label">First Name</label>
              <input
                className={`vr-input ${errors.firstName ? "input-error" : ""}`}
                type="text"
                placeholder="Prénom(s)"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrors((err) => ({ ...err, firstName: "" }));
                }}
              />
              {errors.firstName && (
                <span className="vr-error">{errors.firstName}</span>
              )}
            </div>
            <div className="vr-field">
              <label className="vr-label">Last Name</label>
              <input
                className={`vr-input ${errors.lastName ? "input-error" : ""}`}
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrors((err) => ({ ...err, lastName: "" }));
                }}
              />
              {errors.lastName && (
                <span className="vr-error">{errors.lastName}</span>
              )}
            </div>
          </div>
          <div className="vr-row-2">
            <div className="vr-field">
              <label className="vr-label">Email Address</label>
              <input
                className={`vr-input ${errors.email ? "input-error" : ""}`}
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((err) => ({ ...err, email: "" }));
                }}
              />
              {errors.email && <span className="vr-error">{errors.email}</span>}
            </div>

            <div className="vr-field">
              <label className="vr-label">WhatsApp Number</label>
              <div
                className={`vr-phone-wrap ${
                  errors.whatsapp ? "input-error" : ""
                }`}
              >
                <select
                  className="vr-country-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} {c.name}
                    </option>
                  ))}
                </select>
                <input
                  className="vr-phone-input"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value.replace(/[^\d\s]/g, ""));
                    setErrors((err) => ({ ...err, whatsapp: "" }));
                  }}
                />
              </div>
              {errors.whatsapp && (
                <span className="vr-error">{errors.whatsapp}</span>
              )}
            </div>
          </div>

          <div className="vr-legend">
            <span className="vr-legend-item">
              <span className="vr-legend-dot dot-green" />
              Available
            </span>
            <span className="vr-legend-item">
              <span className="vr-legend-dot dot-gray" />
              No Session
            </span>
          </div>

          <div className="vr-calendar-wrap">
            <div className="vr-cal-nav">
              <button
                type="button"
                className="vr-cal-arrow"
                onClick={prevMonth}
              >
                ‹
              </button>
              <span className="vr-cal-month">
                {MONTHS[month]} {year}
              </span>
              <button
                type="button"
                className="vr-cal-arrow"
                onClick={nextMonth}
              >
                ›
              </button>
            </div>
            <Calendar
              year={year}
              month={month}
              selectedDate={selectedDate}
              slots={slots}
              loading={slotsLoading}
              onSelect={(key) => {
                setSelectedDate(key);
                setErrors((err) => ({ ...err, date: "" }));
              }}
            />
            {errors.date && (
              <span
                className="vr-error"
                style={{ marginTop: 8, display: "block" }}
              >
                {errors.date}
              </span>
            )}
          </div>

          {selectedDate && (
            <SlotDetail dateKey={selectedDate} slot={selectedSlot} />
          )}
          <button
            type="submit"
            className="vr-btn-primary"
            disabled={
              submitting || Boolean(selectedSlot && !selectedSlot.available)
            }
          >
            {submitting ? "Submitting…" : "Submit Registration"}
          </button>
        </form>

        <aside className="vr-aside">
          <div className="vr-aside-card">
            <div className="vr-aside-icon">
              <img src="logo.png" alt="" />
            </div>
            <h3>Eligibility</h3>
            <ul className="vr-aside-list">
              <li>
                <img src="/check_.png" alt="" className="img-icon" />- Age: 16+
              </li>
              <li>
                <img src="/check_.png" alt="" className="img-icon" />
               - Commitment: 2 hours per week
              </li>
              <li>
                <img src="/check_.png" alt="" className="img-icon" />- For STEM teachers:
                 math, science, coding, or robotics skills
              </li>
              <li>
                <img src="/check_.png" alt="" className="img-icon" />- For language teachers: English/French/German profeciency.
              </li>
              <li>
                <img src="/check_.png" alt="" className="img-icon" />- Able to
                volunteer consistently for at least 2.5 months.
              </li>
            </ul>
          </div>
          <div className="vr-aside-card highlight-card">
            <div className="vr-aside-icon"></div>
            <h3>Programs Available: </h3>
            <div className="vr-program-tags">
              <div>STEM</div>
              <div>Spoken English</div>
              <div>Spoken French</div>
              <div>Spoken German</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
