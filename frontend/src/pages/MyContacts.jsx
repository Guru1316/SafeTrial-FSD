import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function MyContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("list");
  const [form, setForm] = useState({ name: "", phone: "", relation: "" });
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const touristId = user?.touristId;

  useEffect(() => {
    if (!touristId) { setLoading(false); return; }
    api.getContacts(touristId).then(setContacts).catch(() => {}).finally(() => setLoading(false));
  }, [touristId]);

  const flash = (m, type = "success") => { setMsg({ m, type }); setTimeout(() => setMsg(null), 3000); };
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!touristId) { flash("No tourist ID linked.", "error"); return; }
    setSubmitting(true);
    try {
      const res = await api.addContact({ ...form, touristId: Number(touristId) });
      setContacts(prev => [...prev, res]);
      flash(`✅ Contact "${res.name}" added`);
      setForm({ name: "", phone: "", relation: "" });
      setTab("list");
    } catch { flash("❌ Failed to add contact", "error"); }
    finally { setSubmitting(false); }
  };

  if (!touristId) return (
    <div className="animate-in">
      <div className="page-header"><div className="page-header-left"><h1>Emergency Contacts</h1></div></div>
      <div className="banner warn">⚠️ No Tourist ID linked to your account.</div>
    </div>
  );

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left"><h1>Emergency Contacts</h1><p>Your emergency contact list</p></div>
        <button className="btn btn-primary" onClick={() => setTab(tab === "new" ? "list" : "new")}>
          {tab === "new" ? "← Back" : "➕ Add Contact"}
        </button>
      </div>
      {msg && <div className={`banner ${msg.type}`}>{msg.m}</div>}
      <div className="tabs">
        <div className={`tab ${tab === "list" ? "active" : ""}`} onClick={() => setTab("list")}>My Contacts</div>
        <div className={`tab ${tab === "new" ? "active" : ""}`} onClick={() => setTab("new")}>Add Contact</div>
      </div>
      {tab === "list" && (
        loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Relation</th></tr></thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c.id}>
                      <td style={{ color: "var(--muted)" }}>#{c.id}</td>
                      <td style={{ fontWeight: 600, color: "var(--text)" }}>{c.name}</td>
                      <td>{c.phone}</td>
                      <td>{c.relation || "—"}</td>
                    </tr>
                  ))}
                  {contacts.length === 0 && <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">📞</div><p>No contacts added yet</p></div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
      {tab === "new" && (
        <div className="card">
          <div className="card-header"><h3>Add Emergency Contact</h3></div>
          <div className="card-body">
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="form-group"><label>Name *</label><input value={form.name} onChange={set("name")} placeholder="Full name" required /></div>
                <div className="form-group"><label>Phone *</label><input value={form.phone} onChange={set("phone")} placeholder="+91 9876543210" required /></div>
                <div className="form-group"><label>Relation</label><input value={form.relation} onChange={set("relation")} placeholder="e.g. Parent" /></div>
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
