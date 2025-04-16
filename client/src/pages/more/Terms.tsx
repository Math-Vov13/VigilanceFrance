
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Conditions d'utilisation | VigilanceFrance</title>
        <meta name="description" content="Consultez les conditions d'utilisation de la plateforme VigilanceFrance." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Conditions d'utilisation</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <p className="text-gray-600 italic mb-6">
              Dernière mise à jour : 10 mars 2025
            </p>
            
            <div className="prose prose-blue max-w-none text-gray-700">
              <p>
                Bienvenue sur VigilanceFrance. En accédant à notre site web et en utilisant nos services, vous acceptez de vous 
                conformer à ces conditions d'utilisation et de vous y tenir. Veuillez les lire attentivement avant d'utiliser notre plateforme.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">1. Acceptation des conditions</h2>
              <p>
                En utilisant VigilanceFrance, vous acceptez pleinement et sans réserve les présentes conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou nos services.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">2. Description du service</h2>
              <p>
                VigilanceFrance est une plateforme collaborative permettant aux utilisateurs de signaler et de consulter des incidents 
                de sécurité sur une carte interactive. Notre objectif est de renforcer la vigilance citoyenne et d'améliorer la sécurité 
                des communautés en France.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">3. Inscription et compte utilisateur</h2>
              <p>
                Pour accéder à certaines fonctionnalités de notre plateforme, vous devez créer un compte utilisateur. Vous vous engagez à :
              </p>
              <ul className="list-disc pl-5 my-2 space-y-1">
                <li>Fournir des informations exactes, à jour et complètes lors de votre inscription</li>
                <li>Maintenir et mettre à jour rapidement ces informations pour qu'elles restent exactes</li>
                <li>Protéger votre mot de passe et ne pas le partager</li>
                <li>Être seul responsable de toutes les activités qui se produisent sous votre compte</li>
                <li>Nous informer immédiatement de toute utilisation non autorisée de votre compte</li>
              </ul>
              <p>
                Nous nous réservons le droit de suspendre ou de résilier votre compte si nous avons des raisons de croire 
                que les informations fournies sont inexactes, trompeuses ou incomplètes.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">4. Contenu et comportement des utilisateurs</h2>
              <p>
                En utilisant notre plateforme, vous vous engagez à :
              </p>
              <ul className="list-disc pl-5 my-2 space-y-1">
                <li>Ne signaler que des incidents réels et vérifiables</li>
                <li>Fournir des informations précises et objectives</li>
                <li>Ne pas publier de contenu diffamatoire, abusif, menaçant, harcelant ou autrement répréhensible</li>
                <li>Ne pas violer la vie privée d'autrui</li>
                <li>Ne pas usurper l'identité d'une autre personne</li>
                <li>Ne pas utiliser la plateforme à des fins illégales ou non autorisées</li>
                <li>Ne pas tenter de nuire au bon fonctionnement du site</li>
              </ul>
              <p>
                Nous nous réservons le droit de supprimer tout contenu qui ne respecte pas ces règles et de suspendre 
                ou résilier les comptes des utilisateurs concernés.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">5. Modération et vérification</h2>
              <p>
                Tous les signalements publiés sur VigilanceFrance sont soumis à un processus de modération. Nous nous efforçons 
                de vérifier les informations dans la mesure du possible, mais nous ne pouvons garantir l'exactitude absolue de 
                tous les contenus. Les utilisateurs sont encouragés à signaler tout contenu inapproprié ou inexact via notre 
                système de signalement intégré.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">6. Propriété intellectuelle</h2>
              <p>
                Le contenu de VigilanceFrance, y compris mais sans s'y limiter, les textes, graphiques, logos, icônes, images, 
                clips audio, téléchargements numériques et compilations de données, est la propriété de VigilanceFrance ou de 
                ses fournisseurs de contenu et est protégé par les lois françaises et internationales sur le droit d'auteur.
              </p>
              <p className="mt-2">
                En soumettant du contenu sur notre plateforme, vous nous accordez une licence mondiale, non exclusive, libre de 
                redevance, pour utiliser, reproduire, modifier, adapter, publier, traduire, distribuer et afficher ce contenu 
                dans le cadre de nos services.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">7. Limitation de responsabilité</h2>
              <p>
                VigilanceFrance s'efforce de fournir des informations aussi précises que possible, mais ne peut garantir 
                l'exactitude, l'exhaustivité ou la pertinence des informations diffusées sur sa plateforme. En conséquence :
              </p>
              <ul className="list-disc pl-5 my-2 space-y-1">
                <li>Nous ne sommes pas responsables des décisions prises sur la base des informations disponibles sur notre site</li>
                <li>Nous ne pouvons être tenus responsables des dommages directs ou indirects résultant de l'utilisation de notre plateforme</li>
                <li>VigilanceFrance ne se substitue pas aux autorités compétentes en matière de sécurité</li>
                <li>En cas d'urgence, les utilisateurs doivent contacter directement les services d'urgence appropriés</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">8. Modification des services</h2>
              <p>
                VigilanceFrance se réserve le droit, à tout moment, de modifier ou d'interrompre, temporairement ou définitivement, 
                tout ou partie de ses services avec ou sans préavis. Nous ne serons pas responsables envers vous ou tout tiers pour 
                toute modification, suspension ou interruption de nos services.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">9. Modification des conditions d'utilisation</h2>
              <p>
                Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications entrent en 
                vigueur dès leur publication sur notre site. En continuant à utiliser notre plateforme après la publication de 
                modifications, vous acceptez d'être lié par les conditions ainsi modifiées.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">10. Droit applicable et juridiction compétente</h2>
              <p>
                Les présentes conditions d'utilisation sont régies par le droit français. Tout litige relatif à l'interprétation 
                ou à l'exécution de ces conditions sera soumis à la compétence exclusive des tribunaux français.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">11. Contact</h2>
              <p>
                Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à l'adresse suivante : 
                legal@vigilancefrance.fr ou via notre formulaire de contact disponible sur le site.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Besoin d'aide supplémentaire ?</h2>
            <p className="text-gray-700 mb-4">
              Si vous avez des questions concernant nos conditions d'utilisation, n'hésitez pas à contacter notre équipe juridique. Nous sommes là pour vous aider à comprendre vos droits et obligations en tant qu'utilisateur de VigilanceFrance.
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

export default Terms;