import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAdmin, isVendedor } from '../../utils/permissions';

/**
 * Componente que redirige a la ruta correcta según el rol del usuario
 * Evita que vendedores accedan a rutas de admin y viceversa
 *
 * showAccessDenied: Si es true, muestra la página de acceso denegado en lugar de redirigir
 */
const RoleBasedRoute = ({ children, requiredRole, showAccessDenied = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  const userRole = user?.role;

  // Si la ruta requiere rol de admin
  if (requiredRole === 'admin') {
    if (!isAdmin(userRole)) {
      // Si es vendedor, mostrar página de acceso denegado
      if (isVendedor(userRole)) {
        return <Navigate to="/acceso-denegado" replace />;
      }
      // Si no está autenticado o rol desconocido, redirigir al login
      return <Navigate to="/admin/login" replace />;
    }
  }

  // Si la ruta requiere rol de vendedor
  if (requiredRole === 'vendedor') {
    if (!isVendedor(userRole)) {
      // Si no es vendedor, redirigir a su área correspondiente
      if (isAdmin(userRole)) {
        return <Navigate to="/admin/productos" replace />;
      }
      return <Navigate to="/admin/login" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;
