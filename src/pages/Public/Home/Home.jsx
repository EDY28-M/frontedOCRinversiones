import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPDU-7DqgZqFjr5rnw339dXlW-iaHbgMWr-oUlGLHmyXhtLEH2Juu0Hir_I_DybM3Gft3mxUrByH49b2ALkQrv5ENZXmqUWByWHsj7hJHfI6iFASrntTDbCF54dqIjYDpOVFWDnXaxfOTlzLo-EPypn5QPjQn2xaN2JbZy-al_q5rNoWj_puTjkhF1DvJTDkTl0Zn7oVILm2zKXW9PZfOW3kefsZIo_OmGGKMEX6LCy01TRRwIcP5GTL6318TrWnWVl8wQYDPeI6o"
            alt="Taller ORC"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-wide">
            ORC <span className="text-primary">INVERSIONES</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 font-semibold">
            Servicios Profesionales de Mantenimiento y Reparación de Camiones Pesados
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/servicios"
              className="px-8 py-4 bg-primary text-secondary font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl"
            >
              Nuestros Servicios
            </Link>
            <Link
              to="/contacto"
              className="px-8 py-4 bg-transparent border-2 border-primary text-primary font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-secondary transition-all"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios Destacados */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary mb-4 uppercase tracking-wider border-b-4 border-primary inline-block pb-2">
              Servicios Destacados
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Soluciones integrales para tu flota de camiones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Servicio 1 */}
            <div className="bg-gray-50 p-8 border-t-4 border-primary hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 bg-secondary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">build</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3 uppercase tracking-wide">
                Mantenimiento Preventivo
              </h3>
              <p className="text-gray-600">
                Programas de mantenimiento para extender la vida útil de tus vehículos.
              </p>
            </div>

            {/* Servicio 2 */}
            <div className="bg-gray-50 p-8 border-t-4 border-primary hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 bg-secondary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">engineering</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3 uppercase tracking-wide">
                Reparaciones Especializadas
              </h3>
              <p className="text-gray-600">
                Técnicos expertos en reparación de motores, transmisiones y sistemas.
              </p>
            </div>

            {/* Servicio 3 */}
            <div className="bg-gray-50 p-8 border-t-4 border-primary hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 bg-secondary flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">local_shipping</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3 uppercase tracking-wide">
                Diagnóstico Computarizado
              </h3>
              <p className="text-gray-600">
                Tecnología de punta para identificar y resolver problemas rápidamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-wider">
            ¿Necesitas Asistencia?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Nuestro equipo de expertos está listo para ayudarte con cualquier necesidad de tu flota.
          </p>
          <Link
            to="/contacto"
            className="inline-block px-10 py-4 bg-primary text-secondary font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl"
          >
            Solicitar Cotización
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
