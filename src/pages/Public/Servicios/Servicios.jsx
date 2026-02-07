import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileMenu from '../../../components/common/MobileMenu';
import '../../../styles/inicio.css';

/**
 * Página Servicios - Placeholder
 * TODO: Implementar página de servicios
 */
export default function Servicios() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="inicio-wrapper min-h-screen flex flex-col bg-surface font-sans text-text-main antialiased">
      <div className="relative flex flex-col flex-1 w-full">

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

        {/* Content */}
        <main className="pt-0">

          {/* Hero Header Section */}
          <header className="relative bg-primary/5 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                alt="Warehouse logistics background"
                className="absolute inset-0 h-full w-full object-cover opacity-50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFqJSj30qeh3cZQJ_ncr6zao1F7rVuDiGP0r-gTFacNt_BCRtZAgj4QjNZidWcKszsHRS6eOOMttmjzC4i4NGXsuJRyxb20P-0KdXc7fm7vkVNO9nBIE-_cTLgt-Bq7ANZyQuVPUXhfCRY7VaQWcBkj7KzibPtUhZEafwaA9psbs2Y39xhVC7N8Uq_sQDoS1KU0nF0hd3R3Nf4IajSQxg0smCmHUmzs2y6vawiTwijRyVED3DFmG-XY56RLBLRfTwX2zdfhDnnlreA"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-primary/50 z-[5]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-10"></div>
            </div>
            <div className="relative z-20 max-w-7xl ml-8 lg:ml-24 px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/100 text-amber-700 text-xs font-bold tracking-wider uppercase mb-6 border border-accent/20">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                  Logística Nacional
                </div>
                <h1 className="font-display text-6xl lg:text-8xl text-matte-dark uppercase leading-[0.9] mb-8">
                  Envíos a <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Provincia</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-xl leading-relaxed border-l-4 border-accent pl-6">
                  Realizamos envíos a provincia todos los días, garantizando rapidez, seguridad y cumplimiento para que tus repuestos lleguen a tiempo donde los necesites.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    className="inline-flex justify-center items-center py-4 px-8 border border-transparent text-base font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all duration-300"
                    href="#coverage"
                  >
                    Ver Cobertura
                  </a>
                  <a
                    className="inline-flex justify-center items-center py-4 px-8 border border-gray-300 text-base font-medium text-gray-700 bg-transparent hover:bg-gray-50 focus:outline-none transition-all duration-300"
                    href="#partners"
                  >
                    Nuestros Aliados
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* Coverage Section */}
          <section className="py-20 bg-white relative" id="coverage">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative order-2 lg:order-1 group lg:-ml-16 lg:w-[125%]">
                  <img
                    src="/envios/enviosprovinvia hd.png"
                    alt="Envíos a provincias del Perú"
                    className="w-full h-auto object-contain scale-110"
                  />
                </div>
                <div className="order-1 lg:order- lg:ml-20">
                  <h2 className="font-display text-4xl text-matte-dark mb-6 uppercase">¡Envíos diarios a provincia sin demoras!</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Entendemos la urgencia de tener tu vehículo listo. Por eso, hemos establecido alianzas estratégicas con las empresas de transporte más confiables del Perú para asegurar que tus repuestos lleguen en perfectas condiciones.
                  </p>
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">rocket_launch</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Envíos diarios a provincia</h3>
                        <p className="text-gray-600 mt-1">Despachamos pedidos todos los días sin interrupciones.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">package_2</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Agencia a elección</h3>
                        <p className="text-gray-600 mt-1">El cliente elige la empresa de transporte de su preferencia.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">public</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Entrega al día siguiente</h3>
                        <p className="text-gray-600 mt-1">Rapidez y cumplimiento para que tu pedido llegue a tiempo.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 bg-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="text-primary font-bold tracking-widest text-sm uppercase">Proceso Simple</span>
                <h2 className="font-display text-4xl text-matte-dark mt-2 uppercase">¿Cómo <span className="text-primary">Funciona</span>?</h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Realizamos envíos a todas las provincias del Perú de forma rápida y segura</p>
                <div className="w-16 h-1 bg-accent mx-auto mt-4"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">1</div>
                  <div className="text-primary mb-4 mt-2">
                    <span className="material-symbols-outlined text-4xl">shopping_cart</span>
                  </div>
                  <h3 className="font-bold text-gray-900 uppercase mb-2">Elige tus Productos</h3>
                  <p className="text-gray-600 text-sm">Navega nuestro catálogo y selecciona las autopartes que necesitas.</p>
                </div>
                <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">2</div>
                  <div className="text-primary mb-4 mt-2">
                    <span className="material-symbols-outlined text-4xl">chat</span>
                  </div>
                  <h3 className="font-bold text-gray-900 uppercase mb-2">Contáctanos</h3>
                  <p className="text-gray-600 text-sm">Escríbenos por WhatsApp con tu pedido e indícanos tu destino.</p>
                </div>
                <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
                  <div className="text-primary mb-4 mt-2">
                    <span className="material-symbols-outlined text-4xl">payments</span>
                  </div>
                  <h3 className="font-bold text-gray-900 uppercase mb-2">Realiza el Pago</h3>
                  <p className="text-gray-600 text-sm">Paga mediante transferencia, Yape o BCP. Te enviamos comprobante.</p>
                </div>
                <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">4</div>
                  <div className="text-primary mb-4 mt-2">
                    <span className="material-symbols-outlined text-4xl">local_shipping</span>
                  </div>
                  <h3 className="font-bold text-gray-900 uppercase mb-2">Recibe tu Pedido</h3>
                  <p className="text-gray-600 text-sm">Despachamos por agencia y te enviamos el código de seguimiento.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section className="py-10 bg-gray-50 border-t border-gray-200" id="partners">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-primary font-bold tracking-widest text-sm uppercase">Nuestra Red</span>
                <h2 className="font-display text-4xl text-matte-dark mt-2 uppercase">Aliados Logísticos</h2>
                <div className="w-16 h-1 bg-accent mx-auto mt-4"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="font-display text-2xl italic text-red-600">SHALOM</span>
                </div>
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="font-display text-2xl font-bold text-orange-500">Flores</span>
                </div>
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="font-display text-2xl tracking-tighter text-black uppercase font-black">GRAEL</span>
                </div>
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="font-display text-xl text-yellow-500 bg-gray-800 px-2 py-1">ITTSA</span>
                </div>
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="font-display text-xl text-red-700 uppercase font-bold border-2 border-red-700 px-1">Marvisur</span>
                </div>
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="font-display text-xl text-blue-600 italic font-bold">Palomino</span>
                </div>
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="font-display text-xl text-yellow-500 uppercase font-black tracking-widest">CROMOTEX</span>
                </div>
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                    <span className="font-display text-xl text-gray-800 uppercase font-bold">Linea</span>
                  </div>
                </div>
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="font-display text-xl text-orange-600 font-bold lowercase">movilbus</span>
                </div>
                <div className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="font-display text-sm text-green-700 font-bold uppercase text-center leading-none">Pacifico<br />del Sur</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-12">
                * Trabajamos también con otras agencias según la preferencia del cliente y disponibilidad de destino.
              </p>
            </div>
          </section>

          {/* Times and Quote Section */}
          <section className="py-8 bg-white">
            <div className="w-full">
              <div className="bg-white overflow-hidden flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <h3 className="font-display text-3xl text-matte-dark mb-2 uppercase">Tiempos Estimados</h3>
                  <p className="text-gray-500 mb-8 text-sm">Los tiempos de entrega pueden variar según condiciones climáticas y la agencia seleccionada.</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">north</span>
                        <span className="font-bold text-gray-700">Zona Norte</span>
                      </div>
                      <span className="text-sm font-medium bg-white px-3 py-1 rounded border border-gray-200 text-gray-600">2 - 5 Horas</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">east</span>
                        <span className="font-bold text-gray-700">Zona Centro</span>
                      </div>
                      <span className="text-sm font-medium bg-white px-3 py-1 rounded border border-gray-200 text-gray-600">2 - 5 Horas</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">south</span>
                        <span className="font-bold text-gray-700">Zona Sur</span>
                      </div>
                      <span className="text-sm font-medium bg-white px-3 py-1 rounded border border-gray-200 text-gray-600">2 - 5 Horas</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">near_me</span>
                        <span className="font-bold text-gray-700">Oriente / Selva</span>
                      </div>
                      <span className="text-sm font-medium bg-white px-3 py-1 rounded border border-gray-200 text-gray-600">1 - 3 Días</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 bg-gray-50 p-10 lg:p-14 flex flex-col justify-center">
                  <h3 className="font-display text-3xl text-matte-dark mb-6 uppercase">¿Necesitas cotizar un envío?</h3>
                  <p className="text-gray-600 mb-8">
                    Nuestro equipo de logística está listo para calcular el costo exacto a tu ciudad y recomendarte la mejor agencia.
                  </p>
                  <a
                    href="https://wa.me/51984244498"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-[#25D366] hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors uppercase"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Consultar por WhatsApp
                  </a>
                  <div className="mt-8 pt-8 border-t border-gray-200 flex items-center gap-4 text-gray-500 text-sm">
                    <span className="material-symbols-outlined text-accent">verified</span>
                    <span>Respuesta en menos de 15 minutos</span>
                  </div>
                </div>
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
                  <h1 className="text-2xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h1>
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
                    <span className="text-sm text-gray-200">Av. Nicolás Ayllón 4329 - Ate, Lima</span>
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
