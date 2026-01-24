import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { isAdmin } from '../../../utils/permissions';

/**
 * Componente que redirige al dashboard apropiado según el rol del usuario
 * - Administrador: redirige a /admin/productos
 * - Vendedor: redirige a /vendedor/productos
 */
const DashboardRedirect = () => {
  const { user } = useAuth();

  // Si es administrador, va a admin
  if (isAdmin(user?.role)) {
    return <Navigate to="/admin/productos" replace />;
  }

  // Vendedor va a su propia interfaz
  return <Navigate to="/vendedor/productos" replace />;
};

export default DashboardRedirect;
