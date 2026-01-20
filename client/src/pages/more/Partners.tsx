import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';

const Partners = () => {
  return (
    <>
      <Helmet>
        <title>Partenariats | VigilanceFrance</title>
        <meta name="description" content="Découvrez nos partenaires et les opportunités de collaboration avec VigilanceFrance." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Nos Partenaires</h1>
          
          {/* Hero section */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg p-8 mb-12">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ensemble pour une France plus sûre</h2>
              <p className="mb-6 text-blue-50">
                VigilanceFrance collabore avec des institutions publiques, des entreprises privées et des associations 
                pour renforcer la sécurité des citoyens. Découvrez nos partenariats actuels et les possibilités de 
                collaboration.
              </p>
              <Button className="bg-white text-blue-700 hover:bg-blue-50">
                <a href="#contact-section">Devenir partenaire</a>
              </Button>
            </div>
          </div>
          
          {/* Institutional Partners */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Partenaires Institutionnels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">Logo</div>
                  </div>
                  <CardTitle>Ministère de l'Intérieur</CardTitle>
                  <CardDescription>Partenaire officiel</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>Collaboration sur l'amélioration de la sécurité dans les zones urbaines et l'échange de données anonymisées pour renforcer la prévention.</p>
                </CardContent>
                <CardFooter>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">En savoir plus →</a>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">Logo</div>
                  </div>
                  <CardTitle>Ville de Paris</CardTitle>
                  <CardDescription>Partenaire territorial</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>Partenariat pour l'amélioration de la sécurité dans la capitale, avec des initiatives conjointes et des campagnes de sensibilisation des citoyens.</p>
                </CardContent>
                <CardFooter>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">En savoir plus →</a>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">Logo</div>
                  </div>
                  <CardTitle>Préfecture de Police</CardTitle>
                  <CardDescription>Partenaire stratégique</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>Coopération pour le partage d'informations et l'amélioration des dispositifs de vigilance citoyenne dans le respect des cadres légaux.</p>
                </CardContent>
                <CardFooter>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">En savoir plus →</a>
                </CardFooter>
              </Card>
            </div>
          </section>
          
          {/* Corporate Partners */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Partenaires Privés</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">Logo</div>
                  </div>
                  <CardTitle>SecuriTech</CardTitle>
                  <CardDescription>Partenaire technologique</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>Collaboration sur l'intégration de technologies de pointe pour améliorer la précision et la fiabilité des signalements.</p>
                </CardContent>
                <CardFooter>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">En savoir plus →</a>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">Logo</div>
                  </div>
                  <CardTitle>DataMap France</CardTitle>
                  <CardDescription>Partenaire cartographique</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>Partenariat pour l'amélioration de notre système cartographique et l'optimisation de la représentation des données.</p>
                </CardContent>
                <CardFooter>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">En savoir plus →</a>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">Logo</div>
                  </div>
                  <CardTitle>AssurPlus</CardTitle>
                  <CardDescription>Partenaire assurance</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>Collaboration pour développer des offres d'assurance adaptées aux zones géographiques et aux risques identifiés.</p>
                </CardContent>
                <CardFooter>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">En savoir plus →</a>
                </CardFooter>
              </Card>
            </div>
          </section>
          
          {/* Association Partners */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Associations Partenaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">Logo</div>
                  </div>
                  <CardTitle>Voisins Vigilants</CardTitle>
                  <CardDescription>Partenaire communautaire</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>Partenariat pour renforcer les réseaux de vigilance citoyenne et faciliter la communication entre les différentes initiatives locales.</p>
                </CardContent>
                <CardFooter>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">En savoir plus →</a>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">Logo</div>
                  </div>
                  <CardTitle>Association des Maires de France</CardTitle>
                  <CardDescription>Partenaire territorial</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>Collaboration pour sensibiliser et impliquer les collectivités locales dans l'amélioration de la sécurité au niveau municipal.</p>
                </CardContent>
                <CardFooter>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">En savoir plus →</a>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-2xl">Logo</div>
                  </div>
                  <CardTitle>Citoyens Engagés</CardTitle>
                  <CardDescription>Partenaire associatif</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>Partenariat visant à renforcer l'engagement citoyen et à promouvoir les bonnes pratiques en matière de vigilance collective.</p>
                </CardContent>
                <CardFooter>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">En savoir plus →</a>
                </CardFooter>
              </Card>
            </div>
          </section>
          
          {/* Benefits of Partnership */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Avantages du Partenariat</h2>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium text-blue-700 mb-4">Pour les institutions publiques</h3>
                  <ul className="space-y-3">
                    <li className="flex">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Accès à des données anonymisées sur les incidents pour mieux comprendre les besoins en sécurité</p>
                    </li>
                    <li className="flex">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Canal de communication directe avec les citoyens sur les questions de sécurité</p>
                    </li>
                    <li className="flex">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Outils d'analyse pour optimiser le déploiement des ressources de sécurité</p>
                    </li>
                    <li className="flex">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Image positive d'engagement pour la sécurité et le bien-être des citoyens</p>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-blue-700 mb-4">Pour les entreprises</h3>
                  <ul className="space-y-3">
                    <li className="flex">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Visibilité auprès d'une communauté engagée et responsable</p>
                    </li>
                    <li className="flex">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Opportunités de développement de services adaptés aux besoins de sécurité</p>
                    </li>
                    <li className="flex">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Accès à des statistiques et tendances pour orienter vos stratégies</p>
                    </li>
                    <li className="flex">
                      <div className="text-blue-600 mr-2">•</div>
                      <p className="text-gray-700">Renforcement de votre engagement RSE et de votre image de marque</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          {/* Become a Partner */}
          <section id="contact-section" className="mb-16">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Devenir Partenaire</h2>
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-100">
              <div className="max-w-3xl mx-auto">
                <p className="text-gray-700 mb-6">
                  Vous souhaitez collaborer avec VigilanceFrance pour contribuer à la sécurité des citoyens ? 
                  Nous sommes ouverts à différents types de partenariats selon vos objectifs et votre domaine d'activité.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-blue-700 mb-3">Types de partenariats</h3>
                    <ul className="space-y-2">
                      <li className="flex">
                        <div className="text-blue-600 mr-2">•</div>
                        <p className="text-gray-700">Partenariat technologique</p>
                      </li>
                      <li className="flex">
                        <div className="text-blue-600 mr-2">•</div>
                        <p className="text-gray-700">Partenariat de contenu</p>
                      </li>
                      <li className="flex">
                        <div className="text-blue-600 mr-2">•</div>
                        <p className="text-gray-700">Partenariat institutionnel</p>
                      </li>
                      <li className="flex">
                        <div className="text-blue-600 mr-2">•</div>
                        <p className="text-gray-700">Partenariat territorial</p>
                      </li>
                      <li className="flex">
                        <div className="text-blue-600 mr-2">•</div>
                        <p className="text-gray-700">Partenariat média</p>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-blue-700 mb-3">Processus de partenariat</h3>
                    <ol className="space-y-2">
                      <li className="flex">
                        <div className="text-blue-600 mr-2">1.</div>
                        <p className="text-gray-700">Prise de contact et présentation de votre organisation</p>
                      </li>
                      <li className="flex">
                        <div className="text-blue-600 mr-2">2.</div>
                        <p className="text-gray-700">Évaluation des synergies potentielles</p>
                      </li>
                      <li className="flex">
                        <div className="text-blue-600 mr-2">3.</div>
                        <p className="text-gray-700">Définition des objectifs communs</p>
                      </li>
                      <li className="flex">
                        <div className="text-blue-600 mr-2">4.</div>
                        <p className="text-gray-700">Établissement d'un accord de partenariat</p>
                      </li>
                      <li className="flex">
                        <div className="text-blue-600 mr-2">5.</div>
                        <p className="text-gray-700">Mise en œuvre et suivi</p>
                      </li>
                    </ol>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-700 mb-6">
                    Pour discuter des possibilités de partenariat, contactez notre équipe dédiée. 
                    Nous étudierons ensemble comment notre collaboration peut contribuer à rendre la France plus sûre.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <a href="/contact?subject=Partenariat">Nous contacter pour un partenariat</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Testimonials */}
          <section>
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Témoignages de nos partenaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="rounded-full w-12 h-12 bg-gray-200 mr-4 flex items-center justify-center">
                    <span className="text-gray-400">P</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pierre Durand</p>
                    <p className="text-sm text-gray-600">Directeur Sécurité, Ville de Lyon</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic">
                  "Notre partenariat avec VigilanceFrance a permis d'améliorer significativement notre connaissance des 
                  problématiques de sécurité au niveau des quartiers. Les données recueillies nous ont aidés à optimiser 
                  le déploiement de nos ressources et à mieux répondre aux préoccupations des citoyens."
                </blockquote>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="rounded-full w-12 h-12 bg-gray-200 mr-4 flex items-center justify-center">
                    <span className="text-gray-400">S</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sophie Martin</p>
                    <p className="text-sm text-gray-600">Présidente, Association Voisins Vigilants</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic">
                  "La collaboration avec VigilanceFrance a donné une nouvelle dimension à notre action. La complémentarité 
                  de nos approches et l'intégration de nos réseaux ont renforcé l'efficacité de la vigilance citoyenne. 
                  Un partenariat fructueux qui profite à tous."
                </blockquote>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Partners;