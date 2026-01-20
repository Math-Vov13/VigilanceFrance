import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import MapPage from './pages/Map';
import MonitoringPage from './pages/Monitoring';
import About from './pages/more/About';
import FAQ from './pages/more/FAQ';
import Terms from './pages/more/Terms';
import Privacy from './pages/more/Privacy';
import Legal from './pages/more/Legal';
import Cookies from './pages/more/Cookies';
import Support from './pages/more/Support';
import Partners from './pages/more/Partners';
import Press from './pages/more/Press';
import Contact from './pages/more/Contact';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './routes/ProtectedRoute';
import OAuthCallback from './components/callback/OAuthCallback';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/auth/callback" element={<OAuthCallback />} />
          
          {/* Protected Map Route - requires authentication */}
          <Route 
            path="/map" 
            element={
              <ProtectedRoute redirectPath='/auth'>
                <MapPage />
              </ProtectedRoute>
            } 
          />
          {/* Protected Monitoring Route - requires authentication */}
          <Route 
            path="/monitoring" 
            element={
              <ProtectedRoute redirectPath='/auth'>
                <MonitoringPage />
              </ProtectedRoute>
            } 
          />
          {/* Public routes */}
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/support" element={<Support />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/press" element={<Press />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Catch-all redirect to home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Global Toaster for notifications */}
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;