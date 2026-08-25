import { memo, useId, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePublicCategories } from '../../hooks/usePublicCategories';
import { usePublicSiteSettings } from '../../hooks/usePublicSiteSettings';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { toSlug } from '../../utils/slugUtils';

const SHAPES = ['gear', 'hex', 'gasket', 'ring', 'plate'];

function normalizeShape(value) {
  const key = String(value || '').toLowerCase();
  return SHAPES.includes(key) ? key : 'gear';
}

function cleanDescription(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (/^categor[ií]a importada/i.test(text)) return '';
  return text;
}

function fallbackPhoto(name) {
  const n = String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (n.includes('diesel') || n.includes('motor')) return '/images/parts-finder-piston.jpg';
  if (n.includes('accesor') || n.includes('perno')) return '/images/parts-finder-hardware.jpg';
  return '/images/parts-finder-tools.jpg';
}

function buildGearPath(cx, cy, teeth, rRoot, rTip, hole) {
  const pts = [];
  for (let i = 0; i < teeth; i += 1) {
    const a = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const span = (Math.PI * 2) / teeth;
    pts.push(
      [cx + rRoot * Math.cos(a + span * 0.12), cy + rRoot * Math.sin(a + span * 0.12)],
      [cx + rTip * Math.cos(a + span * 0.32), cy + rTip * Math.sin(a + span * 0.32)],
      [cx + rTip * Math.cos(a + span * 0.68), cy + rTip * Math.sin(a + span * 0.68)],
      [cx + rRoot * Math.cos(a + span * 0.88), cy + rRoot * Math.sin(a + span * 0.88)]
    );
  }
  const outer = `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;
  const inner = `M ${cx} ${cy - hole} A ${hole} ${hole} 0 1 1 ${cx} ${cy + hole} A ${hole} ${hole} 0 1 1 ${cx} ${cy - hole}`;
  return `${outer} ${inner}`;
}

function ShapeFrame({ shape, gid }) {
  const steel = `url(#${gid}-steel)`;
  if (shape === 'hex') {
    return (
      <svg className="line-tile-frame" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-steel`} x1="0.2" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="55%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <path
          d="M100 10 L176 54 L176 146 L100 190 L24 146 L24 54 Z M100 38 L158 72 L158 128 L100 162 L42 128 L42 72 Z"
          fill={steel}
          fillRule="evenodd"
          stroke="#e2e8f0"
          strokeWidth="1.2"
        />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const a = ((deg - 90) * Math.PI) / 180;
          return <circle key={deg} cx={100 + Math.cos(a) * 78} cy={100 + Math.sin(a) * 78} r="5" fill="#1e293b" stroke="#facc15" strokeWidth="1.2" />;
        })}
      </svg>
    );
  }
  if (shape === 'gasket') {
    return (
      <svg className="line-tile-frame" viewBox="0 0 220 160" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-steel`} x1="0.1" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <path
          d="M28 16 H192 Q210 16 210 34 V126 Q210 144 192 144 H28 Q10 144 10 126 V34 Q10 16 28 16 Z M40 34 H180 Q190 34 190 44 V116 Q190 126 180 126 H40 Q30 126 30 116 V44 Q30 34 40 34 Z"
          fill={steel}
          fillRule="evenodd"
          stroke="#e2e8f0"
          strokeWidth="1.1"
        />
        {[
          [22, 28],
          [198, 28],
          [22, 132],
          [198, 132],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="6" fill="#1e293b" stroke="#facc15" strokeWidth="1.3" />
        ))}
      </svg>
    );
  }
  if (shape === 'ring') {
    return (
      <svg className="line-tile-frame" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-steel`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="45%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        <path
          d="M100 8 A 92 92 0 1 1 99.9 8 Z M100 42 A 58 58 0 1 1 99.9 42 Z"
          fill={steel}
          fillRule="evenodd"
          stroke="#e2e8f0"
          strokeWidth="1.2"
        />
        <circle cx="100" cy="100" r="62" fill="none" stroke="#facc15" strokeWidth="4" />
      </svg>
    );
  }
  if (shape === 'plate') {
    return (
      <svg className="line-tile-frame" viewBox="0 0 220 150" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-steel`} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="55%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <path
          d="M22 8 H198 L212 22 V128 L198 142 H22 L8 128 V22 Z M26 24 H194 L202 32 V118 L194 126 H26 L18 118 V32 Z"
          fill={steel}
          fillRule="evenodd"
          stroke="#cbd5e1"
          strokeWidth="1.1"
        />
        {[
          [20, 20],
          [200, 20],
          [20, 130],
          [200, 130],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="5.5" fill="#0f172a" stroke="#facc15" strokeWidth="1.2" />
        ))}
      </svg>
    );
  }
  const ringPath = buildGearPath(100, 100, 20, 86, 98, 62);
  return (
    <svg className="line-tile-frame" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <linearGradient id={`${gid}-steel`} x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="45%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      <path d={ringPath} fill={steel} fillRule="evenodd" stroke="#e2e8f0" strokeWidth="1" />
      <circle cx="100" cy="100" r="64" fill="none" stroke="#facc15" strokeWidth="3.5" />
    </svg>
  );
}

