
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';

const Legal = () => {
  return (
    <>
      <Helmet>
        <title>Mentions légales | VigilanceFrance</title>
        <meta name="description" content="Mentions légales de la plateforme VigilanceFrance." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Mentions légales</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 italic mb-6">
              Dernière mise à jour : 1 février 2025
            </p>
            
            <div className="prose prose-blue max-w-none text-gray-700">
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">1. Informations légales</h2>
              
              <h3 className="text-lg font-medium text-blue-700 mt-4 mb-2">1.1 Éditeur du site</h3>
              <p>
                Le site VigilanceFrance est édité par la société VigilanceFrance SAS, société par actions simplifiée au 
                capital de 50 000 euros, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 
                987 654 321, dont le siège social est situé au :
              </p>
              <p className="mt-2 ml-4">
                123 Avenue de la République<br />
                75011 Paris<br />
                France
              </p>
              <p className="mt-2">
                Numéro de TVA intracommunautaire : FR 12 987 654 321<br />
                Numéro de téléphone : +33 (0)1 23 45 67 89<br />
                Adresse e-mail : contact@vigilancefrance.fr
              </p>
              
              <h3 className="text-lg font-medium text-blue-700 mt-4 mb-2">1.2 Directeur de la publication</h3>
              <p>
                Le Directeur de la publication est Madame Marie Dupont, en sa qualité de Présidente de VigilanceFrance SAS.
              </p>
              
              <h3 className="text-lg font-medium text-blue-700 mt-4 mb-2">1.3 Hébergeur du site</h3>
              <p>
                Le site VigilanceFrance est hébergé par la société OVH SAS, société par actions simplifiée au capital de 
                10 174 560 euros, immatriculée au Registre du Commerce et des Sociétés de Lille Métropole sous le numéro 
                424 761 419, dont le siège social est situé au :
              </p>
              <p className="mt-2 ml-4">
                2 rue Kellermann<br />
                59100 Roubaix<br />
                France
              </p>
              <p className="mt-2">
                Téléphone : +33 (0)9 72 10 10 07
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">2. Propriété intellectuelle</h2>
              <p>
                L'ensemble des éléments composant le site VigilanceFrance (textes, graphismes, logiciels, photographies, 
                images, vidéos, sons, plans, logos, marques, etc.) ainsi que la structure générale du site sont la propriété 
                exclusive de VigilanceFrance SAS ou font l'objet d'une autorisation d'utilisation.
              </p>
              <p className="mt-2">
                Ces éléments sont protégés par les lois relatives à la propriété intellectuelle, notamment le droit d'auteur, 
                le droit des marques et le droit des bases de données.
              </p>
              <p className="mt-2">
                Toute représentation, reproduction, exploitation, modification, utilisation, diffusion ou traduction de tout 
                ou partie des éléments du site, sous quelque forme que ce soit, sans l'autorisation écrite préalable de 
                VigilanceFrance SAS, est strictement interdite et serait susceptible de constituer un délit de contrefaçon 
                au sens des articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">3. Protection des données personnelles</h2>
              <p>
                VigilanceFrance SAS, en tant que responsable de traitement, collecte et traite des données à caractère 
                personnel conformément au Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 
                (Règlement Général sur la Protection des Données - RGPD) et à la loi n° 78-17 du 6 janvier 1978 relative 
                à l'informatique, aux fichiers et aux libertés modifiée.
              </p>
              <p className="mt-2">
                Pour plus d'informations sur la manière dont nous collectons, utilisons et protégeons vos données personnelles, 
                veuillez consulter notre <a href="/privacy" className="text-blue-600 hover:text-blue-800">Politique de confidentialité</a>.
              </p>
              <p className="mt-2">
                Conformément à la réglementation applicable, vous disposez de droits d'accès, de rectification, d'effacement, 
                de limitation du traitement, de portabilité de vos données et d'opposition au traitement de vos données personnelles.
              </p>
              <p className="mt-2">
                Pour exercer ces droits ou pour toute question relative au traitement de vos données, vous pouvez contacter 
                notre Délégué à la Protection des Données (DPO) à l'adresse suivante : dpo@vigilancefrance.fr ou par courrier à 
                l'adresse du siège social.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">4. Cookies</h2>
              <p>
                Le site VigilanceFrance utilise des cookies et autres traceurs. Pour en savoir plus sur leur utilisation et 
                pour les paramétrer, veuillez consulter notre <a href="/cookies" className="text-blue-600 hover:text-blue-800">Politique de gestion des cookies</a>.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">5. Liens hypertextes</h2>
              <p>
                Le site VigilanceFrance peut contenir des liens hypertextes vers d'autres sites internet. VigilanceFrance SAS 
                n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, aux pratiques 
                qu'ils mettent en œuvre et aux produits ou services qu'ils proposent.
              </p>
              <p className="mt-2">
                La mise en place de liens hypertextes vers le site VigilanceFrance nécessite une autorisation préalable écrite 
                de VigilanceFrance SAS.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">6. Limitation de responsabilité</h2>
              <p>
                VigilanceFrance SAS s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des 
                informations diffusées sur le site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, 
                le contenu.
              </p>
              <p className="mt-2">
                Toutefois, VigilanceFrance SAS ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations 
                mises à disposition sur le site, qui sont fournies à titre indicatif et peuvent être mises à jour régulièrement.
              </p>
              <p className="mt-2">
                VigilanceFrance SAS ne saurait être tenue pour responsable des erreurs ou omissions, ainsi que de l'indisponibilité 
                des informations et des services.
              </p>
              <p className="mt-2">
                VigilanceFrance SAS décline toute responsabilité pour les dommages directs ou indirects, quelle qu'en soit la 
                cause, origine, nature ou conséquence, résultant de l'accès à son site ou de l'impossibilité d'y accéder, de 
                l'utilisation de son site et/ou du crédit accordé à une information provenant directement ou indirectement de ce dernier.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">7. Droit applicable et juridiction compétente</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige relatif à l'interprétation ou 
                à l'exécution de ces mentions légales, les tribunaux français seront seuls compétents.
              </p>
              
              <h2 className="text-xl font-semibold text-blue-800 mt-6 mb-3">8. Contact</h2>
              <p>
                Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter :
              </p>
              <ul className="list-none mt-2">
                <li>Par e-mail : legal@vigilancefrance.fr</li>
                <li className="mt-1">Par courrier : VigilanceFrance SAS - Service Juridique, 123 Avenue de la République, 75011 Paris, France</li>
                <li className="mt-1">Par téléphone : +33 (0)1 23 45 67 89 (du lundi au vendredi, de 9h à 18h)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Legal;