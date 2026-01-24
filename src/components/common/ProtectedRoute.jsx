import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

/**
 * Componente que protege rutas basándose en permisos y roles
 * Redirige a una página de acceso denegado si no tiene permisos
 */
const ProtectedRoute = ({ 
  children, 
  permission, 
  anyPermissions, 
  allPermissions, 
  adminOnly = false,
  vendedorOnly = false,
  roleBasedRedirect = false  // Si true, redirige según el rol al acceso denegado correcto
}) => {
  const { can, canAny, canAll, isAdmin, isVendedor } = usePermissions();

  // Determinar la ruta de acceso denegado según el rol del usuario
  const getAccessDeniedRoute = () => {
    if (isAdmin()) {
      return '/admin/acceso-denegado';
    } else if (isVendedor()) {
      return '/vendedor/acceso-denegado';
    }
    return '/admin/login';  // Si no tiene rol, redirigir a login
  };

  // Si requiere ser admin y NO lo es
  if (adminOnly && !isAdmin()) {
    return <Navigate to={getAccessDeniedRoute()} replace />;
  }

  // Si requiere ser vendedor y NO lo es
  if (vendedorOnly && !isVendedor()) {
    return <Navigate to={getAccessDeniedRoute()} replace />;
  }

  // Si requiere un permiso específico
  if (permission && !can(permission)) {
    return <Navigate to={getAccessDeniedRoute()} replace />;
  }

  // Si requiere al menos uno de varios permisos
  if (anyPermissions && !canAny(anyPermissions)) {
    return <Navigate to={getAccessDeniedRoute()} replace />;
  }

  // Si requiere todos los permisos especificados
  if (allPermissions && !canAll(allPermissions)) {
    return <Navigate to={getAccessDeniedRoute()} replace />;
  }

  // Si pasa todas las validaciones, renderizar el componente
  return children;
};

export default ProtectedRoute;
