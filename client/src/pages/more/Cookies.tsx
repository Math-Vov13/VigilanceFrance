import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle } from 'lucide-react';

const Cookies = () => {
  // State for cookie preferences
  const [cookiesPreferences, setCookiesPreferences] = useState({
    necessary: true, // Always enabled
    functional: true,
    analytics: true,
    marketing: false,
  });

  // Handler for cookie preferences changes
  const handleCookiePreferenceChange = (type: string) => {
    if (type === 'necessary') return; // Cannot toggle necessary cookies
    setCookiesPreferences({
      ...cookiesPreferences,
      [type]: !cookiesPreferences[type as keyof typeof cookiesPreferences],
    });
  };

  // Handler for save preferences button
  const [saved, setSaved] = useState(false);
  const handleSavePreferences = () => {
    // Here you would implement the actual saving of preferences
    // For example, setting cookies or storing in localStorage
    console.log('Saving cookie preferences:', cookiesPreferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Gestion des cookies | VigilanceFrance</title>
        <meta name="description" content="Gérez vos préférences de cookies sur la plateforme VigilanceFrance." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Gestion des cookies</h1>
          
          {saved && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                Vos préférences ont été enregistrées avec succès.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <p className="text-gray-600 italic mb-6">
              Dernière mise à jour : 5 mars 2025
            </p>
            
            <div className="prose prose-blue max-w-none text-gray-700">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Notre politique de gestion des cookies</h2>
              <p>
                VigilanceFrance utilise des cookies et autres technologies similaires pour améliorer votre expérience sur notre plateforme, 
                analyser notre trafic et personnaliser notre contenu. Cette page vous permet de comprendre ce que sont ces technologies, 
                comment nous les utilisons et comment vous pouvez les gérer.
              </p>
              
              <h3 className="text-lg font-medium text-blue-700 mt-6 mb-3">Qu'est-ce qu'un cookie ?</h3>
              <p>
                Un cookie est un petit fichier texte stocké par votre navigateur lorsque vous visitez un site web. Les cookies permettent 
                aux sites web de mémoriser vos préférences, de personnaliser votre expérience et d'analyser votre comportement de navigation.
              </p>
              
              <h3 className="text-lg font-medium text-blue-700 mt-6 mb-3">Types de cookies que nous utilisons</h3>
              <p>
                VigilanceFrance utilise différents types de cookies pour diverses raisons :
              </p>
              
              <Accordion type="single" collapsible className="w-full mt-4">
                <AccordionItem value="cookies-necessary">
                  <AccordionTrigger className="text-blue-800 font-medium">Cookies nécessaires</AccordionTrigger>
                  <AccordionContent>
                    <p>Ces cookies sont indispensables au fonctionnement du site. Ils permettent l'utilisation des principales fonctionnalités du site (par exemple, l'accès à votre compte). Sans ces cookies, vous ne pourrez pas utiliser le site normalement.</p>
                    <p className="mt-2 text-sm text-gray-500">Exemples : cookies d'authentification, cookies de sécurité</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="cookies-functional">
                  <AccordionTrigger className="text-blue-800 font-medium">Cookies fonctionnels</AccordionTrigger>
                  <AccordionContent>
                    <p>Ces cookies permettent de personnaliser votre expérience sur notre site et de mémoriser vos préférences (par exemple, votre langue, la région où vous vous trouvez). Ils peuvent être déposés par nous ou par nos partenaires dont les services sont utilisés sur notre site.</p>
                    <p className="mt-2 text-sm text-gray-500">Exemples : préférences de langue, dernière zone géographique consultée</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="cookies-analytics">
                  <AccordionTrigger className="text-blue-800 font-medium">Cookies d'analyse et de performance</AccordionTrigger>
                  <AccordionContent>
                    <p>Ces cookies nous permettent de suivre et d'analyser votre comportement sur notre site. Ils mesurent le nombre de visites, les pages vues, l'activité des utilisateurs sur le site et leur fréquence de retour. Ils nous aident à améliorer le fonctionnement du site en recueillant des informations sur la façon dont vous l'utilisez.</p>
                    <p className="mt-2 text-sm text-gray-500">Exemples : Google Analytics, statistiques de trafic et d'utilisation</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="cookies-marketing">
                  <AccordionTrigger className="text-blue-800 font-medium">Cookies de marketing et publicitaires</AccordionTrigger>
                  <AccordionContent>
                    <p>Ces cookies sont utilisés pour suivre les visiteurs sur les sites web. Ils sont destinés à afficher des publicités qui sont pertinentes et intéressantes pour l'utilisateur individuel et donc plus précieuses pour les éditeurs et les annonceurs tiers.</p>
                    <p className="mt-2 text-sm text-gray-500">Exemples : cookies publicitaires, cookies de ciblage</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <h3 className="text-lg font-medium text-blue-700 mt-6 mb-3">Comment gérer vos préférences en matière de cookies</h3>
              <p>
                Vous pouvez à tout moment modifier vos préférences en matière de cookies à l'aide de l'outil ci-dessous.
                Vous pouvez également gérer vos cookies via les paramètres de votre navigateur. Veuillez noter que la 
                désactivation de certains cookies peut affecter votre expérience sur notre site.
              </p>

              <div className="mt-8 mb-6 border rounded-lg p-6 bg-gray-50">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">Gérez vos préférences de cookies</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Cookies nécessaires</p>
                      <p className="text-sm text-gray-600">Toujours actifs pour le fonctionnement du site</p>
                    </div>
                    <Switch 
                      checked={cookiesPreferences.necessary} 
                      disabled={true}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Cookies fonctionnels</p>
                      <p className="text-sm text-gray-600">Améliorent votre expérience et les fonctionnalités</p>
                    </div>
                    <Switch 
                      checked={cookiesPreferences.functional} 
                      onCheckedChange={() => handleCookiePreferenceChange('functional')}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Cookies analytiques</p>
                      <p className="text-sm text-gray-600">Nous aident à améliorer notre site</p>
                    </div>
                    <Switch 
                      checked={cookiesPreferences.analytics} 
                      onCheckedChange={() => handleCookiePreferenceChange('analytics')}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Cookies marketing</p>
                      <p className="text-sm text-gray-600">Permettent des publicités personnalisées</p>
                    </div>
                    <Switch 
                      checked={cookiesPreferences.marketing} 
                      onCheckedChange={() => handleCookiePreferenceChange('marketing')}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleSavePreferences} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Enregistrer mes préférences
                  </Button>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-blue-700 mt-6 mb-3">Durée de conservation des cookies</h3>
              <p>
                La durée de conservation des cookies varie selon leur type :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Cookies de session : supprimés lorsque vous fermez votre navigateur</li>
                <li>Cookies persistants : restent sur votre appareil pendant une durée déterminée (de quelques jours à plusieurs mois)</li>
              </ul>
              <p className="mt-2">
                Pour plus d'informations sur la durée de conservation spécifique à chaque cookie, veuillez consulter le tableau détaillé dans notre politique de confidentialité.
              </p>
              
              <h3 className="text-lg font-medium text-blue-700 mt-6 mb-3">Mise à jour de notre politique de cookies</h3>
              <p>
                Nous nous réservons le droit de modifier cette politique de cookies à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous encourageons à consulter régulièrement cette page pour rester informé des changements.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Questions concernant les cookies ?</h2>
            <p className="text-gray-700 mb-4">
              Si vous avez des questions sur notre utilisation des cookies ou sur la manière de les gérer, n'hésitez pas à nous contacter.
            </p>
            <a href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200">
              Nous contacter
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cookies;