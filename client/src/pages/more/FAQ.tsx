
import { Navbar } from '../../components/layout/Navbar';
import {Footer } from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>FAQ | VigilanceFrance</title>
        <meta name="description" content="Questions fréquemment posées sur l'utilisation de la plateforme VigilanceFrance." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Questions Fréquemment Posées</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <p className="text-gray-700 mb-6">
              Découvrez les réponses aux questions les plus fréquentes sur l'utilisation de VigilanceFrance. 
              Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter via notre page de support.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-medium text-blue-800">
                  Comment signaler un incident ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>Pour signaler un incident, suivez ces étapes simples :</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-2">
                    <li>Connectez-vous à votre compte VigilanceFrance</li>
                    <li>Accédez à la carte interactive via l'onglet "Carte" du menu principal</li>
                    <li>Cliquez sur le bouton "Signaler un incident" dans le coin supérieur droit</li>
                    <li>Remplissez le formulaire en précisant le type d'incident, sa localisation exacte, la date et l'heure, ainsi qu'une description détaillée</li>
                    <li>Ajoutez des photos si vous en disposez (facultatif mais recommandé)</li>
                    <li>Vérifiez les informations saisies et soumettez votre signalement</li>
                  </ol>
                  <p className="mt-3">Votre signalement sera examiné par nos modérateurs avant d'être publié sur la carte.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-medium text-blue-800">
                  Mes informations personnelles sont-elles protégées ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>Absolument. La protection de vos données est notre priorité. Voici comment nous protégeons vos informations :</p>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Tous les signalements sont anonymisés avant d'être publiés sur la carte</li>
                    <li>Nous ne partageons jamais vos coordonnées personnelles avec des tiers</li>
                    <li>Nos serveurs sont sécurisés selon les normes les plus strictes</li>
                    <li>Vous pouvez à tout moment demander la suppression de vos données personnelles</li>
                  </ul>
                  <p className="mt-3">Pour plus de détails, consultez notre Politique de confidentialité.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-medium text-blue-800">
                  Comment créer un compte ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>Créer un compte sur VigilanceFrance est simple et gratuit :</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-2">
                    <li>Cliquez sur "Connexion" dans le menu principal</li>
                    <li>Sélectionnez l'option "Créer un compte"</li>
                    <li>Renseignez votre adresse e-mail et choisissez un mot de passe sécurisé</li>
                    <li>Acceptez nos conditions d'utilisation et notre politique de confidentialité</li>
                    <li>Cliquez sur "S'inscrire"</li>
                    <li>Vérifiez votre adresse e-mail en cliquant sur le lien que nous vous envoyons</li>
                    <li>Complétez votre profil avec les informations souhaitées</li>
                  </ol>
                  <p className="mt-3">Vous pourrez ensuite accéder à toutes les fonctionnalités de notre plateforme.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-medium text-blue-800">
                  Comment fonctionne la vérification des incidents ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>Nous prenons très au sérieux la fiabilité des informations partagées sur notre plateforme. Chaque signalement suit un processus de vérification rigoureux :</p>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Examen initial par notre système automatisé pour détecter les contenus inappropriés</li>
                    <li>Vérification manuelle par notre équipe de modération</li>
                    <li>Recoupement avec d'autres signalements similaires dans la même zone</li>
                    <li>Validation par des sources fiables quand c'est possible</li>
                    <li>Mise à jour du statut de l'incident en fonction des nouvelles informations reçues</li>
                  </ul>
                  <p className="mt-3">Ce processus garantit que les informations affichées sur notre carte sont aussi précises et fiables que possible.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-medium text-blue-800">
                  Puis-je utiliser VigilanceFrance sur mobile ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>Oui, VigilanceFrance est entièrement responsive et s'adapte parfaitement aux appareils mobiles. Vous pouvez :</p>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Accéder à notre site depuis votre navigateur mobile</li>
                    <li>Télécharger notre application mobile disponible sur iOS et Android</li>
                    <li>Signaler des incidents en déplacement</li>
                    <li>Recevoir des alertes en temps réel sur votre téléphone</li>
                    <li>Consulter la carte des incidents même hors connexion (avec l'application)</li>
                  </ul>
                  <p className="mt-3">Notre application mobile offre des fonctionnalités supplémentaires comme la géolocalisation automatique et la possibilité de prendre des photos directement depuis l'interface.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-medium text-blue-800">
                  Comment sont utilisées mes données ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>Vos données sont utilisées exclusivement pour améliorer la sécurité et l'expérience utilisateur sur notre plateforme :</p>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Les informations sur les incidents servent à alimenter notre carte interactive</li>
                    <li>Les données anonymisées permettent d'établir des statistiques et des tendances</li>
                    <li>Vos coordonnées ne sont utilisées que pour vous contacter en cas de besoin</li>
                    <li>Nous pouvons partager des données agrégées avec les autorités locales pour améliorer la sécurité publique</li>
                  </ul>
                  <p className="mt-3">Nous ne vendons jamais vos données personnelles à des tiers. Pour plus d'informations, consultez notre Politique de confidentialité.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-medium text-blue-800">
                  Comment contacter l'équipe de support ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>Plusieurs options s'offrent à vous pour contacter notre équipe de support :</p>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Via notre formulaire de contact disponible sur la page "Nous contacter"</li>
                    <li>Par email à support@vigilancefrance.fr</li>
                    <li>Par chat en direct sur notre site (disponible du lundi au vendredi, de 9h à 18h)</li>
                    <li>Par téléphone au 01 23 45 67 89 (appel non surtaxé, du lundi au vendredi de 9h à 17h)</li>
                  </ul>
                  <p className="mt-3">Notre équipe s'engage à vous répondre dans un délai de 24 heures ouvrées.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg font-medium text-blue-800">
                  VigilanceFrance est-il un service officiel ?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  <p>Non, VigilanceFrance est une initiative citoyenne indépendante. Quelques précisions importantes :</p>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Nous ne sommes pas affiliés aux forces de l'ordre ou aux services d'urgence</li>
                    <li>Notre plateforme ne remplace pas les numéros d'urgence (17, 18, 15, 112)</li>
                    <li>En cas d'urgence, contactez toujours directement les services compétents</li>
                    <li>Nous collaborons avec les autorités locales mais restons une entité distincte</li>
                  </ul>
                  <p className="mt-3">VigilanceFrance est un outil complémentaire qui vise à renforcer la vigilance citoyenne et à partager des informations utiles à la communauté.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Vous n'avez pas trouvé de réponse à votre question ?</h2>
            <p className="text-gray-700 mb-4">
              Notre équipe de support est là pour vous aider. N'hésitez pas à nous contacter directement pour obtenir une assistance personnalisée.
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

export default FAQ;