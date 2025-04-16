import  { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <>
      <Helmet>
        <title>À propos | VigilanceFrance</title>
        <meta name="description" content="Découvrez l'histoire et la mission de VigilanceFrance, une plateforme citoyenne dédiée à la sécurité publique." />
      </Helmet>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">À propos de VigilanceFrance</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Notre Mission</h2>
            <p className="text-gray-700 mb-4">
              VigilanceFrance a été créée avec une mission simple mais essentielle : permettre aux citoyens de participer activement à la sécurité de leur environnement. 
              Notre plateforme collaborative vise à cartographier en temps réel les incidents de sécurité signalés à travers la France, offrant ainsi une 
              vision claire et précise de la situation sécuritaire dans chaque quartier.
            </p>
            <p className="text-gray-700">
              Nous croyons fermement que l'information partagée est un outil puissant pour renforcer la sécurité collective. En donnant aux citoyens 
              les moyens de signaler et de consulter les incidents, nous contribuons à créer des communautés plus vigilantes et mieux préparées.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Notre Histoire</h2>
            <p className="text-gray-700 mb-4">
              Fondée en 2023 par une équipe de professionnels passionnés par la technologie et la sécurité publique, VigilanceFrance est née de 
              la conviction que les citoyens peuvent jouer un rôle actif dans la prévention des délits et la promotion de la sécurité.
            </p>
            <p className="text-gray-700">
              Face à la montée des préoccupations sécuritaires et à l'évolution constante des défis urbains, nous avons voulu créer un outil 
              qui met la technologie moderne au service de la sécurité quotidienne. Depuis, notre plateforme n'a cessé d'évoluer, intégrant 
              les retours des utilisateurs et les dernières innovations technologiques.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-blue-700 mb-2">Transparence</h3>
                <p className="text-gray-700">Nous croyons à l'importance d'une information claire et vérifiée. Notre processus de modération 
                assure que les données partagées sur notre plateforme sont fiables et pertinentes.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-blue-700 mb-2">Confidentialité</h3>
                <p className="text-gray-700">La protection des données personnelles est au cœur de nos préoccupations. Tous les signalements 
                sont anonymisés et nous respectons scrupuleusement les normes les plus strictes en matière de confidentialité.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-blue-700 mb-2">Engagement citoyen</h3>
                <p className="text-gray-700">Nous valorisons la participation active de chaque citoyen à la construction d'un environnement 
                plus sûr. Votre vigilance est la première ligne de défense contre l'insécurité.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-blue-700 mb-2">Innovation</h3>
                <p className="text-gray-700">Nous investissons continuellement dans l'amélioration de notre plateforme pour offrir une 
                expérience utilisateur optimale et des fonctionnalités adaptées aux enjeux contemporains.</p>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Notre Équipe</h2>
            <p className="text-gray-700 mb-4">
              Derrière VigilanceFrance se trouve une équipe diversifiée de professionnels de la sécurité, de développeurs, de data scientists 
              et d'experts en communication. Cette diversité de compétences nous permet d'aborder la question de la sécurité sous différents angles 
              et d'apporter des solutions innovantes.
            </p>
            <p className="text-gray-700">
              Nous travaillons en étroite collaboration avec des experts du secteur et des autorités locales pour garantir que notre plateforme 
              répond aux besoins réels en matière de sécurité publique.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Rejoignez-nous</h2>
            <p className="text-gray-700 mb-4">
              Votre participation est essentielle pour faire de VigilanceFrance un outil toujours plus efficace. En signalant les incidents, 
              en partageant vos observations ou en proposant des améliorations, vous contribuez directement à renforcer la sécurité de votre quartier 
              et à améliorer notre service.
            </p>
            <p className="text-gray-700">
              Nous sommes toujours à l'écoute de vos suggestions et questions. N'hésitez pas à nous contacter via notre page dédiée ou à nous suivre 
              sur les réseaux sociaux pour rester informés des dernières actualités.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;