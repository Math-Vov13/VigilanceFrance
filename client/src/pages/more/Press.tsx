import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Download } from 'lucide-react';

const Press = () => {
  return (
    <>
      <Helmet>
        <title>Presse | VigilanceFrance</title>
        <meta name="description" content="Espace presse de VigilanceFrance - Communiqués, dossiers et contacts pour les médias." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Espace Presse</h1>
          
          {/* Hero section */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg p-8 mb-12">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Bienvenue dans notre espace presse</h2>
              <p className="mb-6 text-blue-50">
                Trouvez toutes les ressources et informations nécessaires pour vos reportages sur VigilanceFrance. 
                Pour toute demande spécifique, notre équipe de relations presse est à votre disposition.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-blue-700 hover:bg-blue-50">
                  <a href="#contact-section">Contacter le service presse</a>
                </Button>
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-blue-700">
                  <a href="#kit-section">Télécharger le kit presse</a>
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="communiques" className="mb-12">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="communiques">Communiqués</TabsTrigger>
              <TabsTrigger value="couverture">Couverture médiatique</TabsTrigger>
              <TabsTrigger value="resources">Ressources</TabsTrigger>
            </TabsList>
            
            {/* Press Releases Tab */}
            <TabsContent value="communiques">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-800">VigilanceFrance franchit le cap du million d'utilisateurs</h3>
                        <p className="text-gray-500 text-sm mt-1">Publié le 15 mars 2025</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Communiqué
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      VigilanceFrance, la plateforme citoyenne de signalement et de cartographie des incidents de sécurité, 
                      a franchi aujourd'hui le cap symbolique du million d'utilisateurs actifs. Ce succès témoigne de l'engagement 
                      croissant des Français dans la coproduction de sécurité...
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Lire la suite
                    </a>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Télécharger (PDF)</span>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-800">Lancement de la nouvelle application mobile VigilanceFrance</h3>
                        <p className="text-gray-500 text-sm mt-1">Publié le 2 février 2025</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Communiqué
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      VigilanceFrance annonce aujourd'hui le lancement de sa nouvelle application mobile entièrement repensée. 
                      Cette version, disponible sur iOS et Android, intègre de nombreuses fonctionnalités innovantes, dont la 
                      géolocalisation précise des incidents, des alertes personnalisables en temps réel...
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Lire la suite
                    </a>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Télécharger (PDF)</span>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-800">VigilanceFrance signe un partenariat stratégique avec l'Association des Maires de France</h3>
                        <p className="text-gray-500 text-sm mt-1">Publié le 10 janvier 2025</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Communiqué
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      VigilanceFrance et l'Association des Maires de France (AMF) annoncent aujourd'hui la signature d'un 
                      partenariat stratégique visant à renforcer la sécurité dans les communes françaises. Cette collaboration 
                      permettra aux municipalités d'accéder à une version spécifique de la plateforme VigilanceFrance...
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Lire la suite
                    </a>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Télécharger (PDF)</span>
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="text-blue-600 border-blue-200">
                    Voir tous les communiqués
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Media Coverage Tab */}
            <TabsContent value="couverture">
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">VigilanceFrance dans les médias</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <div className="text-gray-400 text-sm">Logo</div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-blue-800">Le Monde</h4>
                          <p className="text-gray-500 text-sm">5 mars 2025</p>
                          <h3 className="font-medium mt-2">La sécurité participative, nouveau paradigme citoyen</h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-700">
                        "L'application VigilanceFrance révolutionne l'approche de la sécurité en milieu urbain en impliquant 
                        directement les citoyens. Une analyse de ce phénomène et de son impact sur les politiques publiques de sécurité."
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="#" className="text-blue-600 hover:text-blue-800">Lire l'article →</a>
                    </CardFooter>
                  </Card>
                  
                  <Card className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <div className="text-gray-400 text-sm">Logo</div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-blue-800">Les Échos</h4>
                          <p className="text-gray-500 text-sm">18 février 2025</p>
                          <h3 className="font-medium mt-2">VigilanceFrance lève 15 millions d'euros pour son expansion européenne</h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-700">
                        "La startup française spécialisée dans la cartographie collaborative des incidents de sécurité annonce 
                        une levée de fonds significative pour financer son déploiement dans plusieurs pays européens."
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="#" className="text-blue-600 hover:text-blue-800">Lire l'article →</a>
                    </CardFooter>
                  </Card>
                  
                  <Card className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <div className="text-gray-400 text-sm">Logo</div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-blue-800">France Info</h4>
                          <p className="text-gray-500 text-sm">5 février 2025</p>
                          <h3 className="font-medium mt-2">Interview : Marie Dupont, fondatrice de VigilanceFrance</h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-700">
                        "Dans cette interview exclusive, la fondatrice de VigilanceFrance revient sur la genèse du projet et 
                        explique comment la technologie peut contribuer à renforcer le lien social et la sécurité collective."
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="#" className="text-blue-600 hover:text-blue-800">Voir la vidéo →</a>
                    </CardFooter>
                  </Card>
                  
                  <Card className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <div className="text-gray-400 text-sm">Logo</div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-blue-800">La Tribune</h4>
                          <p className="text-gray-500 text-sm">20 janvier 2025</p>
                          <h3 className="font-medium mt-2">La French Tech à l'assaut de la sécurité urbaine</h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-700">
                        "Analyse du marché des civic-tech dédiées à la sécurité, avec un focus sur le succès de VigilanceFrance 
                        qui s'impose comme le leader français du secteur et attire l'attention des investisseurs internationaux."
                      </p>
                    </CardContent>
                    <CardFooter>
                      <a href="#" className="text-blue-600 hover:text-blue-800">Lire l'article →</a>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="text-blue-600 border-blue-200">
                    Voir toute la couverture médiatique
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Resources Tab */}
            <TabsContent value="resources" id="kit-section">
              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">Kit Presse</h3>
                  <p className="text-gray-700 mb-6">
                    Tous les éléments nécessaires pour vos publications sur VigilanceFrance. 
                    Notre kit presse contient des logos, photos, vidéos et documents officiels.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-blue-700 mb-3">Éléments visuels</h4>
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                          <span className="text-gray-700">Logo VigilanceFrance (différents formats)</span>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>ZIP</span>
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-gray-700">Photos de l'équipe</span>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>ZIP</span>
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-gray-700">Captures d'écran de l'application</span>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>ZIP</span>
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-gray-700">Vidéo de présentation</span>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>MP4</span>
                          </Button>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-blue-700 mb-3">Documents</h4>
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                          <span className="text-gray-700">Dossier de presse complet</span>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>PDF</span>
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-gray-700">Fiche d'information</span>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>PDF</span>
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-gray-700">Biographies des fondateurs</span>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>PDF</span>
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-gray-700">Statistiques et chiffres clés</span>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>PDF</span>
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Télécharger le kit presse complet</span>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">Infographies et Data</h3>
                  <p className="text-gray-700 mb-6">
                    Des visualisations et données sur l'utilisation de notre plateforme et l'évolution des signalements.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-3">
                      <div className="aspect-square bg-gray-200 mb-3 flex items-center justify-center">
                        <span className="text-gray-400">Infographie</span>
                      </div>
                      <h4 className="font-medium text-gray-800 text-sm">Évolution des signalements 2023-2025</h4>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="ghost" className="h-8 px-2 text-blue-600">
                          <Download className="h-3 w-3 mr-1" />
                          <span className="text-xs">PNG</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="aspect-square bg-gray-200 mb-3 flex items-center justify-center">
                        <span className="text-gray-400">Infographie</span>
                      </div>
                      <h4 className="font-medium text-gray-800 text-sm">Répartition des incidents par catégorie</h4>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="ghost" className="h-8 px-2 text-blue-600">
                          <Download className="h-3 w-3 mr-1" />
                          <span className="text-xs">PNG</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="aspect-square bg-gray-200 mb-3 flex items-center justify-center">
                        <span className="text-gray-400">Infographie</span>
                      </div>
                      <h4 className="font-medium text-gray-800 text-sm">Carte de chaleur des signalements en France</h4>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="ghost" className="h-8 px-2 text-blue-600">
                          <Download className="h-3 w-3 mr-1" />
                          <span className="text-xs">PNG</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Press Contact Section */}
          <section id="contact-section" className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Contact Presse</h2>
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium text-blue-700 mb-4">Service Presse</h3>
                  <p className="text-gray-700 mb-6">
                    Notre équipe de relations presse est à votre disposition pour toute demande d'information, 
                    d'interview ou de partenariat médiatique.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-3">•</div>
                      <div>
                        <p className="font-medium text-gray-800">Email</p>
                        <p className="text-gray-700">presse@vigilancefrance.fr</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-3">•</div>
                      <div>
                        <p className="font-medium text-gray-800">Téléphone</p>
                        <p className="text-gray-700">01 23 45 67 89</p>
                        <p className="text-sm text-gray-500">Du lundi au vendredi, de 9h à 18h</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-3">•</div>
                      <div>
                        <p className="font-medium text-gray-800">Contact principal</p>
                        <p className="text-gray-700">Juliette Moreau, Responsable Relations Presse</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-blue-700 mb-4">Demandes d'interview</h3>
                  <p className="text-gray-700 mb-6">
                    Pour toute demande d'interview avec les fondateurs ou l'équipe de VigilanceFrance, 
                    merci de nous contacter en précisant :
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Le média que vous représentez</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Le sujet de l'interview</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Le format souhaité (écrit, audio, vidéo)</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">La date de publication prévue</p>
                    </li>
                  </ul>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                    <a href="mailto:presse@vigilancefrance.fr">Contacter le service presse</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Newsletter Section */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Restez informé</h2>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-gray-700 mb-6">
                Inscrivez-vous à notre liste de diffusion dédiée aux médias pour recevoir en priorité 
                nos communiqués de presse et actualités.
              </p>
              <form className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Votre email professionnel" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 md:w-auto">
                  S'inscrire
                </Button>
              </form>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Press;