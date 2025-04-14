import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

type FooterProps = {
  minimal?: boolean;
};

export function Footer({ minimal = false }: FooterProps) {
  if (minimal) {
    return (
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">© 2025 VigilanceFrance. Tous droits réservés.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-blue-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-white rounded-full opacity-20"></div>
                <svg viewBox="0 0 24 24" className="w-8 h-8 relative" fill="currentColor">
                  <path d="M12 22s8.5-5.5 8.5-12.5c0-4.1-3.4-7.5-7.5-7.5h-2c-4.1 0-7.5 3.4-7.5 7.5C3.5 16.5 12 22 12 22z"></path>
                  <circle cx="12" cy="9.5" r="2.5" fill="white"></circle>
                </svg>
              </div>
              <span className="text-xl font-bold">VigilanceFrance</span>
            </div>
            <p className="text-gray-400 max-w-md mb-8">
              Une plateforme citoyenne pour améliorer la sécurité et l'information en France. Signaler, collaborer, protéger.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-200">Navigation</h3>
                <ul className="space-y-3">
                  <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
                  <li><Link to="/map" className="text-gray-400 hover:text-white transition-colors">Carte</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">À propos</Link></li>
                  <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-200">Légal</h3>
                <ul className="space-y-3">
                  <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Conditions d'utilisation</Link></li>
                  <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</Link></li>
                  <li><Link to="/legal" className="text-gray-400 hover:text-white transition-colors">Mentions légales</Link></li>
                  <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Gestion des cookies</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-200">Contact</h3>
                <ul className="space-y-3">
                  <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
                  <li><Link to="/partners" className="text-gray-400 hover:text-white transition-colors">Partenariats</Link></li>
                  <li><Link to="/press" className="text-gray-400 hover:text-white transition-colors">Presse</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Nous contacter</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-blue-800/50 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 VigilanceFrance. Tous droits réservés.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="hover:text-white">Conditions</Link>
            <Link to="/privacy" className="hover:text-white">Confidentialité</Link>
            <Link to="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}