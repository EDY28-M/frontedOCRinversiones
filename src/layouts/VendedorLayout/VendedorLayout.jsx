import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VendedorLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/productos')) return 'Listado de Productos';
    return 'Vendedor';
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-display overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-full bg-[#0F172A] shadow-2xl z-20 text-white border-r border-[#1e293b] shrink-0">
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-6 border-b border-[#1e293b]">
          <div className="bg-[#F5C344]/10 p-2 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#F5C344]" style={{ fontSize: '24px' }}>
              store
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-base font-bold uppercase tracking-wider leading-none">
              ORC INV.
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-1">VENDEDOR</p>
          </div>
        </div>

        {/* Navigation - Solo productos para vendedor */}
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          <div className="flex flex-col">
            <button
              onClick={() => navigate('/vendedor/productos')}
              className={`flex items-center gap-3 px-4 py-3 transition-colors group w-full text-left ${
                location.pathname.includes('/productos')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined group-hover:text-[#F5C344] transition-colors">
                inventory_2
              </span>
              <span className="text-sm font-medium">
                Productos
              </span>
            </button>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#1e293b] flex flex-col gap-2">
          {/* Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:text-red-400 transition-colors">
              logout
            </span>
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>

          {/* Usuario Info */}
          <div className="flex items-center gap-3 px-4 py-3 mt-2 bg-[#020617] border border-[#1e293b]">
            <div className="size-8 shrink-0 border border-slate-600 bg-slate-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">person</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-white text-xs font-bold truncate">
                {user?.username || 'Vendedor'}
              </span>
              <span className="text-slate-500 text-[10px] font-mono truncate">
                {user?.role?.toUpperCase() || 'VENDEDOR'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-xs font-mono text-slate-500 gap-2">
              <span className="w-2 h-2 bg-emerald-500"></span>
              <span>ONLINE</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">
                Vendedor
              </span>
              <span className="material-symbols-outlined text-[12px] pt-0.5">chevron_right</span>
              <span className="text-slate-900 font-bold">{getBreadcrumb()}</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-mono">
              {user?.username || 'vendedor'}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VendedorLayout;
