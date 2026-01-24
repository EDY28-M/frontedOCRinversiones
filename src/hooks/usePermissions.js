import { useAuth } from '../context/AuthContext';
import { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, isVendedor } from '../utils/permissions';

/**
 * Hook personalizado para verificar permisos del usuario actual
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  return {
    // Verificar permiso específico
    can: (permission) => hasPermission(userRole, permission),
    
    // Verificar si tiene al menos uno de los permisos
    canAny: (permissions) => hasAnyPermission(userRole, permissions),
    
    // Verificar si tiene todos los permisos
    canAll: (permissions) => hasAllPermissions(userRole, permissions),
    
    // Verificar rol
    isAdmin: () => isAdmin(userRole),
    isVendedor: () => isVendedor(userRole),
    
    // Rol actual
    role: userRole,
  };
};
