import "./VolunteerTable.css";

function Badge({ status }) {
  const map = {
    confirmed: { bg:"#dcfce7", color:"#166534", label:"✓ Confirmed" },
    pending:   { bg:"#fef9c3", color:"#854d0e", label:"Pending" },
    cancelled: { bg:"#fee2e2", color:"#991b1b", label:"✕ Cancelled" },
  };
  const s = map[status] || map.confirmed;
  return (
    <span className="vt-badge" style={{ background:s.bg, color:s.color }}>
      {s.label}
    </span>
  );
}

function formatDate(dateStr, withTime = false) {
  if (!dateStr) return "—";
  const d = new Date(withTime ? dateStr : dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month:"short", day:"numeric", year:"numeric",
  });
}
function VolunteerCard({ v, index }) {
  const initials = `${v.first_name?.[0] || ""}${v.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="vt-card">
      <div className="vt-card-top">
        <div className="vt-avatar">{initials}</div>
        <div className="vt-card-name-block">
          <p className="vt-card-name">{v.first_name} {v.last_name}</p>
          <p className="vt-card-program">{v.program}</p>
        </div>
        <Badge status={v.status} />
      </div>

      <div className="vt-card-details">
        <div className="vt-card-row">
          <span className="vt-card-label"><img src="/gmail.png" className="icon" /> Email</span>
          <span className="vt-card-value">{v.email}</span>
        </div>
        <div className="vt-card-row">
          <span className="vt-card-label"><img src="/whatsapp_.png" className="icon" /> WhatsApp</span>
          <span className="vt-card-value">{v.whatsapp || "—"}</span>
        </div>
        <div className="vt-card-row">
          <span className="vt-card-label"><img src="/calendar.png" className="icon"/> Start Date</span>
          <span className="vt-card-value vt-card-date">{formatDate(v.start_date)}</span>
        </div>
        <div className="vt-card-row">
          <span className="vt-card-label"><img src="/registration.png" className="icon" /> Registered</span>
          <span className="vt-card-value">{formatDate(v.created_at, true)}</span>
        </div>
      </div>

      <div className="vt-card-index">#{index}</div>
    </div>
  );
}

export default function VolunteerTable({ volunteers, total, page, pages, onPage }) {
  if (volunteers.length === 0) {
    return (
      <div className="vt-empty">
        <img src="/nothingfound.png" alt="" />
        <p>No volunteers found.</p>
      </div>
    );
  }

  return (
    <div className="vt-root">
      <div className="vt-table-wrap">
        <table className="vt-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>WhatsApp</th>
              <th>Program</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v, i) => (
              <tr key={v.id}>
                <td className="vt-muted">{(page - 1) * 20 + i + 1}</td>
                <td><strong>{v.first_name} {v.last_name}</strong></td>
                <td className="vt-muted">{v.email}</td>
                <td className="vt-muted">{v.whatsapp || "—"}</td>
                <td>
                  <span className="vt-program-tag">{v.program}</span>
                </td>
                <td className="vt-date">{formatDate(v.start_date)}</td>
                <td><Badge status={v.status} /></td>
                <td className="vt-muted">{formatDate(v.created_at, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="vt-cards">
        {volunteers.map((v, i) => (
          <VolunteerCard key={v.id} v={v} index={(page - 1) * 20 + i + 1} />
        ))}
      </div>

      <div className="vt-pagination">
        <span className="vt-page-info">
          Showing <strong>{volunteers.length}</strong> of <strong>{total}</strong> volunteers
        </span>
        <div className="vt-page-btns">
          <button
            className="vt-page-btn"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          >
            ‹ Prev
          </button>
          <span className="vt-page-cur">{page} / {pages}</span>
          <button
            className="vt-page-btn"
            disabled={page >= pages}
            onClick={() => onPage(page + 1)}
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}
