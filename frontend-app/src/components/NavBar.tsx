"use client";

import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isAuthenticated, profile, logout } = useAuth();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">VigilanceFrance</h1>
              <p className="text-xs text-gray-500">Signalements citoyens</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Accueil
            </Link>
            <Link href="/map" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Signaler
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Communauté
            </Link>

            {isAuthenticated ? (
              <>
              <Link href="/profile" className="underline text-gray-700 hover:text-blue-600 transition-colors font-medium">
                {profile?.email}
              </Link>
              <button
                className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-2 rounded-full cursor-pointer hover:shadow-lg transition-all"
                onClick={async () => {
                  await logout();
                  router.push('/login');
                }}
              >
                Déconnexion
              </button>
              </>
              ) :
              (
                <button className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                  <Link href="/login">Connexion</Link>
                </button>
              )
            }
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6 cursor-pointer" /> : <Menu className="w-6 h-6 cursor-pointer" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg">
            <nav className="flex flex-col p-6 space-y-4">
              <a href="#accueil" className="text-gray-700 hover:text-blue-600 transition-colors">Accueil</a>
              <a href="#signaler" className="text-gray-700 hover:text-blue-600 transition-colors">Signaler</a>
              <a href="#carte" className="text-gray-700 hover:text-blue-600 transition-colors">Carte</a>
              <a href="#communaute" className="text-gray-700 hover:text-blue-600 transition-colors">Communauté</a>
              <button className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-2 rounded-full">
                <Link href="/login">Connexion</Link>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}