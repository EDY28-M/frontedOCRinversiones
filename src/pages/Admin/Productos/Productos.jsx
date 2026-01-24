import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService, nombreMarcaService } from '../../../services/productService';
import { ErrorAlert, ConfirmModal, ImportProductsModal } from '../../../components/common';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';
import { useNotification } from '../../../context/NotificationContext';

const Productos = () => {
  const { can } = usePermissions();
  const { error: showErrorNotif } = useNotification();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, descripcion: '' });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [marcas, setMarcas] = useState([]);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Función para limpiar error - solo por acción del usuario
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategoriesAndMarcas();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // NO limpiar el error aquí - solo si la carga es exitosa
      const data = await productService.getAllProducts();
      setProductos(data);
      // Solo limpiar error si la carga fue exitosa
      setError(null);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar productos. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleImportSuccess = () => {
    loadProducts();
  };

  const handleDelete = async (id, descripcion) => {
    setConfirmDelete({ isOpen: true, id, descripcion });
  };

  const confirmDeleteAction = async () => {
    try {
      await productService.deleteProduct(confirmDelete.id);
      showErrorNotif('Producto eliminado exitosamente');
      await loadProducts();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('Error al eliminar el producto');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      // Obtener el producto actual
      const product = productos.find(p => p.id === id);
      if (!product) return;

      // Actualizar solo el campo IsActive
      await productService.updateProduct(id, {
        ...product,
        isActive: !currentStatus
      });
      
      await loadProducts();
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      alert('Error al actualizar el estado del producto');
    }
  };

  const filteredProducts = productos.filter(producto => {
    // Filtro por estado (todos/publicados/borradores)
    if (filtroActivo === 'publicados' && !producto.isActive) return false;
    if (filtroActivo === 'borradores' && producto.isActive) return false;
    
    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      
      // Buscar en Código
      const matchCodigo = producto.codigo?.toString().toLowerCase().includes(term);
      
      // Buscar en Código Comercial
      const matchCodigoComer = producto.codigoComer?.toString().toLowerCase().includes(term);
      
      // Buscar en Producto (nombre/descripción)
      const matchProducto = producto.producto?.toLowerCase().includes(term);
      
      // Buscar en Marca
      const matchMarca = producto.marcaNombre?.toLowerCase().includes(term);
      
      // Buscar en Categoría
      const matchCategoria = producto.categoryName?.toLowerCase().includes(term);
      
      // Si no coincide con ninguno, excluir el producto
      if (!matchCodigo && !matchCodigoComer && !matchProducto && !matchMarca && !matchCategoria) {
        return false;
      }
    }
    
    return true;
  });

  // Productos paginados
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset página al cambiar filtro o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [filtroActivo, pageSize, searchTerm]);

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
    return null;
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
          onClick={loadProducts}
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white border border-gray-200 shadow-sm flex flex-col">
        {/* Filtros */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFiltroActivo('todos')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                filtroActivo === 'todos'
                  ? 'text-blue-700 bg-blue-50 border border-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100 border border-transparent'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroActivo('publicados')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                filtroActivo === 'publicados'
                  ? 'text-blue-700 bg-blue-50 border border-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100 border border-transparent'
              }`}
            >
              Publicados
            </button>
            <button
              onClick={() => setFiltroActivo('borradores')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                filtroActivo === 'borradores'
                  ? 'text-blue-700 bg-blue-50 border border-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100 border border-transparent'
              }`}
            >
              Borradores
            </button>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            MOSTRANDO {filteredProducts.length} DE {productos.length}
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
                <th className="p-4 py-3 font-bold text-slate-500 text-center w-32">Activo</th>
                <th className="p-4 py-3 font-bold text-slate-500 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
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
                    <td className="p-4 py-3 text-center align-middle">
                      {can(PERMISSIONS.PRODUCTOS_EDIT) ? (
                        <input
                          type="checkbox"
                          className="sharp-switch"
                          checked={producto.isActive}
                          onChange={() => handleToggleActive(producto.id, producto.isActive)}
                        />
                      ) : (
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${producto.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {producto.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      )}
                    </td>
                    <td className="p-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {can(PERMISSIONS.PRODUCTOS_EDIT) && (
                          <Link 
                            to={`/admin/productos/editar/${producto.id}`}
                            className="p-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-slate-400 transition-colors shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                        )}
                        {can(PERMISSIONS.PRODUCTOS_DELETE) && (
                          <button 
                            onClick={() => handleDelete(producto.id, producto.marca)}
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
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-blue-600 bg-blue-600 text-white text-xs font-mono font-bold">
              {currentPage}
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-100 text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
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
