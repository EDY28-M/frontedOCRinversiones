import { useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileMenu from '../../../components/common/MobileMenu';
import WhatsAppButton from '../../../components/WhatsAppButton';
import VehicleSelectorCard from '../../../components/common/VehicleSelectorCard';
import CategoryLinesShowcase from '../../../components/common/CategoryLinesShowcase';
import SiteLogo from '../../../components/common/SiteLogo';
import '../../../styles/inicio.css';
import { usePublicFeaturedProducts } from '../../../hooks/usePublicFeaturedProducts';
import { getFirstValidImageUrl } from '../../../utils/imageUtils';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { getProductUrl } from '../../../utils/slugUtils';

/**
 * Componente Inicio - Migración pixel-perfect del HTML original (Google Stitch)
 * Mantiene exactamente los colores, tipografías, espaciados y estilos del diseño.
 * 
 * IMPORTANTE: Este componente incluye su propio header y footer.
 * NO usar dentro de PublicLayout para evitar duplicación.
 */

// Helper to strip product code from title
const getDisplayName = (product) => {
    if (!product?.producto) return 'Producto sin nombre';
    if (!product.codigo) return product.producto;
    try {
        const escapedCode = product.codigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\s*\\(?${escapedCode}\\)?`, 'gi');
        return product.producto.replace(pattern, '').trim();
    } catch (e) {
        return product.producto;
    }
};

export default function Inicio() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { products: featuredProducts, isLoading: isLoadingFeatured } = usePublicFeaturedProducts({ page: 1, pageSize: 9 });

    useDocumentMeta({
        title: 'ORC Inversiones Perú | Venta de Repuestos Automotrices en Lima',
        description: 'Líderes en importación de repuestos coreanos, chinos y japoneses para vehículos. Más de 15 años de experiencia en Ate, Lima. JAC, Foton, Hyundai, Toyota y más. Envíos a todo el Perú.',
        canonicalPath: '/',
    });

    const featuredRows = useMemo(() => {
        const rows = [];
        for (let i = 0; i < featuredProducts.length; i += 3) {
            rows.push(featuredProducts.slice(i, i + 3));
        }
        return rows;
    }, [featuredProducts]);

    return (
        <div className="h-screen flex flex-col bg-surface font-sans text-text-main antialiased overflow-hidden">
            {/* ==================== HEADER ==================== */}
            <header className="flex-shrink-0 w-full bg-white border-b border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
                    <SiteLogo />
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
                            to="/repuestos"
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
                            <div className="page-container w-full">
                                <div className="flex items-center justify-between gap-6 lg:gap-8">
                                    {/* Contenido Original de Texto y Botones */}
                                    <div className="max-w-[580px]">
                                        <div className="inline-block px-3 py-1 bg-accent text-black text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-yellow-400/30">
                                            Líderes en Importación
                                        </div>
                                        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white tracking-tight leading-none mb-4 md:mb-5" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                                            Expertos en <br />
                                            <span className="text-accent" style={{ textShadow: '0 0 20px rgba(255,204,0,0.5), 2px 2px 8px rgba(0,0,0,0.5)' }}>Repuestos</span> <br />
                                            Coreanos, Chinos <br />
                                            y <span className="text-accent" style={{ textShadow: '0 0 20px rgba(255,204,0,0.5), 2px 2px 8px rgba(0,0,0,0.5)' }}>Japoneses</span>
                                        </h1>
                                        <p className="text-base md:text-lg text-white max-w-md font-normal mb-6 md:mb-8 leading-relaxed border-l-4 border-accent pl-5" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
                                            Más de 15 años de experiencia atendiendo talleres y flotas en Ate, Lima. Calidad garantizada para tu vehiculo.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Link to="/repuestos" className="bg-accent hover:bg-yellow-400 text-black px-6 py-3 font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-yellow-500/40 hover:shadow-yellow-400/60 hover:scale-105 text-center">
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

                                    {/* Ficha de almacén (desktop) */}
                                    <div className="hidden lg:block w-[400px] xl:w-[460px] flex-shrink-0 self-center">
                                        <VehicleSelectorCard />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ficha de almacén en móvil/tablet, debajo del banner */}
                    <div className="lg:hidden w-full bg-[#0014cc] pt-8 pb-24 px-4 border-b border-blue-900/40">
                        <div className="max-w-[420px] mx-auto">
                            <VehicleSelectorCard />
                        </div>
                    </div>
                </section>

                {/* ==================== ESPECIALISTAS EN MARCAS SECTION ==================== */}
                <section className="w-full bg-white border-b border-gray-100 py-12 overflow-hidden">
                    <div className="page-container">
                        <div className="text-center mb-10">
                            <h2 className="font-display text-2xl md:text-3xl font-medium uppercase text-primary mb-2">Especialistas en Marcas</h2>
                            <div className="w-16 h-1 bg-accent mx-auto"></div>
                        </div>

                        {/* Marcas Chinas - Carousel hacia la izquierda */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
                                    Línea China
                                </h3>
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
                                <h3 className="text-xs font-bold uppercase tracking-widest text-primary bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                                    Línea Japonesa y Coreana
                                </h3>
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

                <CategoryLinesShowcase />

                {/* ==================== PRODUCTS SECTION ==================== */}
                <section className="bg-surface-alt py-14 md:py-16 border-t border-border-light">
                    <div className="page-container">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-12 gap-4">
                            <div>
                                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1 block">Catálogo Online</span>
                                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium uppercase text-black">Productos Destacados</h2>
                            </div>
                            <Link className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-black transition-colors" to="/repuestos">
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
                                        const imageUrl = getFirstValidImageUrl(producto);
                                        const productUrl = getProductUrl(producto);
                                        return (
                                            <article
                                                key={producto.id}
                                                className="bg-white border border-gray-200 group grid-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                                            >
                                                <Link to={productUrl} className="flex flex-col h-full text-inherit no-underline">
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
                                                    <div className="p-5 md:p-6 product-card-content flex flex-col flex-grow">
                                                        <h3 className="font-display text-lg font-medium uppercase text-primary mb-1.5 line-clamp-2 min-h-[3.5rem]">
                                                            {getDisplayName(producto)}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                                            {producto.descripcion || 'Descripción no disponible.'}
                                                        </p>
                                                        <span className="w-full bg-accent hover:bg-accent-hover text-black py-2.5 font-bold uppercase text-xs tracking-wider transition-colors mt-auto text-center">
                                                            Cotizar Ahora
                                                        </span>
                                                    </div>
                                                </Link>
                                            </article>
                                        );
                                    })}
                                </div>
                            ))
                        )}

                        {/* Mobile CTA */}
                        <div className="mt-8 text-center md:hidden">
                            <Link to="/repuestos" className="inline-block bg-white border border-gray-300 text-black px-6 py-2.5 font-semibold uppercase tracking-wider text-xs w-full">Ver Catálogo Completo</Link>
                        </div>
                    </div>
                </section>

                {/* ==================== FOOTER ==================== */}
                <footer className="bg-primary text-white pt-8 pb-8 border-t-4 border-accent">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                            <div className="flex flex-col gap-6">
                                <SiteLogo variant="footer" iconClassName="text-accent" />
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
                                    <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/repuestos">Catálogo</Link></li>
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

                {/* Floating WhatsApp Button */}
                <WhatsAppButton />
            </div>{/* Cierre del contenedor con scroll */}

        </div>
    );
}