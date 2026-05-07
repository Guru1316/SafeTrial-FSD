const BASE = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("st_token");

const headers = (extra = {}) => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const ok = async (r) => {
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || r.statusText);
  }
  return r;
};

const get  = (url) => fetch(url, { headers: headers() }).then(ok).then(r => r.json());
const post = (url, body) => fetch(url, { method: "POST", headers: headers(), body: JSON.stringify(body) }).then(ok).then(r => r.json());
const put  = (url, body) => fetch(url, { method: "PUT",  headers: headers(), body: body ? JSON.stringify(body) : undefined }).then(ok).then(r => r.json());
const postText = (url) => fetch(url, { method: "POST", headers: headers() }).then(ok).then(r => r.text());

export const api = {
  // Auth
  login:    (data) => post(`${BASE}/auth/login`, data),
  register: (data) => post(`${BASE}/auth/register`, data),
  getMe:    () => get(`${BASE}/auth/me`),

  // Dashboard
  getDashboard: () => get(`${BASE}/dashboard/summary`),

  // Tourists
  getTourists:      () => get(`${BASE}/tourists`),
  registerTourist:  (data) => post(`${BASE}/tourists/register`, data),
  triggerPanic:     (id, lat, lng) => postText(`${BASE}/tourists/panic/${id}?lat=${lat}&lng=${lng}`),
  updateLocation:   (id, lat, lng) => postText(`${BASE}/tourists/location/${id}?lat=${lat}&lng=${lng}`),

  // Alerts
  getAlerts:          () => get(`${BASE}/alerts`),
  getAlertsByTourist: (id) => get(`${BASE}/alerts/${id}`),

  // Incidents
  getIncidents:          () => get(`${BASE}/incidents`),
  getIncidentsByTourist: (id) => get(`${BASE}/incidents/${id}`),
  createIncident:        (data) => post(`${BASE}/incidents`, data),
  updateIncidentStatus:  (id, status) => put(`${BASE}/incidents/${id}?status=${status}`),

  // Trips
  getAllTrips: () => get(`${BASE}/trips`),
  getTrips:   (touristId) => get(`${BASE}/trips/${touristId}`),
  createTrip: (data) => post(`${BASE}/trips`, data),

  // GeoFence
  getGeoFences:   () => get(`${BASE}/geofence`),
  createGeoFence: (data) => post(`${BASE}/geofence`, data),

  // Emergency Contacts
  getContacts: (touristId) => get(`${BASE}/contacts/${touristId}`),
  addContact:  (data) => post(`${BASE}/contacts`, data),

  // Admin
  getAdminTourists:  () => get(`${BASE}/admin/tourists`),
  getAdminAlerts:    () => get(`${BASE}/admin/alerts`),
  getPanicAlerts:    () => get(`${BASE}/admin/panic`),
  getAdminIncidents: () => get(`${BASE}/admin/incidents`),

  // Blockchain
  getBlockchain: () => get(`${BASE}/blockchain`),
};
