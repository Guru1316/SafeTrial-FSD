import { useState, useEffect } from "react";
import { api } from "../api";

export default function Contacts() {
  const [tourists, setTourists] = useState([]);
  const [selectedId, setSelectedId] = useState("all");
  const [allContacts, setAllContacts] = useState([]);
  const [tab, setTab] = useState("list");
  const [form, setForm] = useState({ touristId: "", name: "", phone: "", relation: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load all tourists + their contacts on mount
  useEffect(() => {
    api.getTourists()
      .then(list => {
        setTourists(list);
        if (list.length > 0) {
          Promise.all(list.map(t => api.getContacts(t.id).catch(() => [])))
            .then(results => setAllContacts(results.flat()));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const flash = (m, type = "success") => { setMsg({ m, type }); setTimeout(() => setMsg(null), 3000); };
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleTouristChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    if (id === "all") {
      setLoading(true);
      Promise.all(tourists.map(t => api.getContacts(t.id).catch(() => [])))
        .then(results => setAllContacts(results.flat()))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      api.getContacts(id).then(setAllContacts).catch(() => setAllContacts([])).finally(() => setLoading(false));
    }
  };

  const submit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await api.addContact({ ...form, touristId: Number(form.touristId) });
      flash(`✅ Contact "${res.name}" added`);
      setForm({ touristId: "", name: "", phone: "", relation: "" });
      setTab("list");
      // Refresh
      if (selectedId === "all") {
        Promise.all(tourists.map(t => api.getContacts(t.id).catch(() => []))).then(r => setAllContacts(r.flat()));
      } else {
        api.getContacts(selectedId).then(setAllContacts).catch(() => {});
      }
    } catch (e) { flash(`❌ ${e.message}`, "error"); }
    finally { setSubmitting(false); }
  };

  const getTouristName = (id) => tourists.find(t => String(t.id) === String(id))?.fullName || `Tourist #${id}`;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Emergency Contacts</h1>
          <p>All tourist emergency contacts — {allContacts.length} total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setTab(tab === "new" ? "list" : "new")}>
          {tab === "new" ? "← Back" : "➕ Add Contact"}
        </button>
      </div>

      {msg && <div className={`banner ${msg.type}`}>{msg.m}</div>}

      <div className="tabs">
        <div className={`tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>All Contacts</div>
        <div className={`tab ${tab === "new" ? "active" : ""}`} onClick={() => setTab("new")}>Add Contact</div>
      </div>

      {tab === "list" && (
        <>
          <div className="filter-row">
            <select
              className="search-input"
              style={{ minWidth: 260 }}
              value={selectedId}
              onChange={handleTouristChange}
            >
              <option value="all">All Tourists</option>
              {tourists.map(t => (
                <option key={t.id} value={t.id}>#{t.id} — {t.fullName}</option>
              ))}
            </select>
          </div>

          {loading ? <div className="loading"><div className="spinner" />Loading contacts...</div> : (
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Tourist</th><th>Contact Name</th><th>Phone</th><th>Relation</th></tr>
                  </thead>
                  <tbody>
                    {allContacts.map(c => (
                      <tr key={c.id}>
                        <td style={{ color: "var(--muted)" }}>#{c.id}</td>
                        <td style={{ fontWeight: 600, color: "var(--accent)" }}>{getTouristName(c.touristId)}</td>
                        <td style={{ fontWeight: 600, color: "var(--text)" }}>{c.name}</td>
                        <td>{c.phone}</td>
                        <td>{c.relation || "—"}</td>
                      </tr>
                    ))}
                    {allContacts.length === 0 && (
                      <tr><td colSpan={5}>
                        <div className="empty-state"><div className="empty-icon">📞</div><p>No emergency contacts found.</p></div>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "new" && (
        <div className="card">
          <div className="card-header"><h3>Add Emergency Contact</h3></div>
          <div className="card-body">
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tourist *</label>
                  <select value={form.touristId} onChange={set("touristId")} required>
                    <option value="">Select tourist...</option>
                    {tourists.map(t => (
                      <option key={t.id} value={t.id}>#{t.id} — {t.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact Name *</label>
                  <input value={form.name} onChange={set("name")} placeholder="Full name" required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input value={form.phone} onChange={set("phone")} placeholder="+91 9876543210" required />
                </div>
                <div className="form-group">
                  <label>Relation</label>
                  <input value={form.relation} onChange={set("relation")} placeholder="e.g. Parent, Spouse" />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Adding...</> : "📞 Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
