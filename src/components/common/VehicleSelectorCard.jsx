import React, { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublicBrands } from '../../hooks/usePublicBrands';
import { usePublicCategories } from '../../hooks/usePublicCategories';

const FEATURED_BRANDS = ['JAC', 'FOTON', 'TOYOTA', 'CUMMINS'];

const BRAND_LOGOS = {
  jac: '/svg logos/Logo_jac.svg',
  foton: '/svg logos/FOTON.svg',
  jmc: '/svg logos/JMC.svg',
  cummins: '/svg logos/Cummins_logo.svg',
  dfm: '/svg logos/DFM.svg',
  xce: '/svg logos/XCE.svg',
  yuchai: '/svg logos/YUCHAI.svg',
  juylong: '/svg logos/juylong.svg',
  toyota: '/svg_japneses_coreanos/toyoya.svg',
  hyundai: '/svg_japneses_coreanos/hyunday.svg',
  mitsubishi: '/svg_japneses_coreanos/motors.svg',
  nissan: '/svg_japneses_coreanos/nissan.svg',
  isuzu: '/svg_japneses_coreanos/isuzu.svg',
  hino: '/svg_japneses_coreanos/Hino-logo.svg',
};

function normalizeKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function logoForBrand(nombre) {
  return BRAND_LOGOS[normalizeKey(nombre)] || null;
}

function categoryVisual(name) {
  const n = normalizeKey(name);
  if (n.includes('diesel') || n.includes('motor') || n.includes('piston')) {
    return '/images/parts-finder-piston.jpg';
  }
  if (n.includes('accesor') || n.includes('perno') || n.includes('tornillo')) {
    return '/images/parts-finder-hardware.jpg';
  }
  if (n.includes('freno')) return '/images/parts-finder-tools.jpg';
  if (n.includes('filtro')) return '/images/parts-finder-hardware.jpg';
  return '/images/parts-finder-tools.jpg';
}

