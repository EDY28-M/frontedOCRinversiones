import { Link } from 'react-router-dom';

const WA =
  'https://wa.me/51984244498?text=' +
  encodeURIComponent('Hola, necesito confirmar disponibilidad. Marca:  Modelo: ');

const AUTOS = [
  { name: 'Hyundai', models: 'Accent, Elantra, Tucson, Santa Fe, Creta, Venue' },
  { name: 'Toyota', models: 'Corolla, Yaris, Avanza, Hilux' },
  { name: 'Kia', models: '' },
  { name: 'Mitsubishi', models: '' },
  { name: 'Foton', models: '' },
  { name: 'JAC', models: '' },
  { name: 'Joylong', models: '' },
  { name: 'Yutong', models: '' },
  { name: 'Dongfeng', models: '' },
  { name: 'Yuejin', models: '' },
];

const FLOTAS = [
  { name: 'JAC', src: '/svg logos/Logo_jac.svg' },
  { name: 'Foton', src: '/svg logos/FOTON.svg' },
  { name: 'JMC', src: '/svg logos/JMC.svg' },
  { name: 'Cummins', src: '/svg logos/Cummins_logo.svg' },
  { name: 'Hino', src: '/svg_japneses_coreanos/Hino-logo.svg' },
  { name: 'Isuzu', src: '/svg_japneses_coreanos/isuzu.svg' },
  { name: 'DFM', src: '/svg logos/DFM.svg' },
  { name: 'Yuchai', src: '/svg logos/YUCHAI.svg' },
];

function MarkYears() {
  return (
    <svg viewBox="0 0 72 72" className="emp-mark" aria-hidden="true">
      <rect x="8" y="14" width="56" height="48" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8 28 H64" stroke="currentColor" strokeWidth="2.2" />
      <path d="M22 14 V8 M50 14 V8" stroke="currentColor" strokeWidth="2.4" />
      <text x="36" y="52" textAnchor="middle" fill="currentColor" fontFamily="Oswald, sans-serif" fontSize="18" fontWeight="600">
        10
      </text>
    </svg>
  );
}

function MarkStores() {
  return (
    <svg viewBox="0 0 72 72" className="emp-mark" aria-hidden="true">
      <path d="M10 32 L36 12 L62 32 V62 H10 Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M28 62 V44 H44 V62" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M16 32 H56" stroke="#facc15" strokeWidth="3" />
    </svg>
  );
}

