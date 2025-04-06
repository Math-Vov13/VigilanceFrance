import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { MapPin, FileWarning, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-grow flex items-center relative france-map-bg overflow-hidden">
        {/* Background with France colors and map */}
        <div className="absolute inset-0 bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-800/80 to-blue-900/90"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-24 relative text-white z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Column: Text Content */}
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 inline-block"
              >
                <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium">
                  Plateforme citoyenne de signalement collaboratif
                </span>
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Suivez et signalez les incidents 
                <div className="ml-2">
                  <span className="france-colors-gradient rounded-md px-2 py-1">partout en France</span>
                </div>
              </motion.h1>

              <motion.p 
                className="text-xl md:text-2xl max-w-2xl mb-8 text-blue-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Une plateforme interactive pour cartographier les événements en temps réel 
                et améliorer la sécurité collective de tous les citoyens.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Link to="/about">
                  <Button variant="secondary" size="lg" className="px-6 py-6 text-lg font-medium hover-lift">
                    En savoir plus
                  </Button>
                </Link>
                <Link to="/map">
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white
                    px-6 py-6 text-lg shadow-xl hover-lift"
                  >
                    Commencer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div 
                className="mt-12 flex items-center space-x-4 text-sm text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center">
                    <span className="font-bold">+</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-700 border-2 border-white"></div>
                </div>
                <span>Rejoignez plus de 50 000 utilisateurs actifs</span>
              </motion.div>
            </motion.div>

            {/* Right Column: Map */}
            <motion.div 
              className="w-full lg:w-1/2 justify-center items-center hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-lg"></div>
                <div className="relative bg-blue-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-2xl">
                  <img 
                    src="./src/assets/french-map.png" 
                    alt="French map" 
                    className="w-full max-w-md object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated gradient elements */}
        <div className="absolute right-0 -bottom-32 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl"></div>
        <div className="absolute left-0 top-0 w-72 h-72 bg-blue-300/20 rounded-full filter blur-3xl"></div>
      </section>
      
      {/* Feature Section */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              <span className="text-gradient">Comment ça fonctionne</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trois étapes simples pour contribuer à la sécurité collective
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="glass-card p-8 rounded-xl hover-lift"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="bg-gradient-primary w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-white shadow-lg">
                <MapPin className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Visualisez la carte</h3>
              <p className="text-gray-600 text-center">
                Consultez en temps réel les incidents signalés partout en France avec notre interface interactive
              </p>
            </motion.div>
            
            <motion.div 
              className="glass-card p-8 rounded-xl hover-lift"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="bg-gradient-primary w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-white shadow-lg">
                <UserCheck className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Créez un compte</h3>
              <p className="text-gray-600 text-center">
                Inscrivez-vous gratuitement pour contribuer et suivre les incidents qui vous concernent
              </p>
            </motion.div>
            
            <motion.div 
              className="glass-card p-8 rounded-xl hover-lift"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="bg-gradient-primary w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-white shadow-lg">
                <FileWarning className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Signalez un incident</h3>
              <p className="text-gray-600 text-center">
                Ajoutez des informations, photos et descriptions précises des événements que vous constatez
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
              <Button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6 text-lg rounded-full hover-lift">
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