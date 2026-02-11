// Exportaciones centralizadas de componentes comunes
// Facilita imports y permite tree shaking

export { default as ConfirmModal } from './ConfirmModal';
export { default as ErrorAlert } from './ErrorAlert';
export { default as ImageUploader } from './ImageUploader';
export { default as ImportProductsModal } from './ImportProductsModal';
export { default as TableLoader } from './TableLoader';
export { default as MobileMenu } from './MobileMenu';
export { default as NotificationContainer } from './NotificationContainer';
export { default as OptimizedImage } from './OptimizedImage';
export { default as ProtectedRoute } from './ProtectedRoute';
export { default as RoleBasedRoute } from './RoleBasedRoute';

// Re-exportar componentes de productos
export { default as ProductCard } from '../products/ProductCard';
export { default as ProductsGrid } from '../products/ProductsGrid';
export { default as FiltersSidebar } from '../products/FiltersSidebar';
