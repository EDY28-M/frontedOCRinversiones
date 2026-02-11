import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { PERMISSIONS } from '../utils/permissions';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import PageLoader from '../components/common/PageLoader';

// Componente de carga optimizado - pantalla completa
const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-sm text-gray-500 font-medium">Cargando...</p>
    </div>
  </div>
);

// Lazy loading de layouts (con retry automático ante deploy nuevo)
const PublicLayout = lazyWithRetry(() => import('../layouts/PublicLayout/PublicLayout'));
const AdminLayout = lazyWithRetry(() => import('../layouts/AdminLayout/AdminLayout'));
const VendedorLayout = lazyWithRetry(() => import('../layouts/VendedorLayout/VendedorLayout'));

// Lazy loading de páginas públicas
const Inicio = lazyWithRetry(() => import('../pages/Public/Inicio/Inicio'));
const Productos = lazyWithRetry(() => import('../pages/Public/Productos/Productos'));
const Servicios = lazyWithRetry(() => import('../pages/Public/Servicios/Servicios'));
const Nosotros = lazyWithRetry(() => import('../pages/Public/Nosotros/Nosotros'));
const Home = lazyWithRetry(() => import('../pages/Public/Home/Home'));
const About = lazyWithRetry(() => import('../pages/Public/About/About'));
const Contact = lazyWithRetry(() => import('../pages/Public/Contact/Contact'));

// Lazy loading de páginas de admin
const AdminLogin = lazyWithRetry(() => import('../pages/Admin/Login/Login'));
const AccessDenied = lazyWithRetry(() => import('../pages/Admin/AccessDenied/AccessDenied'));
const DashboardRedirect = lazyWithRetry(() => import('../pages/Admin/Dashboard/DashboardRedirect'));

// Lazy loading de páginas de vendedor
const VendedorAccessDenied = lazyWithRetry(() => import('../pages/Vendedor/VendedorAccessDenied'));

// Lazy loading de productos
const ProductosList = lazyWithRetry(() => import('../pages/Admin/Productos/Productos'));
const ProductosCreate = lazyWithRetry(() => import('../pages/Admin/Productos/ProductosCreate'));
const ProductosEdit = lazyWithRetry(() => import('../pages/Admin/Productos/ProductosEdit'));
const ProductosDestacados = lazyWithRetry(() => import('../pages/Admin/ProductosDestacados/ProductosDestacados'));

// Lazy loading de categorías
const CategoriasList = lazyWithRetry(() => import('../pages/Admin/Categorias/CategoriasList'));
const CategoriasCreate = lazyWithRetry(() => import('../pages/Admin/Categorias/CategoriasCreate'));
const CategoriasEdit = lazyWithRetry(() => import('../pages/Admin/Categorias/CategoriasEdit'));

// Lazy loading de nombre marca
const NombreMarcaList = lazyWithRetry(() => import('../pages/Admin/NombreMarca/NombreMarcaList'));
const NombreMarcaCreate = lazyWithRetry(() => import('../pages/Admin/NombreMarca/NombreMarcaCreate'));
const NombreMarcaEdit = lazyWithRetry(() => import('../pages/Admin/NombreMarca/NombreMarcaEdit'));

// Lazy loading de usuarios
const UsuariosList = lazyWithRetry(() => import('../pages/Admin/Usuarios/UsuariosList'));
const UsuariosCreate = lazyWithRetry(() => import('../pages/Admin/Usuarios/UsuariosCreate'));
const UsuariosEdit = lazyWithRetry(() => import('../pages/Admin/Usuarios/UsuariosEdit'));

// Private Route Component for Admin
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Wrapper para lazy loaded components
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<FullPageLoader />}>
    {children}
  </Suspense>
);

