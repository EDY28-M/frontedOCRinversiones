import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar Público */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <div className="h-12 w-12 bg-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    settings
                  </span>
                </div>
                <div className="flex flex-col leading-none">
                  <h1 className="text-2xl font-extrabold text-secondary tracking-wide">
                    ORC
                  </h1>
                  <h2 className="text-base font-bold text-primary tracking-tight">
                    INVERSIONES
                  </h2>
                </div>
              </Link>
            </div>

            {/* Menu */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="text-secondary font-semibold hover:text-primary transition-colors uppercase text-sm tracking-wider"
              >
                Inicio
              </Link>
              <Link
                to="/servicios"
                className="text-secondary font-semibold hover:text-primary transition-colors uppercase text-sm tracking-wider"
              >
                Servicios
              </Link>
              <Link
                to="/nosotros"
                className="text-secondary font-semibold hover:text-primary transition-colors uppercase text-sm tracking-wider"
              >
                Nosotros
              </Link>
              <Link
                to="/contacto"
                className="text-secondary font-semibold hover:text-primary transition-colors uppercase text-sm tracking-wider"
              >
                Contacto
              </Link>
              <Link
                to="/admin/login"
                className="px-4 py-2 bg-secondary text-primary font-bold text-sm uppercase tracking-wider hover:bg-opacity-90 transition-colors"
              >
                Acceso Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-2xl">
                    settings
                  </span>
                </div>
                <div className="flex flex-col leading-none">
                  <h3 className="text-xl font-extrabold tracking-wide">ORC</h3>
                  <p className="text-primary text-sm font-bold">INVERSIONES</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Servicios profesionales de mantenimiento y reparación de camiones pesados.
              </p>
            </div>

            {/* Columna 2 */}
            <div>
              <h4 className="text-primary font-bold text-sm uppercase tracking-wider mb-4">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-primary text-sm transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/servicios" className="text-gray-300 hover:text-primary text-sm transition-colors">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link to="/nosotros" className="text-gray-300 hover:text-primary text-sm transition-colors">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" className="text-gray-300 hover:text-primary text-sm transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3 */}
            <div>
              <h4 className="text-primary font-bold text-sm uppercase tracking-wider mb-4">
                Contacto
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                  Perú
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">phone</span>
                  +51 XXX XXX XXX
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">email</span>
                  info@orcinversiones.pe
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest">
              © 2024 ORC Inversiones Perú. Todos los derechos reservados. V3.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
