import { useState, useEffect } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function MyLocation() {
  const { user } = useAuth();
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [tourist, setTourist] = useState(null);
  const [checkingTourist, setCheckingTourist] = useState(true);
  const touristId = user?.touristId;

  useEffect(() => {
    if (!touristId) { setCheckingTourist(false); return; }
    api.getTourists()
      .then(list => {
        const found = list.find(t => String(t.id) === String(touristId));
        setTourist(found || null);
      })
      .catch(() => setTourist(null))
      .finally(() => setCheckingTourist(false));
  }, [touristId]);

  const flash = (m, type = "success") => { setMsg({ m, type }); setTimeout(() => setMsg(null), 4000); };

  const getGPS = () => {
    if (!navigator.geolocation) { flash("Geolocation not supported", "error"); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude.toFixed(6)); setLng(pos.coords.longitude.toFixed(6)); setGeoLoading(false); },
      () => { flash("Could not get GPS location", "error"); setGeoLoading(false); }
    );
  };

  const updateLoc = async () => {
    if (!touristId || !tourist) { flash("No valid tourist profile linked. Ask admin to register you first.", "error"); return; }
    if (!lat || !lng) { flash("Enter latitude and longitude", "error"); return; }
    setLoading(true);
    try {
      const res = await api.updateLocation(touristId, lat, lng);
      flash(`✅ ${res}`);
    } catch (e) { flash(`❌ ${e.message}`, "error"); }
    finally { setLoading(false); }
  };

  const triggerPanic = async () => {
    if (!touristId || !tourist) { flash("No valid tourist profile linked.", "error"); return; }
    if (!lat || !lng) { flash("Set your location first before triggering panic", "error"); return; }
    if (!window.confirm("🚨 Are you sure? This will immediately alert authorities with your location.")) return;
    setLoading(true);
    try {
      const res = await api.triggerPanic(touristId, lat, lng);
      flash(`🚨 ${res}`, "error");
    } catch (e) { flash(`❌ ${e.message}`, "error"); }
    finally { setLoading(false); }
  };

  if (checkingTourist) return <div className="loading"><div className="spinner" />Checking profile...</div>;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-left"><h1>Update Location</h1><p>Share your current location for safety tracking</p></div>
      </div>

      {!touristId && (
        <div className="banner warn">⚠️ No Tourist ID linked to your account. Ask admin to register you as a tourist and link your Tourist ID during account creation.</div>
      )}
      {touristId && !tourist && (
        <div className="banner error">❌ Tourist ID #{touristId} not found in the system. Ask admin to register you first via the Register Tourist page.</div>
      )}
      {tourist && (
        <div className="banner success">✅ Linked to tourist profile: <strong>{tourist.fullName}</strong> (ID: #{tourist.id}) — Safety Status: {tourist.safetyStatus || "SAFE"}</div>
      )}

      {msg && <div className={`banner ${msg.type}`}>{msg.m}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 720, marginTop: 20 }}>
        <div className="card">
          <div className="card-header"><h3>📍 Location Update</h3></div>
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>Latitude</label>
              <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g. 15.4909" />
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Longitude</label>
              <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} placeholder="e.g. 73.8278" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="btn btn-ghost" onClick={getGPS} disabled={geoLoading}>
                {geoLoading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Getting GPS...</> : "🛰️ Use My GPS Location"}
              </button>
              <button className="btn btn-primary" onClick={updateLoc} disabled={loading || !lat || !lng || !tourist}>
                {loading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Updating...</> : "📍 Update Location"}
              </button>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderColor: "rgba(247,95,95,0.3)" }}>
          <div className="card-header" style={{ borderColor: "rgba(247,95,95,0.2)" }}>
            <h3 style={{ color: "var(--danger)" }}>🚨 Emergency Panic</h3>
          </div>
          <div className="card-body">
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
              Use only in a genuine emergency. Triggering panic will immediately alert authorities and your emergency contacts with your current location.
            </p>
            <button className="btn btn-danger" onClick={triggerPanic} disabled={loading || !tourist} style={{ width: "100%", justifyContent: "center" }}>
              🚨 TRIGGER PANIC ALERT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
