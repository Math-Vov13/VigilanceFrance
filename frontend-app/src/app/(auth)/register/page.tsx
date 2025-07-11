"use client";

import React, { useState } from 'react';
import { AlertTriangle, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowRight, Shield, Users, Award, Check } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


export default function RegisterPage() {
    const { registerUser } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptNewsletter, setAcceptNewsletter] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!acceptTerms) {
            toast.error('Veuillez accepter les conditions d\'utilisation');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);

        const response = await registerUser({
            firstName: formData.firstName as string,
            lastName: formData.lastName as string,
            email: formData.email as string,
            password: formData.password as string,
        });


        if (response === 200) {
            toast.success("Inscription réussie ! Vous allez être redirigé dans quelques instants.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            router.push('/'); // Redirect to home page

        } else {
            toast.error("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });

        }
        setIsLoading(false);
    }

    const benefits = [
        {
            icon: Shield,
            title: "Sécurité renforcée",
            description: "Vos données personnelles sont protégées selon les normes RGPD"
        },
        {
            icon: Users,
            title: "Communauté engagée",
            description: "Rejoignez des milliers de citoyens actifs dans toute la France"
        },
        {
            icon: Award,
            title: "Impact mesurable",
            description: "Suivez l'impact de vos signalements et contributions"
        }
    ];

    const features = [
        "Signalement géolocalisé instantané",
        "Suivi en temps réel de vos signalements",
        "Notifications des résolutions",
        "Statistiques personnalisées",
        "Accès à la carte interactive",
        "Participation aux discussions communautaires"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            <div className="w-full max-w-6xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 items-start">

                    {/* Left side - Benefits */}
                    <div className="hidden lg:block">
                        <div className="max-w-md mx-auto sticky top-8">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-red-600 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">VigilanceFrance</h1>
                                    <p className="text-sm text-gray-500">Signalements citoyens</p>
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Rejoignez la communauté citoyenne
                            </h2>

                            <p className="text-lg text-gray-600 mb-8">
                                Créez votre compte pour commencer à signaler les incidents et contribuer à l'amélioration de votre environnement quotidien.
                            </p>

                            <div className="space-y-6 mb-8">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start space-x-4 group">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <benefit.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-4">Fonctionnalités incluses :</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Registration Form */}
                    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
                            {/* Mobile logo */}
                            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-600 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">VigilanceFrance</h1>
                                    <p className="text-xs text-gray-500">Signalements citoyens</p>
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Créer un compte</h2>
                                <p className="text-gray-600">Rejoignez la communauté citoyenne</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Prénom
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Jean"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Dupont"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adresse email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="jean.dupont@email.fr"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="**********"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmer le mot de passe
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="**********"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={(e) => setAcceptTerms(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mt-1"
                                        />
                                        <span className="text-sm text-gray-600">
                                            J'accepte les{' '}
                                            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                                                conditions d'utilisation
                                            </a>{' '}
                                            et la{' '}
                                            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                                                politique de confidentialité
                                            </a>
                                        </span>
                                    </label>

                                    <label className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={acceptNewsletter}
                                            onChange={(e) => setAcceptNewsletter(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mt-1"
                                        />
                                        <span className="text-sm text-gray-600">
                                            Je souhaite recevoir les actualités et informations de VigilanceFrance
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !acceptTerms}
                                    className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Créer mon compte
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-gray-600">
                                    Déjà un compte ?{' '}
                                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                        Se connecter
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                                    <span>🇫🇷</span>
                                    <span>Plateforme communautaire française</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}