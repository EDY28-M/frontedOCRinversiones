import { Link } from 'react-router-dom';
import '../../../styles/inicio.css';

/**
 * Página Servicios - Placeholder
 * TODO: Implementar página de servicios
 */
export default function Servicios() {
  return (
    <div className="inicio-wrapper bg-surface font-sans text-text-main antialiased">
      <div className="relative flex flex-col w-full">
        
        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-border-light">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between h-24">
              <Link to="/" className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">settings_b_roll</span>
                <div>
                  <h2 className="text-primary text-2xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h2>
                  <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-12">
                <Link className="text-gray-500 hover:text-primary text-sm font-semibold uppercase tracking-widest transition-colors" to="/">Inicio</Link>
                <Link className="text-gray-500 hover:text-primary text-sm font-semibold uppercase tracking-widest transition-colors" to="/productos">Productos</Link>
                <Link className="text-black hover:text-primary text-sm font-semibold uppercase tracking-widest transition-colors" to="/servicios">Servicios</Link>
              </nav>
              <div className="flex items-center gap-6">
                <span className="material-symbols-outlined text-gray-400 hover:text-primary cursor-pointer transition-colors text-xl">search</span>
                <div className="relative cursor-pointer group">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-xl">shopping_bag</span>
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="pt-24">
          <section className="py-24 bg-surface-alt">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">Nuestros Servicios</span>
              <h1 className="font-display text-4xl md:text-5xl font-medium uppercase text-black mb-8">Servicios</h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Página en construcción. Pronto encontrarás aquí información sobre nuestros servicios de importación y asesoría.
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
