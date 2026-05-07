import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

const initReg = {
  username: "", password: "", confirmPassword: "",
  fullName: "", gender: "", nationality: "",
  passportNumber: "", phoneNumber: "",
  emergencyName: "", emergencyPhone: "", emergencyRelation: "",
  destination: "", itinerary: "",
};

export default function AuthPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("TOURIST");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [regForm, setRegForm] = useState(initReg);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const setL = (k) => (e) => setLoginForm(f => ({ ...f, [k]: e.target.value }));
  const setR = (k) => (e) => setRegForm(f => ({ ...f, [k]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const res = await api.login({ username: loginForm.username, password: loginForm.password });
      if (role !== "ALL" && res.role !== role) {
        setErr(`This account is a ${res.role} account, not ${role}. Please select the correct role.`);
        setLoading(false); return;
      }
      login({ username: res.username, role: res.role, fullName: res.fullName, touristId: res.touristId || null }, res.token);
    } catch (e) {
      setErr(e.message || "Invalid username or password");
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr(""); setSuccess(""); setLoading(true);
    if (regForm.password !== regForm.confirmPassword) { setErr("Passwords do not match"); setLoading(false); return; }
    if (regForm.password.length < 6) { setErr("Password must be at least 6 characters"); setLoading(false); return; }
    try {
      const res = await api.register({
        username: regForm.username,
        password: regForm.password,
        fullName: regForm.fullName,
        gender: regForm.gender,
        nationality: regForm.nationality,
        passportNumber: regForm.passportNumber,
        phoneNumber: regForm.phoneNumber,
        emergencyName: regForm.emergencyName,
        emergencyPhone: regForm.emergencyPhone,
        emergencyRelation: regForm.emergencyRelation,
        destination: regForm.destination,
        itinerary: regForm.itinerary,
      });
      login({ username: res.username, role: res.role, fullName: res.fullName, touristId: res.touristId || null }, res.token);
    } catch (e) {
      setErr(e.message || "Registration failed. Please check all fields.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      <div className="auth-card" style={{ maxWidth: tab === "register" ? 600 : 440 }}>
        <div className="auth-logo">
          <div className="logo-icon">🛡️</div>
          <h1>Safe<span>Trail</span></h1>
          <p>Smart Tourist Safety Monitoring System</p>
        </div>

        <div className="auth-tabs">
          <div className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr(""); setSuccess(""); }}>Sign In</div>
          <div className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setErr(""); setSuccess(""); }}>Register as Tourist</div>
        </div>

        {/* ── LOGIN ── */}
        {tab === "login" && (
          <>
            <div className="auth-role-select">
              <div className={`role-option ${role === "TOURIST" ? "selected" : ""}`} onClick={() => setRole("TOURIST")}>
                <div className="role-icon">🧳</div>
                <div className="role-name">Tourist</div>
              </div>
              <div className={`role-option ${role === "ADMIN" ? "selected" : ""}`} onClick={() => setRole("ADMIN")}>
                <div className="role-icon">👮</div>
                <div className="role-name">Admin</div>
              </div>
            </div>
            {role === "ADMIN" && (
              <div className="banner info" style={{ marginBottom: 14, fontSize: 12 }}>
                🔑 Default admin: <strong>admin</strong> / <strong>admin123</strong>
              </div>
            )}
            {err && <div className="banner error">⚠️ {err}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Username</label>
                <input value={loginForm.username} onChange={setL("username")} placeholder={role === "ADMIN" ? "admin" : "your username"} required autoComplete="username" />
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>Password</label>
                <input type="password" value={loginForm.password} onChange={setL("password")} placeholder="••••••••" required autoComplete="current-password" />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Signing in...</> : `Sign in as ${role}`}
              </button>
            </form>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--muted)" }}>
              New tourist? <span style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => setTab("register")}>Register here →</span>
            </p>
          </>
        )}

        {/* ── REGISTER ── */}
        {tab === "register" && (
          <>
            <div className="banner info" style={{ marginBottom: 18, fontSize: 12 }}>
              🧳 Fill in your details below. Your Tourist Digital ID will be auto-generated using blockchain hashing.
            </div>
            {err && <div className="banner error">⚠️ {err}</div>}
            {success && <div className="banner success">✅ {success}</div>}
            <form onSubmit={handleRegister}>

              <div className="section-title" style={{ marginBottom: 12 }}>Account Credentials</div>
              <div className="form-grid" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label>Username *</label>
                  <input value={regForm.username} onChange={setR("username")} placeholder="Choose a username" required autoComplete="username" />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input type="password" value={regForm.password} onChange={setR("password")} placeholder="Min 6 characters" required autoComplete="new-password" />
                </div>
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input type="password" value={regForm.confirmPassword} onChange={setR("confirmPassword")} placeholder="Repeat password" required autoComplete="new-password" />
                </div>
              </div>

              <div className="section-title" style={{ marginBottom: 12 }}>Personal Information</div>
              <div className="form-grid" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input value={regForm.fullName} onChange={setR("fullName")} placeholder="As on passport" required />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={regForm.gender} onChange={setR("gender")}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nationality</label>
                  <input value={regForm.nationality} onChange={setR("nationality")} placeholder="e.g. Indian" />
                </div>
                <div className="form-group">
                  <label>Passport Number *</label>
                  <input value={regForm.passportNumber} onChange={setR("passportNumber")} placeholder="e.g. A1234567" required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input value={regForm.phoneNumber} onChange={setR("phoneNumber")} placeholder="+91 9876543210" required />
                </div>
              </div>

              <div className="section-title" style={{ marginBottom: 12 }}>Emergency Contact</div>
              <div className="form-grid" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label>Contact Name *</label>
                  <input value={regForm.emergencyName} onChange={setR("emergencyName")} placeholder="Full name" required />
                </div>
                <div className="form-group">
                  <label>Contact Phone *</label>
                  <input value={regForm.emergencyPhone} onChange={setR("emergencyPhone")} placeholder="+91 9876543210" required />
                </div>
                <div className="form-group">
                  <label>Relation</label>
                  <input value={regForm.emergencyRelation} onChange={setR("emergencyRelation")} placeholder="e.g. Parent, Spouse" />
                </div>
              </div>

              <div className="section-title" style={{ marginBottom: 12 }}>Travel Details</div>
              <div className="form-grid" style={{ marginBottom: 16 }}>
                <div className="form-group">
                  <label>Destination *</label>
                  <input value={regForm.destination} onChange={setR("destination")} placeholder="e.g. Goa, India" required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>Itinerary *</label>
                <textarea value={regForm.itinerary} onChange={setR("itinerary")} placeholder="Day 1: Arrive at Goa airport, check in hotel..." required style={{ minHeight: 70 }} />
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                {loading
                  ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Creating your account...</>
                  : "🛡️ Register & Get My Digital Tourist ID"}
              </button>
            </form>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--muted)" }}>
              Already registered? <span style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => setTab("login")}>Sign in →</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
