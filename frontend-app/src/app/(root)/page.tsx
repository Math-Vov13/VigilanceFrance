"use client";
import React from 'react';
import { AlertTriangle, MapPin, Users, Shield, ChevronRight, Menu, X, Bell, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  const stats = [
    { number: "15,247", label: "Signalements traités", icon: Shield },
    { number: "2,856", label: "Citoyens actifs", icon: Users },
    { number: "95%", label: "Taux de résolution", icon: TrendingUp },
    { number: "24h", label: "Temps de réponse moyen", icon: Bell }
  ];

  const incidentTypes = [
    { title: "Sécurité routière", description: "Accidents, infractions, dangers", color: "bg-red-500" },
    { title: "Environnement", description: "Pollution, déchets, nuisances", color: "bg-blue-500" },
    { title: "Espaces publics", description: "Dégradations, maintenance", color: "bg-red-600" },
    { title: "Sécurité publique", description: "Troubles, incidents", color: "bg-blue-600" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-gray-800 to-red-600 bg-clip-text text-transparent leading-tight">
              Signalons ensemble pour une France plus sûre
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Rejoignez la communauté citoyenne qui œuvre au quotidien pour améliorer notre cadre de vie. 
              Signalez, suivez et contribuez à résoudre les incidents près de chez vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group bg-gradient-to-r from-blue-600 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                <Link href="/map">Signaler un incident</Link>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all flex items-center justify-center">
                <MapPin className="w-5 h-5 mr-2 group-hover:bounce" />
                <Link href="/map">Voir la carte</Link>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un processus simple et efficace pour signaler et résoudre les incidents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">1. Observez</h3>
              <p className="text-gray-600 leading-relaxed">
                Identifiez un incident, un problème ou une situation nécessitant une intervention dans votre environnement quotidien.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">2. Signalez</h3>
              <p className="text-gray-600 leading-relaxed">
                Créez un signalement détaillé avec photos, localisation précise et description complète de la situation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">3. Suivez</h3>
              <p className="text-gray-600 leading-relaxed">
                Recevez des notifications sur l'avancement du traitement et la résolution de votre signalement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Incident Types */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Types d'incidents</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous couvrons tous les aspects de la vie citoyenne
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {incidentTypes.map((type, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all group-hover:bg-white">
                  <div className={`w-12 h-12 ${type.color} rounded-full mb-4 group-hover:scale-110 transition-transform`}></div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{type.title}</h3>
                  <p className="text-gray-600">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-red-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Rejoignez la communauté citoyenne
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Ensemble, construisons une France plus sûre, plus propre et plus solidaire. 
              Votre voix compte, votre action fait la différence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                <Link href="/register">Créer mon compte</Link>
              </button>
              
              <button className="bg-transparent text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center">
                <MapPin className="w-5 h-5 mr-2" />
                <Link href="/map">Explorer la carte</Link>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;