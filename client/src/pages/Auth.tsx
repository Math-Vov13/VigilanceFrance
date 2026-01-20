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
    <div className="min-h-screen flex flex-col relative bg-gray-900">
      {/* Blurred Colored Background Circles */}
      <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

      {/* Auth Form */}
      <div className="flex-grow flex items-center justify-center relative overflow-hidden pt-16">
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
