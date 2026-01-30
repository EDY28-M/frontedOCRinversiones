import { useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileMenu from '../../../components/common/MobileMenu';
import WhatsAppButton from '../../../components/WhatsAppButton';
import ProductDetailModal from '../../../components/ProductDetailModal';
import '../../../styles/inicio.css';
import { usePublicFeaturedProducts } from '../../../hooks/usePublicFeaturedProducts';

/**
 * Componente Inicio - Migración pixel-perfect del HTML original (Google Stitch)
 * Mantiene exactamente los colores, tipografías, espaciados y estilos del diseño.
 * 
 * IMPORTANTE: Este componente incluye su propio header y footer.
 * NO usar dentro de PublicLayout para evitar duplicación.
 */
export default function Inicio() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { products: featuredProducts, isLoading: isLoadingFeatured } = usePublicFeaturedProducts({ page: 1, pageSize: 9 });

    const featuredRows = useMemo(() => {
        const rows = [];
        for (let i = 0; i < featuredProducts.length; i += 3) {
            rows.push(featuredProducts.slice(i, i + 3));
        }
        return rows;
    }, [featuredProducts]);

    const getFirstImageUrl = (producto) => {
        if (producto?.imagenPrincipal) return producto.imagenPrincipal;
        if (producto?.imagen2) return producto.imagen2;
        if (producto?.imagen3) return producto.imagen3;
        if (producto?.imagen4) return producto.imagen4;
        return null;
    };

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
                <section className="relative w-full bg-gray-50">
                    {/* Container de imagen - responsive: móvil altura fija, desktop aspect-ratio */}
                    <div className="relative w-full min-h-[400px] sm:min-h-[450px] md:min-h-0 md:aspect-video" style={{ maxHeight: '89vh' }}>
                        <img
                            src="/imagenes OC/1.jpeg"
                            alt="ORC Inversiones Perú - Repuestos"
                            className="absolute inset-0 w-full h-full object-cover object-bottom md:object-center"
                        />
                        {/* Overlay oscuro para legibilidad del texto */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

                        {/* Contenido del Hero */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="page-container">
                                <div className="max-w-[580px]">
                                    <div className="inline-block px-3 py-1 bg-accent text-black text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-yellow-400/30">
                                        Líderes en Importación
                                    </div>
                                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white tracking-tight leading-none mb-4 md:mb-5" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                                        Expertos en <br />
                                        <span className="text-accent" style={{ textShadow: '0 0 20px rgba(255,204,0,0.5), 2px 2px 8px rgba(0,0,0,0.5)' }}>Repuestos</span> <br />
                                        Coreanos y <br />
                                        <span className="text-accent" style={{ textShadow: '0 0 20px rgba(255,204,0,0.5), 2px 2px 8px rgba(0,0,0,0.5)' }}>Chinos</span>
                                    </h1>
                                    <p className="text-base md:text-lg text-white max-w-md font-normal mb-6 md:mb-8 leading-relaxed border-l-4 border-accent pl-5" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
                                        Más de 15 años de experiencia atendiendo talleres y flotas en Ate, Lima. Calidad garantizada para tu motor.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link to="/productos" className="bg-accent hover:bg-yellow-400 text-black px-6 py-3 font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-yellow-500/40 hover:shadow-yellow-400/60 hover:scale-105 text-center">
                                            Ver Catálogo
                                        </Link>
                                        <a
                                            href="https://wa.me/51984244498?text=Hola%2C%20necesito%20más%20información%20sobre%20sus%20productos%20y%20servicios.%20¿Podrían%20ayudarme?"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white/10 backdrop-blur-md border-2 border-white/50 hover:bg-white hover:text-black text-white px-6 py-3 font-semibold uppercase tracking-wider text-xs transition-all hover:scale-105 text-center"
                                        >
                                            Contactar Asesor
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================== ESPECIALISTAS EN MARCAS SECTION ==================== */}
                <section className="w-full bg-white border-b border-gray-100 py-12 overflow-hidden">
                    <div className="page-container">
                        <div className="text-center mb-10">
                            <h3 className="font-display text-2xl md:text-3xl font-medium uppercase text-primary mb-2">Especialistas en Marcas</h3>
                            <div className="w-16 h-1 bg-accent mx-auto"></div>
                        </div>

                        {/* Marcas Chinas - Carousel hacia la izquierda */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
                                    🇨🇳 Línea China
                                </span>
                                <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
                            </div>
                            <div className="brand-carousel">
                                <div className="brand-carousel-track">
                                    {/* Primera copia */}
                                    <img src="/svg logos/Cummins_logo.svg" alt="Cummins" />
                                    <img src="/svg logos/DFM.svg" alt="DFM" />
                                    <img src="/svg logos/FOTON.svg" alt="Foton" />
                                    <img src="/svg logos/JMC.svg" alt="JMC" />
                                    <img src="/svg logos/Logo_jac.svg" alt="JAC" />
                                    <img src="/svg logos/XCE.svg" alt="XCE" />
                                    <img src="/svg logos/YUCHAI.svg" alt="Yuchai" />
                                    <img src="/svg logos/juylong.svg" alt="Juylong" />
                                    {/* Segunda copia para loop infinito */}
                                    <img src="/svg logos/Cummins_logo.svg" alt="Cummins" />
                                    <img src="/svg logos/DFM.svg" alt="DFM" />
                                    <img src="/svg logos/FOTON.svg" alt="Foton" />
                                    <img src="/svg logos/JMC.svg" alt="JMC" />
                                    <img src="/svg logos/Logo_jac.svg" alt="JAC" />
                                    <img src="/svg logos/XCE.svg" alt="XCE" />
                                    <img src="/svg logos/YUCHAI.svg" alt="Yuchai" />
                                    <img src="/svg logos/juylong.svg" alt="Juylong" />
                                </div>
                            </div>
                        </div>

                        {/* Marcas Japonesas y Coreanas - Carousel hacia la derecha */}
                        <div>
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
                                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                                    🇯🇵🇰🇷 Línea Japonesa y Coreana
                                </span>
                                <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
                            </div>
                            <div className="brand-carousel">
                                <div className="brand-carousel-track reverse">
                                    {/* Primera copia */}
                                    <img src="/svg_japneses_coreanos/toyoya.svg" alt="Toyota" />
                                    <img src="/svg_japneses_coreanos/hyunday.svg" alt="Hyundai" />
                                    <img src="/svg_japneses_coreanos/motors.svg" alt="Mitsubishi" />
                                    <img src="/svg_japneses_coreanos/nissan.svg" alt="Nissan" />
                                    <img src="/svg_japneses_coreanos/isuzu.svg" alt="Isuzu" />
                                    <img src="/svg_japneses_coreanos/Hino-logo.svg" alt="Hino" />
                                    {/* Segunda copia para loop infinito */}
                                    <img src="/svg_japneses_coreanos/toyoya.svg" alt="Toyota" />
                                    <img src="/svg_japneses_coreanos/hyunday.svg" alt="Hyundai" />
                                    <img src="/svg_japneses_coreanos/motors.svg" alt="Mitsubishi" />
                                    <img src="/svg_japneses_coreanos/nissan.svg" alt="Nissan" />
                                    <img src="/svg_japneses_coreanos/isuzu.svg" alt="Isuzu" />
                                    <img src="/svg_japneses_coreanos/Hino-logo.svg" alt="Hino" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================== FEATURES SECTION ==================== */}
                <section className="w-full bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
                    <div className="page-container py-12 md:py-16">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 - Calidad Original */}
                            <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1">
                                <div className="flex items-start gap-5">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border-l-4 border-primary group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-display text-lg font-bold uppercase text-gray-900 mb-2 group-hover:text-primary transition-colors">Calidad Original</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">Importamos directamente repuestos certificados para garantizar la durabilidad de su flota.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2 - Precios Competitivos */}
                            <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1">
                                <div className="flex items-start gap-5">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border-l-4 border-primary group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-display text-lg font-bold uppercase text-gray-900 mb-2 group-hover:text-primary transition-colors">Precios Competitivos</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">Optimizamos costos para ofrecer la mejor relación precio-calidad del mercado en Ate.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3 - Stock Disponible */}
                            <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1">
                                <div className="flex items-start gap-5">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border-l-4 border-primary group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-display text-lg font-bold uppercase text-gray-900 mb-2 group-hover:text-primary transition-colors">Stock Disponible</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">Amplio inventario listo para entrega inmediata. Motores, filtros y sistemas de freno.</p>
                                    </div>
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

                        {isLoadingFeatured && featuredProducts.length === 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                                {Array.from({ length: 9 }).map((_, index) => (
                                    <div key={`skeleton-${index}`} className="bg-white border border-gray-200 group grid-card animate-pulse">
                                        <div className="aspect-[16/9] bg-gray-100"></div>
                                        <div className="p-5 md:p-6 product-card-content">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                            <div className="h-3 bg-gray-100 rounded w-full mb-4"></div>
                                            <div className="h-9 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : featuredRows.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No hay productos destacados disponibles.
                            </div>
                        ) : (
                            featuredRows.map((row, rowIndex) => (
                                <div
                                    key={`row-${rowIndex}`}
                                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 ${rowIndex < featuredRows.length - 1 ? 'mb-5 md:mb-6' : ''}`}
                                >
                                    {row.map((producto) => {
                                        const imageUrl = getFirstImageUrl(producto);
                                        return (
                                            <div
                                                key={producto.id}
                                                onClick={() => setSelectedProduct(producto)}
                                                className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
                                            >
                                                {/* Image container with fixed aspect ratio */}
                                                <div className="aspect-[16/9] bg-gray-50 overflow-hidden relative flex-shrink-0">
                                                    {imageUrl ? (
                                                        <div
                                                            className="w-full h-full bg-cover bg-center card-img transition-transform duration-500"
                                                            style={{ backgroundImage: `url("${imageUrl}")` }}
                                                        ></div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <span className="material-symbols-outlined text-4xl">image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Content container with flex-grow to fill remaining space */}
                                                <div className="p-5 md:p-6 product-card-content flex flex-col flex-grow">
                                                    {/* Title with fixed height (2 lines max) */}
                                                    <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5 line-clamp-2 min-h-[3.5rem]">
                                                        {producto.producto || 'Producto sin nombre'}
                                                    </h3>
                                                    {/* Description with fixed height (2 lines max) */}
                                                    <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                                        {producto.descripcion || 'Descripción no disponible.'}
                                                    </p>
                                                    {/* Button pushed to bottom with mt-auto */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedProduct(producto);
                                                        }}
                                                        className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors mt-auto"
                                                    >
                                                        Cotizar Ahora
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}

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

                {/* Floating WhatsApp Button */}
                <WhatsAppButton />
            </div>

            {/* Modal de Detalle del Producto */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}