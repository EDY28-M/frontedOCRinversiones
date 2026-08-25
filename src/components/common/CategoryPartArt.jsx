/** Dibujos técnicos de pieza. Trazo a trazo, sin iconos genéricos. */

function Steel({ gid }) {
  return (
    <defs>
      <linearGradient id={`${gid}-face`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e8eef7" />
        <stop offset="45%" stopColor="#9aa8bd" />
        <stop offset="100%" stopColor="#3d4a5c" />
      </linearGradient>
      <linearGradient id={`${gid}-gold`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
  );
}

function Blueprint({ children, gid }) {
  return (
    <svg className="line-card-svg" viewBox="0 0 220 220" aria-hidden="true">
      <Steel gid={gid} />
      <g stroke="#d6deea" strokeWidth="0.6" fill="none">
        <path d="M12 12 H208 M12 208 H208 M12 12 V208 M208 12 V208" />
        <path d="M12 110 H208 M110 12 V208" strokeDasharray="3 5" />
        <circle cx="110" cy="110" r="96" />
      </g>
      {children}
    </svg>
  );
}

function ArtBolts({ gid }) {
  return (
    <Blueprint gid={gid}>
      <g stroke="#0f2744" strokeWidth="1.7" fill="none" strokeLinejoin="miter">
        <path d="M58 46 L76 36 L94 46 L94 62 L76 72 L58 62 Z" fill={`url(#${gid}-face)`} />
        <path d="M67 41 L85 51 M76 36 V72" stroke="#0014cc" strokeWidth="1" />
        <rect x="70" y="72" width="12" height="38" fill={`url(#${gid}-face)`} />
        <path d="M70 88 H82 M70 94 H82 M70 100 H82 M70 106 H82" stroke="#0014cc" />
        <ellipse cx="76" cy="118" rx="18" ry="6" fill="#e2e8f0" />
        <ellipse cx="76" cy="118" rx="8" ry="3" />
        <path d="M64 138 L88 138 L92 146 L60 146 Z" fill={`url(#${gid}-face)`} />
        <path d="M66 146 L70 168 L82 168 L86 146" fill={`url(#${gid}-face)`} />
        <path d="M70 152 H82 M70 158 H82 M70 164 H82" stroke="#0014cc" />
        <circle cx="148" cy="78" r="28" fill={`url(#${gid}-face)`} />
        <circle cx="148" cy="78" r="11" fill="#0f172a" />
        <path d="M148 50 V64 M176 78 H162 M148 106 V92 M120 78 H134" stroke={`url(#${gid}-gold)`} strokeWidth="2.2" />
        <path d="M128 128 L168 128 L178 148 L168 168 L128 168 L118 148 Z" fill={`url(#${gid}-face)`} />
        <circle cx="148" cy="148" r="10" />
        <path d="M138 148 H158 M148 138 V158" stroke="#0014cc" />
      </g>
    </Blueprint>
  );
}

function ArtPiston({ gid }) {
  return (
    <Blueprint gid={gid}>
      <g stroke="#0f2744" strokeWidth="1.7" fill="none">
        <path d="M78 28 H142 L150 48 V92 L142 104 H78 L70 92 V48 Z" fill={`url(#${gid}-face)`} />
        <path d="M74 52 H146 M74 62 H146 M74 72 H146" stroke="#0014cc" />
        <path d="M88 34 H132" stroke={`url(#${gid}-gold)`} strokeWidth="2.4" />
        <path d="M96 104 V138 H124 V104" fill={`url(#${gid}-face)`} />
        <circle cx="110" cy="124" r="8" fill="#1e293b" stroke={`url(#${gid}-gold)`} />
        <path d="M98 138 L78 198 H102 L110 150 L118 198 H142 L122 138" fill={`url(#${gid}-face)`} />
        <path d="M92 168 H128" stroke="#0014cc" />
        <path d="M70 44 H54 M150 44 H166" stroke="#94a3b8" strokeDasharray="2 3" />
      </g>
    </Blueprint>
  );
}

function ArtClutch({ gid }) {
  return (
    <Blueprint gid={gid}>
      <g stroke="#0f2744" strokeWidth="1.6" fill="none">
        <circle cx="110" cy="110" r="78" fill={`url(#${gid}-face)`} />
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const x1 = 110 + Math.cos(a) * 72;
          const y1 = 110 + Math.sin(a) * 72;
          const x2 = 110 + Math.cos(a) * 78;
          const y2 = 110 + Math.sin(a) * 78;
          return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} />;
        })}
        <circle cx="110" cy="110" r="64" stroke="#0014cc" />
        <circle cx="110" cy="110" r="48" />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const a = ((deg - 90) * Math.PI) / 180;
          const cx = 110 + Math.cos(a) * 40;
          const cy = 110 + Math.sin(a) * 40;
          return (
            <g key={deg}>
              <rect x={cx - 7} y={cy - 11} width="14" height="22" rx="6" transform={`rotate(${deg} ${cx} ${cy})`} fill="#e2e8f0" />
              <path d={`M${cx - 4} ${cy - 6} Q${cx} ${cy} ${cx + 4} ${cy + 6}`} stroke={`url(#${gid}-gold)`} />
            </g>
          );
        })}
        <circle cx="110" cy="110" r="16" fill="#0f172a" />
        <circle cx="110" cy="110" r="8" stroke={`url(#${gid}-gold)`} strokeWidth="2" />
      </g>
    </Blueprint>
  );
}