function MarkPay() {
  return (
    <svg viewBox="0 0 72 72" className="emp-mark" aria-hidden="true">
      <rect x="10" y="20" width="52" height="34" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M10 30 H62" stroke="currentColor" strokeWidth="2.2" />
      <rect x="16" y="38" width="18" height="8" fill="#facc15" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function MarkShip() {
  return (
    <svg viewBox="0 0 72 72" className="emp-mark" aria-hidden="true">
      <path d="M8 42 H40 V24 H22 L8 36 Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M40 30 H58 L64 42 V54 H40 Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="22" cy="56" r="6" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="54" cy="56" r="6" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8 42 H64" stroke="#facc15" strokeWidth="2" />
    </svg>
  );
}

export default function EmpresaBloques() {
  return (
    <>
      <section className="emp-block emp-block--audiences">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12 md:mb-16">
            <p className="emp-kicker">Almacén Ate · Lima</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-matte-dark uppercase font-display mb-4">
              Repuestos para autos particulares <span className="text-primary">y vehículos comerciales</span>
            </h2>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </header>

          <article className="emp-dossier">
            <div className="emp-dossier-photo">
              <img src="/imagenes OC/4.jpeg" alt="Repuestos para autos particulares" />
              <span className="emp-tick emp-tick--tl" />
              <span className="emp-tick emp-tick--br" />
              <span className="emp-dossier-index">01</span>
            </div>
            <div className="emp-dossier-copy">
              <p className="emp-kicker">Uso particular</p>
              <h3>Repuestos para tu auto</h3>
              <p>
                Atendemos autos de familia y uso diario: sedán, SUV y camioneta liviana. Si tu unidad es Hyundai,
                Toyota, Foton, JAC u otra de las marcas de esta ficha, tráenos el modelo exacto y confirmamos pieza
                y disponibilidad desde Ate.
              </p>
              <p>
                No vendemos “genérico para todos”. Cruzamos marca, modelo y código para que el recambio calce.
              </p>
            </div>
          </article>

          <article className="emp-dossier emp-dossier--reverse">
            <div className="emp-dossier-photo">
              <img src="/imagenes OC/2.jpeg" alt="Repuestos para vehículo de trabajo" />
              <span className="emp-tick emp-tick--tr" />
              <span className="emp-tick emp-tick--bl" />
              <span className="emp-dossier-index">02</span>
            </div>
            <div className="emp-dossier-copy">
              <p className="emp-kicker">Flota y trabajo</p>
              <h3>Repuestos para tu vehículo de trabajo</h3>
              <p>
                Camionetas, vans y flotas que no pueden parar. Traemos motor, caja, dirección y tren de fuerza para
                línea china y diésel de trabajo: JAC, Foton, JMC, Hino, Isuzu y Cummins, entre otras.
              </p>
              <p>
                El pedido se arma con el mismo criterio del almacén: pieza identificada, stock real y despacho el mismo día cuando hay inventario.
              </p>
              <div className="emp-logo-row">
                {FLOTAS.map((b) => (
                  <span key={b.name} className="emp-logo-chip" title={b.name}>
                    <img src={b.src} alt={b.name} />
                  </span>
                ))}
              </div>
            </div>
          </article>

          <div className="emp-ficha">
            <div className="emp-ficha-head">
              <div>
                <p className="emp-kicker">Compatibilidad · autos particulares</p>
                <h3>Marcas y modelos que atendemos</h3>
              </div>
              <p className="emp-ficha-note">
                Escríbenos la marca y el modelo exacto para confirmar disponibilidad.
              </p>
            </div>
            <ul className="emp-brand-grid">
              {AUTOS.map((brand) => (
                <li key={brand.name}>
                  <div className="emp-brand-name">
                    <span>{brand.name}</span>
                  </div>
                  {brand.models ? <p>{brand.models}</p> : null}
                </li>
              ))}
            </ul>
            <div className="emp-ficha-actions">
              <a href={WA} target="_blank" rel="noopener noreferrer" className="emp-btn emp-btn--wa">
                Confirmar por WhatsApp
              </a>
              <Link to="/repuestos" className="emp-btn emp-btn--ghost">
                Ver catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="emp-block emp-block--why">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <p className="emp-kicker">Respaldo</p>
            <h2 className="text-3xl md:text-4xl font-bold text-matte-dark uppercase font-display mb-4">
              Por qué comprar <span className="text-primary">con nosotros</span>
            </h2>
            <div className="h-1 w-24 bg-accent mx-auto" />
          </header>

          <div className="emp-why-grid">
            <article className="emp-why">
              <MarkYears />
              <p className="emp-why-num">01</p>
              <h3>10 años de rubro</h3>
              <p>Más de una década importando y despachando recambio. El mostrador ya conoce las fallas recurrentes de cada línea.</p>
            </article>
            <article className="emp-why">
              <MarkStores />
              <p className="emp-why-num">02</p>
              <h3>3 tiendas físicas en Lima</h3>
              <p>Tres locales en Lima para recoger o coordinar. Sede de almacén en Ate, referencia Puruchuco.</p>
            </article>
            <article className="emp-why">
              <MarkPay />
              <p className="emp-why-num">03</p>
              <h3>Pagos con Yape o Plin</h3>
              <p>Cierra el pedido al instante. Yape y Plin para no frenar el recambio por transferencia larga.</p>
              <div className="emp-why-pays">
                <img src="/Bancos/yape.png" alt="Yape" />
                <img src="/Bancos/plin.svg" alt="Plin" />
              </div>
            </article>
            <article className="emp-why">
              <MarkShip />
              <p className="emp-why-num">04</p>
              <h3>Envíos a nivel nacional</h3>
              <p>Despacho a provincias todos los días. Coordinamos agencia y te dejamos el recambio en ruta.</p>
              <Link to="/envios-provincias" className="emp-why-link">
                Ver envíos a provincias
              </Link>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
