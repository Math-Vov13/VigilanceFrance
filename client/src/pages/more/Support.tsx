import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Helmet } from 'react-helmet';
import { CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const Support = () => {
  // State for form handling
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'technical',
  });

  // Success message state
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally send the form data to your backend
    console.log('Form submitted:', formState);
    
    // Show success message and reset form
    setSubmitSuccess(true);
    setFormState({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'technical',
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  return (
    <>
      <Helmet>
        <title>Support | VigilanceFrance</title>
        <meta name="description" content="Obtenez de l'aide et du support pour l'utilisation de la plateforme VigilanceFrance." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Support et assistance</h1>
          
          {submitSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="faq" className="mb-12">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="faq">FAQ & Aide rapide</TabsTrigger>
              <TabsTrigger value="contact">Nous contacter</TabsTrigger>
              <TabsTrigger value="resources">Ressources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-800">Problèmes de connexion</CardTitle>
                    <CardDescription>Solutions aux problèmes de connexion couramment rencontrés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="border-b border-gray-100 pb-2">
                        <h3 className="font-medium text-blue-700">Mot de passe oublié</h3>
                        <p className="text-sm text-gray-700">Cliquez sur "Mot de passe oublié" sur la page de connexion et suivez les instructions envoyées par email.</p>
                      </li>
                      <li className="border-b border-gray-100 pb-2">
                        <h3 className="font-medium text-blue-700">Compte bloqué</h3>
                        <p className="text-sm text-gray-700">Après plusieurs tentatives échouées, votre compte peut être temporairement bloqué. Attendez 30 minutes ou contactez-nous.</p>
                      </li>
                      <li>
                        <h3 className="font-medium text-blue-700">Email de confirmation non reçu</h3>
                        <p className="text-sm text-gray-700">Vérifiez vos spams ou demandez un nouvel email de confirmation depuis la page de connexion.</p>
                      </li>
                    </ul>
                    <a href="/faq" className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">Voir toutes les questions sur la connexion →</a>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-800">Signalement d'incidents</CardTitle>
                    <CardDescription>Comment signaler et gérer vos signalements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="border-b border-gray-100 pb-2">
                        <h3 className="font-medium text-blue-700">Comment signaler un incident?</h3>
                        <p className="text-sm text-gray-700">Accédez à la carte, cliquez sur "Signaler" et suivez les étapes du formulaire en indiquant le type, lieu et détails.</p>
                      </li>
                      <li className="border-b border-gray-100 pb-2">
                        <h3 className="font-medium text-blue-700">Mon signalement n'apparaît pas</h3>
                        <p className="text-sm text-gray-700">Les signalements sont soumis à modération et peuvent prendre jusqu'à 24h pour apparaître sur la carte.</p>
                      </li>
                      <li>
                        <h3 className="font-medium text-blue-700">Modifier ou supprimer un signalement</h3>
                        <p className="text-sm text-gray-700">Accédez à votre profil, section "Mes signalements" pour modifier ou supprimer vos signalements.</p>
                      </li>
                    </ul>
                    <a href="/faq" className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">Voir toutes les questions sur les signalements →</a>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-800">Problèmes techniques</CardTitle>
                    <CardDescription>Dépannage des problèmes techniques courants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="border-b border-gray-100 pb-2">
                        <h3 className="font-medium text-blue-700">La carte ne s'affiche pas correctement</h3>
                        <p className="text-sm text-gray-700">Essayez d'actualiser la page ou de vider le cache de votre navigateur. Vérifiez que JavaScript est activé.</p>
                      </li>
                      <li className="border-b border-gray-100 pb-2">
                        <h3 className="font-medium text-blue-700">L'application est lente</h3>
                        <p className="text-sm text-gray-700">Vérifiez votre connexion internet et fermez les onglets inutilisés. Sur mobile, essayez de redémarrer l'application.</p>
                      </li>
                      <li>
                        <h3 className="font-medium text-blue-700">Notifications qui ne fonctionnent pas</h3>
                        <p className="text-sm text-gray-700">Vérifiez vos paramètres de notification dans votre profil et les autorisations de votre navigateur.</p>
                      </li>
                    </ul>
                    <a href="/faq" className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">Voir tous les problèmes techniques →</a>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-800">Compte et confidentialité</CardTitle>
                    <CardDescription>Gestion de votre compte et de vos données</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="border-b border-gray-100 pb-2">
                        <h3 className="font-medium text-blue-700">Modifier mes informations personnelles</h3>
                        <p className="text-sm text-gray-700">Accédez à votre profil et cliquez sur "Modifier mon profil" pour mettre à jour vos informations.</p>
                      </li>
                      <li className="border-b border-gray-100 pb-2">
                        <h3 className="font-medium text-blue-700">Supprimer mon compte</h3>
                        <p className="text-sm text-gray-700">Dans les paramètres de votre compte, vous trouverez l'option "Supprimer mon compte" tout en bas de la page.</p>
                      </li>
                      <li>
                        <h3 className="font-medium text-blue-700">Données personnelles et RGPD</h3>
                        <p className="text-sm text-gray-700">Pour toute demande concernant vos données personnelles, contactez notre DPO à dpo@vigilancefrance.fr.</p>
                      </li>
                    </ul>
                    <a href="/privacy" className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">Voir notre politique de confidentialité →</a>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="contact">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Contactez notre équipe de support</h2>
                <p className="text-gray-700 mb-6">
                  Notre équipe est disponible pour vous aider. Veuillez remplir le formulaire ci-dessous et nous vous répondrons dans les meilleurs délais.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                      <Input 
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="votre.email@exemple.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Sujet</label>
                      <Input 
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        placeholder="Sujet de votre demande"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
                      <select
                        id="category"
                        name="category"
                        value={formState.category}
                        onChange={handleInputChange}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        required
                      >
                        <option value="technical">Problème technique</option>
                        <option value="account">Gestion de compte</option>
                        <option value="billing">Facturation</option>
                        <option value="report">Signalement d'incident</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre problème ou votre question en détail..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Envoyer le message
                  </Button>
                </form>
              </div>
              
              <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Autres moyens de nous contacter</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">Email</h3>
                    <p className="text-gray-700">support@vigilancefrance.fr</p>
                    <p className="text-gray-500 text-sm mt-1">Réponse sous 24-48h</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">Téléphone</h3>
                    <p className="text-gray-700">01 23 45 67 89</p>
                    <p className="text-gray-500 text-sm mt-1">Lun-Ven, 9h-18h</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-blue-700 mb-2">Chat en direct</h3>
                    <p className="text-gray-700">Disponible sur notre site</p>
                    <p className="text-gray-500 text-sm mt-1">Lun-Ven, 9h-17h</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-800">Guides d'utilisation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Guide de démarrage rapide</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Comment signaler un incident</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Utiliser la carte interactive</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Configurer les alertes</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Guide de l'application mobile</a></li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-800">Tutoriels vidéo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Présentation de VigilanceFrance</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Comment créer un compte</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Utiliser les filtres de la carte</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Personnaliser votre profil</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Fonctionnalités avancées</a></li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-800">Ressources à télécharger</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Manuel d'utilisation complet (PDF)</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Fiches conseils sécurité (PDF)</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Infographie : Types d'incidents (JPG)</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Glossaire des termes (PDF)</a></li>
                      <li><a href="#" className="text-blue-600 hover:text-blue-800">Guide des bonnes pratiques (PDF)</a></li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Demande de formation</h2>
                <p className="text-gray-700 mb-4">
                  Vous êtes une collectivité, une entreprise ou une association et souhaitez former vos membres à l'utilisation de VigilanceFrance ?
                  Nous proposons des sessions de formation personnalisées.
                </p>
                <a href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200">
                  Demander une formation
                </a>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Questions fréquentes</h2>
            <p className="text-gray-700 mb-6">
              Consultez notre page FAQ pour trouver rapidement des réponses aux questions les plus courantes.
            </p>
            <a href="/faq" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200">
              Voir la FAQ
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Support;