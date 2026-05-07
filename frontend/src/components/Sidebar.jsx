import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/", icon: "📊", label: "Dashboard" },
  { to: "/tourists", icon: "🧳", label: "Tourists" },
  { to: "/register", icon: "➕", label: "Register Tourist" },
  { to: "/alerts", icon: "🚨", label: "Alerts" },
  { to: "/incidents", icon: "📄", label: "Incidents (E-FIR)" },
  { to: "/trips", icon: "🗺️", label: "Trip Plans" },
  { to: "/geofence", icon: "📍", label: "GeoFence Zones" },
  { to: "/contacts", icon: "📞", label: "Emergency Contacts" },
  { to: "/blockchain", icon: "🔗", label: "Blockchain Ledger" },
  { to: "/admin", icon: "👮", label: "Admin Panel" },
];

const touristLinks = [
  { to: "/", icon: "📊", label: "My Dashboard" },
  { to: "/my-trips", icon: "🗺️", label: "My Trips" },
  { to: "/my-alerts", icon: "🚨", label: "My Alerts" },
  { to: "/my-incidents", icon: "📄", label: "My Incidents" },
  { to: "/my-contacts", icon: "📞", label: "Emergency Contacts" },
  { to: "/my-location", icon: "📍", label: "Update Location" },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : touristLinks;
  const initials = (user?.fullName || user?.username || "U").slice(0, 2).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">🛡️</div>
        <div className="logo-text">Safe<span>Trail</span></div>
      </div>
      <nav>
        <div className="sidebar-section-label">{isAdmin ? "Management" : "My Account"}</div>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => isActive ? "active" : ""}>
            <span className="nav-icon">{l.icon}</span>{l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.fullName || user?.username}</div>
            <div className={`user-role ${isAdmin ? "" : "role-tourist"}`}>{user?.role}</div>
          </div>
          <div className="logout-btn" title="Logout" onClick={logout}>⏻</div>
        </div>
      </div>
    </aside>
  );
}
