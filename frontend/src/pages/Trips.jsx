import { useState, useEffect } from "react";
import { api } from "../api";

const statusBadge = { PLANNED: "badge-planned", ACTIVE: "badge-active", COMPLETED: "badge-completed" };

export default function Trips() {
  const [tourists, setTourists] = useState([]);
  const [selectedId, setSelectedId] = useState("all");
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTourists(), api.getAllTrips()])
      .then(([list, trips]) => { setTourists(list); setAllTrips(trips); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleTouristChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setLoading(true);
    const fn = id === "all" ? api.getAllTrips() : api.getTrips(id);
    fn.then(setAllTrips).catch(() => setAllTrips([])).finally(() => setLoading(false));
  };

  const getTouristName = (id) => tourists.find(t => String(t.id) === String(id))?.fullName || `Tourist #${id}`;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Trip Plans</h1>
          <p>All tourist trip plans — {allTrips.length} total</p>
        </div>
      </div>

      <div className="filter-row">
        <select className="search-input" style={{ minWidth: 260 }} value={selectedId} onChange={handleTouristChange}>
          <option value="all">All Tourists</option>
          {tourists.map(t => (
            <option key={t.id} value={t.id}>#{t.id} — {t.fullName}</option>
          ))}
        </select>
      </div>

      {loading ? <div className="loading"><div className="spinner" />Loading trips...</div> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Trip ID</th><th>Tourist</th><th>Source</th><th>Destination</th><th>Mode</th><th>Status</th><th>Route Details</th></tr>
              </thead>
              <tbody>
                {allTrips.map(t => (
                  <tr key={t.id}>
                    <td style={{ color: "var(--muted)" }}>#{t.id}</td>
                    <td style={{ fontWeight: 600, color: "var(--accent)" }}>{getTouristName(t.touristId)}</td>
                    <td>{t.source}</td>
                    <td style={{ fontWeight: 600 }}>{t.destination}</td>
                    <td><span className="badge badge-planned">{t.transportMode}</span></td>
                    <td><span className={`badge ${statusBadge[t.status] || "badge-planned"}`}>{t.status}</span></td>
                    <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--muted)", fontSize: 12 }}>{t.routeDetails || "—"}</td>
                  </tr>
                ))}
                {allTrips.length === 0 && (
                  <tr><td colSpan={7}>
                    <div className="empty-state"><div className="empty-icon">🗺️</div><p>No trips found. Tourists can create trips from their dashboard.</p></div>
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
