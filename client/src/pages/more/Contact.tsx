import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer }from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle, MapPin, Mail, Phone, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

const Contact = () => {
  // State for form handling
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    reason: 'general',
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
      reason: 'general',
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  return (
    <>
      <Helmet>
        <title>Nous contacter | VigilanceFrance</title>
        <meta name="description" content="Contactez l'équipe de VigilanceFrance pour toute question ou demande d'information." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Nous contacter</h1>
          
          {submitSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Envoyez-nous un message</h2>
                <p className="text-gray-700 mb-6">
                  Vous avez une question, une suggestion ou une demande ? Utilisez ce formulaire pour nous contacter 
                  et nous vous répondrons dans les meilleurs délais.
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
                        placeholder="Sujet de votre message"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Raison du contact</label>
                      <select
                        id="reason"
                        name="reason"
                        value={formState.reason}
                        onChange={handleInputChange}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        required
                      >
                        <option value="general">Question générale</option>
                        <option value="support">Support technique</option>
                        <option value="partnership">Proposition de partenariat</option>
                        <option value="press">Demande presse</option>
                        <option value="bug">Signalement de bug</option>
                        <option value="suggestion">Suggestion d'amélioration</option>
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
                      placeholder="Votre message..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="privacy" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      required 
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-700">
                      J'accepte que mes données soient traitées conformément à la {' '}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-800">politique de confidentialité</a>.
                    </label>
                  </div>
                  
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Téléphone</h3>
                        <p className="text-gray-700 mb-2">Service client :</p>
                        <p className="text-blue-600">01 23 45 67 89</p>
                        <p className="text-gray-500 text-sm mt-1">Du lundi au vendredi, 9h-18h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Horaires d'ouverture</h3>
                        <p className="text-gray-700 mb-1">Lundi - Vendredi :</p>
                        <p className="text-gray-600">9h00 - 18h00</p>
                        <p className="text-gray-700 mt-2 mb-1">Samedi :</p>
                        <p className="text-gray-600">10h00 - 15h00</p>
                        <p className="text-gray-700 mt-2 mb-1">Dimanche :</p>
                        <p className="text-gray-600">Fermé</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Questions fréquentes</h2>
            <p className="text-gray-700 mb-6">
              Avant de nous contacter, consultez notre FAQ qui répond déjà à de nombreuses questions.
            </p>
            <div className="flex justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <a href="/faq">Consulter la FAQ</a>
              </Button>
            </div>
          </div>
          
          {/* Map Section - You would integrate with a real map service */}
          <div className="aspect-video bg-gray-200 rounded-lg shadow-md flex items-center justify-center mb-12">
            <div className="text-gray-500 text-center">
              <p className="text-lg font-medium mb-2">Carte Interactive</p>
              <p>Ici s'afficherait une carte Google Maps avec l'emplacement de nos bureaux</p>
            </div>
          </div>
          
          {/* Different Departments */}
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">Contacts par département</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-blue-800 text-lg mb-3">Support technique</h3>
                <p className="text-gray-700 mb-4">
                  Pour toute question technique concernant l'utilisation de l'application ou pour signaler un bug.
                </p>
                <p className="text-gray-800 font-medium">Email :</p>
                <p className="text-blue-600 mb-2">support@vigilancefrance.fr</p>
                <p className="text-gray-800 font-medium">Téléphone :</p>
                <p className="text-blue-600">01 23 45 67 90</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-blue-800 text-lg mb-3">Partenariats</h3>
                <p className="text-gray-700 mb-4">
                  Pour toute proposition de partenariat commercial, institutionnel ou associatif.
                </p>
                <p className="text-gray-800 font-medium">Email :</p>
                <p className="text-blue-600 mb-2">partenariats@vigilancefrance.fr</p>
                <p className="text-gray-800 font-medium">Téléphone :</p>
                <p className="text-blue-600">01 23 45 67 91</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-blue-800 text-lg mb-3">Relations presse</h3>
                <p className="text-gray-700 mb-4">
                  Pour les journalistes et médias souhaitant des informations ou interviews.
                </p>
                <p className="text-gray-800 font-medium">Email :</p>
                <p className="text-blue-600 mb-2">presse@vigilancefrance.fr</p>
                <p className="text-gray-800 font-medium">Téléphone :</p>
                <p className="text-blue-600">01 23 45 67 92</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Follow Us Section */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Suivez-nous</h2>
            <p className="text-gray-700 mb-6">
              Restez connectés et découvrez nos dernières actualités en nous suivant sur les réseaux sociaux.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;