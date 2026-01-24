const About = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-secondary mb-4 uppercase tracking-wider border-b-4 border-primary inline-block pb-2">
            Nosotros
          </h1>
          <p className="text-gray-600 text-lg mt-6 max-w-3xl mx-auto">
            Expertos en el mantenimiento y reparación de camiones pesados con años de experiencia en el sector.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPDU-7DqgZqFjr5rnw339dXlW-iaHbgMWr-oUlGLHmyXhtLEH2Juu0Hir_I_DybM3Gft3mxUrByH49b2ALkQrv5ENZXmqUWByWHsj7hJHfI6iFASrntTDbCF54dqIjYDpOVFWDnXaxfOTlzLo-EPypn5QPjQn2xaN2JbZy-al_q5rNoWj_puTjkhF1DvJTDkTl0Zn7oVILm2zKXW9PZfOW3kefsZIo_OmGGKMEX6LCy01TRRwIcP5GTL6318TrWnWVl8wQYDPeI6o"
              alt="Taller ORC"
              className="w-full h-96 object-cover shadow-lg border-t-4 border-primary"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-6 uppercase tracking-wide">
              Quiénes Somos
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              ORC Inversiones es una empresa peruana especializada en el mantenimiento, reparación y servicios 
              integrales para camiones pesados. Con años de experiencia en el sector, nos hemos consolidado como 
              líderes en servicios de ingeniería mecánica.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Contamos con un equipo de técnicos altamente capacitados y equipamiento de última generación 
              para garantizar el mejor servicio a nuestros clientes.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nuestra misión es mantener tu flota operativa con los más altos estándares de calidad y seguridad.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-gray-50 py-12 px-8 border-t-4 border-primary">
          <h2 className="text-3xl font-bold text-secondary mb-8 text-center uppercase tracking-wide">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-secondary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">verified</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2 uppercase">Calidad</h3>
              <p className="text-gray-600">
                Comprometidos con la excelencia en cada servicio.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-secondary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">shield</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2 uppercase">Confianza</h3>
              <p className="text-gray-600">
                Tu socio de confianza para el mantenimiento de tu flota.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-secondary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">schedule</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2 uppercase">Puntualidad</h3>
              <p className="text-gray-600">
                Respetamos tus tiempos y plazos de entrega.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
