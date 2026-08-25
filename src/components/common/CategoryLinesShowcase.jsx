import { memo, useId, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePublicCategories } from '../../hooks/usePublicCategories';
import { usePublicSiteSettings } from '../../hooks/usePublicSiteSettings';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import CategoryPartArt from './CategoryPartArt';

const SHAPES = ['plate', 'gear', 'hex', 'gasket', 'ring'];

function normalizeShape(value) {
  const key = String(value || '').toLowerCase();
  return SHAPES.includes(key) ? key : 'plate';
}

function cleanDescription(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (/^categor[ií]a importada/i.test(text)) return '';
  return text;
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
  const grad = (
    <defs>
      <linearGradient id={`${gid}-steel`} x1="0.15" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="48%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
  );
  if (shape === 'hex') {
    return (
      <svg className="line-card-frame" viewBox="0 0 200 200" aria-hidden="true">
        {grad}
        <path d="M100 12 L174 54 L174 146 L100 188 L26 146 L26 54 Z" fill="none" stroke={steel} strokeWidth="7" />
        <path d="M100 12 L174 54 L174 146 L100 188 L26 146 L26 54 Z" fill="none" stroke="#0014cc" strokeWidth="1.1" />
      </svg>
    );
  }
  if (shape === 'gasket') {
    return (
      <svg className="line-card-frame" viewBox="0 0 200 200" aria-hidden="true">
        {grad}
        <rect x="14" y="28" width="172" height="144" rx="18" fill="none" stroke={steel} strokeWidth="8" />
        <rect x="14" y="28" width="172" height="144" rx="18" fill="none" stroke="#0014cc" strokeWidth="1" />
        {[
          [24, 40],
          [176, 40],
          [24, 160],
          [176, 160],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="5" fill="#0f172a" stroke="#facc15" strokeWidth="1.3" />
        ))}
      </svg>
    );
  }
  if (shape === 'ring') {
    return (
      <svg className="line-card-frame" viewBox="0 0 200 200" aria-hidden="true">
        {grad}
        <circle cx="100" cy="100" r="86" fill="none" stroke={steel} strokeWidth="10" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="#facc15" strokeWidth="2" />
      </svg>
    );
  }
  if (shape === 'gear') {
    const d = buildGearPath(100, 100, 18, 82, 94, 70);
    return (
      <svg className="line-card-frame" viewBox="0 0 200 200" aria-hidden="true">
        {grad}
        <path d={d} fill={steel} fillRule="evenodd" />
        <circle cx="100" cy="100" r="72" fill="none" stroke="#facc15" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className="line-card-frame" viewBox="0 0 200 200" aria-hidden="true">
      {grad}
      <path d="M22 8 H178 L192 22 V178 L178 192 H22 L8 178 V22 Z" fill="none" stroke={steel} strokeWidth="6" />
      <path d="M22 8 H178 L192 22 V178 L178 192 H22 L8 178 V22 Z" fill="none" stroke="#0014cc" strokeWidth="1" />
      {[
        [16, 16],
        [184, 16],
        [16, 184],
        [184, 184],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4.5" fill="#0f172a" stroke="#facc15" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

const LineCard = memo(function LineCard({ cat, shape }) {
  const uid = useId();
  const gid = `ln${uid.replace(/[^a-zA-Z0-9]/g, '')}`;
  const photo = resolveMediaUrl(cat.imageUrl);

  return (
    <Link to={`/productos?categoria=${cat.id}`} className={`line-card is-${shape}`}>
      <div className="line-card-art">
        <ShapeFrame shape={shape} gid={`${gid}f`} />
        {photo ? (
          <img src={photo} alt="" className="line-card-photo" />
        ) : (
          <CategoryPartArt name={cat.name} gid={gid} />
        )}
      </div>
      <div className="line-card-copy">
        <p className="line-card-kicker">Línea de pieza</p>
        <h3>{cat.name}</h3>
        {cat.description ? <p className="line-card-desc">{cat.description}</p> : null}
        <span className="line-card-go">Ver stock</span>
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
        }))
        .filter((cat) => cat.id > 0 && cat.name),
    [categories]
  );

  if (!isLoading && list.length === 0) return null;

  return (
    <section className="line-showcase">
      <div className="page-container">
        <div className="text-center mb-10">
          <h3 className="font-display text-2xl md:text-3xl font-medium uppercase text-primary mb-2">
            Repuestos por línea
          </h3>
          <div className="w-16 h-1 bg-accent mx-auto" />
        </div>

        {isLoading ? (
          <div className="line-showcase-grid">
            <div className="line-card-skeleton" />
            <div className="line-card-skeleton" />
            <div className="line-card-skeleton" />
          </div>
        ) : (
          <div className="line-showcase-grid">
            {list.map((cat) => (
              <LineCard key={cat.id} cat={cat} shape={shape} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export const SHOWCASE_SHAPES = [
  { id: 'plate', label: 'Placa' },
  { id: 'gear', label: 'Corona' },
  { id: 'hex', label: 'Tuerca' },
  { id: 'gasket', label: 'Empaque' },
  { id: 'ring', label: 'Anillo' },
];

export function ShowcaseShapePreview({ shape }) {
  return (
    <div className="relative w-full aspect-square bg-white overflow-hidden">
      <ShapeFrame shape={normalizeShape(shape)} gid={`pv${shape}`} />
    </div>
  );
}
