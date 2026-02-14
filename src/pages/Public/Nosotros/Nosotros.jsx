import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileMenu from '../../../components/common/MobileMenu';
import '../../../styles/inicio.css';
import { contactService } from '../../../services/contactService';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';

/**
 * Página Nosotros - V3
 */
export default function Nosotros() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useDocumentMeta({
    title: 'Sobre Nosotros - ORC Inversiones Perú | Repuestos Vehiculares',
    description: 'Conoce ORC Inversiones Perú, empresa líder en importación de repuestos coreanos, chinos y japoneses para vehículos. Más de 15 años en Ate, Lima. Misión, visión y contacto.',
    canonicalPath: '/nosotros',
  });

  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  });
  const [contactStatus, setContactStatus] = useState({
    isSubmitting: false,
    type: '',
    message: '',
    confirmationSent: false,
  });

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    if (contactStatus.message) {
      setContactStatus((prev) => ({ ...prev, message: '', type: '' }));
    }
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (contactStatus.isSubmitting) return;

    const name = contactForm.name.trim();
    const email = contactForm.email.trim();
    const message = contactForm.message.trim();
    const company = contactForm.company.trim();

    if (!name || !email || !message) {
      setContactStatus((prev) => ({
        ...prev,
        type: 'error',
        message: 'Por favor completa los campos obligatorios.',
      }));
      return;
    }

    const subjectBase = 'Consulta desde página Nosotros';
    const subjectRaw = company ? `${subjectBase} - ${company}` : subjectBase;
    const subject = subjectRaw.length > 120 ? subjectRaw.slice(0, 120) : subjectRaw;
    const composedMessage = company
      ? `Empresa: ${company}\n\n${message}`
      : message;

    try {
      setContactStatus((prev) => ({ ...prev, isSubmitting: true, message: '', type: '' }));
      const response = await contactService.sendContact({
        name,
        email,
        subject,
        message: composedMessage,
      });

      setContactStatus({
        isSubmitting: false,
        type: 'success',
        message: response?.message || 'Mensaje enviado correctamente.',
        confirmationSent: response?.confirmationSent ?? true,
      });
      setContactForm({
        name: '',
        company: '',
        email: '',
        message: '',
      });
    } catch (error) {
      setContactStatus({
        isSubmitting: false,
        type: 'error',
        message: error?.message || 'No pudimos enviar tu mensaje. Inténtalo más tarde.',
        confirmationSent: false,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-surface font-sans text-text-main antialiased overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 w-full bg-white border-b border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 min-w-fit">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
            </div>
            <div>
              <span className="text-2xl font-display font-medium uppercase tracking-tighter leading-none block">ORC</span>
              <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
              }
              end
            >
              {({ isActive }) => (
                <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                  INICIO
                </span>
              )}
            </NavLink>
            <NavLink
              to="/productos"
              className={({ isActive }) =>
                `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
              }
            >
              {({ isActive }) => (
                <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                  CATÁLOGO
                </span>
              )}
            </NavLink>
            <NavLink
              to="/envios-provincias"
              className={({ isActive }) =>
                `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
              }
            >
              {({ isActive }) => (
                <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                  ENVÍOS A PROVINCIAS
                </span>
              )}
            </NavLink>
            <NavLink
              to="/nosotros"
              className={({ isActive }) =>
                `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
              }
            >
              {({ isActive }) => (
                <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                  EMPRESA
                </span>
              )}
            </NavLink>
          </nav>

          <div className="flex-1 max-w-sm hidden lg:block">
            {/* Spacer to maintain layout positions */}
          </div>

          <div className="flex items-center gap-2 min-w-fit">
            <button className="relative p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded transition-colors group">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-white"></span>
            </button>
            <button className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded transition-colors group">
              <span className="material-symbols-outlined text-[22px]">person</span>
            </button>
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-gray-900 rounded"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Component */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Contenedor con scroll */}
      <div className="flex-1 overflow-y-auto">
        {/* Content */}
        <main className="font-body">
          {/* Sobre Nosotros Section */}
          <section className="pt-6 sm:pt-8 md:pt-10 pb-10 sm:pb-12 md:pb-10 bg-white overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 gap-6 lg:gap-8">
              {/* Imagen del auto */}
              <div className="relative w-full lg:w-1/2 xl:w-[50%] overflow-hidden order-1 lg:order-1">
                <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:absolute lg:inset-0">
                  <img
                    src="/imagenes OC/1.jpeg"
                    alt="ORC Inversiones Perú - Repuestos"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Contenido de texto */}
              <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 lg:w-1/2 xl:w-[45%] py-2 sm:py-4 lg:py-0 lg:px-8 xl:px-12 order-2 lg:order-2">
                <div>
                  <span className="text-primary font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm">NUESTRA HISTORIA</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-matte-dark uppercase font-display leading-tight">
                  SOBRE <span className="text-primary">NOSOTROS</span>
                </h1>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                  Somos una empresa especializada en la importación y comercialización de repuestos para vehículos de origen chino, japonés y coreano, comprometida con ofrecer productos de calidad y soluciones confiables para el sector automotriz.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Trabajamos con proveedores seleccionados y un control riguroso de nuestros productos, lo que nos permite garantizar repuestos confiables, disponibilidad permanente y precios competitivos. Nuestro equipo cuenta con experiencia en el rubro automotriz y brinda una atención personalizada, orientada a satisfacer las necesidades de talleres, empresas y clientes finales.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Nuestro objetivo es convertirnos en un aliado estratégico para nuestros clientes, aportando confianza, cumplimiento y respaldo en cada compra.
                </p>
                <div className="mt-2 sm:mt-4">
                  <a
                    href="#contacto"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold font-display uppercase tracking-wide text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-4 hover:bg-secondary transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    CONTÁCTANOS
                    <span className="material-symbols-outlined text-base sm:text-lg">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="pt-12 md:pt-16 pb-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-matte-dark uppercase font-display mb-4">Línea de Tiempo <span className="text-secondary">Operativa</span></h2>
                <div className="h-1 w-24 bg-accent mx-auto"></div>
              </div>
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-secondary/20 md:-ml-0.5 h-full"></div>
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-secondary to-transparent md:-ml-0.5 h-3/4"></div>

                {/* 2008 */}
                <div className="relative mb-16 md:mb-24">
                  <div className="md:flex items-center justify-between w-full">
                    <div className="md:w-6/12 order-1 text-left pr-0 md:pr-12 pl-12 md:pl-0 mb-4 md:mb-0">
                      <span className="block text-7xl font-display font-bold text-gray-100 absolute md:relative -top-6 left-0 md:top-auto md:left-auto -z-10">2008</span>
                      <h3 className="text-3xl font-bold text-matte-dark uppercase font-display mb-3">Inicio de Operaciones</h3>
                      <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
                        Fundación en Ate, Lima. ORC Inversiones nace con un inventario modesto pero con una visión técnica clara: suministrar solo componentes de alta especificación.
                      </p>
                    </div>
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 bg-white border-4 border-accent w-6 h-6 z-20"></div>
                    <div className="md:w-4/12 order-1 pl-12 md:pl-4">
                      <div className="w-full overflow-hidden relative group shadow-md">
                        <img
                          src="/nosotrosimages/inicioperaciones.jpg"
                          alt="Inicio de Operaciones ORC"
                          className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-secondary"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-secondary"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2015 */}
                <div className="relative mb-16 md:mb-24">
                  <div className="md:flex items-center justify-between w-full flex-row-reverse">
                    <div className="md:w-6/12 text-left pl-12 md:pl-12 mb-4 md:mb-0">
                      <span className="block text-7xl font-display font-bold text-gray-100 absolute md:relative -top-6 left-0 md:top-auto md:left-auto -z-10">2015</span>
                      <h3 className="text-3xl font-bold text-matte-dark uppercase font-display mb-3">Expansión Logística</h3>
                      <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
                        Consolidación de alianzas estratégicas internacionales. Apertura del centro de distribución frente a Puruchuco, optimizando tiempos de entrega en un 40%.
                      </p>
                    </div>
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 bg-secondary w-6 h-6 z-20 shadow-lg shadow-secondary/50"></div>
                    <div className="md:w-4/12 pr-0 md:pr-4 pl-12 md:pl-0">
                      <div className="w-full overflow-hidden relative group shadow-md">
                        <img
                          src="/nosotrosimages/logisitca.jpg"
                          alt="Expansión Logística ORC"
                          className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2024 */}
                <div className="relative">
                  <div className="md:flex items-center justify-between w-full">
                    <div className="md:w-6/12 order-1 text-left pr-0 md:pr-12 pl-12 md:pl-0 mb-4 md:mb-0">
                      <span className="block text-7xl font-display font-bold text-gray-100 absolute md:relative -top-6 left-0 md:top-auto md:left-auto -z-10">2024</span>
                      <h3 className="text-3xl font-bold text-matte-dark uppercase font-display mb-3">Repuestos Originales</h3>
                      <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
                        Consolidamos nuestra oferta con repuestos 100% originales y certificados. Catálogo digital completo para flotas industriales y transporte pesado en Perú.
                      </p>
                    </div>
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 bg-matte-dark border-2 border-white w-6 h-6 z-20"></div>
                    <div className="md:w-4/12 order-1 pl-12 md:pl-4">
                      <div className="w-full overflow-hidden relative group shadow-md">
                        <img
                          src="/nosotrosimages/repuestos_originales.jpg"
                          alt="Repuestos Originales ORC"
                          className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-secondary"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-secondary"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cuentas Bancarias Section */}
          <section className="py-16 md:py-20 bg-white border-y border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Métodos de Pago</span>
                <h2 className="text-3xl md:text-4xl font-bold text-matte-dark uppercase font-display mb-4">
                  Cuentas Bancarias <span className="text-primary">Oficiales</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Realiza tus pagos de forma segura a través de nuestras cuentas verificadas
                </p>
                <div className="h-1 w-24 bg-accent mx-auto mt-6"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* BCP Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:border-orange-400">
                  <div className="flex items-center gap-4 mb-6">
                    {/* BCP Logo */}
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden p-2">
                      <img src="/Bancos/BCP.png" alt="BCP" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 font-display">Banco de Crédito del Perú</h3>
                      <p className="text-orange-600 text-sm font-semibold">Cuenta Corriente Soles</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Número de Cuenta</span>
                      </div>
                      <p className="text-gray-900 text-lg font-mono font-bold tracking-wider">191 21 22 62 4045</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">CCI (Interbancario)</span>
                      </div>
                      <p className="text-gray-900 text-base font-mono font-bold tracking-wider">002 19100 21 22 6240 45 51</p>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-gray-700 text-sm">
                        <span className="text-gray-500">Titular:</span> <span className="font-semibold">ORC INVERSIONES PERU S.A.C</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Yape Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group hover:border-purple-400">
                  <div className="flex items-center gap-4 mb-6">
                    {/* Yape Logo */}
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden p-2">
                      <img src="/Bancos/yape.png" alt="Yape" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 font-display">Yape</h3>
                      <p className="text-purple-600 text-sm font-semibold">Pago Instantáneo</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Número de Celular</span>
                      </div>
                      <p className="text-gray-900 text-2xl font-mono font-bold tracking-wider">984 244 498</p>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-gray-700 text-sm">
                        <span className="text-gray-500">Titular:</span> <span className="font-semibold">ORC INVERSIONES PERU S.A.C</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-purple-700 text-sm bg-purple-50 px-4 py-3 rounded-xl border border-purple-100">
                      <span className="material-symbols-outlined text-lg">verified</span>
                      <span className="font-medium">Verificado y seguro para pagos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-100 px-6 py-3 rounded-full">
                  <span className="material-symbols-outlined text-primary">shield</span>
                  <p className="text-gray-700 text-sm">
                    <span className="text-primary font-bold">Importante:</span> Solo realice pagos a estas cuentas oficiales verificadas
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission/Vision Section */}
          <section className="py-24 bg-surface-alt border-y border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 relative group border border-gray-200 hover:border-secondary transition-colors duration-300 shadow-sm hover:shadow-xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 group-hover:bg-secondary transition-colors"></div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-bold text-matte-dark uppercase font-display tracking-wide">Misión</h3>
                    <span className="material-symbols-outlined text-4xl text-gray-300 group-hover:text-secondary transition-colors">flag</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Proveer soluciones de ingeniería automotriz de <span className="font-bold text-secondary">alta gama</span>.
                    Optimizamos el rendimiento de cada vehículo mediante refacciones certificadas y un soporte técnico sin precedentes.
                  </p>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-secondary transition-colors">
                    Protocolo: Calidad Total
                  </div>
                </div>
                <div className="bg-white p-10 relative group border border-gray-200 hover:border-accent transition-colors duration-300 shadow-sm hover:shadow-xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 group-hover:bg-accent transition-colors"></div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-bold text-matte-dark uppercase font-display tracking-wide">Visión</h3>
                    <span className="material-symbols-outlined text-4xl text-gray-300 group-hover:text-accent transition-colors">visibility</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Ser el eje central de la distribución de autopartes en la región andina para el <span className="font-bold text-gray-900">2030</span>. Innovando en logística digital y estableciendo el estándar de oro en servicio industrial.
                  </p>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-accent transition-colors">
                    Objetivo: Liderazgo Regional
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contacto" className="bg-matte-dark text-white scroll-mt-20">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 p-12 lg:p-24 bg-matte-dark relative">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-accent opacity-50"></div>
                <h2 className="text-4xl font-bold font-display uppercase mb-2">Contacto</h2>
                <p className="text-gray-400 mb-10 font-light">Complete la ficha técnica para iniciar una consulta.</p>
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative pt-2">
                      <input
                        className="block w-full px-4 pt-6 pb-2 bg-white/5 border border-gray-700 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors peer placeholder-transparent"
                        id="name"
                        placeholder="Nombre Completo"
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required
                      />
                      <label
                        className="absolute left-4 top-4 text-gray-400 text-base transition-all duration-200 pointer-events-none uppercase tracking-wide peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary"
                        htmlFor="name"
                      >
                        Nombre
                      </label>
                    </div>
                    <div className="relative pt-2">
                      <input
                        className="block w-full px-4 pt-6 pb-2 bg-white/5 border border-gray-700 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors peer placeholder-transparent"
                        id="company"
                        placeholder="Empresa"
                        type="text"
                        name="company"
                        value={contactForm.company}
                        onChange={handleContactChange}
                      />
                      <label
                        className="absolute left-4 top-4 text-gray-400 text-base transition-all duration-200 pointer-events-none uppercase tracking-wide peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary"
                        htmlFor="company"
                      >
                        Empresa
                      </label>
                    </div>
                  </div>
                  <div className="relative pt-2">
                    <input
                      className="block w-full px-4 pt-6 pb-2 bg-white/5 border border-gray-700 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors peer placeholder-transparent"
                      id="email"
                      placeholder="Correo Corporativo"
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                    />
                    <label
                      className="absolute left-4 top-4 text-gray-400 text-base transition-all duration-200 pointer-events-none uppercase tracking-wide peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary"
                      htmlFor="email"
                    >
                      Correo Corporativo
                    </label>
                  </div>
                  <div className="relative pt-2">
                    <textarea
                      className="block w-full px-4 pt-6 pb-2 bg-white/5 border border-gray-700 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors peer placeholder-transparent"
                      id="message"
                      placeholder="Especificaciones del Requerimiento"
                      rows="4"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      maxLength={5000}
                      required
                    ></textarea>
                    <label
                      className="absolute left-4 top-4 text-gray-400 text-base transition-all duration-200 pointer-events-none uppercase tracking-wide peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-primary"
                      htmlFor="message"
                    >
                      Especificaciones
                    </label>
                  </div>
                  {contactStatus.message && (
                    <div
                      className={`text-sm font-semibold ${contactStatus.type === 'success' ? 'text-emerald-300' : 'text-red-300'
                        }`}
                    >
                      {contactStatus.message}
                      {contactStatus.type === 'success' && contactStatus.confirmationSent === false
                        ? ' No pudimos enviar el correo de confirmación.'
                        : ''}
                    </div>
                  )}
                  <button
                    className="w-full bg-accent text-matte-dark font-bold font-display uppercase tracking-widest text-sm py-5 hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none translate-x-0 hover:translate-x-[2px] hover:translate-y-[2px] duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={contactStatus.isSubmitting}
                  >
                    {contactStatus.isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                </form>
              </div>
              <div className="w-full lg:w-1/2 h-96 lg:h-auto relative bg-slate-900 border-l-0 lg:border-l-4 border-secondary">
                <div className="absolute inset-0 z-10 pointer-events-none border-[20px] border-slate-800/80"></div>
                <div className="absolute top-8 left-8 z-20 bg-secondary px-6 py-4 shadow-2xl">
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Base Operativa</p>
                  <p className="text-xl font-bold font-display text-white">ATE - LIMA</p>
                  <div className="flex items-center mt-2 text-xs text-blue-100">
                    <span className="material-symbols-outlined text-sm mr-1">near_me</span>
                    <span>Ref. Puruchuco</span>
                  </div>
                </div>
                <iframe allowFullScreen="" height="100%" loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.0!2d-76.9186!3d-12.0286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c78c19cb26af%3A0x7c183903bc384951!2sORC%20INVERSIONES%20PER%C3%9A%20S.A.C!5e0!3m2!1ses!2spe" style={{ border: 0, filter: 'grayscale(100%) contrast(1.2) brightness(0.8)' }} width="100%">
                </iframe>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-accent">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
                  </div>
                  <span className="text-2xl font-display font-medium uppercase tracking-tighter leading-none block">ORC</span>
                  <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Somos una empresa dedicada a la importación y venta de repuestos para vehículos chinos, japoneses y coreanos, ofreciendo calidad y precios competitivos.
                </p>
                <div className="flex gap-4">
                  <a className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-xs font-bold">IG</span>
                  </a>
                  <a className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-xs font-bold">FB</span>
                  </a>
                  <a className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-xs font-bold">TW</span>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Nuestra Empresa</h4>
                <ul className="space-y-4">
                  <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/nosotros">Sobre Nosotros</Link></li>
                  <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/envios-provincias">Envíos a Provincias</Link></li>
                  <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/productos">Catálogo</Link></li>
                  <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/">Empresa</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Políticas</h4>
                <ul className="space-y-4">
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Envíos y Entregas</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Devoluciones</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Garantía de Piezas</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Términos de Servicio</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Contacto</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-accent text-lg mt-0.5">location_on</span>
                    <a className="text-sm text-gray-200 hover:text-white transition-colors" href="https://maps.app.goo.gl/iA9sAQACR87o2Bsj7" target="_blank" rel="noopener noreferrer">Av. Nicolás Ayllón 4329 - Ate, Lima</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent text-lg">mail</span>
                    <a className="text-sm text-gray-200 hover:text-white" href="mailto:ventas@orcinversiones.com">ventas@orcinversiones.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent text-lg">call</span>
                    <span className="text-sm text-gray-200">984 244 498</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-800 pt-8 text-[10px] text-blue-200 uppercase tracking-widest gap-4">
              <p>© {new Date().getFullYear()} ORC Inversiones Perú. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <a className="hover:text-white transition-colors" href="#">Facebook</a>
                <a className="hover:text-white transition-colors" href="#">Instagram</a>
                <a className="hover:text-white transition-colors" href="#">WhatsApp</a>
              </div>
            </div>
          </div>
        </footer>
      </div>{/* Cierre del contenedor con scroll */}
    </div>
  );
}
