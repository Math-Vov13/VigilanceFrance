import { AlertTriangle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">VigilanceFrance</h3>
                <p className="text-sm text-gray-400">Signalements citoyens</p>
              </div>
            </div>
            <p className="text-gray-400">
              La plateforme collaborative pour une France plus sûre et plus solidaire.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Signaler</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Nouvel incident</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mes signalements</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Suivi des incidents</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Communauté</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Forum</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Statistiques</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Actualités</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Aide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 VigilanceFrance. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}