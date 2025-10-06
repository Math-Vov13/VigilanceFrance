import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github, Shield } from 'lucide-react';

type FooterProps = {
  minimal?: boolean;
};

export function Footer({ minimal = false }: FooterProps) {
  if (minimal) {
    return (
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-4 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2025 VigilanceFrance. Tous droits réservés.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-16 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">VigilanceFrance</span>
            </div>
            <p className="text-gray-400 max-w-md mb-8">
              Une plateforme citoyenne pour améliorer la sécurité et l'information en France. Signaler, collaborer, protéger.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors hover-lift">
                <Facebook size={18} className="text-gray-300" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-400 flex items-center justify-center transition-colors hover-lift">
                <Twitter size={18} className="text-gray-300" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors hover-lift">
                <Instagram size={18} className="text-gray-300" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors hover-lift">
                <Github size={18} className="text-gray-300" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
                <ul className="space-y-3">
                  <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
                  <li><Link to="/map" className="text-gray-400 hover:text-white transition-colors">Carte</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">À propos</Link></li>
                  <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Légal</h3>
                <ul className="space-y-3">
                  <li><Link to="/legal/terms" className="text-gray-400 hover:text-white transition-colors">Conditions d'utilisation</Link></li>
                  <li><Link to="/legal/privacy" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</Link></li>
                  <li><Link to="/legal" className="text-gray-400 hover:text-white transition-colors">Mentions légales</Link></li>
                  <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Gestion des cookies</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
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
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 VigilanceFrance. Tous droits réservés.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/legal/terms" className="hover:text-white transition-colors">Conditions</Link>
            <Link to="/legal/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}