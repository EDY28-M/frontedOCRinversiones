import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRecentProducts } from '../../hooks/useProducts';

const LIMIT_OPTIONS = [10, 25, 50, 100];

/**
 * Panel compacto que muestra los últimos productos subidos al sistema.
 * Se ubica entre el título y el buscador en el Listado de Productos.
 */
const RecentProductsPanel = () => {
  const [limit, setLimit] = useState(10);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: recentProducts = [], isLoading, isError, error } = useRecentProducts(limit);

  const formatDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return (dateStr) => {
      try {
        return formatter.format(new Date(dateStr));
      } catch {
        return '—';
      }
    };
  }, []);

  return (
    <div className="mb-6 bg-white border border-gray-200 shadow-sm rounded">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setIsCollapsed((c) => !c)}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-blue-600">schedule</span>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Últimos productos subidos
          </h3>
          <span className="text-[10px] text-slate-400 font-mono ml-1">
            ({recentProducts.length})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Selector de cantidad */}
          {!isCollapsed && (
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <label className="text-[10px] text-slate-400 uppercase tracking-wide">Mostrar:</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="text-xs border border-gray-300 rounded px-1.5 py-0.5 bg-white text-slate-600 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              >
                {LIMIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          {/* Toggle collapse */}
          <span className="material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-200"
            style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
          >
            expand_more
          </span>
        </div>
      </div>

      {/* Body */}
      {!isCollapsed && (
        <div className="max-h-[320px] overflow-y-auto">
          {/* Loading */}
          {isLoading && (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-48 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-28 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="p-3 text-xs text-red-600 bg-red-50 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error?.message || 'Error al cargar productos recientes'}
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && recentProducts.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-400">
              <span className="material-symbols-outlined text-[24px] block mb-1 text-slate-300">inventory_2</span>
              No hay productos recientes
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && recentProducts.length > 0 && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-2 font-semibold">Código</th>
                  <th className="px-4 py-2 font-semibold">Producto</th>
                  <th className="px-4 py-2 font-semibold">Marca</th>
                  <th className="px-4 py-2 font-semibold">Categoría</th>
                  <th className="px-4 py-2 font-semibold">Fecha creación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="px-4 py-1.5">
                      <Link
                        to={`/admin/productos/editar/${product.id}`}
                        className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {product.codigo}
                      </Link>
                    </td>
                    <td className="px-4 py-1.5 text-slate-700 truncate max-w-[280px]" title={product.producto}>
                      <Link
                        to={`/admin/productos/editar/${product.id}`}
                        className="hover:text-blue-700 transition-colors"
                      >
                        {product.producto}
                      </Link>
                    </td>
                    <td className="px-4 py-1.5 text-slate-500">{product.marcaNombre}</td>
                    <td className="px-4 py-1.5">
                      <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                        {product.categoryName}
                      </span>
                    </td>
                    <td className="px-4 py-1.5 text-slate-400 font-mono text-[11px]">
                      {formatDate(product.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentProductsPanel;