// Wrapper para páginas admin (spinner dentro del layout)
const AdminLazyWrapper = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================
            RUTAS PÚBLICAS - Diseño Pixel-Perfect
            Sin layout wrapper (cada página tiene header/footer propio)
            ======================================== */}
        <Route path="/" element={<LazyWrapper><Inicio /></LazyWrapper>} />
        <Route path="/productos" element={<LazyWrapper><Productos /></LazyWrapper>} />
        <Route path="/catalogo" element={<Navigate to="/productos" replace />} />
        <Route path="/envios-provincias" element={<LazyWrapper><Servicios /></LazyWrapper>} />
        <Route path="/nosotros" element={<LazyWrapper><Nosotros /></LazyWrapper>} />

        {/* Rutas legacy con PublicLayout (contacto usa el diseño antiguo) */}
        <Route element={<LazyWrapper><PublicLayout /></LazyWrapper>}>
          <Route path="contacto" element={<LazyWrapper><Contact /></LazyWrapper>} />
        </Route>

        {/* LOGIN ROUTE */}
        <Route path="/admin/login" element={<LazyWrapper><AdminLogin /></LazyWrapper>} />

        {/* ADMIN ROUTES - Solo para Administradores */}
        <Route path="/admin">
          {/* Admin Protected Routes (con layout) - SOLO ADMIN */}
          <Route
            element={
              <PrivateRoute>
                <ProtectedRoute adminOnly={true}>
                  <LazyWrapper><AdminLayout /></LazyWrapper>
                </ProtectedRoute>
              </PrivateRoute>
            }
          >
            {/* Redirección dinámica según rol del usuario */}
            <Route index element={<LazyWrapper><DashboardRedirect /></LazyWrapper>} />

            {/* Página de Acceso Denegado dentro del layout */}
            <Route path="acceso-denegado" element={<LazyWrapper><AccessDenied /></LazyWrapper>} />

            {/* PRODUCTOS - Admin tiene acceso completo */}
            <Route path="productos" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_VIEW}>
                <AdminLazyWrapper><ProductosList /></AdminLazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="productos/destacados" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_VIEW}>
                <AdminLazyWrapper><ProductosDestacados /></AdminLazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="productos/crear" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_CREATE}>
                <LazyWrapper><ProductosCreate /></LazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="productos/editar/:id" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_EDIT}>
                <LazyWrapper><ProductosEdit /></LazyWrapper>
              </ProtectedRoute>
            } />

            {/* CATEGORÍAS - Solo Administrador */}
            <Route path="categorias" element={
              <ProtectedRoute permission={PERMISSIONS.CATEGORIAS_VIEW}>
                <AdminLazyWrapper><CategoriasList /></AdminLazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="categorias/crear" element={
              <ProtectedRoute permission={PERMISSIONS.CATEGORIAS_CREATE}>
                <LazyWrapper><CategoriasCreate /></LazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="categorias/editar/:id" element={
              <ProtectedRoute permission={PERMISSIONS.CATEGORIAS_EDIT}>
                <LazyWrapper><CategoriasEdit /></LazyWrapper>
              </ProtectedRoute>
            } />

            {/* NOMBRE MARCA - Solo Administrador */}
            <Route path="nombre-marca" element={
              <ProtectedRoute permission={PERMISSIONS.MARCAS_VIEW}>
                <AdminLazyWrapper><NombreMarcaList /></AdminLazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="nombre-marca/crear" element={
              <ProtectedRoute permission={PERMISSIONS.MARCAS_CREATE}>
                <LazyWrapper><NombreMarcaCreate /></LazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="nombre-marca/editar/:id" element={
              <ProtectedRoute permission={PERMISSIONS.MARCAS_EDIT}>
                <LazyWrapper><NombreMarcaEdit /></LazyWrapper>
              </ProtectedRoute>
            } />

            {/* USUARIOS - Solo Administrador */}
            <Route path="usuarios" element={
              <ProtectedRoute permission={PERMISSIONS.USUARIOS_VIEW}>
                <AdminLazyWrapper><UsuariosList /></AdminLazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="usuarios/crear" element={
              <ProtectedRoute permission={PERMISSIONS.USUARIOS_CREATE}>
                <LazyWrapper><UsuariosCreate /></LazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="usuarios/editar/:id" element={
              <ProtectedRoute permission={PERMISSIONS.USUARIOS_EDIT}>
                <LazyWrapper><UsuariosEdit /></LazyWrapper>
              </ProtectedRoute>
            } />
          </Route>
        </Route>

        {/* VENDEDOR ROUTES - Interfaz separada para vendedores SOLO */}
        <Route path="/vendedor">
          <Route
            element={
              <PrivateRoute>
                <ProtectedRoute vendedorOnly={true}>
                  <LazyWrapper><VendedorLayout /></LazyWrapper>
                </ProtectedRoute>
              </PrivateRoute>
            }
          >
            {/* Redirección por defecto a productos */}
            <Route index element={<Navigate to="/vendedor/productos" replace />} />

            {/* Página de Acceso Denegado para vendedor */}
            <Route path="acceso-denegado" element={<LazyWrapper><VendedorAccessDenied /></LazyWrapper>} />

            {/* PRODUCTOS - Vendedor solo puede VER */}
            <Route path="productos" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_VIEW}>
                <LazyWrapper><ProductosList /></LazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="productos/destacados" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_VIEW}>
                <LazyWrapper><ProductosDestacados /></LazyWrapper>
              </ProtectedRoute>
            } />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
