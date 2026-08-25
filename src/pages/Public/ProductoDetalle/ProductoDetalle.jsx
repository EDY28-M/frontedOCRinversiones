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

  const openWhatsApp = () => {
    if (!product) return;
    const msg = `¡Hola! Consulta sobre:\n\n📦 *Producto:* ${product.producto}\n📋 *SKU:* ${product.codigo || 'N/A'}\n\n¿Me pueden ayudar?`;
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
      {/* Header fijo */}
      <header className="flex-shrink-0 w-full bg-white border-b border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3.5 min-w-fit">
            <Link to="/" className="text-primary">
              <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
            </Link>
            <Link to="/" className="hidden sm:block">
              <span className="text-2xl font-display font-medium uppercase tracking-tighter leading-none block">ORC</span>
              <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none mt-1">Inversiones Perú</p>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={({ isActive }) => `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`}>
              {({ isActive }) => <span className={`relative nav-link ${isActive ? 'active' : ''}`}>INICIO</span>}
            </NavLink>
            <NavLink to="/productos" className={({ isActive }) => `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`}>
              {({ isActive }) => <span className={`relative nav-link ${isActive ? 'active' : ''}`}>CATÁLOGO</span>}
            </NavLink>
            <NavLink to="/envios-provincias" className={({ isActive }) => `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`}>
              {({ isActive }) => <span className={`relative nav-link ${isActive ? 'active' : ''}`}>ENVÍOS A PROVINCIAS</span>}
            </NavLink>
            <NavLink to="/nosotros" className={({ isActive }) => `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`}>
              {({ isActive }) => <span className={`relative nav-link ${isActive ? 'active' : ''}`}>EMPRESA</span>}
            </NavLink>
          </nav>
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm hidden lg:block">
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
              />
            </div>
          </form>
          <div className="flex items-center gap-2 min-w-fit">
            <button
              type="button"
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
            <div className="space-y-10">
              <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto py-1">
                <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
                <span>/</span>
                <Link to="/productos" className="hover:text-primary transition-colors">Catálogo</Link>
                {product.categoryName && (
                  <>
                    <span>/</span>
                    <span className="text-gray-700 font-medium">{product.categoryName}</span>
                  </>
                )}
                <span>/</span>
                <span className="text-gray-900 font-semibold truncate max-w-[200px]">{title}</span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-sm">
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

                    <div className="relative flex-1 bg-white min-h-[320px] sm:min-h-[440px] flex items-center justify-center rounded-xl border border-gray-50">
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
                </div>

                {/* Información del Producto */}
                <div className="lg:col-span-5 flex flex-col">
                  {product.marcaNombre && (
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{product.marcaNombre}</p>
                  )}
                  <h1 className="text-2xl sm:text-[1.75rem] font-bold text-gray-900 leading-snug mb-4">
                    {title}
                  </h1>

                  <div className="space-y-2 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
                    {product.codigo && (
                      <p>
                        SKU: <span className="font-semibold text-gray-900 font-mono">{product.codigo}</span>
                      </p>
                    )}
                    <p>
                      Vendido por: <span className="font-semibold text-gray-900">ORC Inversiones Perú</span>
                    </p>
                    {product.categoryName && (
                      <p>
                        Categoría: <span className="font-semibold text-gray-900">{product.categoryName}</span>
                      </p>
                    )}
                  </div>

                  {/* Botón Consultar por WhatsApp */}
                  <div className="mt-auto space-y-4 pt-4">
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="w-full h-12 rounded-full bg-[#25D366] hover:bg-green-600 text-white font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Consultar por WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* Pestañas: Descripción y Especificaciones */}
              {(product.descripcion || ficha.length > 0) && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                  <div className="flex border-b border-gray-100 gap-6 mb-6">
                    {product.descripcion && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('descripcion')}
                        className={`pb-3 text-sm font-bold tracking-wide uppercase transition-colors relative ${
                          activeTab === 'descripcion' ? 'text-primary' : 'text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        Descripción
                        {activeTab === 'descripcion' && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </button>
                    )}
                    {ficha.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('ficha')}
                        className={`pb-3 text-sm font-bold tracking-wide uppercase transition-colors relative ${
                          activeTab === 'ficha' ? 'text-primary' : 'text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        Especificaciones
                        {activeTab === 'ficha' && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </button>
                    )}
                  </div>

                  {activeTab === 'descripcion' && product.descripcion && (
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.descripcion}
                    </div>
                  )}

                  {activeTab === 'ficha' && ficha.length > 0 && (
                    <dl className="divide-y divide-gray-100 max-w-xl">
                      {ficha.map((item, index) => (
                        <div key={index} className="flex py-3 text-sm">
                          <dt className="w-1/3 text-gray-500 font-medium">{item.label}</dt>
                          <dd className="w-2/3 text-gray-900 font-semibold">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="mt-auto flex-shrink-0 bg-primary text-white pt-10 pb-6 border-t-4 border-accent">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-blue-200 uppercase tracking-widest gap-4">
              <p>© {new Date().getFullYear()} ORC Inversiones Perú. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
