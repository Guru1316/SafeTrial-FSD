import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Tourists from "./pages/Tourists";
import Register from "./pages/Register";
import Alerts from "./pages/Alerts";
import Incidents from "./pages/Incidents";
import Trips from "./pages/Trips";
import GeoFence from "./pages/GeoFence";
import Contacts from "./pages/Contacts";
import Admin from "./pages/Admin";
import Blockchain from "./pages/Blockchain";
import MyTrips from "./pages/MyTrips";
import MyAlerts from "./pages/MyAlerts";
import MyIncidents from "./pages/MyIncidents";
import MyContacts from "./pages/MyContacts";
import MyLocation from "./pages/MyLocation";

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function AuthPageGuard() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <AuthPage />;
}

function AppLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tourists" element={<AdminRoute><Tourists /></AdminRoute>} />
          <Route path="/register" element={<AdminRoute><Register /></AdminRoute>} />
          <Route path="/alerts" element={<AdminRoute><Alerts /></AdminRoute>} />
          <Route path="/incidents" element={<AdminRoute><Incidents /></AdminRoute>} />
          <Route path="/trips" element={<AdminRoute><Trips /></AdminRoute>} />
          <Route path="/geofence" element={<AdminRoute><GeoFence /></AdminRoute>} />
          <Route path="/contacts" element={<AdminRoute><Contacts /></AdminRoute>} />
          <Route path="/blockchain" element={<AdminRoute><Blockchain /></AdminRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
          <Route path="/my-alerts" element={<ProtectedRoute><MyAlerts /></ProtectedRoute>} />
          <Route path="/my-incidents" element={<ProtectedRoute><MyIncidents /></ProtectedRoute>} />
          <Route path="/my-contacts" element={<ProtectedRoute><MyContacts /></ProtectedRoute>} />
          <Route path="/my-location" element={<ProtectedRoute><MyLocation /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPageGuard />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
