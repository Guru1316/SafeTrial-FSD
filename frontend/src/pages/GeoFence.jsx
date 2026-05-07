import { useEffect, useState } from "react";
import { api } from "../api";

const zoneColors = { SAFE: "badge-safe", RISK: "badge-risk", RESTRICTED: "badge-warn" };

export default function GeoFence() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("list");
  const [form, setForm] = useState({ name: "", centerLat: "", centerLng: "", radius: "", zoneType: "SAFE" });
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getGeoFences().then(setZones).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const flash = (m, type = "success") => { setMsg({ m, type }); setTimeout(() => setMsg(null), 3000); };
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await api.createGeoFence({
        ...form,
        centerLat: parseFloat(form.centerLat),
        centerLng: parseFloat(form.centerLng),
        radius: parseFloat(form.radius),
      });
      setZones(prev => [...prev, res]);
      flash(`✅ Zone "${res.name}" created`);
      setForm({ name: "", centerLat: "", centerLng: "", radius: "", zoneType: "SAFE" });
      setTab("list");
    } catch { flash("❌ Failed to create zone", "error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>GeoFence Zones</h1>
          <p>Define geographic safety boundaries — {zones.length} zones active</p>
        </div>
        <button className="btn btn-primary" onClick={() => setTab(tab === "new" ? "list" : "new")}>
          {tab === "new" ? "← Back" : "➕ Add Zone"}
        </button>
      </div>

      {msg && <div className={`banner ${msg.type}`}>{msg.m}</div>}

      <div className="tabs">
        <div className={`tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>All Zones</div>
        <div className={`tab ${tab === "new" ? "active" : ""}`} onClick={() => setTab("new")}>Add Zone</div>
      </div>

      {tab === "list" && (
        loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Center Lat</th><th>Center Lng</th><th>Radius (km)</th><th>Zone Type</th></tr>
                </thead>
                <tbody>
                  {zones.map(z => (
                    <tr key={z.id}>
                      <td style={{ color: "var(--muted)" }}>#{z.id}</td>
                      <td style={{ fontWeight: 600, color: "var(--text)" }}>{z.name}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{z.centerLat}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{z.centerLng}</td>
                      <td>{z.radius} km</td>
                      <td><span className={`badge ${zoneColors[z.zoneType] || "badge-warn"}`}>{z.zoneType}</span></td>
                    </tr>
                  ))}
                  {zones.length === 0 && (
                    <tr><td colSpan={6}>
                      <div className="empty-state"><div className="empty-icon">📍</div><p>No geofence zones defined</p></div>
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
          <div className="card-header"><h3>Create GeoFence Zone</h3></div>
          <div className="card-body">
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Zone Name *</label>
                  <input value={form.name} onChange={set("name")} placeholder="e.g. Restricted Forest Area" required />
                </div>
                <div className="form-group">
                  <label>Center Latitude *</label>
                  <input type="number" step="any" value={form.centerLat} onChange={set("centerLat")} placeholder="e.g. 15.4909" required />
                </div>
                <div className="form-group">
                  <label>Center Longitude *</label>
                  <input type="number" step="any" value={form.centerLng} onChange={set("centerLng")} placeholder="e.g. 73.8278" required />
                </div>
                <div className="form-group">
                  <label>Radius (km) *</label>
                  <input type="number" step="any" value={form.radius} onChange={set("radius")} placeholder="e.g. 5" required />
                </div>
                <div className="form-group">
                  <label>Zone Type</label>
                  <select value={form.zoneType} onChange={set("zoneType")}>
                    <option>SAFE</option><option>RISK</option><option>RESTRICTED</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Creating...</> : "📍 Create Zone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
