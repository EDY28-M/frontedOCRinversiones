import { useState } from 'react';
import { Link } from 'react-router-dom';
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
        <header className="fixed top-0 left-0 w-full z-10 bg-white/95 backdrop-blur-sm border-b border-border-light">
          <div className="page-container">
            <div className="flex items-center justify-between h-20 header-container">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-4xl">settings_b_roll</span>
                <div>
                  <h2 className="text-primary text-2xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h2>
                  <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
                </div>
              </Link>
              
              {/* Nav Desktop */}
              <nav className="hidden md:flex items-center gap-12">
                <Link className="text-black hover:text-primary text-sm font-semibold uppercase tracking-widest transition-colors" to="/">Inicio</Link>
                <Link className="text-gray-500 hover:text-primary text-sm font-semibold uppercase tracking-widest transition-colors" to="/productos">Productos</Link>
                <Link className="text-gray-500 hover:text-primary text-sm font-semibold uppercase tracking-widest transition-colors" to="/servicios">Servicios</Link>
              </nav>
              
              {/* Actions */}
              <div className="flex items-center gap-6">
                <button type="button" aria-label="Buscar">
                  <span className="material-symbols-outlined text-gray-400 hover:text-primary cursor-pointer transition-colors text-xl">search</span>
                </button>
                <div className="relative cursor-pointer group">
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-xl">shopping_bag</span>
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full"></span>
                </div>
                
                {/* Mobile menu button */}
                <button
                  type="button"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Menú"
                >
                  <span className="material-symbols-outlined text-gray-600 text-2xl">
                    {mobileMenuOpen ? 'close' : 'menu'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Mobile Nav */}
            {mobileMenuOpen && (
              <nav className="md:hidden mobile-menu">
                <Link className="text-black hover:text-primary text-sm font-semibold uppercase tracking-widest py-2" to="/" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
                <Link className="text-gray-500 hover:text-primary text-sm font-semibold uppercase tracking-widest py-2" to="/productos" onClick={() => setMobileMenuOpen(false)}>Productos</Link>
                <Link className="text-gray-500 hover:text-primary text-sm font-semibold uppercase tracking-widest py-2" to="/servicios" onClick={() => setMobileMenuOpen(false)}>Servicios</Link>
              </nav>
            )}
          </div>
        </header>

        {/* ==================== HERO SECTION ==================== */}
        <section className="relative pt-20 w-full flex items-center bg-gray-50 hero-section min-h-[440px] md:min-h-[480px] lg:min-h-[520px]">
          <div 
            className="absolute inset-0 bg-cover bg-right-top lg:bg-center"
            style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6aAXIdmyLI-VmCXw3ei_O2zxFd3rS23EzoNgVy2bM29doMxteKy20xdnHGoyxgk3v6WTCBHQV3_4Qu6wUXCNuEJ_z74Uwou0NfbTNsLj9y7FkqjljGkoy-dD_YFD0VoE3u9sr-5eZig13qFKJlVICqakLnr_XhnClKNmm9NL-ly8QQV2BTpyXoOmegxS1ERjSJGJPJem1L8oO4Q6raqhn4EoVcs7PB0opGaRNkq179ClmDVzPV2UN2S3RQF4EAWBBAVOHnWjPnVQ")', backgroundSize: 'cover'}}
          >
            <div className="absolute inset-0 bg-white/80"></div>
          </div>
          <div className="relative z-10 w-full page-container py-10 md:py-12">
            <div className="max-w-[580px]">
              <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-wider text-primary mb-4">
                Líderes en Importación
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium uppercase text-black tracking-tight leading-none mb-4 md:mb-5">
                Expertos en <br/><span className="text-primary">Repuestos</span> Coreanos, <span className="text-primary">Japoneses</span> y Chinos
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
                <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                  <div className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wide">Nuevo Ingreso</div>
                  <div 
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC2wkKD1tTrebuIADqe4wsmcbuo8iwOn2EkC9GcZ4KXeqgTYm6yiP1sbLiMtpnlthbUoMdhfNRvqXzqdMK63iSnruSPHSEaJueHdhsG_kN_VhJ2agV4g6EfuVskybENJ_kQb5tR_KVXjaRU4VrjJXgk6Dcqa5-c9HfvwXgea0n5piQaHjoL3bL1cdAQf4qZyjMYPZNcPcdUIKN96qmDYZlj3Lr5-dtJOqWGeJV8dfM09T43y6AARGTYctu0-MVSKum0b5S4bRSuaw")'}}
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
                <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWMAWvToIFkRoFwnnk91THA9_5-KISj2D2lLkINUUajOgny0MUJTRevcbFfE4ffled0VM9m2FiR7lPBmqbDrq7ZOyRyPx7CkpJc7ZsOq_jqJE5VSON8KmK9vNyYUCqj3P6pAqitBBfK5WjeS7jAzOjCvbRHDpMyhX8McZm8tASV3Z_qO8eZLfgtLa0oBASCgNBQFor6Qt1o3NVPBCyA_Lv240urrsbUok6MymoFe0QMjuYNHN4DCmteOS6tQXH3_qm8HtZYYVrQH8")'}}
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
                <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9ZUK9avxLOWJMPmubQ7FSWpvK4v9FqGO9XByps9EwAABjTCrEGZ9LSpUb0A7hCOIzY13xLeTwFq-COOYilpizU7k3veeb9U2am24iQyn4z08dWbuK7He_DLfUdouNugD-fkoRxNq-m0rmroVDhTUo_M-PiBfn7H4-qQMyMf4oGNX1BeKYE1r2TjedKCAKjxLGrSNcjOvQuiEsUvVoy1cvbDIH1e3Vodc9bWM3ZmSfJakB2iGqztRv3EMa9O0JG-BPWQhwZiXt3l4")'}}
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
                <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI4I3eZaFebtNXfF09qbIawl3RLDBWRPRrwUsTxy0PqBvJkkGMHcb8q6Kc5Ac0wGIbt7uaRT-fbJhQfUhS0seUIz42TrIDFo-ZL7LwAo7cTbOa0wkb4_HGYTuIu1wYkmnOOhHCN54lH9eeacQliY-2DEiIpVlAcq85LPX6x4trLT1xEv5ugDVJCwgsDalt0HU-9xJ1Wv-E7qCBGB6siN2YWWOjc41dgX77bzvuPMFLfMBz35POMYgqCWyieJe7GzcSK5KsCRxjaJw")'}}
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
                <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                  <div className="absolute top-3 left-3 z-10 bg-accent text-black text-[10px] font-bold px-2.5 py-1 uppercase tracking-wide">Oferta</div>
                  <div 
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6aAXIdmyLI-VmCXw3ei_O2zxFd3rS23EzoNgVy2bM29doMxteKy20xdnHGoyxgk3v6WTCBHQV3_4Qu6wUXCNuEJ_z74Uwou0NfbTNsLj9y7FkqjljGkoy-dD_YFD0VoE3u9sr-5eZig13qFKJlVICqakLnr_XhnClKNmm9NL-ly8QQV2BTpyXoOmegxS1ERjSJGJPJem1L8oO4Q6raqhn4EoVcs7PB0opGaRNkq179ClmDVzPV2UN2S3RQF4EAWBBAVOHnWjPnVQ")'}}
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
                <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI4I3eZaFebtNXfF09qbIawl3RLDBWRPRrwUsTxy0PqBvJkkGMHcb8q6Kc5Ac0wGIbt7uaRT-fbJhQfUhS0seUIz42TrIDFo-ZL7LwAo7cTbOa0wkb4_HGYTuIu1wYkmnOOhHCN54lH9eeacQliY-2DEiIpVlAcq85LPX6x4trLT1xEv5ugDVJCwgsDalt0HU-9xJ1Wv-E7qCBGB6siN2YWWOjc41dgX77bzvuPMFLfMBz35POMYgqCWyieJe7GzcSK5KsCRxjaJw")'}}
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
                <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZrZnjIbfruTcQ67At8BnfOhwm0LdgFGKAxmh0KeaO7o1rvRGBccicqZdET1-qF0NpFs34xbf9OEHKxruLtbFj1McFrZk32hNO7TgIyFGBgGOGH1JcDggh544mmzKO-TCeuOmoeIQ9k7BYL-9ErS5S2IiwxWysdybGWLAO5WUpVItN-FeDnHNi4YjF7aIQZP7E9W7dyRoc3T1yxWdFzQKyIjalYpmtlNS57H7OxOSmoqqMf1KlK_2849hx6w9SeF47z5s77UFMv0Q")'}}
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
                <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDC2wkKD1tTrebuIADqe4wsmcbuo8iwOn2EkC9GcZ4KXeqgTYm6yiP1sbLiMtpnlthbUoMdhfNRvqXzqdMK63iSnruSPHSEaJueHdhsG_kN_VhJ2agV4g6EfuVskybENJ_kQb5tR_KVXjaRU4VrjJXgk6Dcqa5-c9HfvwXgea0n5piQaHjoL3bL1cdAQf4qZyjMYPZNcPcdUIKN96qmDYZlj3Lr5-dtJOqWGeJV8dfM09T43y6AARGTYctu0-MVSKum0b5S4bRSuaw")'}}
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
                <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWMAWvToIFkRoFwnnk91THA9_5-KISj2D2lLkINUUajOgny0MUJTRevcbFfE4ffled0VM9m2FiR7lPBmqbDrq7ZOyRyPx7CkpJc7ZsOq_jqJE5VSON8KmK9vNyYUCqj3P6pAqitBBfK5WjeS7jAzOjCvbRHDpMyhX8McZm8tASV3Z_qO8eZLfgtLa0oBASCgNBQFor6Qt1o3NVPBCyA_Lv240urrsbUok6MymoFe0QMjuYNHN4DCmteOS6tQXH3_qm8HtZYYVrQH8")'}}
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
        <footer className="bg-primary text-white pt-10 md:pt-12 pb-6 border-t-4 border-accent">
          <div className="page-container">
            <div className="grid md:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-12 footer-grid">
              {/* Logo Column */}
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-accent text-2xl">settings_b_roll</span>
                  <span className="text-xl font-display font-bold uppercase tracking-tight text-white">ORC <span className="text-accent text-xs align-middle">Inversiones</span></span>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Soluciones integrales en repuestos automotrices. <br/>Calidad y confianza en cada kilómetro.
                </p>
              </div>
              
              {/* Navigation Column */}
              <div>
                <h4 className="font-bold uppercase mb-4 text-xs tracking-widest text-accent">Navegación</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li><Link className="hover:text-white transition-colors" to="/">Inicio</Link></li>
                  <li><Link className="hover:text-white transition-colors" to="/productos">Productos</Link></li>
                  <li><Link className="hover:text-white transition-colors" to="/servicios">Servicios</Link></li>
                </ul>
              </div>
              
              {/* Contact Column */}
              <div>
                <h4 className="font-bold uppercase mb-4 text-xs tracking-widest text-accent">Contacto</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li><a className="hover:text-white transition-colors" href="#">Ate, Lima - Perú</a></li>
                  <li><a className="hover:text-white transition-colors" href="mailto:ventas@orcinversiones.com">ventas@orcinversiones.com</a></li>
                  <li><a className="hover:text-white transition-colors" href="tel:+51999999999">+51 999 999 999</a></li>
                </ul>
              </div>
              
              {/* Newsletter Column */}
              <div>
                <h4 className="font-bold uppercase mb-4 text-xs tracking-widest text-accent">Boletín</h4>
                <form className="flex border-b border-blue-400 pb-2">
                  <input 
                    className="newsletter-input text-sm" 
                    placeholder="Correo electrónico" 
                    type="email"
                    aria-label="Correo electrónico para boletín"
                  />
                  <button className="text-accent font-bold uppercase text-xs hover:text-white transition-colors whitespace-nowrap" type="submit">Suscribir</button>
                </form>
              </div>
            </div>
            
            {/* Footer Bottom */}
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-800 pt-6 text-[10px] text-blue-200 uppercase tracking-widest gap-3">
              <p>© 2024 ORC Inversiones Perú. Todos los derechos reservados.</p>
              <div className="flex gap-5">
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
