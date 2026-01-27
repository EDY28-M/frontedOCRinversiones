import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../../../styles/inicio.css';

/**
 * Página Nosotros - Placeholder
 * TODO: Implementar página de nosotros/about
 */
export default function Nosotros() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="inicio-wrapper bg-surface font-sans text-text-main antialiased">
      <div className="relative flex flex-col w-full">

        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white border-b border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
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
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide relative pb-1 ${isActive ? 'text-primary font-bold nav-link-active' : 'hover:text-primary'}`
                }
                end
              >
                INICIO
              </NavLink>
              <NavLink
                to="/productos"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide relative pb-1 ${isActive ? 'text-primary font-bold nav-link-active' : 'hover:text-primary'}`
                }
              >
                CATÁLOGO
              </NavLink>
              <NavLink
                to="/servicios"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide relative pb-1 ${isActive ? 'text-primary font-bold nav-link-active' : 'hover:text-primary'}`
                }
              >
                SERVICIOS
              </NavLink>
              <NavLink
                to="/nosotros"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide relative pb-1 ${isActive ? 'text-primary font-bold nav-link-active' : 'hover:text-primary'}`
                }
              >
                EMPRESA
              </NavLink>
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
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Filters Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-border-light p-4">
            <nav className="flex flex-col gap-2">
              <Link
                className="text-sm font-semibold py-2 hover:text-primary transition-colors"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                INICIO
              </Link>
              <Link
                className="text-sm font-semibold py-2 hover:text-primary transition-colors"
                to="/productos"
                onClick={() => setMobileMenuOpen(false)}
              >
                CATÁLOGO
              </Link>
              <Link
                className="text-sm font-semibold py-2 hover:text-primary transition-colors"
                to="/servicios"
                onClick={() => setMobileMenuOpen(false)}
              >
                SERVICIOS
              </Link>
              <Link
                className="text-sm font-semibold py-2 hover:text-primary transition-colors"
                to="/nosotros"
                onClick={() => setMobileMenuOpen(false)}
              >
                EMPRESA
              </Link>
            </nav>
          </div>
        )}

        {/* Content */}
        <main className="pt-20">
          <section className="py-24 bg-surface-alt">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Conócenos</span>
              <h1 className="font-display text-4xl md:text-5xl font-medium uppercase text-black mb-8">Nosotros</h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Página en construcción. Pronto encontrarás aquí información sobre nuestra empresa y trayectoria.
              </p>
              <Link to="/" className="inline-flex items-center gap-2 mt-8 text-primary hover:text-black text-sm font-bold uppercase tracking-widest transition-colors">
                <span className="material-symbols-outlined">arrow_back</span> Volver al Inicio
              </Link>
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
                  <h1 className="text-2xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h1>
                  <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Líderes en refacciones de alto rendimiento para entusiastas del motor. Calidad garantizada en cada pieza.
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
                  <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/contacto">Carreras</Link></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Blog Automotriz</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Socios Comerciales</a></li>
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
                    <span className="text-sm text-gray-200">Av. Revolución 1234, CDMX, México</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent text-lg">mail</span>
                    <a className="text-sm text-gray-200 hover:text-white" href="mailto:ventas@estructurapro.com">ventas@estructurapro.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent text-lg">call</span>
                    <span className="text-sm text-gray-200">+52 55 1234 5678</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-800 pt-8 text-[10px] text-blue-200 uppercase tracking-widest gap-4">
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
    </div>
  );
}
