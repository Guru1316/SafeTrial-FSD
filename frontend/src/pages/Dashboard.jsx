import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { isAdmin, user } = useAuth();
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [tourist, setTourist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      Promise.all([api.getDashboard(), api.getAlerts()])
        .then(([d, a]) => { setData(d); setAlerts(a.slice(0, 5)); })
        .catch(e => setErr(e.message))
        .finally(() => setLoading(false));
    } else {
      const tid = user?.touristId;
      Promise.all([
        tid ? api.getAlertsByTourist(tid) : Promise.resolve([]),
        tid ? api.getTourists().then(list => list.find(t => String(t.id) === String(tid)) || null) : Promise.resolve(null),
      ]).then(([a, t]) => { setAlerts(a.slice(0, 5)); setTourist(t); })
        .catch(e => setErr(e.message))
        .finally(() => setLoading(false));
    }
  }, [isAdmin, user]);

  if (loading) return <div className="loading"><div className="spinner" />Loading dashboard...</div>;
  if (err) return <div className="banner error" style={{ margin: 20 }}>❌ Failed to load: {err}</div>;

  /* ── TOURIST DASHBOARD ── */
  if (!isAdmin) return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Welcome, {user?.fullName || user?.username} 👋</h1>
          <p>Your personal safety overview</p>
        </div>
        <div className="topbar-right">
          <div className="topbar-badge">🟢 System Online</div>
          {user?.touristId && <div className="topbar-badge">🧳 ID: #{user.touristId}</div>}
        </div>
      </div>

      {!user?.touristId && (
        <div className="banner info" style={{ marginBottom: 20 }}>ℹ️ No tourist profile linked to your account.</div>
      )}
      {user?.touristId && !tourist && (
        <div className="banner warn" style={{ marginBottom: 20 }}>⚠️ Tourist profile not found in system.</div>
      )}

      {tourist && (
        <div className="card" style={{ marginBottom: 24, borderColor: tourist.safetyStatus === "RISK" ? "rgba(247,95,95,0.4)" : "rgba(79,207,142,0.3)" }}>
          <div className="card-body" style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Profile</div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{tourist.fullName}</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{tourist.destination}{tourist.nationality ? ` · ${tourist.nationality}` : ""}</div>
              <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2 }}>📞 {tourist.phoneNumber}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>SAFETY STATUS</div>
              <span className={`badge badge-${(tourist.safetyStatus || "safe").toLowerCase()}`} style={{ fontSize: 13, padding: "6px 16px" }}>
                {tourist.safetyStatus || "SAFE"}
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>SAFETY SCORE</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--success)" }}>{tourist.safetyScore ?? 100}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>DIGITAL ID</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--accent)", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={tourist.digitalIdHash}>
                {tourist.digitalIdHash?.slice(0, 18)}...
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>PANIC</div>
              {tourist.panicTriggered
                ? <span className="badge badge-panic">🚨 TRIGGERED</span>
                : <span style={{ color: "var(--success)", fontSize: 13 }}>✅ None</span>}
            </div>
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-title">My Recent Alerts</div>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Type</th><th>Message</th><th>Location</th><th>Time</th></tr></thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id}>
                    <td><span className={`badge ${a.type === "PANIC" ? "badge-panic" : a.type === "GEOFENCE" ? "badge-risk" : "badge-warn"}`}>{a.type}</span></td>
                    <td>{a.message}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--muted)" }}>{a.latitude != null ? `${a.latitude}, ${a.longitude}` : "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{a.timestamp ? new Date(a.timestamp).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {alerts.length === 0 && (
                  <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">✅</div><p>No alerts — you're safe!</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── ADMIN DASHBOARD ── */
  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Admin Dashboard</h1>
          <p>Real-time overview of all tourist safety metrics</p>
        </div>
        <div className="topbar-right">
          <div className="topbar-badge">🟢 System Online</div>
        </div>
      </div>

      {data && (
        <div className="card-grid">
          <div className="stat-card accent">
            <div className="stat-icon">🧳</div>
            <div className="label">Total Tourists</div>
            <div className="value">{data.totalTourists}</div>
            <div className="trend">Registered in system</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-icon">⚠️</div>
            <div className="label">At Risk</div>
            <div className="value">{data.riskTourists}</div>
            <div className="trend">Need attention</div>
          </div>
          <div className="stat-card warn">
            <div className="stat-icon">🚨</div>
            <div className="label">Panic Alerts</div>
            <div className="value">{data.panicCount}</div>
            <div className="trend">Active emergencies</div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">🔔</div>
            <div className="label">Total Alerts</div>
            <div className="value">{data.totalAlerts}</div>
            <div className="trend">All time</div>
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-title">Recent Alerts</div>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tourist ID</th><th>Type</th><th>Message</th><th>Time</th></tr></thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id}>
                    <td>#{a.touristId}</td>
                    <td><span className={`badge ${a.type === "PANIC" ? "badge-panic" : a.type === "GEOFENCE" ? "badge-risk" : "badge-warn"}`}>{a.type}</span></td>
                    <td>{a.message}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{a.timestamp ? new Date(a.timestamp).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {alerts.length === 0 && (
                  <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">✅</div><p>No alerts</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
