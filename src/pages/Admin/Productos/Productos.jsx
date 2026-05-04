import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { categoryService, nombreMarcaService } from '../../../services/productService';
import { ErrorAlert, ConfirmModal, ImportProductsModal } from '../../../components/common';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';
import { useProducts, useToggleProductActive, useToggleProductFeatured, useDeleteProduct, useDeleteAllProducts, usePrefetchProduct, productKeys } from '../../../hooks/useProducts';
import { categoryKeys } from '../../../hooks/useCategories';
import { brandKeys } from '../../../hooks/useBrands';
import RecentProductsPanel from '../../../components/products/RecentProductsPanel';
import PageLoader from '../../../components/common/PageLoader';

const Productos = () => {
  const { can } = usePermissions();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // React Query hooks
  const { data: productos = [], isLoading: loading, error: queryError, refetch } = useProducts();
  const toggleActiveMutation = useToggleProductActive();
  const toggleFeaturedMutation = useToggleProductFeatured();
  const deleteMutation = useDeleteProduct();
  const deleteAllMutation = useDeleteAllProducts();
  const prefetchProduct = usePrefetchProduct();
  const error = queryError?.message || (queryError ? 'Error al cargar productos. Verifica que el backend esté corriendo.' : null);

  // const [filtroActivo, setFiltroActivo] = useState('todos'); // Moved to URL params
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, descripcion: '' });
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [marcas, setMarcas] = useState([]);

  // Track qué filas están en proceso de toggle
  const [togglingRows, setTogglingRows] = useState(new Set());
  const [togglingFeaturedRows, setTogglingFeaturedRows] = useState(new Set());

  // Paginación y Estado desde URL
  const pageParam = parseInt(searchParams.get('page'), 10);
  const currentPage = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;
  const filtroActivo = searchParams.get('filter') || 'todos';
  const searchTerm = searchParams.get('search') || '';

  const [pageSize, setPageSize] = useState(7);

  const setCurrentPage = (page) => {
    setSearchParams(prev => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  const handleSetFilter = (filter) => {
    setSearchParams(prev => {
      prev.set('filter', filter);
      prev.set('page', '1'); // Reset to page 1
      return prev;
    });
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchParams(prev => {
      if (term) prev.set('search', term);
      else prev.delete('search');
      prev.set('page', '1'); // Reset to page 1
      return prev;
    });
  };

  // Estado para búsqueda
  // Estado para búsqueda (Moved to URL)

  const filteredProducts = useMemo(() => productos.filter(producto => {
    // Helper: Verificar si tiene imágenes
    const hasImages = producto.imagenPrincipal || producto.imagen2 || producto.imagen3 || producto.imagen4;

    // Filtro por estado
    if (filtroActivo === 'publicar') {
      // PUBLICAR: Solo productos con imágenes (listos para publicar)
      if (!hasImages) return false;
    } else if (filtroActivo === 'borradores') {
      // BORRADORES: Solo productos SIN imágenes
      if (hasImages) return false;
    }
    // 'todos' no filtra nada

    // Filtro por búsqueda inteligente (AND por cada palabra)
    if (searchTerm) {
      const tokens = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);

      // Cada token debe coincidir en al menos un campo (AND entre tokens)
      const allTokensMatch = tokens.every(token => {
        const matchCodigo = producto.codigo?.toString().toLowerCase().includes(token);
        const matchCodigoComer = producto.codigoComer?.toString().toLowerCase().includes(token);
        const matchProducto = producto.producto?.toLowerCase().includes(token);
        const matchMarca = producto.marcaNombre?.toLowerCase().includes(token);
        const matchCategoria = producto.categoryName?.toLowerCase().includes(token) ||
          producto.categoria?.toLowerCase().includes(token) ||
          producto.category?.nombre?.toLowerCase().includes(token) ||
          producto.category?.toLowerCase().includes(token);

        return matchCodigo || matchCodigoComer || matchProducto || matchMarca || matchCategoria;
      });

      if (!allTokensMatch) return false;
    }

    return true;
  }), [productos, filtroActivo, searchTerm]);

  // Contadores solo de productos CON imagen (visible en tab Publicar)
  const { productosPublicadosCount, productosNoPublicadosCount } = useMemo(() => {
    const conImagen = productos.filter(p =>
      p.imagenPrincipal || p.imagen2 || p.imagen3 || p.imagen4
    );
    const publicados = conImagen.filter(p => p.isActive).length;
    const noPublicados = conImagen.filter(p => !p.isActive).length;
    return { productosPublicadosCount: publicados, productosNoPublicadosCount: noPublicados };
  }, [productos]);

  // Productos paginados
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  // Asegurar que currentPage sea válido si los filtros cambiaron el total
  useEffect(() => {
    // Si la página actual es mayor al total de páginas (y hay páginas), ir a la última
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    // OPTIONAL: Si no hay resultados (totalPages=0) y estamos en página > 1, volver a 1
    // Esto evita mostrar "Página 5 de 1" vacío
    if (totalPages === 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset página auto-handled by bounds check and setters

  // Función para limpiar error - solo por acción del usuario
  const clearError = useCallback(() => {
    queryClient.resetQueries({ queryKey: productKeys.all });
  }, [queryClient]);

  const loadCategoriesAndMarcas = async () => {
    try {
      const [categoriesData, marcasData] = await Promise.all([
        categoryService.getAllCategories(),
        nombreMarcaService.getAllNombreMarcas()
      ]);
      setCategories(categoriesData);
      setMarcas(marcasData);
    } catch (err) {
      console.error('Error al cargar categorías/marcas:', err);
    }
  };

  useEffect(() => {
    loadCategoriesAndMarcas();
  }, []);

  const handleImportSuccess = () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
    queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    queryClient.invalidateQueries({ queryKey: brandKeys.all });
    loadCategoriesAndMarcas();
  };

  const handleDelete = async (id, descripcion) => {
    setConfirmDelete({ isOpen: true, id, descripcion });
  };

  const confirmDeleteAction = async () => {
    deleteMutation.mutate(confirmDelete.id);
    setConfirmDelete({ isOpen: false, id: null, descripcion: '' });
  };

  // Toggle con optimistic update
  const handleToggleActive = useCallback((e, id, currentStatus) => {
    e.preventDefault();
    e.stopPropagation();

    const product = productos.find(p => p.id === id);
    if (!product) return;

    setTogglingRows(prev => new Set(prev).add(id));

    toggleActiveMutation.mutate(
      { productId: id, product, newActiveState: !currentStatus },
      {
        onSettled: () => {
          setTogglingRows(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      }
    );
  }, [productos, toggleActiveMutation]);

  const handleToggleFeatured = useCallback((e, id, currentStatus) => {
    e.preventDefault();
    e.stopPropagation();

    const product = productos.find(p => p.id === id);
    if (!product) return;

    setTogglingFeaturedRows(prev => new Set(prev).add(id));

    toggleFeaturedMutation.mutate(
      { productId: id, product, newFeaturedState: !currentStatus },
      {
        onSettled: () => {
          setTogglingFeaturedRows(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      }
    );
  }, [productos, toggleFeaturedMutation]);

  const getIconForCategory = (categoryName) => {
    const icons = {
      'Maquinaria': 'precision_manufacturing',
      'Repuestos': 'settings_input_component',
      'Energía': 'bolt',
      'Agricultura': 'agriculture',
    };
    return icons[categoryName] || 'inventory_2';
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorAlert
          error={error}
          onClose={clearError}
          title="Error de Carga"
        />
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            Productos
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestión de inventario de productos</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Botón Eliminar Todo - Solo Admin */}
          {can(PERMISSIONS.PRODUCTOS_DELETE) && (
            <button
              onClick={() => setConfirmDeleteAll(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-bold uppercase tracking-wide shadow-sm border border-red-500/20"
            >
              <span className="material-symbols-outlined text-[20px]">delete_forever</span>
              ELIMINAR TODO
            </button>
          )}
          {/* Botón Importar - Solo Admin */}
          {can(PERMISSIONS.PRODUCTOS_CREATE) && (
            <button
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-bold uppercase tracking-wide shadow-sm border border-blue-500/20"
            >
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
              IMPORTAR
            </button>
          )}
          {/* Botón Nuevo Producto - Solo Admin */}
          {can(PERMISSIONS.PRODUCTOS_CREATE) && (
            <Link
              to="/admin/productos/crear"
              className="flex items-center gap-2 px-6 py-3 bg-[#F5C344] text-black hover:bg-[#eab308] transition-colors text-sm font-bold uppercase tracking-wide shadow-sm border border-yellow-500/20"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              NUEVO PRODUCTO
            </Link>
          )}
        </div>
      </div>

      {/* Historial de productos recientes */}
      <RecentProductsPanel />

      {/* Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="bg-white border border-gray-300 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3 placeholder-slate-400 transition-all font-mono shadow-sm"
            placeholder="BUSCAR CÓDIGO, SKU, PRODUCTO, MARCA, CATEGORÍA..."
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white border border-gray-200 shadow-sm flex flex-col">
        {/* Filtros */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSetFilter('todos')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${filtroActivo === 'todos'
                ? 'text-blue-700 bg-blue-50 border border-blue-100'
                : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100 border border-transparent'
                }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleSetFilter('publicar')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${filtroActivo === 'publicar'
                ? 'text-green-700 bg-green-50 border border-green-100'
                : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100 border border-transparent'
                }`}
            >
              Publicar
            </button>
            <button
              onClick={() => handleSetFilter('borradores')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${filtroActivo === 'borradores'
                ? 'text-orange-700 bg-orange-50 border border-orange-100'
                : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100 border border-transparent'
                }`}
            >
              Borradores
            </button>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {filtroActivo === 'publicar' && (
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded text-xs font-bold uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[14px]">public</span>
                  Publicados: {productosPublicadosCount}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded text-xs font-bold uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                  No publicados: {productosNoPublicadosCount}
                </span>
              </>
            )}
            <div className="text-xs text-slate-400 font-mono">
              {filteredProducts.length > 0 ? (
                <>MOSTRANDO {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredProducts.length)} DE {filteredProducts.length}</>
              ) : (
                <>MOSTRANDO 0 PRODUCTOS</>
              )}
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100 text-xs uppercase tracking-wider">
                <th className="p-4 py-3 font-bold text-yellow-700 font-mono w-40">Código</th>
                <th className="p-4 py-3 font-bold text-yellow-700 font-mono w-48">Código Comer.</th>
                <th className="p-4 py-3 font-bold text-slate-500">Producto</th>
                <th className="p-4 py-3 font-bold text-slate-500">Marca</th>
                <th className="p-4 py-3 font-bold text-slate-500 text-center w-48">Categoría</th>
                {filtroActivo === 'publicar' && (
                  <th className="p-4 py-3 font-bold text-slate-500 text-center w-32">Activo</th>
                )}
                {filtroActivo === 'publicar' && (
                  <th className="p-4 py-3 font-bold text-slate-500 text-center w-40">Destacado</th>
                )}
                <th className="p-4 py-3 font-bold text-slate-500 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={filtroActivo === 'publicar' ? "8" : "6"} className="p-8 text-center text-slate-500">
                    No hay productos para mostrar
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((producto) => (
                  <tr key={producto.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4 py-3 font-mono text-xs text-slate-900 font-medium">
                      {producto.codigo || 'N/A'}
                    </td>
                    <td className="p-4 py-3 font-mono text-xs text-slate-500">
                      {producto.codigoComer || 'N/A'}
                    </td>
                    <td className="p-4 py-3">
                      <span className="text-sm text-slate-900 font-semibold">
                        {producto.producto || 'Sin nombre'}
                      </span>
                    </td>
                    <td className="p-4 py-3">
                      <span className="text-sm text-slate-600">
                        {producto.marcaNombre || 'Sin marca'}
                      </span>
                    </td>
                    <td className="p-4 py-3 text-center">
                      <span className="text-xs text-slate-500">
                        {producto.categoryName || 'Sin categoría'}
                      </span>
                    </td>
                    {filtroActivo === 'publicar' && (
                      <td className="p-4 py-3 text-center align-middle">
                        {can(PERMISSIONS.PRODUCTOS_EDIT) ? (
                          <div className="relative inline-flex items-center">
                            <input
                              type="checkbox"
                              className="sharp-switch"
                              checked={producto.isActive}
                              disabled={togglingRows.has(producto.id)}
                              onChange={(e) => handleToggleActive(e, producto.id, producto.isActive)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            {togglingRows.has(producto.id) && (
                              <span className="absolute -right-5 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                            )}
                          </div>
                        ) : (
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${producto.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {producto.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        )}
                      </td>
                    )}
                    {filtroActivo === 'publicar' && (
                      <td className="p-4 py-3 text-center align-middle">
                        {can(PERMISSIONS.PRODUCTOS_EDIT) ? (
                          <div className="relative inline-flex items-center">
                            <input
                              type="checkbox"
                              className="sharp-switch"
                              checked={Boolean(producto.isFeatured)}
                              disabled={togglingFeaturedRows.has(producto.id)}
                              onChange={(e) => handleToggleFeatured(e, producto.id, Boolean(producto.isFeatured))}
                              onClick={(e) => e.stopPropagation()}
                            />
                            {togglingFeaturedRows.has(producto.id) && (
                              <span className="absolute -right-5 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                            )}
                          </div>
                        ) : (
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${producto.isFeatured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                            {producto.isFeatured ? 'Destacado' : 'Normal'}
                          </span>
                        )}
                      </td>
                    )}
                    <td className="p-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {can(PERMISSIONS.PRODUCTOS_EDIT) && (
                          <Link
                            to={`/admin/productos/editar/${producto.id}`}
                            state={{ max: searchParams.toString() }}
                            className="p-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-slate-400 transition-colors shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={() => prefetchProduct(producto.id)}
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                        )}
                        {can(PERMISSIONS.PRODUCTOS_DELETE) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(producto.id, producto.marca);
                            }}
                            className="p-2 bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 text-slate-400 transition-colors shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                        {!can(PERMISSIONS.PRODUCTOS_EDIT) && !can(PERMISSIONS.PRODUCTOS_DELETE) && (
                          <span className="text-xs text-slate-400 italic">Solo lectura</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer de la Tabla */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="material-symbols-outlined text-[16px]">info</span>
              {filteredProducts.length} productos
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Mostrar:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="p-1 px-2 border border-gray-300 bg-white text-xs"
              >
                <option value={7}>7</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Página {currentPage} de {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-blue-600 bg-blue-600 text-white text-xs font-mono font-bold">
              {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, descripcion: '' })}
        onConfirm={confirmDeleteAction}
        title="Confirmar eliminación"
        message={`¿Estás seguro de eliminar el producto "${confirmDelete.descripcion}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Modal de confirmación para ELIMINAR TODO */}
      <ConfirmModal
        isOpen={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        onConfirm={() => {
          deleteAllMutation.mutate();
          setConfirmDeleteAll(false);
        }}
        title="PELIGRO: Eliminar TODOS los productos"
        message="¿Estás completamente seguro de que quieres ELIMINAR TODOS LOS PRODUCTOS de la base de datos? Esta acción es IRREVERSIBLE y borrará todo el inventario."
        confirmText="SÍ, ELIMINAR TODO"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Modal de importación */}
      <ImportProductsModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
        categories={categories}
        marcas={marcas}
      />
    </div>
  );
};

export default Productos;
