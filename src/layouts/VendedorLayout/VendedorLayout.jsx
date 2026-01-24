import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VendedorLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para controlar el sidebar en móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Cerrar sidebar al navegar en móvil
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/productos/destacados')) return 'Productos';
    if (path.includes('/productos')) return 'Listado de Productos';
    return 'Vendedor';
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-display overflow-hidden">
      {/* Backdrop para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative
        flex flex-col w-72 h-full bg-[#0F172A] shadow-2xl z-40 text-white border-r border-[#1e293b] shrink-0
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-center py-3 px-6 border-b border-[#1e293b]">
          <img 
            src="/logo_orc-removebg-preview.png" 
            alt="ORC Inversiones" 
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Navigation - Solo productos para vendedor */}
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          <div className="flex flex-col">
            {/* Menú de Productos con submenú */}
            <div className="mb-2">
              <div className="flex items-center gap-3 px-4 py-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">
                  inventory_2
                </span>
                <span>Productos</span>
              </div>
              
              {/* Submenú */}
              <div className="flex flex-col gap-1 mt-1">
                <button
                  onClick={() => {
                    navigate('/vendedor/productos');
                    closeSidebar();
                  }}
                  className={`flex items-center gap-3 px-4 py-3 ml-4 transition-colors group w-full text-left ${
                    location.pathname === '/vendedor/productos'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-base group-hover:text-[#F5C344] transition-colors">
                    list
                  </span>
                  <span className="text-sm font-medium">
                    Listado de Productos
                  </span>
                </button>

                <button
                  onClick={() => {
                    navigate('/vendedor/productos/destacados');
                    closeSidebar();
                  }}
                  className={`flex items-center gap-3 px-4 py-3 ml-4 transition-colors group w-full text-left ${
                    location.pathname === '/vendedor/productos/destacados'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-base group-hover:text-[#F5C344] transition-colors">
                    star
                  </span>
                  <span className="text-sm font-medium">
                    Productos Disponibles
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#1e293b]">
          {/* Usuario Info - Diseño mejorado */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-3 bg-gradient-to-r from-[#1e293b] to-[#334155] rounded-lg border border-[#334155] hover:border-[#475569] transition-all duration-200 group">
            <div className="relative">
              <div className="size-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-shadow duration-200">
                <span className="material-symbols-outlined text-white text-[22px]">person</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0F172A]"></div>
            </div>
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="text-white text-sm font-bold truncate">
                {user?.username || 'Vendedor'}
              </span>
              <span className="text-slate-400 text-xs font-medium truncate">
                {user?.role || 'Vendedor'}
              </span>
            </div>
          </div>

          {/* Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 group border border-transparent hover:border-red-500/20"
          >
            <span className="material-symbols-outlined group-hover:text-red-400 transition-colors text-[20px]">
              logout
            </span>
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-200 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            {/* Botón Hamburguesa - Solo móvil */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 transition-colors"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-slate-700">menu</span>
            </button>

            <div className="hidden md:flex items-center text-xs font-mono text-slate-500 gap-2">
              <span className="w-2 h-2 bg-emerald-500"></span>
              <span>ONLINE</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-gray-300"></div>
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <span className="hover:text-blue-600 cursor-pointer transition-colors hidden md:inline">
                Vendedor
              </span>
              <span className="material-symbols-outlined text-[12px] pt-0.5 hidden md:inline">chevron_right</span>
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
