import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { DirectionAwareHover } from "../components/ui/direction-aware-hover";
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const imageUrl1 = '/images/image1.jpg';
  const imageUrl2 = '/images/image2.jpg';
  const imageUrl3 = '/images/image3.jpg';

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-grow flex items-center relative overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300">
                Community-Powered Intelligence
              </span>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                Track every incident happening
                <span className="block mt-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-100 bg-clip-text text-transparent">
                  in real time.
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                An interactive platform to map global incidents in real time and enhance collective safety.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/map">
                  <Button size="lg" className="default">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300">
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-gray-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-gray-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-red-500 border-2 border-gray-900"></div>
                </div>
                <span className="text-gray-400">+50 000 active users</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Feature Section */}
      <section className="py-20 bg-gray-950 relative">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              How does it<span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-100 bg-clip-text text-transparent"> work</span>
            </h2>
            <p className="text-gray-400 text-lg">Three simple steps to contribute</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="h-[40rem] relative  flex items-center justify-center">
              <DirectionAwareHover imageUrl={imageUrl1}>
                <p className="font-bold text-xl">Create an account</p>
                <p className="font-normal text-sm">Sign up for free to contribute and track incidents</p>
              </DirectionAwareHover>
            </div>
            <div className="h-[40rem] relative  flex items-center justify-center">
              <DirectionAwareHover imageUrl={imageUrl2}>
                <p className="font-bold text-xl">Visualize the map</p>
                <p className="font-normal text-sm">View reported incidents in real-time with Google Maps integration</p>
              </DirectionAwareHover>
            </div>
            <div className="h-[40rem] relative  flex items-center justify-center">
              <DirectionAwareHover imageUrl={imageUrl3}>
                <p className="font-bold text-xl">Report an incident</p>
                <p className="font-normal text-sm">Add detailed information about the events you observe</p>
              </DirectionAwareHover>
            </div>
          </div>
          
          <motion.div 
            className="mt-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/map">
              <Button size="lg" className="default">
                Explore the Map
                <MapPin className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}