import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileMenu from '../../../components/common/MobileMenu';
import '../../../styles/inicio.css';

/**
 * Componente Inicio - Migración pixel-perfect del HTML original (Google Stitch)
 * Mantiene exactamente los colores, tipografías, espaciados y estilos del diseño.
 * 
 * IMPORTANTE: Este componente incluye su propio header y footer.
 * NO usar dentro de PublicLayout para evitar duplicación.
 */
export default function Inicio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="inicio-wrapper bg-surface font-sans text-text-main antialiased">
      <div className="relative flex flex-col w-full">

        {/* ==================== HEADER ==================== */}
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
                to="/servicios"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
                }
              >
                {({ isActive }) => (
                  <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                    SERVICIOS
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

        {/* ==================== HERO SECTION ==================== */}
        <section className="relative w-full flex items-center bg-gray-50 hero-section min-h-[440px] md:min-h-[480px] lg:min-h-[520px]">
          <div
            className="absolute inset-0 bg-cover bg-right-top lg:bg-center"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6aAXIdmyLI-VmCXw3ei_O2zxFd3rS23EzoNgVy2bM29doMxteKy20xdnHGoyxgk3v6WTCBHQV3_4Qu6wUXCNuEJ_z74Uwou0NfbTNsLj9y7FkqjljGkoy-dD_YFD0VoE3u9sr-5eZig13qFKJlVICqakLnr_XhnClKNmm9NL-ly8QQV2BTpyXoOmegxS1ERjSJGJPJem1L8oO4Q6raqhn4EoVcs7PB0opGaRNkq179ClmDVzPV2UN2S3RQF4EAWBBAVOHnWjPnVQ")', backgroundSize: 'cover' }}
          >
            <div className="absolute inset-0 bg-white/80"></div>
          </div>
          <div className="relative z-10 w-full page-container py-10 md:py-1">
            <div className="max-w-[580px]">
              <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-wider text-primary mb-4">
                Líderes en Importación
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium uppercase text-black tracking-tight leading-none mb-4 md:mb-5">
                Expertos en <br /><span className="text-primary">Repuestos</span> <br />Coreanos y <br /><span className="text-primary">Chinos</span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 max-w-md font-normal mb-6 md:mb-8 leading-relaxed border-l-4 border-accent pl-5">
                Más de 15 años de experiencia atendiendo talleres y flotas en Ate, Lima. Calidad garantizada para tu motor.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-accent hover:bg-accent-hover text-black px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors shadow-lg shadow-yellow-200">
                  Ver Catálogo
                </button>
                <button className="bg-white border border-gray-300 hover:border-primary hover:text-primary text-black px-6 py-3 font-semibold uppercase tracking-wider text-xs transition-colors">
                  Contactar Asesor
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== FEATURES SECTION ==================== */}
        <section className="w-full bg-white border-b border-gray-100">
          <div className="page-container py-10 md:py-12">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium uppercase text-gray-900 mb-2">Calidad Original</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Importamos directamente repuestos certificados para garantizar la durabilidad de su flota.</p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">local_offer</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium uppercase text-gray-900 mb-2">Precios Competitivos</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Optimizamos costos para ofrecer la mejor relación precio-calidad del mercado en Ate.</p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">warehouse</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium uppercase text-gray-900 mb-2">Stock Disponible</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Amplio inventario listo para entrega inmediata. Motores, filtros y sistemas de freno.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== PRODUCTS SECTION ==================== */}
        <section className="bg-surface-alt py-14 md:py-16 border-t border-border-light">
          <div className="page-container">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-12 gap-4">
              <div>
                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1 block">Catálogo Online</span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium uppercase text-black">Productos Destacados</h2>
              </div>
              <Link className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-black transition-colors" to="/productos">
                Ver Catálogo Completo <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>

            {/* Products Grid Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-5 md:mb-6">
              {/* Product 1 */}
              <div className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                  <div className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wide">Nuevo Ingreso</div>
                  <div
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC2wkKD1tTrebuIADqe4wsmcbuo8iwOn2EkC9GcZ4KXeqgTYm6yiP1sbLiMtpnlthbUoMdhfNRvqXzqdMK63iSnruSPHSEaJueHdhsG_kN_VhJ2agV4g6EfuVskybENJ_kQb5tR_KVXjaRU4VrjJXgk6Dcqa5-c9HfvwXgea0n5piQaHjoL3bL1cdAQf4qZyjMYPZNcPcdUIKN96qmDYZlj3Lr5-dtJOqWGeJV8dfM09T43y6AARGTYctu0-MVSKum0b5S4bRSuaw")' }}
                  ></div>
                </div>
                <div className="p-5 md:p-6 product-card-content">
                  <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5">Motor Diesel 2.5L Turbo</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed">Compatible con Hyundai H1 / Porter. Rendimiento superior y bajo consumo.</p>
                  <button className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors">
                    Cotizar Ahora
                  </button>
                </div>
              </div>

              {/* Product 2 */}
              <div className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWMAWvToIFkRoFwnnk91THA9_5-KISj2D2lLkINUUajOgny0MUJTRevcbFfE4ffled0VM9m2FiR7lPBmqbDrq7ZOyRyPx7CkpJc7ZsOq_jqJE5VSON8KmK9vNyYUCqj3P6pAqitBBfK5WjeS7jAzOjCvbRHDpMyhX8McZm8tASV3Z_qO8eZLfgtLa0oBASCgNBQFor6Qt1o3NVPBCyA_Lv240urrsbUok6MymoFe0QMjuYNHN4DCmteOS6tQXH3_qm8HtZYYVrQH8")' }}
                  ></div>
                </div>
                <div className="p-5 md:p-6 product-card-content">
                  <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5">Kit de Reparación Motor</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed">Juego completo de empaques y pistones para motores Isuzu serie N.</p>
                  <button className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors">
                    Cotizar Ahora
                  </button>
                </div>
              </div>

              {/* Product 3 */}
              <div className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9ZUK9avxLOWJMPmubQ7FSWpvK4v9FqGO9XByps9EwAABjTCrEGZ9LSpUb0A7hCOIzY13xLeTwFq-COOYilpizU7k3veeb9U2am24iQyn4z08dWbuK7He_DLfUdouNugD-fkoRxNq-m0rmroVDhTUo_M-PiBfn7H4-qQMyMf4oGNX1BeKYE1r2TjedKCAKjxLGrSNcjOvQuiEsUvVoy1cvbDIH1e3Vodc9bWM3ZmSfJakB2iGqztRv3EMa9O0JG-BPWQhwZiXt3l4")' }}
                  ></div>
                </div>
                <div className="p-5 md:p-6 product-card-content">
                  <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5">Culata Completa 3.0L</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed">Para Toyota Hilux / Hiace. Material reforzado para trabajo pesado.</p>
                  <button className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors">
                    Cotizar Ahora
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-5 md:mb-6">
              {/* Product 4 */}
              <div className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI4I3eZaFebtNXfF09qbIawl3RLDBWRPRrwUsTxy0PqBvJkkGMHcb8q6Kc5Ac0wGIbt7uaRT-fbJhQfUhS0seUIz42TrIDFo-ZL7LwAo7cTbOa0wkb4_HGYTuIu1wYkmnOOhHCN54lH9eeacQliY-2DEiIpVlAcq85LPX6x4trLT1xEv5ugDVJCwgsDalt0HU-9xJ1Wv-E7qCBGB6siN2YWWOjc41dgX77bzvuPMFLfMBz35POMYgqCWyieJe7GzcSK5KsCRxjaJw")' }}
                  ></div>
                </div>
                <div className="p-5 md:p-6 product-card-content">
                  <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5">Set de Filtros Heavy Duty</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed">Aire, Aceite y Combustible. Protección máxima para motores de carga.</p>
                  <button className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors">
                    Cotizar Ahora
                  </button>
                </div>
              </div>

              {/* Product 5 */}
              <div className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                  <div className="absolute top-3 left-3 z-10 bg-accent text-black text-[10px] font-bold px-2.5 py-1 uppercase tracking-wide">Oferta</div>
                  <div
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6aAXIdmyLI-VmCXw3ei_O2zxFd3rS23EzoNgVy2bM29doMxteKy20xdnHGoyxgk3v6WTCBHQV3_4Qu6wUXCNuEJ_z74Uwou0NfbTNsLj9y7FkqjljGkoy-dD_YFD0VoE3u9sr-5eZig13qFKJlVICqakLnr_XhnClKNmm9NL-ly8QQV2BTpyXoOmegxS1ERjSJGJPJem1L8oO4Q6raqhn4EoVcs7PB0opGaRNkq179ClmDVzPV2UN2S3RQF4EAWBBAVOHnWjPnVQ")' }}
                  ></div>
                </div>
                <div className="p-5 md:p-6 product-card-content">
                  <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5">Filtro Separador Agua/Comb.</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed">Sistema avanzado de filtración para camiones chinos Sinotruk / Jac.</p>
                  <button className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors">
                    Cotizar Ahora
                  </button>
                </div>
              </div>

              {/* Product 6 */}
              <div className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI4I3eZaFebtNXfF09qbIawl3RLDBWRPRrwUsTxy0PqBvJkkGMHcb8q6Kc5Ac0wGIbt7uaRT-fbJhQfUhS0seUIz42TrIDFo-ZL7LwAo7cTbOa0wkb4_HGYTuIu1wYkmnOOhHCN54lH9eeacQliY-2DEiIpVlAcq85LPX6x4trLT1xEv5ugDVJCwgsDalt0HU-9xJ1Wv-E7qCBGB6siN2YWWOjc41dgX77bzvuPMFLfMBz35POMYgqCWyieJe7GzcSK5KsCRxjaJw")' }}
                  ></div>
                </div>
                <div className="p-5 md:p-6 product-card-content">
                  <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5">Pack Mantenimiento Flota</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed">Kit x10 unidades de filtros de aceite. Precio especial para empresas.</p>
                  <button className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors">
                    Cotizar Ahora
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {/* Product 7 */}
              <div className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZrZnjIbfruTcQ67At8BnfOhwm0LdgFGKAxmh0KeaO7o1rvRGBccicqZdET1-qF0NpFs34xbf9OEHKxruLtbFj1McFrZk32hNO7TgIyFGBgGOGH1JcDggh544mmzKO-TCeuOmoeIQ9k7BYL-9ErS5S2IiwxWysdybGWLAO5WUpVItN-FeDnHNi4YjF7aIQZP7E9W7dyRoc3T1yxWdFzQKyIjalYpmtlNS57H7OxOSmoqqMf1KlK_2849hx6w9SeF47z5s77UFMv0Q")' }}
                  ></div>
                </div>
                <div className="p-5 md:p-6 product-card-content">
                  <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5">Discos de Freno Ventilados</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed">Aleación de alta resistencia térmica para buses interprovinciales.</p>
                  <button className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors">
                    Cotizar Ahora
                  </button>
                </div>
              </div>

              {/* Product 8 */}
              <div className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC2wkKD1tTrebuIADqe4wsmcbuo8iwOn2EkC9GcZ4KXeqgTYm6yiP1sbLiMtpnlthbUoMdhfNRvqXzqdMK63iSnruSPHSEaJueHdhsG_kN_VhJ2agV4g6EfuVskybENJ_kQb5tR_KVXjaRU4VrjJXgk6Dcqa5-c9HfvwXgea0n5piQaHjoL3bL1cdAQf4qZyjMYPZNcPcdUIKN96qmDYZlj3Lr5-dtJOqWGeJV8dfM09T43y6AARGTYctu0-MVSKum0b5S4bRSuaw")' }}
                  ></div>
                </div>
                <div className="p-5 md:p-6 product-card-content">
                  <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5">Pastillas de Freno Cerámicas</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed">Frenado silencioso y eficaz. Larga duración para uso intensivo.</p>
                  <button className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors">
                    Cotizar Ahora
                  </button>
                </div>
              </div>

              {/* Product 9 */}
              <div className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative">
                  <div
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWMAWvToIFkRoFwnnk91THA9_5-KISj2D2lLkINUUajOgny0MUJTRevcbFfE4ffled0VM9m2FiR7lPBmqbDrq7ZOyRyPx7CkpJc7ZsOq_jqJE5VSON8KmK9vNyYUCqj3P6pAqitBBfK5WjeS7jAzOjCvbRHDpMyhX8McZm8tASV3Z_qO8eZLfgtLa0oBASCgNBQFor6Qt1o3NVPBCyA_Lv240urrsbUok6MymoFe0QMjuYNHN4DCmteOS6tQXH3_qm8HtZYYVrQH8")' }}
                  ></div>
                </div>
                <div className="p-5 md:p-6 product-card-content">
                  <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5">Cámaras de Aire (Brake)</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed">Sistemas neumáticos de frenado. Repuestos para camiones americanos.</p>
                  <button className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors">
                    Cotizar Ahora
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 text-center md:hidden">
              <button className="bg-white border border-gray-300 text-black px-6 py-2.5 font-semibold uppercase tracking-wider text-xs w-full">Ver Catálogo Completo</button>
            </div>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer className="bg-primary text-white pt-8 pb-8 border-t-4 border-accent">
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
