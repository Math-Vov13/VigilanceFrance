"use client";

import React, { useState } from 'react';
import { AlertTriangle, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Users, MapPin } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
    const { loginUser } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const response = await loginUser({
            email: formData.email as string,
            password: formData.password as string,
        });

        if (response === 200) {
            toast.success("Connexion réussie ! Vous allez être redirigé dans quelques instants.", {
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
            toast.error("Une erreur s'est produite lors de la connexion. Veuillez réessayer.", {
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

    const features = [
        {
            icon: Shield,
            title: "Sécurité garantie",
            description: "Vos données sont protégées par un chiffrement de niveau bancaire"
        },
        {
            icon: Users,
            title: "Communauté active",
            description: "Rejoignez plus de 15 000 citoyens engagés partout en France"
        },
        {
            icon: MapPin,
            title: "Impact local",
            description: "Contribuez directement à l'amélioration de votre quartier"
        }
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
                <div className="grid lg:grid-cols-2 gap-8 items-center">

                    {/* Left side - Features */}
                    <div className="hidden lg:block">
                        <div className="max-w-md mx-auto">
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
                                Bienvenue dans votre espace citoyen
                            </h2>

                            <p className="text-lg text-gray-600 mb-8">
                                Connectez-vous pour accéder à vos signalements, suivre leur évolution et contribuer à l'amélioration de votre environnement.
                            </p>

                            <div className="space-y-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start space-x-4 group">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <feature.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                                            <p className="text-gray-600 text-sm">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Login Form */}
                    <form onSubmit={handleLogin} className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
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
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Connexion</h2>
                                <p className="text-gray-600">Accédez à votre espace personnel</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
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
                                                placeholder="votre@email.fr"
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
                                                placeholder="***********"
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
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                                    </label>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                                        Mot de passe oublié ?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform cursor-pointer hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Se connecter
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-gray-600">
                                    Pas encore de compte ?{' '}
                                    <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                        Créez un compte
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