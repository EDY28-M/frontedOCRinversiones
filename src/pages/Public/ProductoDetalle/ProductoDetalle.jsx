import { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MobileMenu from '../../../components/common/MobileMenu';
import { publicProductsApi } from '../../../api/publicApi';
import { getAllValidImageUrls } from '../../../utils/imageUtils';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';
import { extractIdFromSlug } from '../../../utils/slugUtils';

const WHATSAPP = '51984244498';

function cleanTitle(product) {
  if (!product?.producto) return '';
  if (!product.codigo) return product.producto;
  try {
    const escaped = product.codigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return product.producto.replace(new RegExp(`\\s*\\(?${escaped}\\)?`, 'gi'), '').trim();
  } catch {
    return product.producto;
  }
}

function parseFicha(raw) {
  if (!raw) return [];
  const text = String(raw).trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({
          label: item.label || item.Label || item.key || '',
          value: item.value || item.Value || '',
        }))
        .filter((x) => x.label || x.value);
    }
  } catch {
    // pipe format
  }
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf('|');
      if (i === -1) return { label: line, value: '' };
      return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
    })
    .filter((x) => x.label || x.value);
}

export default function ProductoDetalle() {
  const { id, productoSlug } = useParams();
  const targetId = id || extractIdFromSlug(productoSlug);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageErrors, setImageErrors] = useState(() => new Set());
  const [activeTab, setActiveTab] = useState('descripcion');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: product, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['public-product', targetId],
    queryFn: () => publicProductsApi.getById(targetId),
    enabled: Boolean(targetId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const title = useMemo(() => cleanTitle(product), [product]);
  const images = useMemo(() => (product ? getAllValidImageUrls(product) : []), [product]);
  const ficha = useMemo(() => parseFicha(product?.fichaTecnica), [product]);
  const visibleImages = images.filter((img) => !imageErrors.has(img));
  const currentImage = selectedImage && !imageErrors.has(selectedImage)
    ? selectedImage
    : visibleImages[0] || null;

  useDocumentMeta({
    title: product
      ? `${title} | ORC Inversiones Perú`
      : 'Producto | ORC Inversiones Perú',
    description: product?.descripcion || `Repuesto ${title} en ORC Inversiones Perú`,
    canonicalPath: targetId ? `/productos/${targetId}` : '/productos',
  });

  const openWhatsApp = (mode = 'compra') => {
    if (!product) return;
    const msg = mode === 'compra'
      ? `¡Hola! Me interesa comprar:\n\n📦 *Producto:* ${title}\n🔢 *Cantidad:* ${quantity}\n📋 *SKU:* ${product.codigo || 'N/A'}\n\n¿Tienen stock disponible?`
      : `¡Hola! Tengo una consulta sobre:\n\n📦 *Producto:* ${title}\n📋 *SKU:* ${product.codigo || 'N/A'}\n\n¿Me pueden ayudar?`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/productos', { state: { initialQuery: searchTerm.trim() } });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-surface font-sans text-text-main antialiased overflow-hidden">
      {/* Header fijo — idéntico al de Catálogo */}
      <header className="flex-shrink-0 w-full bg-white border-b border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 min-w-fit">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
            </div>
            <div>
              <span className="text-2xl font-display font-medium uppercase tracking-tighter leading-none block">ORC</span>
              <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none mt-1">Inversiones Perú</p>
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
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="Buscar refacción..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && searchTerm.trim()) navigate('/productos', { state: { initialQuery: searchTerm.trim() } }); }}
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

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Contenedor con scroll */}
      <div className="flex-1 overflow-y-auto">
        <main className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-6 lg:py-10">
          {isLoading && (
            <div className="py-24 text-center text-gray-500">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              Cargando producto...
            </div>
          )}

          {isError && (
            <div className="py-24 text-center">
              <p className="text-gray-800 font-semibold mb-2">No se pudo cargar el producto</p>
              <p className="text-sm text-gray-500 mb-4">{error?.message || 'Error desconocido'}</p>
              <div className="flex gap-3 justify-center">
                <button type="button" onClick={() => refetch()} className="px-5 py-2 bg-primary text-white rounded-full text-sm font-bold">Reintentar</button>
                <button type="button" onClick={() => navigate('/productos')} className="px-5 py-2 border border-gray-300 rounded-full text-sm font-bold">Volver al catálogo</button>
              </div>
            </div>
          )}

          {product && (
            <div>
              {/* Sección Principal del Producto */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">
                {/* Galería de Imágenes */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="flex flex-col-reverse sm:flex-row gap-4">
                    {visibleImages.length > 1 && (
                      <div className="hidden sm:flex flex-col gap-3 shrink-0">
                        {visibleImages.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedImage(img)}
                            className={`w-16 h-16 bg-white border p-1 rounded-lg ${
                              currentImage === img ? 'border-primary border-2' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-contain" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="relative flex-1 bg-white min-h-[320px] sm:min-h-[440px] lg:min-h-[520px] flex items-center justify-center border border-gray-100 rounded-xl">
                      {currentImage ? (
                        <img
                          src={currentImage}
                          alt={title}
                          className="max-w-full max-h-[500px] object-contain p-4"
                          onError={() => {
                            setImageErrors((prev) => new Set(prev).add(currentImage));
                            setSelectedImage(null);
                          }}
                        />
                      ) : (
                        <div className="text-gray-300 text-center">
                          <span className="material-symbols-outlined text-5xl">image</span>
                          <p className="text-sm mt-2">Sin imagen</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {visibleImages.length > 1 && (
                    <div className="sm:hidden flex gap-2 overflow-x-auto">
                      {visibleImages.map((img, idx) => (
                        <button
                          key={`m-${idx}`}
                          type="button"
                          onClick={() => setSelectedImage(img)}
                          className={`shrink-0 w-14 h-14 bg-white border p-1 rounded-lg ${
                            currentImage === img ? 'border-primary border-2' : 'border-gray-200'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Información Principal del Producto */}
                <div className="lg:col-span-5 flex flex-col">
                  {product.marcaNombre && (
                    <p className="text-sm text-gray-500 mb-1">{product.marcaNombre}</p>
                  )}
                  <h1 className="text-2xl sm:text-[1.75rem] font-bold text-gray-900 leading-snug mb-4">
                    {title}
                  </h1>

                  <div className="space-y-1 text-sm text-gray-600 mb-6">
                    {product.codigo && (
                      <p>
                        SKU <span className="font-semibold text-gray-900 font-mono">{product.codigo}</span>
                      </p>
                    )}
                    <p>
                      Vendido por <span className="font-semibold text-gray-900">ORC Inversiones Perú</span>
                    </p>
                    {product.categoryName && (
                      <p>
                        Categoría <span className="font-semibold text-gray-900">{product.categoryName}</span>
                      </p>
                    )}
                  </div>

                  {/* Disponible en Stock */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-3 h-3 rounded-full bg-green-500 shrink-0"></span>
                    <span className="text-sm font-semibold text-green-600">Disponible en Stock</span>
                  </div>

                  {/* Cantidad + Botón COMPRAR */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center h-12 border-2 border-gray-300 rounded overflow-hidden shrink-0">
                      <button
                        type="button"
                        className="w-10 h-full text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold tabular-nums border-x border-gray-300">{quantity}</span>
                      <button
                        type="button"
                        className="w-10 h-full text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => openWhatsApp('compra')}
                      className="flex-1 h-12 rounded bg-[#d4a017] hover:bg-[#b8860b] text-white font-bold text-sm sm:text-base uppercase tracking-wide transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                      COMPRAR
                    </button>
                  </div>

                  {/* Botón WhatsApp - Consultar con Asesor */}
                  <button
                    type="button"
                    onClick={() => openWhatsApp('consulta')}
                    className="w-full h-12 rounded bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-sm sm:text-base uppercase tracking-wide transition-colors shadow-sm flex items-center justify-center gap-2 mb-6"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    CONSULTAR CON ASESOR
                  </button>

                  {/* Envíos y Asesoría */}
                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Disponible envío a domicilio</p>
                        <button
                          type="button"
                          onClick={() => openWhatsApp('consulta')}
                          className="text-sm text-primary font-medium hover:underline"
                        >
                          Consultar
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">storefront</span>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Disponible retiro en tienda</p>
                        <p className="text-xs text-gray-500 mt-0.5">Av. Nicolás Ayllón 4329 - Ate, Lima</p>
                        <button
                          type="button"
                          onClick={() => openWhatsApp('consulta')}
                          className="text-sm text-primary font-medium hover:underline"
                        >
                          Consultar
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">chat</span>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Asesoría por WhatsApp</p>
                        <button
                          type="button"
                          onClick={() => openWhatsApp('consulta')}
                          className="text-sm text-[#25D366] font-medium hover:underline"
                        >
                          Escribir ahora
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/productos')}
                    className="self-start inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Volver al catálogo
                  </button>
                </div>
              </section>

              {/* Ficha Técnica Inferior — Pestañas e Información Industrial */}
              <section className="mt-6 mb-12 sm:mb-16 border-t-2 border-gray-900 pt-0">
                <div className="border-b border-gray-300 mb-0">
                  <nav className="flex flex-wrap justify-start gap-0 -mb-px">
                    {[
                      { id: 'descripcion', label: 'Descripción del producto' },
                      { id: 'especificaciones', label: 'Especificaciones' },
                      { id: 'cambios', label: 'Cambios y Devoluciones' },
                    ].map((tab) => {
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative px-4 sm:px-6 py-3.5 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.06em] transition-colors whitespace-nowrap border-b-[3px] ${
                            active
                              ? 'text-gray-900 border-[#facc15]'
                              : 'text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-8 sm:pt-10 min-h-[280px]">
                  {activeTab === 'descripcion' && (
                    <div className="max-w-4xl">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                          {product.marcaNombre && (
                            <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.14em] text-gray-900 border-2 border-gray-900 px-2.5 py-1 bg-white">
                              {product.marcaNombre}
                            </span>
                          )}
                          {product.categoryName && (
                            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
                              {product.categoryName}
                            </span>
                          )}
                          {product.codigo && (
                            <span className="text-[11px] font-mono font-semibold text-[#2563EB]">
                              SKU {product.codigo}
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-wide border-l-4 border-[#facc15] pl-3 mb-5">
                          Descripción técnica
                        </h2>

                        {(() => {
                          const raw =
                            product.descripcion ||
                            `${title} — repuesto automotriz de reposición${product.marcaNombre ? ` marca ${product.marcaNombre}` : ''}. Destinado a mantenimiento y reparación de vehículos. Antes de comprar, verifique compatibilidad por modelo, motor y año de fabricación. Comercializado por ORC Inversiones Perú (Ate, Lima).`;
                          const paragraphs = String(raw)
                            .split(/\n+/)
                            .map((p) => p.trim())
                            .filter(Boolean);
                          const body = paragraphs.length > 0 ? paragraphs : [raw];

                          const specs = [
                            product.codigo && { k: 'Código / SKU', v: product.codigo },
                            product.codigoComer && { k: 'Cód. comercial', v: product.codigoComer },
                            product.marcaNombre && { k: 'Marca', v: product.marcaNombre },
                            product.categoryName && { k: 'Línea', v: product.categoryName },
                            { k: 'Uso', v: 'Reposición / mantenimiento' },
                            { k: 'Verificación', v: 'Modelo, motor y año del vehículo' },
                          ].filter(Boolean);

                          return (
                            <>
                              <div className="space-y-4 max-w-[42rem]">
                                {body.map((para, i) => (
                                  <p
                                    key={i}
                                    className="text-[14px] sm:text-[15px] text-gray-700 leading-[1.7] font-normal"
                                  >
                                    {para}
                                  </p>
                                ))}
                              </div>

                              <div className="mt-8 max-w-[42rem] border border-gray-300 bg-gray-50">
                                <div className="px-4 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.16em]">
                                  Datos de referencia
                                </div>
                                <ul className="divide-y divide-gray-200">
                                  {specs.map((row) => (
                                    <li
                                      key={row.k}
                                      className="flex items-baseline gap-4 px-4 py-2.5 text-[13px]"
                                    >
                                      <span className="w-[38%] shrink-0 font-semibold uppercase tracking-wide text-[11px] text-gray-500">
                                        {row.k}
                                      </span>
                                      <span className="font-semibold text-gray-900 tabular-nums">
                                        {row.v}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {activeTab === 'especificaciones' && (
                    <div className="max-w-3xl">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-wide border-l-4 border-[#facc15] pl-3 mb-6">
                        Especificaciones
                      </h2>
                      <div className="border border-gray-800 overflow-hidden">
                        <div className="grid grid-cols-[1fr_1.2fr] bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.14em] px-4 py-2.5">
                          <span>Campo</span>
                          <span>Valor</span>
                        </div>
                        <dl>
                          {(ficha.length > 0
                            ? ficha
                            : [
                                product.codigo && { label: 'SKU', value: product.codigo },
                                product.codigoComer && { label: 'Código comercial', value: product.codigoComer },
                                product.marcaNombre && { label: 'Marca', value: product.marcaNombre },
                                product.categoryName && { label: 'Categoría', value: product.categoryName },
                              ].filter(Boolean)
                          ).map((item, index) => (
                            <div
                              key={`${item.label}-${index}`}
                              className={`grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-1 sm:gap-4 px-4 py-3 border-b border-gray-200 text-sm ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }`}
                            >
                              <dt className="font-semibold uppercase tracking-wide text-[11px] text-gray-500">
                                {item.label}
                              </dt>
                              <dd className="font-bold text-gray-900 tabular-nums">{item.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  )}

                  {activeTab === 'cambios' && (
                    <div className="max-w-3xl text-sm text-gray-700 leading-relaxed space-y-4">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-wide border-l-4 border-[#facc15] pl-3 mb-6">
                        Políticas de Cambios y Devoluciones
                      </h2>
                      <p>
                        En ORC Inversiones Perú nos aseguramos de que recibas repuestos de óptima calidad para tu vehículo.
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Los cambios se realizan dentro de los 7 días posteriores a la recepción del producto.</li>
                        <li>El repuesto debe conservarse sin marcas de instalación y con empaque original.</li>
                        <li>Para consultas sobre garantías, comunícate directamente a nuestra línea de atención por WhatsApp.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </main>

        <footer className="mt-auto flex-shrink-0 bg-primary text-white pt-10 pb-6 border-t-4 border-accent">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-2xl">settings_b_roll</span>
                  </div>
                  <span className="text-xl font-display font-medium uppercase tracking-tighter leading-none block">ORC</span>
                  <p className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] leading-none mt-1">Inversiones Perú</p>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  Somos una empresa dedicada a la importación y venta de repuestos para vehículos chinos, japoneses y coreanos, ofreciendo calidad y precios competitivos.
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
                  <li><Link className="text-xs text-gray-200 hover:text-white transition-colors" to="/envios-provincias">Envíos a Provincias</Link></li>
                  <li><Link className="text-xs text-gray-200 hover:text-white transition-colors" to="/productos">Catálogo</Link></li>
                  <li><Link className="text-xs text-gray-200 hover:text-white transition-colors" to="/">Empresa</Link></li>
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
                    <a className="text-xs text-gray-200 hover:text-white transition-colors" href="https://maps.app.goo.gl/iA9sAQACR87o2Bsj7" target="_blank" rel="noopener noreferrer">Av. Nicolás Ayllón 4329 - Ate, Lima</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-base">mail</span>
                    <a className="text-xs text-gray-200 hover:text-white" href="mailto:ventas@orcinversiones.com">ventas@orcinversiones.com</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-base">call</span>
                    <span className="text-xs text-gray-200">984 244 498</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-800 pt-6 text-[10px] text-blue-200 uppercase tracking-widest gap-4">
              <p>© {new Date().getFullYear()} ORC Inversiones Perú. Todos los derechos reservados.</p>
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
