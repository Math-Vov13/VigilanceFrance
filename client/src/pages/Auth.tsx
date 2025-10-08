import { Footer } from '../components/layout/Footer';
import { AuthForms } from '../components/form/AuthForm';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Auth() {
  const { isAuthenticated, loading } = useAuth();

  // If already authenticated, redirect to map
  if (!loading && isAuthenticated) {
    return <Navigate to="/map" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30"></div>
      </div>

      <div className="flex-grow flex items-center justify-center relative overflow-hidden pt-16">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="z-10 p-4"
        >
          <AuthForms />
        </motion.div>
      </div>

      <Footer minimal />
    </div>
  );
}