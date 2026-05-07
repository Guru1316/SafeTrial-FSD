import { useEffect, useState } from "react";
import { api } from "../api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [touristId, setTouristId] = useState("");
  const [search, setSearch] = useState("");

  const load = (tid) => {
    setLoading(true);
    const fn = tid ? api.getAlertsByTourist(tid) : api.getAlerts();
    fn.then(setAlerts).catch(() => setAlerts([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(""); }, []);

  const filtered = alerts.filter(a =>
    a.message?.toLowerCase().includes(search.toLowerCase()) ||
    a.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Alerts</h1>
          <p>All system safety alerts — {alerts.length} total</p>
        </div>
      </div>

      <div className="filter-row">
        <input className="search-input" placeholder="🔍  Search alerts..." value={search} onChange={e => setSearch(e.target.value)} />
        <input className="search-input" style={{ minWidth: 160 }} placeholder="Filter by Tourist ID..." value={touristId} onChange={e => setTouristId(e.target.value)} />
        <button className="btn btn-primary" onClick={() => load(touristId)}>Search</button>
        <button className="btn btn-ghost" onClick={() => { setTouristId(""); setSearch(""); load(""); }}>Clear</button>
      </div>

      {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Tourist ID</th><th>Type</th><th>Message</th><th>Latitude</th><th>Longitude</th><th>Timestamp</th></tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td style={{ color: "var(--muted)" }}>#{a.id}</td>
                    <td>#{a.touristId}</td>
                    <td>
                      <span className={`badge ${a.type === "PANIC" ? "badge-panic" : a.type === "GEOFENCE" ? "badge-risk" : "badge-warn"}`}>
                        {a.type}
                      </span>
                    </td>
                    <td>{a.message}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.latitude ?? "—"}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.longitude ?? "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{a.timestamp ? new Date(a.timestamp).toLocaleString() : "—"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7}>
                    <div className="empty-state"><div className="empty-icon">🔔</div><p>No alerts found</p></div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
