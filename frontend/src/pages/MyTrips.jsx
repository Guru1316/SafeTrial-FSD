import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const statusBadge = { PLANNED: "badge-planned", ACTIVE: "badge-active", COMPLETED: "badge-completed" };

export default function MyTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("list");
  const [form, setForm] = useState({ source: "", destination: "", routeDetails: "", transportMode: "CAR", status: "PLANNED" });
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const touristId = user?.touristId;

  useEffect(() => {
    if (!touristId) { setLoading(false); return; }
    api.getTrips(touristId).then(setTrips).catch(() => setTrips([])).finally(() => setLoading(false));
  }, [touristId]);

  const flash = (m, type = "success") => { setMsg({ m, type }); setTimeout(() => setMsg(null), 3000); };
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!touristId) { flash("No tourist ID linked to your account. Contact admin.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await api.createTrip({ ...form, touristId: Number(touristId) });
      setTrips(prev => [...prev, res]);
      flash(`✅ Trip #${res.id} created`);
      setForm({ source: "", destination: "", routeDetails: "", transportMode: "CAR", status: "PLANNED" });
      setTab("list");
    } catch { flash("❌ Failed to create trip", "error"); }
    finally { setSubmitting(false); }
  };

  if (!touristId) return (
    <div className="animate-in">
      <div className="page-header"><div className="page-header-left"><h1>My Trips</h1></div></div>
      <div className="banner warn">⚠️ No Tourist ID linked to your account. Ask an admin to register you and link your Tourist ID during account creation.</div>
    </div>
  );

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left"><h1>My Trips</h1><p>Your travel plans</p></div>
        <button className="btn btn-primary" onClick={() => setTab(tab === "new" ? "list" : "new")}>
          {tab === "new" ? "← Back" : "➕ Plan Trip"}
        </button>
      </div>
      {msg && <div className={`banner ${msg.type}`}>{msg.m}</div>}
      <div className="tabs">
        <div className={`tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>My Trips</div>
        <div className={`tab ${tab === "new" ? "active" : ""}`} onClick={() => setTab("new")}>Plan New</div>
      </div>
      {tab === "list" && (
        loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Source</th><th>Destination</th><th>Mode</th><th>Status</th></tr></thead>
                <tbody>
                  {trips.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: "var(--muted)" }}>#{t.id}</td>
                      <td>{t.source}</td>
                      <td style={{ fontWeight: 600 }}>{t.destination}</td>
                      <td><span className="badge badge-planned">{t.transportMode}</span></td>
                      <td><span className={`badge ${statusBadge[t.status] || "badge-planned"}`}>{t.status}</span></td>
                    </tr>
                  ))}
                  {trips.length === 0 && <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">🗺️</div><p>No trips planned yet</p></div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
      {tab === "new" && (
        <div className="card">
          <div className="card-header"><h3>Plan New Trip</h3></div>
          <div className="card-body">
            <form onSubmit={submit}>
              <div className="form-grid" style={{ marginBottom: 16 }}>
                <div className="form-group"><label>Source *</label><input value={form.source} onChange={set("source")} placeholder="e.g. Mumbai" required /></div>
                <div className="form-group"><label>Destination *</label><input value={form.destination} onChange={set("destination")} placeholder="e.g. Goa" required /></div>
                <div className="form-group"><label>Transport Mode</label>
                  <select value={form.transportMode} onChange={set("transportMode")}>
                    <option>CAR</option><option>BUS</option><option>WALK</option><option>TRAIN</option><option>FLIGHT</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Route Details</label><textarea value={form.routeDetails} onChange={set("routeDetails")} placeholder="Describe your route..." /></div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Creating...</> : "🗺️ Create Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