function ArtGearbox({ gid }) {
  const gear = (cx, cy, teeth, r0, r1) => {
    const pts = [];
    for (let i = 0; i < teeth; i += 1) {
      const a = (i / teeth) * Math.PI * 2;
      const s = (Math.PI * 2) / teeth;
      pts.push(
        [cx + r0 * Math.cos(a + s * 0.15), cy + r0 * Math.sin(a + s * 0.15)],
        [cx + r1 * Math.cos(a + s * 0.35), cy + r1 * Math.sin(a + s * 0.35)],
        [cx + r1 * Math.cos(a + s * 0.65), cy + r1 * Math.sin(a + s * 0.65)],
        [cx + r0 * Math.cos(a + s * 0.85), cy + r0 * Math.sin(a + s * 0.85)]
      );
    }
    return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;
  };
  return (
    <Blueprint gid={gid}>
      <g stroke="#0f2744" strokeWidth="1.6" fill="none">
        <rect x="36" y="48" width="148" height="124" rx="8" />
        <path d="M36 70 H184" stroke="#0014cc" />
        <path d={gear(86, 118, 14, 28, 38)} fill={`url(#${gid}-face)`} />
        <circle cx="86" cy="118" r="8" fill="#0f172a" />
        <path d="M86 48 V86" strokeWidth="3" />
        <path d={gear(138, 132, 10, 20, 28)} fill={`url(#${gid}-face)`} />
        <circle cx="138" cy="132" r="6" fill="#0f172a" />
        <path d="M138 152 V176" strokeWidth="3" />
        <circle cx="86" cy="118" r="32" stroke={`url(#${gid}-gold)`} strokeWidth="1.2" fill="none" />
      </g>
    </Blueprint>
  );
}

function ArtSteering({ gid }) {
  return (
    <Blueprint gid={gid}>
      <g stroke="#0f2744" strokeWidth="1.7" fill="none">
        <path d="M40 128 H180" strokeWidth="6" stroke="#64748b" />
        <path d="M40 128 H180" strokeWidth="2.2" stroke={`url(#${gid}-gold)`} />
        <rect x="36" y="118" width="14" height="20" fill={`url(#${gid}-face)`} />
        <rect x="170" y="118" width="14" height="20" fill={`url(#${gid}-face)`} />
        <circle cx="110" cy="86" r="22" fill={`url(#${gid}-face)`} />
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M${(110 + Math.cos(a) * 16).toFixed(1)} ${(86 + Math.sin(a) * 16).toFixed(1)} L${(110 + Math.cos(a) * 22).toFixed(1)} ${(86 + Math.sin(a) * 22).toFixed(1)}`}
            />
          );
        })}
        <path d="M110 108 V128" strokeWidth="4" />
        <path d="M110 52 V64" strokeWidth="5" />
        <circle cx="110" cy="46" r="10" fill={`url(#${gid}-face)`} />
        <path d="M24 128 L12 118 M24 128 L12 138 M196 128 L208 118 M196 128 L208 138" stroke="#0014cc" />
      </g>
    </Blueprint>
  );
}

function ArtBrake({ gid }) {
  return (
    <Blueprint gid={gid}>
      <g stroke="#0f2744" strokeWidth="1.6" fill="none">
        <circle cx="108" cy="118" r="70" fill={`url(#${gid}-face)`} />
        <circle cx="108" cy="118" r="52" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + 0.2;
          const x = 108 + Math.cos(a) * 40;
          const y = 118 + Math.sin(a) * 40;
          return <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a) * 16).toFixed(1)} ${(Math.sin(a) * 16).toFixed(1)}`} stroke="#0014cc" />;
        })}
        <circle cx="108" cy="118" r="18" fill="#0f172a" />
        <circle cx="108" cy="118" r="8" stroke={`url(#${gid}-gold)`} />
        <path d="M150 48 H196 V96 H176 L150 72 Z" fill={`url(#${gid}-face)`} />
        <path d="M158 58 H188 M158 70 H180" stroke="#0014cc" />
        <path d="M168 96 V118" strokeWidth="4" />
      </g>
    </Blueprint>
  );
}

