import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const statusBadge = { OPEN: "badge-open", INVESTIGATING: "badge-investigating", CLOSED: "badge-closed" };

export default function MyIncidents() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("list");
  const [form, setForm] = useState({ title: "", description: "" });
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const touristId = user?.touristId;

  useEffect(() => {
    if (!touristId) { setLoading(false); return; }
    api.getIncidentsByTourist(touristId).then(setIncidents).catch(() => {}).finally(() => setLoading(false));
  }, [touristId]);

  const flash = (m, type = "success") => { setMsg({ m, type }); setTimeout(() => setMsg(null), 3000); };
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!touristId) { flash("No tourist ID linked.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await api.createIncident({ ...form, touristId: Number(touristId), status: "OPEN" });
      setIncidents(prev => [res, ...prev]);
      flash(`✅ Incident #${res.id} filed`);
      setForm({ title: "", description: "" });
      setTab("list");
    } catch { flash("❌ Failed to file incident", "error"); }
    finally { setSubmitting(false); }
  };

  if (!touristId) return (
    <div className="animate-in">
      <div className="page-header"><div className="page-header-left"><h1>My Incidents</h1></div></div>
      <div className="banner warn">⚠️ No Tourist ID linked to your account.</div>
    </div>
  );

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left"><h1>My Incidents</h1><p>Your filed incident reports</p></div>
        <button className="btn btn-primary" onClick={() => setTab(tab === "new" ? "list" : "new")}>
          {tab === "new" ? "← Back" : "➕ File Incident"}
        </button>
      </div>
      {msg && <div className={`banner ${msg.type}`}>{msg.m}</div>}
      <div className="tabs">
        <div className={`tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>My Reports</div>
        <div className={`tab ${tab === "new" ? "active" : ""}`} onClick={() => setTab("new")}>File New</div>
      </div>
      {tab === "list" && (
        loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Filed On</th></tr></thead>
                <tbody>
                  {incidents.map(i => (
                    <tr key={i.id}>
                      <td style={{ color: "var(--muted)" }}>#{i.id}</td>
                      <td style={{ fontWeight: 600, color: "var(--text)" }}>{i.title}</td>
                      <td><span className={`badge ${statusBadge[i.status] || "badge-warn"}`}>{i.status}</span></td>
                      <td style={{ color: "var(--muted)", fontSize: 12 }}>{i.createdAt ? new Date(i.createdAt).toLocaleString() : "—"}</td>
                    </tr>
                  ))}
                  {incidents.length === 0 && <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">📄</div><p>No incidents filed</p></div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
      {tab === "new" && (
        <div className="card">
          <div className="card-header"><h3>File Incident Report</h3></div>
          <div className="card-body">
            <form onSubmit={submit}>
              <div className="form-group" style={{ marginBottom: 14 }}><label>Title *</label><input value={form.title} onChange={set("title")} placeholder="Brief incident title" required /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={set("description")} placeholder="Describe what happened..." /></div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Filing...</> : "📄 File Incident"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
