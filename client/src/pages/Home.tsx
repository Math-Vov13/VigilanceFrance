import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { MapPin, FileWarning, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
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
                Plateforme citoyenne collaborative
              </span>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                Suivez les incidents
                <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent space-x-4">
                  <span className='text-blue-400'>partout</span> 
                  <span className='text-white'>en</span>
                  <span className='text-red-500'>France</span>
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Une plateforme interactive pour cartographier les événements en temps réel 
                et améliorer la sécurité collective.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/map">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-6">
                    Commencer
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300 px-8 py-6">
                    En savoir plus
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-gray-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-gray-900"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-red-500 border-2 border-gray-900"></div>
                </div>
                <span className="text-gray-400">+50 000 utilisateurs actifs</span>
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
              Comment ça <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">fonctionne</span>
            </h2>
            <p className="text-gray-400 text-lg">Trois étapes simples pour contribuer</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Créez un compte</h3>
              <p className="text-gray-400">
                Inscrivez-vous gratuitement pour contribuer et suivre les incidents
              </p>
            </motion.div>

            <motion.div 
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Visualisez la carte</h3>
              <p className="text-gray-400">
                Consultez en temps réel les incidents signalés avec CesiumJS
              </p>
            </motion.div>
            
            <motion.div 
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6">
                <FileWarning className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Signalez un incident</h3>
              <p className="text-gray-400">
                Ajoutez des informations précises des événements que vous constatez
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/map">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-6 text-lg rounded-full">
                Explorer la carte
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