function ArtFilter({ gid }) {
  return (
    <Blueprint gid={gid}>
      <g stroke="#0f2744" strokeWidth="1.7" fill="none">
        <ellipse cx="110" cy="48" rx="42" ry="14" fill={`url(#${gid}-face)`} />
        <path d="M68 48 V160" />
        <path d="M152 48 V160" />
        <ellipse cx="110" cy="160" rx="42" ry="14" fill={`url(#${gid}-face)`} />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 76 + i * 8.5;
          return <path key={i} d={`M${x} 58 V150`} stroke="#0014cc" strokeWidth="1.1" />;
        })}
        <ellipse cx="110" cy="104" rx="18" ry="6" />
        <rect x="98" y="28" width="24" height="14" fill={`url(#${gid}-gold)`} stroke="#0f2744" />
        <circle cx="80" cy="48" r="3.5" fill="#0f172a" />
        <circle cx="140" cy="48" r="3.5" fill="#0f172a" />
      </g>
    </Blueprint>
  );
}

function ArtTools({ gid }) {
  return (
    <Blueprint gid={gid}>
      <g stroke="#0f2744" strokeWidth="1.7" fill="none">
        <path d="M60 70 H150 L168 88 V150 L150 168 H60 L42 150 V88 Z" fill={`url(#${gid}-face)`} />
        <path d="M60 88 H150" stroke="#0014cc" />
        <circle cx="56" cy="80" r="5" fill="#0f172a" stroke={`url(#${gid}-gold)`} />
        <circle cx="154" cy="80" r="5" fill="#0f172a" stroke={`url(#${gid}-gold)`} />
        <circle cx="56" cy="158" r="5" fill="#0f172a" stroke={`url(#${gid}-gold)`} />
        <circle cx="154" cy="158" r="5" fill="#0f172a" stroke={`url(#${gid}-gold)`} />
        <path d="M78 108 H132 M78 122 H118 M78 136 H108" stroke="#0014cc" />
      </g>
    </Blueprint>
  );
}

export function partKindFromName(name) {
  const n = String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (n.includes('embrag')) return 'clutch';
  if (n.includes('caja') || n.includes('cambio') || n.includes('transm')) return 'gearbox';
  if (n.includes('direcc') || n.includes('steering')) return 'steering';
  if (n.includes('freno')) return 'brake';
  if (n.includes('filtro')) return 'filter';
  if (n.includes('diesel') || n.includes('motor') || n.includes('piston')) return 'piston';
  if (n.includes('accesor') || n.includes('perno') || n.includes('tornillo')) return 'bolts';
  return 'tools';
}

export default function CategoryPartArt({ name, gid }) {
  const kind = partKindFromName(name);
  if (kind === 'clutch') return <ArtClutch gid={gid} />;
  if (kind === 'gearbox') return <ArtGearbox gid={gid} />;
  if (kind === 'steering') return <ArtSteering gid={gid} />;
  if (kind === 'brake') return <ArtBrake gid={gid} />;
  if (kind === 'filter') return <ArtFilter gid={gid} />;
  if (kind === 'piston') return <ArtPiston gid={gid} />;
  if (kind === 'bolts') return <ArtBolts gid={gid} />;
  return <ArtTools gid={gid} />;
}
