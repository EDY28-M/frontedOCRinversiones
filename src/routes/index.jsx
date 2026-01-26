import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { PERMISSIONS } from '../utils/permissions';

// Layouts
import PublicLayout from '../layouts/PublicLayout/PublicLayout';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';
import VendedorLayout from '../layouts/VendedorLayout/VendedorLayout';

// Public Pages
import Inicio from '../pages/Public/Inicio/Inicio';
import Productos from '../pages/Public/Productos/Productos';
import Servicios from '../pages/Public/Servicios/Servicios';
import Nosotros from '../pages/Public/Nosotros/Nosotros';
import Home from '../pages/Public/Home/Home';
import About from '../pages/Public/About/About';
import Contact from '../pages/Public/Contact/Contact';

// Admin Pages
import AdminLogin from '../pages/Admin/Login/Login';
import AccessDenied from '../pages/Admin/AccessDenied/AccessDenied';
import DashboardRedirect from '../pages/Admin/Dashboard/DashboardRedirect';

// Vendedor Pages
import VendedorAccessDenied from '../pages/Vendedor/VendedorAccessDenied';

// Productos
import ProductosList from '../pages/Admin/Productos/Productos';
import ProductosCreate from '../pages/Admin/Productos/ProductosCreate';
import ProductosEdit from '../pages/Admin/Productos/ProductosEdit';
import ProductosDestacados from '../pages/Admin/ProductosDestacados/ProductosDestacados';

// Categorías
import CategoriasList from '../pages/Admin/Categorias/CategoriasList';
import CategoriasCreate from '../pages/Admin/Categorias/CategoriasCreate';
import CategoriasEdit from '../pages/Admin/Categorias/CategoriasEdit';

// Nombre Marca
import NombreMarcaList from '../pages/Admin/NombreMarca/NombreMarcaList';
import NombreMarcaCreate from '../pages/Admin/NombreMarca/NombreMarcaCreate';
import NombreMarcaEdit from '../pages/Admin/NombreMarca/NombreMarcaEdit';

// Usuarios
import UsuariosList from '../pages/Admin/Usuarios/UsuariosList';
import UsuariosCreate from '../pages/Admin/Usuarios/UsuariosCreate';
import UsuariosEdit from '../pages/Admin/Usuarios/UsuariosEdit';

// Private Route Component for Admin
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================
            RUTAS PÚBLICAS - Diseño Pixel-Perfect
            Sin layout wrapper (cada página tiene header/footer propio)
            ======================================== */}
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/nosotros" element={<Nosotros />} />

        {/* Rutas legacy con PublicLayout (contacto usa el diseño antiguo) */}
        <Route element={<PublicLayout />}>
          <Route path="contacto" element={<Contact />} />
        </Route>

        {/* LOGIN ROUTE */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN ROUTES - Solo para Administradores */}
        <Route path="/admin">
          {/* Admin Protected Routes (con layout) - SOLO ADMIN */}
          <Route
            element={
              <PrivateRoute>
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              </PrivateRoute>
            }
          >
            {/* Redirección dinámica según rol del usuario */}
            <Route index element={<DashboardRedirect />} />
            
            {/* Página de Acceso Denegado dentro del layout */}
            <Route path="acceso-denegado" element={<AccessDenied />} />

            {/* PRODUCTOS - Admin tiene acceso completo */}
            <Route path="productos" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_VIEW}>
                <ProductosList />
              </ProtectedRoute>
            } />
            <Route path="productos/destacados" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_VIEW}>
                <ProductosDestacados />
              </ProtectedRoute>
            } />
            <Route path="productos/crear" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_CREATE}>
                <ProductosCreate />
              </ProtectedRoute>
            } />
            <Route path="productos/editar/:id" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_EDIT}>
                <ProductosEdit />
              </ProtectedRoute>
            } />
            
            {/* CATEGORÍAS - Solo Administrador */}
            <Route path="categorias" element={
              <ProtectedRoute permission={PERMISSIONS.CATEGORIAS_VIEW}>
                <CategoriasList />
              </ProtectedRoute>
            } />
            <Route path="categorias/crear" element={
              <ProtectedRoute permission={PERMISSIONS.CATEGORIAS_CREATE}>
                <CategoriasCreate />
              </ProtectedRoute>
            } />
            <Route path="categorias/editar/:id" element={
              <ProtectedRoute permission={PERMISSIONS.CATEGORIAS_EDIT}>
                <CategoriasEdit />
              </ProtectedRoute>
            } />
            
            {/* NOMBRE MARCA - Solo Administrador */}
            <Route path="nombre-marca" element={
              <ProtectedRoute permission={PERMISSIONS.MARCAS_VIEW}>
                <NombreMarcaList />
              </ProtectedRoute>
            } />
            <Route path="nombre-marca/crear" element={
              <ProtectedRoute permission={PERMISSIONS.MARCAS_CREATE}>
                <NombreMarcaCreate />
              </ProtectedRoute>
            } />
            <Route path="nombre-marca/editar/:id" element={
              <ProtectedRoute permission={PERMISSIONS.MARCAS_EDIT}>
                <NombreMarcaEdit />
              </ProtectedRoute>
            } />
            
            {/* USUARIOS - Solo Administrador */}
            <Route path="usuarios" element={
              <ProtectedRoute permission={PERMISSIONS.USUARIOS_VIEW}>
                <UsuariosList />
              </ProtectedRoute>
            } />
            <Route path="usuarios/crear" element={
              <ProtectedRoute permission={PERMISSIONS.USUARIOS_CREATE}>
                <UsuariosCreate />
              </ProtectedRoute>
            } />
            <Route path="usuarios/editar/:id" element={
              <ProtectedRoute permission={PERMISSIONS.USUARIOS_EDIT}>
                <UsuariosEdit />
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
                  <VendedorLayout />
                </ProtectedRoute>
              </PrivateRoute>
            }
          >
            {/* Redirección por defecto a productos */}
            <Route index element={<Navigate to="/vendedor/productos" replace />} />
            
            {/* Página de Acceso Denegado para vendedor */}
            <Route path="acceso-denegado" element={<VendedorAccessDenied />} />
            
            {/* PRODUCTOS - Vendedor solo puede VER */}
            <Route path="productos" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_VIEW}>
                <ProductosList />
              </ProtectedRoute>
            } />
            <Route path="productos/destacados" element={
              <ProtectedRoute permission={PERMISSIONS.PRODUCTOS_VIEW}>
                <ProductosDestacados />
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
