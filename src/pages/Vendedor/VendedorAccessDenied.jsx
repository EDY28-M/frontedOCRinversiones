import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VendedorAccessDenied = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
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
        <p className="text-slate-600 mb-2">
          No tienes permisos para acceder a esta sección.
        </p>
        <p className="text-sm text-slate-500 mb-2">
          Tu rol actual: <span className="font-bold text-slate-700">{user?.role || 'Vendedor'}</span>
        </p>
        <p className="text-sm text-slate-500 mb-8">
          Como vendedor, solo tienes acceso al listado de productos.
        </p>

        {/* Botón */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/vendedor/productos', { replace: true })}
            className="px-8 py-3 bg-[#F5C344] text-black font-bold text-sm uppercase tracking-wider hover:bg-[#eab308] transition-all shadow-md"
          >
            Ir a Mis Productos
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs text-slate-600">
            Si necesitas acceso a más funciones, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendedorAccessDenied;
