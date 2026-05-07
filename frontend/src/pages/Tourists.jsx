import { useEffect, useState } from "react";
import { api } from "../api";

export default function Tourists() {
  const [tourists, setTourists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getTourists().then(setTourists).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = tourists.filter(t =>
    t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    t.destination?.toLowerCase().includes(search.toLowerCase()) ||
    t.nationality?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading"><div className="spinner" />Loading tourists...</div>;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Tourists</h1>
          <p>All registered tourists — {tourists.length} total</p>
        </div>
      </div>

      <div className="filter-row">
        <input className="search-input" placeholder="🔍  Search by name, destination, nationality..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Nationality</th><th>Destination</th>
                <th>Phone</th><th>Safety Status</th><th>Panic</th><th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td style={{ color: "var(--muted)" }}>#{t.id}</td>
                  <td style={{ fontWeight: 600, color: "var(--text)" }}>{t.fullName}</td>
                  <td>{t.nationality || "—"}</td>
                  <td>{t.destination}</td>
                  <td>{t.phoneNumber}</td>
                  <td>
                    <span className={`badge badge-${(t.safetyStatus || "safe").toLowerCase()}`}>
                      {t.safetyStatus || "SAFE"}
                    </span>
                  </td>
                  <td>
                    {t.panicTriggered
                      ? <span className="badge badge-panic">🚨 PANIC</span>
                      : <span style={{ color: "var(--muted)" }}>—</span>}
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {t.lastUpdated ? new Date(t.lastUpdated).toLocaleString() : "Never"}
                  </td>

                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8}>
                  <div className="empty-state"><div className="empty-icon">🧳</div><p>No tourists found. <a href="/register" style={{ color: "var(--accent)" }}>Register one →</a></p></div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
