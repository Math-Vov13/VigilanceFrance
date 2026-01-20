import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | Sentinelle</title>
        <meta
          name="description"
          content="Discover the story and mission of Sentinelle, a collaborative platform dedicated to public safety."
        />
      </Helmet>

      <Navbar />

      <main className="bg-gray-900 dark min-h-screen text-gray-100 mt-16">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            About Sentinelle
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
            <p className="mb-4">
              Sentinelle was created with a simple but essential goal: empower citizens to actively participate in the safety of their environment. 
              Our collaborative platform maps incidents in real time, providing a clear and precise overview of public safety in every neighborhood.
            </p>
            <p>
              We strongly believe that shared information is a powerful tool to strengthen collective security. By giving citizens the ability to report and monitor incidents, 
              we help create more vigilant and prepared communities.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Our Story</h2>
            <p className="mb-4">
              Founded in 2023 by a team passionate about technology and public safety, Sentinelle was born from the belief that citizens can play an active role in crime prevention 
              and promoting security.
            </p>
            <p>
              In response to growing safety concerns and the evolving challenges of urban life, we wanted to create a tool that leverages modern technology for daily security. 
              Since then, our platform has continuously evolved, incorporating user feedback and the latest technological innovations.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-300 mb-2">Transparency</h3>
                <p>
                  We believe in clear and verified information. Our moderation process ensures that the data shared on the platform is reliable and relevant.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-300 mb-2">Privacy</h3>
                <p>
                  Protecting personal data is a core concern. All reports are anonymized, and we strictly follow the highest standards of privacy protection.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-300 mb-2">Civic Engagement</h3>
                <p>
                  We value active citizen participation in building a safer environment. Your vigilance is the first line of defense against insecurity.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-300 mb-2">Innovation</h3>
                <p>
                  We continuously invest in improving our platform to provide an optimal user experience and features adapted to contemporary challenges.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Our Team</h2>
            <p className="mb-4">
              Behind Sentinelle is a diverse team of security professionals, developers, data scientists, and communication experts. This diversity allows us to approach safety from multiple angles and deliver innovative solutions.
            </p>
            <p>
              We work closely with sector experts and local authorities to ensure the platform meets real public safety needs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Join Us</h2>
            <p className="mb-4">
              Your participation is essential to make Sentinelle a more effective tool. By reporting incidents, sharing observations, or suggesting improvements, you directly help reinforce the safety of your neighborhood and improve our service.
            </p>
            <p>
              We are always open to your suggestions and questions. Feel free to contact us through our dedicated page or follow us on social media to stay updated.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default About;
