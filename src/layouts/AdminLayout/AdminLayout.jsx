import { useState, useMemo } from 'react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';

// Componente de menú acordeón expandible
const AccordionMenuItem = ({ item, isExpanded, onToggle, currentPath, onNavigate }) => {
  // El padre está "expandido" si alguna ruta hija está activa
  // PERO NO se marca como "activo" - solo como expandido
  const hasActiveChild = item.children.some(child => currentPath === child.path);
  
  return (
    <div className="flex flex-col">
      {/* Item padre - Solo muestra estado de expansión, NO activo */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-3 px-4 py-3 transition-colors group w-full text-left ${
          isExpanded
            ? 'bg-white/5 text-white'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <span className={`material-symbols-outlined ${hasActiveChild ? 'text-[#F5C344]' : 'group-hover:text-[#F5C344]'} transition-colors`}>
          {item.icon}
        </span>
        <span className={`text-sm flex-1 ${hasActiveChild ? 'font-bold text-white' : 'font-medium'}`}>
          {item.label}
        </span>
        <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      
      {/* Submenú */}
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-40' : 'max-h-0'}`}>
        <div className="pl-4 py-1 space-y-1">
          {item.children.map((child) => {
            // Comparación EXACTA de rutas para evitar falsos positivos
            const isChildActive = currentPath === child.path;
            
            return (
              <NavLink
                key={child.path}
                to={child.path}
                end // Importante: coincidencia exacta
                onClick={onNavigate}
                className={`flex items-center gap-3 px-4 py-2 transition-colors text-sm ${
                  isChildActive
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{child.icon}</span>
                <span>{child.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { can, isAdmin } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para controlar qué menú está expandido
  const [expandedMenu, setExpandedMenu] = useState(() => {
    // Abrir automáticamente el menú según la ruta actual
    if (location.pathname.includes('/productos')) return 'productos';
    if (location.pathname.includes('/categorias')) return 'categorias';
    if (location.pathname.includes('/nombre-marca')) return 'nombremarca';
    if (location.pathname.includes('/usuarios')) return 'usuarios';
    return 'productos'; // Por defecto abrir productos
  });

  // Estado para controlar el sidebar en móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenu(expandedMenu === menuKey ? null : menuKey);
  };

  // Cerrar sidebar al navegar en móvil
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Menú jerárquico con submenús - Filtrado por permisos
  const menuItems = useMemo(() => {
    const items = [];
    
    // PRODUCTOS - Todos pueden ver, solo Admin puede crear/editar
    if (can(PERMISSIONS.PRODUCTOS_VIEW)) {
      const productosChildren = [
        { path: '/admin/productos', icon: 'list', label: 'Listado de Productos', permission: PERMISSIONS.PRODUCTOS_VIEW },
        { path: '/admin/productos/destacados', icon: 'star', label: 'Productos Disponibles', permission: PERMISSIONS.PRODUCTOS_VIEW },
      ];
      
      // Solo Admin puede crear productos
      if (can(PERMISSIONS.PRODUCTOS_CREATE)) {
        productosChildren.unshift({ path: '/admin/productos/crear', icon: 'add_circle', label: 'Crear Producto', permission: PERMISSIONS.PRODUCTOS_CREATE });
      }
      
      items.push({
        key: 'productos',
        basePath: '/admin/productos',
        icon: 'inventory_2',
        label: 'Productos',
        children: productosChildren,
      });
    }
    
    // CATEGORÍAS - Solo Admin
    if (can(PERMISSIONS.CATEGORIAS_VIEW)) {
      items.push({
        key: 'categorias',
        basePath: '/admin/categorias',
        icon: 'category',
        label: 'Categorías',
        children: [
          { path: '/admin/categorias/crear', icon: 'add_circle', label: 'Crear Categoría', permission: PERMISSIONS.CATEGORIAS_CREATE },
          { path: '/admin/categorias', icon: 'list', label: 'Listado de Categorías', permission: PERMISSIONS.CATEGORIAS_VIEW },
        ],
      });
    }
    
    // NOMBRE MARCA - Solo Admin
    if (can(PERMISSIONS.MARCAS_VIEW)) {
      items.push({
        key: 'nombremarca',
        basePath: '/admin/nombre-marca',
        icon: 'local_offer',
        label: 'Nombre Marca',
        children: [
          { path: '/admin/nombre-marca/crear', icon: 'add_circle', label: 'Crear Marca', permission: PERMISSIONS.MARCAS_CREATE },
          { path: '/admin/nombre-marca', icon: 'list', label: 'Listado de Marcas', permission: PERMISSIONS.MARCAS_VIEW },
        ],
      });
    }
    
    // USUARIOS - Solo Admin
    if (can(PERMISSIONS.USUARIOS_VIEW)) {
      items.push({
        key: 'usuarios',
        basePath: '/admin/usuarios',
        icon: 'group',
        label: 'Usuarios',
        children: [
          { path: '/admin/usuarios/crear', icon: 'person_add', label: 'Crear Usuario', permission: PERMISSIONS.USUARIOS_CREATE },
          { path: '/admin/usuarios', icon: 'list', label: 'Listado de Usuarios', permission: PERMISSIONS.USUARIOS_VIEW },
        ],
      });
    }
    
    return items;
  }, [can]);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/productos/crear')) return 'Crear Producto';
    if (path.includes('/productos/editar')) return 'Editar Producto';
    if (path.includes('/productos')) return 'Listado de Productos';
    if (path.includes('/categorias/crear')) return 'Crear Categoría';
    if (path.includes('/categorias/editar')) return 'Editar Categoría';
    if (path.includes('/categorias')) return 'Listado de Categorías';
    if (path.includes('/usuarios/crear')) return 'Crear Usuario';
    if (path.includes('/usuarios/editar')) return 'Editar Usuario';
    if (path.includes('/usuarios')) return 'Listado de Usuarios';
    if (path.includes('/configuracion')) return 'Configuración';
    return 'Administración';
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

        {/* Navigation - Menú Acordeón */}
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {menuItems.map((item) => (
            <AccordionMenuItem
              key={item.key}
              item={item}
              isExpanded={expandedMenu === item.key}
              onToggle={() => toggleMenu(item.key)}
              currentPath={location.pathname}
              onNavigate={closeSidebar}
            />
          ))}
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
                {user?.username || 'Administrador'}
              </span>
              <span className="text-slate-500 text-[10px] font-mono truncate">
                {user?.role?.toUpperCase() || 'ADMINISTRADOR'}
              </span>
            </div>
          </div>
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
              <NavLink to="/admin/productos" className="hover:text-blue-600 cursor-pointer transition-colors hidden md:inline">
                Admin
              </NavLink>
              <span className="material-symbols-outlined text-[12px] pt-0.5 hidden md:inline">chevron_right</span>
              <span className="text-slate-900 font-bold">{getBreadcrumb()}</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-mono">
              {user?.username || 'admin'}
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

export default AdminLayout;
