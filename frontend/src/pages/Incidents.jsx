import { useEffect, useState } from "react";
import { api } from "../api";

const statusBadge = { OPEN: "badge-open", INVESTIGATING: "badge-investigating", CLOSED: "badge-closed" };

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("list");
  const [form, setForm] = useState({ touristId: "", title: "", description: "" });
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getIncidents().then(setIncidents).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const flash = (m, type = "success") => { setMsg({ m, type }); setTimeout(() => setMsg(null), 3000); };
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await api.createIncident({ ...form, touristId: Number(form.touristId), status: "OPEN" });
      setIncidents(prev => [res, ...prev]);
      flash(`✅ Incident #${res.id} filed successfully`);
      setForm({ touristId: "", title: "", description: "" });
      setTab("list");
    } catch { flash("❌ Failed to file incident", "error"); }
    finally { setSubmitting(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.updateIncidentStatus(id, status);
      setIncidents(prev => prev.map(i => i.id === id ? res : i));
      flash(`Status updated to ${status}`);
    } catch { flash("Failed to update status", "error"); }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Incidents (E-FIR)</h1>
          <p>File and manage incident reports</p>
        </div>
        <button className="btn btn-primary" onClick={() => setTab(tab === "new" ? "list" : "new")}>
          {tab === "new" ? "← Back to List" : "➕ File Incident"}
        </button>
      </div>

      {msg && <div className={`banner ${msg.type}`}>{msg.m}</div>}

      <div className="tabs">
        <div className={`tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>All Incidents</div>
        <div className={`tab ${tab === "new" ? "active" : ""}`} onClick={() => setTab("new")}>File New</div>
      </div>

      {tab === "list" && (
        loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>ID</th><th>Tourist ID</th><th>Title</th><th>Description</th><th>Status</th><th>Created</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {incidents.map(i => (
                    <tr key={i.id}>
                      <td style={{ color: "var(--muted)" }}>#{i.id}</td>
                      <td>#{i.touristId}</td>
                      <td style={{ fontWeight: 600, color: "var(--text)" }}>{i.title}</td>
                      <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--muted)" }}>{i.description}</td>
                      <td><span className={`badge ${statusBadge[i.status] || "badge-warn"}`}>{i.status}</span></td>
                      <td style={{ color: "var(--muted)", fontSize: 12 }}>{i.createdAt ? new Date(i.createdAt).toLocaleString() : "—"}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {i.status !== "INVESTIGATING" && <button className="btn btn-sm btn-warn" onClick={() => updateStatus(i.id, "INVESTIGATING")}>Investigate</button>}
                          {i.status !== "CLOSED" && <button className="btn btn-sm btn-ghost" onClick={() => updateStatus(i.id, "CLOSED")}>Close</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {incidents.length === 0 && (
                    <tr><td colSpan={7}>
                      <div className="empty-state"><div className="empty-icon">📄</div><p>No incidents filed</p></div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {tab === "new" && (
        <div className="card">
          <div className="card-header"><h3>File New Incident Report</h3></div>
          <div className="card-body">
            <form onSubmit={submit}>
              <div className="form-grid" style={{ marginBottom: 16 }}>
                <div className="form-group">
                  <label>Tourist ID *</label>
                  <input type="number" value={form.touristId} onChange={set("touristId")} placeholder="e.g. 1" required />
                </div>
                <div className="form-group">
                  <label>Title *</label>
                  <input value={form.title} onChange={set("title")} placeholder="Brief incident title" required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={set("description")} placeholder="Detailed description of the incident..." />
              </div>
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
