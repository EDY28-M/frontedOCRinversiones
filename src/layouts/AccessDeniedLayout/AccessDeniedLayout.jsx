import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAdmin, isVendedor } from '../../utils/permissions';

/**
 * Layout simple para la página de acceso denegado
 * Muestra el mensaje sin el sidebar de admin o vendedor
 */
const AccessDeniedLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Determinar la ruta permitida según el rol del usuario
  const getAllowedRoute = () => {
    const userRole = user?.role;

    if (isAdmin(userRole)) {
      return '/admin/productos';
    } else if (isVendedor(userRole)) {
      return '/vendedor/productos';
    }

    // Fallback en caso de rol desconocido
    return '/admin/login';
  };

  const handleGoToAllowedRoute = () => {
    const allowedRoute = getAllowedRoute();
    navigate(allowedRoute, { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center font-display">
      <div className="text-center max-w-md px-6">
        {/* Icono de Prohibido */}
        <div className="mb-6">
          <span className="material-symbols-outlined text-red-500" style={{ fontSize: '120px' }}>
            block
          </span>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-slate-900 mb-4 uppercase tracking-wide">
          Acceso Denegado
        </h1>

        {/* Mensaje */}
        <p className="text-slate-600 mb-2 text-lg">
          No tienes permisos para acceder a esta sección.
        </p>
        <p className="text-sm text-slate-500 mb-8">
          Tu rol actual: <span className="font-bold text-slate-700">{user?.role || 'Desconocido'}</span>
        </p>

        {/* Botón */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleGoToAllowedRoute}
            className="px-8 py-3 bg-[#F5C344] text-black font-bold text-sm uppercase tracking-wider hover:bg-[#eab308] transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Ir a Productos
          </button>
        </div>

        {/* Información adicional */}
        <div className="p-4 bg-blue-50 border border-blue-200">
          <p className="text-xs text-slate-600">
            Si crees que deberías tener acceso a esta sección, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedLayout;