function MechChevron() {
  return (
    <svg viewBox="0 0 12 8" className="w-3 h-2.5" fill="none" aria-hidden="true">
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/**
 * Ficha de almacén del hero: caja de herramientas ORC (azul + amarillo)
 * para filtrar el catálogo por marca y línea, con piezas reales, no iconos.
 */
export default function VehicleSelectorCard({ className = '' }) {
  const navigate = useNavigate();
  const uid = useId();
  const { brands = [], isLoading: isLoadingBrands } = usePublicBrands();
  const { categories = [], isLoading: isLoadingCategories } = usePublicCategories();

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const brandList = useMemo(() => {
    const featuredRank = new Map(FEATURED_BRANDS.map((n, i) => [normalizeKey(n), i]));
    return [...brands]
      .map((brand) => ({
        id: Number(brand.Id || brand.id),
        nombre: brand.Nombre || brand.nombre || brand.Name || brand.name || '',
      }))
      .filter((brand) => brand.id > 0 && brand.nombre)
      .sort((a, b) => {
        const aRank = featuredRank.has(normalizeKey(a.nombre))
          ? featuredRank.get(normalizeKey(a.nombre))
          : 1000;
        const bRank = featuredRank.has(normalizeKey(b.nombre))
          ? featuredRank.get(normalizeKey(b.nombre))
          : 1000;
        if (aRank !== bRank) return aRank - bRank;
        return a.nombre.localeCompare(b.nombre, 'es');
      });
  }, [brands]);

  const categoryList = useMemo(
    () =>
      [...categories]
        .map((cat) => ({
          id: Number(cat.Id || cat.id),
          name: cat.Name || cat.name || cat.Nombre || cat.nombre || '',
        }))
        .filter((cat) => cat.id > 0 && cat.name),
    [categories]
  );

  const featuredLogos = useMemo(() => {
    return FEATURED_BRANDS.map((label) => {
      const brand = brandList.find((item) => normalizeKey(item.nombre) === normalizeKey(label));
      if (!brand) return null;
      const src = logoForBrand(brand.nombre);
      if (!src) return null;
      return { ...brand, src, label };
    }).filter(Boolean);
  }, [brandList]);

  const useCategoryChips = categoryList.length > 0 && categoryList.length <= 4;

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (selectedBrand) params.set('marca', String(selectedBrand));
    if (selectedCategory) params.set('categoria', String(selectedCategory));
    const queryString = params.toString();
    navigate(queryString ? `/productos?${queryString}` : '/productos');
  };

  const toggleBrand = (id) => {
    const value = String(id);
    setSelectedBrand((prev) => (prev === value ? '' : value));
  };

  const toggleCategory = (id) => {
    const value = String(id);
    setSelectedCategory((prev) => (prev === value ? '' : value));
  };

  return (
    <div className={`parts-finder ${className}`}>
      <div className="parts-finder-handle" aria-hidden="true">
        <span className="parts-finder-handle-grip" />
        <span className="parts-finder-rivet parts-finder-rivet-left" />
        <span className="parts-finder-rivet parts-finder-rivet-right" />
      </div>

      <div className="parts-finder-lid">
        <img
          src="/images/parts-finder-wrench.jpg"
          alt=""
          width="640"
          height="360"
          decoding="async"
        />
      </div>

      <div className="parts-finder-seam" />

      <form onSubmit={handleSearch} className="parts-finder-body">
        <header className="mb-4">
          <p className="font-display text-accent text-[11px] font-semibold uppercase tracking-[0.22em] leading-none mb-1.5">
            Almacén Ate
          </p>
          <h3 className="font-display text-white text-[22px] font-medium uppercase tracking-tight leading-none">
            Consulta de stock
          </h3>
          <p className="text-blue-100 text-[12px] mt-2 leading-snug">
            Stock en Ate para JAC, Foton, Toyota y Cummins.
          </p>
        </header>

        {featuredLogos.length > 0 && (
          <div className="mb-3.5">
            <div className="parts-finder-logos">
              {featuredLogos.map((brand) => {
                const active = selectedBrand === String(brand.id);
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => toggleBrand(brand.id)}
                    title={brand.nombre}
                    aria-pressed={active}
                    className={`parts-finder-logo ${active ? 'is-active' : ''}`}
                  >
                    <img src={brand.src} alt={brand.nombre} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label htmlFor={`parts-finder-brand-${uid}`} className="parts-finder-label">
              Marca del repuesto
            </label>
            <div className="relative">
              <select
                id={`parts-finder-brand-${uid}`}
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                disabled={isLoadingBrands}
                className="parts-finder-select"
              >
                <option value="">
                  {isLoadingBrands ? 'Cargando marcas…' : 'Todas las marcas del almacén'}
                </option>
                {brandList.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.nombre}
                  </option>
                ))}
              </select>
              <span className="parts-finder-chevron">
                <MechChevron />
              </span>
            </div>
          </div>

          <div>
            <p className="parts-finder-label" id={`parts-finder-line-${uid}`}>
              Línea de pieza
            </p>
            {isLoadingCategories ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="h-[72px] bg-blue-950/40 animate-pulse" />
                <div className="h-[72px] bg-blue-950/40 animate-pulse" />
              </div>
            ) : useCategoryChips ? (
              <div
                className="grid grid-cols-2 gap-2"
                role="group"
                aria-labelledby={`parts-finder-line-${uid}`}
              >
                {categoryList.map((cat) => {
                  const active = selectedCategory === String(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      aria-pressed={active}
                      className={`parts-finder-chip ${active ? 'is-active' : ''}`}
                    >
                      <span className="parts-finder-chip-photo">
                        <img src={categoryVisual(cat.name)} alt="" />
                      </span>
                      <span className="parts-finder-chip-name">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="relative">
                <select
                  id={`parts-finder-category-${uid}`}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="parts-finder-select"
                  aria-labelledby={`parts-finder-line-${uid}`}
                >
                  <option value="">Todas las líneas</option>
                  {categoryList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <span className="parts-finder-chevron">
                  <MechChevron />
                </span>
              </div>
            )}
          </div>

          <button type="submit" className="parts-finder-submit">
            Buscar en stock
          </button>
        </div>

        <p className="parts-finder-legend">
          Envíos a provincias · Av. Nicolás Ayllón 4329
        </p>
      </form>
    </div>
  );
}
