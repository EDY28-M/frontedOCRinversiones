/**
 * Sistema de Control de Acceso Basado en Roles (RBAC)
 * Define los permisos de cada rol en el sistema
 */

export const ROLES = {
  ADMINISTRADOR: 'Administrador',
  VENDEDOR: 'Vendedor',
};

export const PERMISSIONS = {
  // Productos
  PRODUCTOS_VIEW: 'productos:view',
  PRODUCTOS_CREATE: 'productos:create',
  PRODUCTOS_EDIT: 'productos:edit',
  PRODUCTOS_DELETE: 'productos:delete',
  
  // Categorías
  CATEGORIAS_VIEW: 'categorias:view',
  CATEGORIAS_CREATE: 'categorias:create',
  CATEGORIAS_EDIT: 'categorias:edit',
  CATEGORIAS_DELETE: 'categorias:delete',
  
  // Marcas
  MARCAS_VIEW: 'marcas:view',
  MARCAS_CREATE: 'marcas:create',
  MARCAS_EDIT: 'marcas:edit',
  MARCAS_DELETE: 'marcas:delete',
  
  // Usuarios
  USUARIOS_VIEW: 'usuarios:view',
  USUARIOS_CREATE: 'usuarios:create',
  USUARIOS_EDIT: 'usuarios:edit',
  USUARIOS_DELETE: 'usuarios:delete',
};

// Definición de permisos por rol
const ROLE_PERMISSIONS = {
  [ROLES.ADMINISTRADOR]: [
    // Productos - Acceso completo
    PERMISSIONS.PRODUCTOS_VIEW,
    PERMISSIONS.PRODUCTOS_CREATE,
    PERMISSIONS.PRODUCTOS_EDIT,
    PERMISSIONS.PRODUCTOS_DELETE,
    
    // Categorías - Acceso completo
    PERMISSIONS.CATEGORIAS_VIEW,
    PERMISSIONS.CATEGORIAS_CREATE,
    PERMISSIONS.CATEGORIAS_EDIT,
    PERMISSIONS.CATEGORIAS_DELETE,
    
    // Marcas - Acceso completo
    PERMISSIONS.MARCAS_VIEW,
    PERMISSIONS.MARCAS_CREATE,
    PERMISSIONS.MARCAS_EDIT,
    PERMISSIONS.MARCAS_DELETE,
    
    // Usuarios - Acceso completo
    PERMISSIONS.USUARIOS_VIEW,
    PERMISSIONS.USUARIOS_CREATE,
    PERMISSIONS.USUARIOS_EDIT,
    PERMISSIONS.USUARIOS_DELETE,
  ],
  
  [ROLES.VENDEDOR]: [
    // Solo puede VER productos - Sin crear, editar o eliminar
    PERMISSIONS.PRODUCTOS_VIEW,
  ],
};

/**
 * Verifica si un rol tiene un permiso específico
 * @param {string} role - El rol del usuario
 * @param {string} permission - El permiso a verificar
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

/**
 * Verifica si un rol tiene al menos uno de los permisos especificados
 * @param {string} role - El rol del usuario
 * @param {string[]} permissions - Array de permisos a verificar
 * @returns {boolean}
 */
export const hasAnyPermission = (role, permissions) => {
  if (!role || !permissions || !Array.isArray(permissions)) return false;
  
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Verifica si un rol tiene todos los permisos especificados
 * @param {string} role - El rol del usuario
 * @param {string[]} permissions - Array de permisos a verificar
 * @returns {boolean}
 */
export const hasAllPermissions = (role, permissions) => {
  if (!role || !permissions || !Array.isArray(permissions)) return false;
  
  return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Obtiene todos los permisos de un rol
 * @param {string} role - El rol del usuario
 * @returns {string[]}
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Verifica si el usuario es administrador
 * @param {string} role - El rol del usuario
 * @returns {boolean}
 */
export const isAdmin = (role) => {
  return role === ROLES.ADMINISTRADOR;
};

/**
 * Verifica si el usuario es vendedor
 * @param {string} role - El rol del usuario
 * @returns {boolean}
 */
export const isVendedor = (role) => {
  return role === ROLES.VENDEDOR;
};
