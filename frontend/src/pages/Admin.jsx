import { useEffect, useState } from "react";
import { api } from "../api";

export default function Admin() {
  const [tab, setTab] = useState("tourists");
  const [tourists, setTourists] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [panics, setPanics] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAdminTourists(),
      api.getAdminAlerts(),
      api.getPanicAlerts(),
      api.getAdminIncidents(),
    ]).then(([t, a, p, i]) => {
      setTourists(t); setAlerts(a); setPanics(p); setIncidents(i);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading admin data...</div>;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Admin Panel</h1>
          <p>Full system oversight and management</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="topbar-badge">🧳 {tourists.length} tourists</div>
          <div className="topbar-badge">🚨 {panics.length} panics</div>
        </div>
      </div>

      <div className="tabs">
        {[
          { key: "tourists", label: `🧳 Tourists (${tourists.length})` },
          { key: "alerts", label: `🔔 Alerts (${alerts.length})` },
          { key: "panic", label: `🚨 Panic (${panics.length})` },
          { key: "incidents", label: `📄 Incidents (${incidents.length})` },
        ].map(t => (
          <div key={t.key} className={`tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>{t.label}</div>
        ))}
      </div>

      {tab === "tourists" && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Nationality</th><th>Destination</th><th>Phone</th><th>Status</th><th>Panic</th><th>Last Updated</th></tr>
              </thead>
              <tbody>
                {tourists.map(t => (
                  <tr key={t.id}>
                    <td style={{ color: "var(--muted)" }}>#{t.id}</td>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>{t.fullName}</td>
                    <td>{t.nationality || "—"}</td>
                    <td>{t.destination}</td>
                    <td>{t.phoneNumber}</td>
                    <td><span className={`badge badge-${(t.safetyStatus || "safe").toLowerCase()}`}>{t.safetyStatus || "SAFE"}</span></td>
                    <td>{t.panicTriggered ? <span className="badge badge-panic">🚨 YES</span> : <span style={{ color: "var(--muted)" }}>No</span>}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{t.lastUpdated ? new Date(t.lastUpdated).toLocaleString() : "Never"}</td>
                  </tr>
                ))}
                {tourists.length === 0 && <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">🧳</div><p>No tourists</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "alerts" && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Tourist ID</th><th>Type</th><th>Message</th><th>Lat</th><th>Lng</th><th>Time</th></tr>
              </thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id}>
                    <td style={{ color: "var(--muted)" }}>#{a.id}</td>
                    <td>#{a.touristId}</td>
                    <td><span className={`badge ${a.type === "PANIC" ? "badge-panic" : a.type === "GEOFENCE" ? "badge-risk" : "badge-warn"}`}>{a.type}</span></td>
                    <td>{a.message}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.latitude ?? "—"}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.longitude ?? "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{a.timestamp ? new Date(a.timestamp).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {alerts.length === 0 && <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">🔔</div><p>No alerts</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "panic" && (
        <div className="card">
          {panics.length > 0 && <div className="banner warn" style={{ margin: 16, marginBottom: 0 }}>🚨 {panics.length} active panic alert(s) require immediate attention</div>}
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Tourist ID</th><th>Message</th><th>Latitude</th><th>Longitude</th><th>Time</th></tr>
              </thead>
              <tbody>
                {panics.map(a => (
                  <tr key={a.id}>
                    <td style={{ color: "var(--muted)" }}>#{a.id}</td>
                    <td style={{ fontWeight: 600, color: "var(--danger)" }}>#{a.touristId}</td>
                    <td>{a.message}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.latitude ?? "—"}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.longitude ?? "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{a.timestamp ? new Date(a.timestamp).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {panics.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">✅</div><p>No panic alerts — all clear</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "incidents" && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Tourist ID</th><th>Title</th><th>Status</th><th>Created</th></tr>
              </thead>
              <tbody>
                {incidents.map(i => (
                  <tr key={i.id}>
                    <td style={{ color: "var(--muted)" }}>#{i.id}</td>
                    <td>#{i.touristId}</td>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>{i.title}</td>
                    <td><span className={`badge badge-${(i.status || "open").toLowerCase()}`}>{i.status}</span></td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{i.createdAt ? new Date(i.createdAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {incidents.length === 0 && <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">📄</div><p>No incidents</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
