import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Politique de confidentialité | VigilanceFrance</title>
        <meta name="description" content="Consultez notre politique de confidentialité et apprenez comment VigilanceFrance protège vos données personnelles." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Politique de confidentialité</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <p className="text-gray-600 italic mb-6">
              Dernière mise à jour : 15 mars 2025
            </p>
            
            <div className="prose prose-blue max-w-none text-gray-700">
              <p>
                Chez VigilanceFrance, nous accordons une importance capitale à la protection de vos données personnelles. 
                Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons 
                vos informations lorsque vous utilisez notre plateforme.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">1. Collecte des données</h2>
              <p>
                Nous collectons plusieurs types d'informations lorsque vous utilisez VigilanceFrance :
              </p>
              <h3 className="text-lg font-medium text-blue-700 mt-4 mb-2">1.1 Informations que vous nous fournissez</h3>
              <ul className="list-disc pl-5 my-2 space-y-1">
                <li>Informations d'inscription : nom, prénom, adresse e-mail, mot de passe</li>
                <li>Informations de profil : photo de profil, ville de résidence, centres d'intérêt (facultatifs)</li>
                <li>Contenu généré : signalements d'incidents, commentaires, évaluations</li>
                <li>Communications : messages envoyés via notre formulaire de contact ou notre système de messagerie</li>
              </ul>
              
              <h3 className="text-lg font-medium text-blue-700 mt-4 mb-2">1.2 Informations collectées automatiquement</h3>
              <ul className="list-disc pl-5 my-2 space-y-1">
                <li>Données de connexion : adresse IP, type d'appareil, navigateur, système d'exploitation</li>
                <li>Données de localisation : géolocalisation (avec votre consentement)</li>
                <li>Données d'utilisation : pages visitées, actions effectuées, durée des sessions</li>
                <li>Cookies et technologies similaires : pour plus d'informations, consultez notre politique de gestion des cookies</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">2. Utilisation des données</h2>
              <p>
                Nous utilisons vos données personnelles pour les finalités suivantes :
              </p>
              <ul className="list-disc pl-5 my-2 space-y-1">
                <li>Fournir, maintenir et améliorer notre plateforme et ses fonctionnalités</li>
                <li>Traiter et afficher les signalements d'incidents sur notre carte interactive</li>
                <li>Gérer votre compte et vous permettre d'interagir avec notre plateforme</li>
                <li>Vous envoyer des notifications liées à votre compte ou à des incidents dans votre zone</li>
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Analyser l'utilisation de notre plateforme et améliorer nos services</li>
                <li>Détecter, prévenir et résoudre les problèmes techniques ou de sécurité</li>
                <li>Respecter nos obligations légales</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">3. Partage des données</h2>
              <p>
                Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons toutefois les partager dans les cas suivants :
              </p>
              <ul className="list-disc pl-5 my-2 space-y-1">
                <li><strong>Prestataires de services</strong> : nous travaillons avec des tiers qui nous aident à exploiter notre plateforme (hébergement, analyse, traitement des paiements)</li>
                <li><strong>Partenaires</strong> : avec votre consentement, nous pouvons partager certaines données avec des partenaires locaux pour améliorer la sécurité publique</li>
                <li><strong>Autorités</strong> : nous pouvons partager des informations si la loi l'exige ou pour protéger nos droits</li>
                <li><strong>Données agrégées</strong> : nous pouvons partager des statistiques anonymisées et agrégées sur l'utilisation de notre plateforme</li>
              </ul>
              <p className="mt-2">
                Les signalements d'incidents que vous publiez sur notre plateforme sont rendus publics, mais sont toujours anonymisés.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">4. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération et la destruction. Ces mesures comprennent :
              </p>
              <ul className="list-disc pl-5 my-2 space-y-1">
                <li>Le chiffrement des données sensibles</li>
                <li>L'utilisation de protocoles sécurisés pour les transmissions de données</li>
                <li>Des audits de sécurité réguliers</li>
                <li>Des restrictions d'accès aux données personnelles</li>
                <li>La formation de notre personnel aux bonnes pratiques de sécurité</li>
              </ul>
              <p className="mt-2">
                Malgré ces mesures, aucun système n'est parfaitement sécurisé. Nous ne pouvons garantir la sécurité absolue de vos informations.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">5. Conservation des données</h2>
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et atteindre les finalités décrites dans cette politique, sauf si une période de conservation plus longue est requise ou permise par la loi.
              </p>
              <p className="mt-2">
                Si vous supprimez votre compte, nous supprimerons vos données personnelles dans un délai raisonnable, mais certaines informations peuvent être conservées plus longtemps si nécessaire pour des raisons légales ou techniques.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">6. Vos droits</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <ul className="list-disc pl-5 my-2 space-y-1">
                <li><strong>Droit d'accès</strong> : vous pouvez demander une copie des données personnelles que nous détenons à votre sujet</li>
                <li><strong>Droit de rectification</strong> : vous pouvez demander la correction de données inexactes ou incomplètes</li>
                <li><strong>Droit à l'effacement</strong> : vous pouvez demander la suppression de vos données personnelles dans certaines circonstances</li>
                <li><strong>Droit à la limitation du traitement</strong> : vous pouvez demander la restriction du traitement de vos données</li>
                <li><strong>Droit à la portabilité</strong> : vous pouvez demander le transfert de vos données à un autre organisme</li>
                <li><strong>Droit d'opposition</strong> : vous pouvez vous opposer au traitement de vos données dans certaines circonstances</li>
                <li><strong>Droit de retirer votre consentement</strong> : vous pouvez retirer votre consentement à tout moment</li>
              </ul>
              <p className="mt-2">
                Pour exercer ces droits, veuillez nous contacter à l'adresse dpo@vigilancefrance.fr ou via notre formulaire dédié dans la section "Compte".
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">7. Transferts internationaux de données</h2>
              <p>
                VigilanceFrance est basé en France, mais nos prestataires de services peuvent être situés dans d'autres pays. 
                Lorsque nous transférons des données personnelles en dehors de l'Espace Économique Européen, nous nous assurons 
                qu'elles bénéficient d'un niveau de protection adéquat, conformément aux exigences du RGPD.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">8. Protection des données concernant les mineurs</h2>
              <p>
                Notre service n'est pas destiné aux personnes de moins de 16 ans. Nous ne collectons pas sciemment de données 
                personnelles auprès de mineurs de moins de 16 ans. Si vous êtes un parent ou un tuteur et que vous savez que 
                votre enfant nous a fourni des données personnelles, veuillez nous contacter.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">9. Modifications de notre politique de confidentialité</h2>
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La version la plus récente 
                sera toujours disponible sur notre site avec la date de dernière mise à jour. Nous vous encourageons à 
                consulter régulièrement cette page pour rester informé des changements.
              </p>
              <p className="mt-2">
                Les modifications importantes feront l'objet d'une notification spécifique sur notre site ou par e-mail.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">10. Contact</h2>
              <p>
                Si vous avez des questions ou des préoccupations concernant cette politique de confidentialité ou le 
                traitement de vos données personnelles, veuillez contacter notre Délégué à la Protection des Données (DPO) :
              </p>
              <ul className="list-none mt-2">
                <li>Par e-mail : dpo@vigilancefrance.fr</li>
                <li className="mt-1">Par courrier : VigilanceFrance - DPO, 123 Avenue de la République, 75011 Paris, France</li>
              </ul>
              <p className="mt-3">
                Vous avez également le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique 
                et des Libertés (CNIL) si vous estimez que le traitement de vos données personnelles n'est pas conforme à la réglementation.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Questions concernant vos données ?</h2>
            <p className="text-gray-700 mb-4">
              Notre équipe de protection des données est disponible pour répondre à toutes vos questions concernant la collecte, 
              l'utilisation et la protection de vos informations personnelles.
            </p>
            <a href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200">
              Contacter notre DPO
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Privacy;