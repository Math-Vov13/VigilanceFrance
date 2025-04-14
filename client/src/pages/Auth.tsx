import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AuthForms } from '../components/auth/AuthForms';
import { motion } from 'framer-motion';

export default function Auth() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100 filter blur-3xl opacity-50"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-200 filter blur-3xl opacity-40"></div>
          <div className="hidden md:block absolute right-10 top-10 w-80 h-80 opacity-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
              <path fill="#2563eb" d="M290.9,563.8c-16.1,1.2-32.2,3.1-48.3,4.8c-3.1,0.3-5.1,2.1-5.5,5.3c-0.8,2.9-3.5,3.5-5.7,4.3c-6.8,2.4-13.5,4.9-20.2,7.4c-3.2,1.2-6.3,2.5-9.5,3.7c-4.3,0-8.6,0-12.9,0c-4.1-2.3-8.5-4.1-12.2-6.9c-1.9-1.4-4.5-2.5-4-5.6c0.4-2.3-1-3.6-3.2-3.9c-1.4-0.2-3-0.3-3.9-1.2c-2.7-2.6-5.5-5.2-7.5-8.3c-1.8-2.9-4.1-5.3-5.8-8.2c-0.9-1.4-2.6-2.3-3.8-3.6c-2.7-2.8-5.2-5.8-8-8.6c-3.5-3.5-7.1-6.9-10.5-10.5c-1.3-1.3-2.5-2.8-3.3-4.4c-2.9-5.8-7.2-10.5-11.1-15.5c-1.2-1.5-3.1-1.9-4.6-2.3c-4.1-1.2-8.1-2.5-12.2-3.6c-2.2-0.6-2.7-2-2.1-4.1c0.6-2,1-4.1,1.9-5.9c3.4-6.8,5.2-14.3,7.9-21.4c1.4-3.6,2.8-7.4,1.4-11.3c-1.6-4.5-1.2-9.2-1.5-13.9c-0.1-1.8-0.8-4.2,1-5.6c2.1-1.7,4.4-0.5,6.7-0.1c4.9,0.8,9.8,1.7,14.7,2.7c4.6,0.9,9.6,0.5,13.3,4.1c0.6,0.6,1.9,0.7,2.9,1c8.2,2.8,16.2,6.1,24.7,7.8c4.3,0.9,8.6,1.9,12.9,2.4c2.9,0.3,5.9,0.2,8.8-0.1c3.9-0.5,7.7-1.5,11.6-2.1c2-0.3,3.9-0.8,5.9-1c2-0.2,4.1,0.1,6.1-0.1c8.2-0.7,16.3-1.6,24.5-2.4c0.9-0.1,1.9-0.1,2.8,0c8.1,0.9,16.2,2.9,24.1,0.3c1.5-0.5,3.1-0.8,4.7-0.7c10.9,0.9,21.8,2,32.7,3c4.1,0.4"></path>
              <path fill="#DC2626" d="M599.6,395.8c-2.9-1.7-5.8-3.4-8.7-5.1c-1.7-1-3.5-1.3-5.5-1.2c-4.2,0.3-8.5-0.1-12.7,0.8c-4.6,1-9,2.6-13.4,4.2c-1.8,0.7-3,1.8-3.7,3.6c-2.3,5.7-5.1,11.2-9,16c-2.3,2.7-4.5,5.6-6.4,8.5c-2,3-3.8,6.1-5.5,9.3c-2.6,4.9-4,10.2-5.1,15.6c-0.4,1.9-0.8,3.8-0.9,5.8c-0.1,2,0.3,4.1,0.5,6.1c0.6,4.5,2.3,8.6,4.4,12.5c2,3.7,4.2,7.3,6.3,11c1.1,1.9,2.1,3.9,3.1,5.9c0.5,1,0.8,2,1.6,2.8"></path>
            </svg>
          </div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="z-10"
        >
          <AuthForms />
        </motion.div>
      </div>
      
      <Footer minimal />
    </div>
  );
}