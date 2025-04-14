import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import MapPage from './pages/Map';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminIncidents } from './pages/admin/AdminIncidents';
import  AdminComments  from './pages/admin/AdminComments';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminModeration } from './pages/admin/AdminModeration';
import { AdminStats } from './pages/admin/AdminStats';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/map" element={<MapPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={
              <ProtectedRoute redirectPath="/admin/login">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="incidents" element={<AdminIncidents />} />
              <Route path="comments" element={<AdminComments />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="moderation" element={<AdminModeration />} />
              <Route path="stats" element={<AdminStats />} />
            </Route>
            
            {/* Catch-all redirect to home page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Global Toaster for notifications */}
          <Toaster />
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;