const LineTile = memo(function LineTile({ cat, shape }) {
  const uid = useId();
  const gid = `lt${uid.replace(/[^a-zA-Z0-9]/g, '')}`;
  const photo = resolveMediaUrl(cat.imageUrl) || fallbackPhoto(cat.name);
  const to = `/productos?categoria=${cat.id}`;

  return (
    <Link to={to} className={`line-tile is-${shape}`}>
      <ShapeFrame shape={shape} gid={gid} />
      <div className="line-tile-core">
        <span className="line-tile-photo">
          <img src={photo} alt="" />
          {cat.overlayImageUrl ? (
            <img src={resolveMediaUrl(cat.overlayImageUrl)} alt="" className="line-tile-overlay" />
          ) : null}
        </span>
        <h3>{cat.name}</h3>
        {cat.description ? <p>{cat.description}</p> : null}
      </div>
    </Link>
  );
});

export default function CategoryLinesShowcase() {
  const { categories = [], isLoading } = usePublicCategories();
  const { showcaseShape } = usePublicSiteSettings();
  const shape = normalizeShape(showcaseShape);

  const list = useMemo(
    () =>
      [...categories]
        .map((cat) => ({
          id: Number(cat.id || cat.Id),
          name: cat.name || cat.Name || '',
          description: cleanDescription(cat.description || cat.Description),
          imageUrl: cat.imageUrl || cat.ImageUrl || '',
          overlayImageUrl: cat.overlayImageUrl || cat.OverlayImageUrl || '',
          slug: toSlug(cat.name || cat.Name || ''),
        }))
        .filter((cat) => cat.id > 0 && cat.name),
    [categories]
  );

  if (!isLoading && list.length === 0) return null;

  return (
    <section className="line-showcase">
      <div className="page-container">
        <header className="line-showcase-head">
          <p>Almacén Ate</p>
          <h2>Repuestos por línea</h2>
          <span />
        </header>

        {isLoading ? (
          <div className="line-showcase-grid">
            <div className="line-tile-skeleton" />
            <div className="line-tile-skeleton" />
          </div>
        ) : (
          <div className="line-showcase-grid">
            {list.map((cat) => (
              <LineTile key={cat.id} cat={cat} shape={shape} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export const SHOWCASE_SHAPES = [
  { id: 'gear', label: 'Corona' },
  { id: 'hex', label: 'Tuerca' },
  { id: 'gasket', label: 'Empaque' },
  { id: 'ring', label: 'Anillo' },
  { id: 'plate', label: 'Placa' },
];

export function ShowcaseShapePreview({ shape }) {
  return (
    <div className="relative w-full aspect-square bg-[#020617] overflow-hidden">
      <ShapeFrame shape={normalizeShape(shape)} gid={`pv${shape}`} />
    </div>
  );
}
