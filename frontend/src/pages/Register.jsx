import { useState } from "react";
import { api } from "../api";

const init = {
  fullName: "", gender: "", nationality: "", passportNumber: "",
  phoneNumber: "", emergencyName: "", emergencyPhone: "",
  emergencyRelation: "", destination: "", itinerary: "",
};

export default function Register() {
  const [form, setForm] = useState(init);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null); setLoading(true);
    try {
      const res = await api.registerTourist(form);
      setMsg({ type: "success", m: `✅ Tourist "${res.fullName}" registered! ID: ${res.id} | Hash: ${res.digitalIdHash?.slice(0, 16)}...` });
      setForm(init);
    } catch {
      setMsg({ type: "error", m: "❌ Registration failed. Check all required fields." });
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Register Tourist</h1>
          <p>Add a new tourist — a blockchain hash will be auto-generated</p>
        </div>
      </div>

      {msg && <div className={`banner ${msg.type}`}>{msg.m}</div>}

      <div className="card">
        <div className="card-header"><h3>Tourist Information</h3></div>
        <div className="card-body">
          <form onSubmit={submit}>
            <div className="section-title">Personal Details</div>
            <div className="form-grid" style={{ marginBottom: 20 }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.fullName} onChange={set("fullName")} placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={form.gender} onChange={set("gender")}>
                  <option value="">Select gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nationality</label>
                <input value={form.nationality} onChange={set("nationality")} placeholder="e.g. Indian" />
              </div>
              <div className="form-group">
                <label>Passport Number *</label>
                <input value={form.passportNumber} onChange={set("passportNumber")} placeholder="A1234567" required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="+91 9876543210" required />
              </div>
            </div>

            <div className="section-title">Emergency Contact</div>
            <div className="form-grid" style={{ marginBottom: 20 }}>
              <div className="form-group">
                <label>Contact Name *</label>
                <input value={form.emergencyName} onChange={set("emergencyName")} placeholder="Jane Doe" required />
              </div>
              <div className="form-group">
                <label>Contact Phone *</label>
                <input value={form.emergencyPhone} onChange={set("emergencyPhone")} placeholder="+91 9876543210" required />
              </div>
              <div className="form-group">
                <label>Relation</label>
                <input value={form.emergencyRelation} onChange={set("emergencyRelation")} placeholder="e.g. Spouse" />
              </div>
            </div>

            <div className="section-title">Travel Details</div>
            <div className="form-grid" style={{ marginBottom: 20 }}>
              <div className="form-group">
                <label>Destination *</label>
                <input value={form.destination} onChange={set("destination")} placeholder="e.g. Goa, India" required />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label>Itinerary *</label>
              <textarea value={form.itinerary} onChange={set("itinerary")} placeholder="Day 1: Arrive at Goa airport..." required />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Registering...</> : "🛡️ Register Tourist"}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => setForm(init)}>Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
