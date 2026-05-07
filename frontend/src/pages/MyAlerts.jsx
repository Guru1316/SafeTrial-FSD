import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function MyAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const touristId = user?.touristId;

  useEffect(() => {
    if (!touristId) { setLoading(false); return; }
    api.getAlertsByTourist(touristId).then(setAlerts).catch(() => {}).finally(() => setLoading(false));
  }, [touristId]);

  if (!touristId) return (
    <div className="animate-in">
      <div className="page-header"><div className="page-header-left"><h1>My Alerts</h1></div></div>
      <div className="banner warn">⚠️ No Tourist ID linked to your account.</div>
    </div>
  );

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left"><h1>My Alerts</h1><p>Safety alerts for your account</p></div>
      </div>
      {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Type</th><th>Message</th><th>Location</th><th>Time</th></tr></thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id}>
                    <td style={{ color: "var(--muted)" }}>#{a.id}</td>
                    <td><span className={`badge ${a.type === "PANIC" ? "badge-panic" : a.type === "GEOFENCE" ? "badge-risk" : "badge-warn"}`}>{a.type}</span></td>
                    <td>{a.message}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.latitude != null ? `${a.latitude}, ${a.longitude}` : "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{a.timestamp ? new Date(a.timestamp).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {alerts.length === 0 && <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">✅</div><p>No alerts — you're safe!</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
