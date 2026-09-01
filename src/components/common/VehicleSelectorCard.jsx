import React, { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublicBrands } from '../../hooks/usePublicBrands';
import { usePublicCategories } from '../../hooks/usePublicCategories';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { getCatalogUrl } from '../../utils/slugUtils';

const FEATURED_BRANDS = ['JAC', 'FOTON', 'TOYOTA', 'CUMMINS'];

function normalizeKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function fallbackCategoryVisual(name) {
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

function withCacheBust(url, version) {
  if (!url) return '';
  if (!version) return url;
  const stamp = Date.parse(version);
  const token = Number.isNaN(stamp) ? encodeURIComponent(String(version)) : String(stamp);
  return `${url}${url.includes('?') ? '&' : '?'}v=${token}`;
}

function categoryPhotoSrc(url, version, name) {
  const resolved = resolveMediaUrl(url);
  if (!resolved) return fallbackCategoryVisual(name);
  return withCacheBust(resolved, version);
}

function MechChevron() {
  return (
    <svg viewBox="0 0 12 8" className="w-3 h-2.5" fill="none" aria-hidden="true">
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="miter" />
    </svg>
  );
}

function buildCrownPath(cx, cy, teeth, rRoot, rTip) {
  const pts = [];
  for (let i = 0; i < teeth; i += 1) {
    const a = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const span = (Math.PI * 2) / teeth;
    const t0 = a + span * 0.1;
    const t1 = a + span * 0.3;
    const t2 = a + span * 0.7;
    const t3 = a + span * 0.9;
    pts.push(
      [cx + rRoot * Math.cos(t0), cy + rRoot * Math.sin(t0)],
      [cx + rTip * Math.cos(t1), cy + rTip * Math.sin(t1)],
      [cx + rTip * Math.cos(t2), cy + rTip * Math.sin(t2)],
      [cx + rRoot * Math.cos(t3), cy + rRoot * Math.sin(t3)]
    );
  }
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;
}

function CrownGear({ gid }) {
  const cx = 250;
  const cy = 250;
  const ringPath = useMemo(() => {
    const outer = buildCrownPath(cx, cy, 16, 208, 246);
    const hole = `M ${cx} ${cy - 198} A 198 198 0 1 1 ${cx} ${cy + 198} A 198 198 0 1 1 ${cx} ${cy - 198}`;
    return `${outer} ${hole}`;
  }, []);
  const bolts = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return {
          cx: cx + Math.cos(a) * 224,
          cy: cy + Math.sin(a) * 224,
        };
      }),
    []
  );

  return (
    <svg className="parts-finder-chrome" viewBox="0 0 500 500" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${gid}-steel`} x1="0.12" y1="0" x2="0.88" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#e2e8f0" />
          <stop offset="48%" stopColor="#94a3b8" />
          <stop offset="72%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id={`${gid}-shine`} cx="0.32" cy="0.28" r="0.7">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <path
        d={ringPath}
        fill={`url(#${gid}-steel)`}
        fillRule="evenodd"
        stroke="#e2e8f0"
        strokeWidth="1.1"
      />
      <path d={ringPath} fill={`url(#${gid}-shine)`} fillRule="evenodd" />
      <circle cx={cx} cy={cy} r="200" fill="none" stroke="#facc15" strokeWidth="6" />
      <circle cx={cx} cy={cy} r="193" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />

      {bolts.map((bolt, i) => (
        <g key={i}>
          <circle cx={bolt.cx} cy={bolt.cy} r="9.5" fill="#1e293b" stroke="#facc15" strokeWidth="1.6" />
          <circle cx={bolt.cx} cy={bolt.cy} r="3.2" fill="#cbd5e1" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Selector del hero: corona de diferencial, vidrio en el cubo.
 */
export default function VehicleSelectorCard({ className = '' }) {
  const navigate = useNavigate();
  const uid = useId();
  const gid = `cg${uid.replace(/[^a-zA-Z0-9]/g, '')}`;
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
          imageUrl: cat.imageUrl || cat.ImageUrl || '',
          overlayImageUrl: cat.overlayImageUrl || cat.OverlayImageUrl || '',
          updatedAt: cat.updatedAt || cat.UpdatedAt || '',
        }))
        .filter((cat) => cat.id > 0 && cat.name),
    [categories]
  );

  const isSingleChip = categoryList.length === 1;
  const isManyChips = categoryList.length > 2;

  const handleSearch = (e) => {
    e?.preventDefault();
    const cat = categoryList.find((c) => String(c.id) === String(selectedCategory));
    const brand = brandList.find((b) => String(b.id) === String(selectedBrand));
    navigate(getCatalogUrl({
      categoryName: cat?.name || '',
      brandName: brand?.nombre || brand?.name || '',
    }));
  };

  const toggleCategory = (id) => {
    const value = String(id);
    setSelectedCategory((prev) => (prev === value ? '' : value));
  };

  return (
    <div className={`parts-finder ${className}`}>
      <CrownGear gid={gid} />
      <div className="parts-finder-glass" />

      <form
        onSubmit={handleSearch}
        className={`parts-finder-form${isManyChips ? ' is-compact' : ''}`}
      >
        <header className="text-center">
          <p className="parts-finder-kicker">Almacén Ate</p>
          <h3 className="parts-finder-title">
            Encuentra tu
            <span> Repuesto</span>
          </h3>
        </header>

        <div className="parts-finder-block">
          <label htmlFor={`parts-finder-brand-${uid}`} className="parts-finder-label">
            Marca del vehículo
          </label>
          <div className="relative">
            <select
              id={`parts-finder-brand-${uid}`}
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              disabled={isLoadingBrands}
              className="parts-finder-select"
            >
              <option value="">{isLoadingBrands ? 'Cargando marcas…' : 'Todas las marcas'}</option>
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

        <div className="parts-finder-block-lines">
          <p className="parts-finder-label" id={`parts-finder-line-${uid}`}>
            Línea de pieza
          </p>
          {isLoadingCategories ? (
            <div className="parts-finder-chips">
              <div className="h-[72px] bg-blue-950/30 animate-pulse" />
              <div className="h-[72px] bg-blue-950/30 animate-pulse" />
            </div>
          ) : categoryList.length === 0 ? (
            <p className="parts-finder-empty">Sin líneas activas</p>
          ) : (
            <div
              className={`parts-finder-chips${isSingleChip ? ' is-single' : ''}${isManyChips ? ' is-many' : ''}`}
              role="group"
              aria-labelledby={`parts-finder-line-${uid}`}
            >
              {categoryList.map((cat) => {
                const active = selectedCategory === String(cat.id);
                const photoSrc = categoryPhotoSrc(cat.imageUrl, cat.updatedAt, cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    aria-pressed={active}
                    className={`parts-finder-chip ${active ? 'is-active' : ''}`}
                  >
                    <span className="parts-finder-chip-photo">
                      <img
                        src={photoSrc}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackCategoryVisual(cat.name);
                        }}
                      />
                      {cat.overlayImageUrl ? (
                        <img
                          src={withCacheBust(resolveMediaUrl(cat.overlayImageUrl), cat.updatedAt)}
                          alt=""
                          className="parts-finder-chip-overlay"
                        />
                      ) : null}
                    </span>
                    <span className="parts-finder-chip-name">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button type="submit" className="parts-finder-submit">
          Buscar en stock
        </button>
      </form>
    </div>
  );
}
