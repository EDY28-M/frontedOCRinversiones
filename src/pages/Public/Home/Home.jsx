import { Link } from 'react-router-dom';
import { useState } from 'react';
import MobileMenu from '../../../components/common/MobileMenu';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* Header */}
      <header className="w-full bg-white border-b border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 min-w-fit">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h1>
              <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-xs font-semibold hover:text-primary transition-colors tracking-wide" to="/">INICIO</Link>
            <Link className="text-xs font-bold text-primary border-b-2 border-primary py-1 tracking-wide" to="/productos">CATÁLOGO</Link>
            <Link className="text-xs font-semibold hover:text-primary transition-colors tracking-wide" to="/servicios">SERVICIOS</Link>
            <Link className="text-xs font-semibold hover:text-primary transition-colors tracking-wide" to="/nosotros">EMPRESA</Link>
          </nav>
          <div className="flex-1 max-w-sm hidden lg:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="Buscar refacción..."
                type="text"
              />
            </div>
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

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden pt-20">
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

      {/* Footer */}
      <footer className="bg-primary text-white pt-10 pb-6 border-t-4 border-accent">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-2xl">settings_b_roll</span>
                  </div>
                  <h1 className="text-xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h1>
                  <p className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  Líderes en refacciones de alto rendimiento para entusiastas del motor. Calidad garantizada en cada pieza.
                </p>
                <div className="flex gap-3">
                  <a className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-[10px] font-bold">IG</span>
                  </a>
                  <a className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-[10px] font-bold">FB</span>
                  </a>
                  <a className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-[10px] font-bold">TW</span>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Nuestra Empresa</h4>
                <ul className="space-y-2">
                  <li><Link className="text-xs text-gray-200 hover:text-white transition-colors" to="/nosotros">Sobre Nosotros</Link></li>
                  <li><Link className="text-xs text-gray-200 hover:text-white transition-colors" to="/contacto">Carreras</Link></li>
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Blog Automotriz</a></li>
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Socios Comerciales</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Políticas</h4>
                <ul className="space-y-2">
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Envíos y Entregas</a></li>
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Devoluciones</a></li>
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Garantía de Piezas</a></li>
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Términos de Servicio</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Contacto</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-accent text-base mt-0.5">location_on</span>
                    <span className="text-xs text-gray-200">Av. Revolución 1234, CDMX, México</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-base">mail</span>
                    <a className="text-xs text-gray-200 hover:text-white" href="mailto:ventas@estructurapro.com">ventas@estructurapro.com</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-base">call</span>
                    <span className="text-xs text-gray-200">+52 55 1234 5678</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-800 pt-6 text-[10px] text-blue-200 uppercase tracking-widest gap-4">
              <p>© 2024 ORC Inversiones Perú. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <a className="hover:text-white transition-colors" href="#">Facebook</a>
                <a className="hover:text-white transition-colors" href="#">Instagram</a>
                <a className="hover:text-white transition-colors" href="#">WhatsApp</a>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default Home;
