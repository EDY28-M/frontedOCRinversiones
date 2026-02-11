import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ErrorAlert, ConfirmModal, PageLoader } from '../../../components/common';
import { useCategories, useDeleteCategory, useDeleteAllCategories } from '../../../hooks/useCategories';

const CategoriasList = () => {
  const { data: categorias = [], isLoading: loading, error: queryError } = useCategories();
  const deleteMutation = useDeleteCategory();
  const deleteAllMutation = useDeleteAllCategories();

  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, nombre: '' });
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const handleDelete = async (id, nombre) => {
    setConfirmDelete({ isOpen: true, id, nombre });
  };

  const confirmDeleteAction = async () => {
    deleteMutation.mutate(confirmDelete.id);
    setConfirmDelete({ isOpen: false, id: null, nombre: '' });
  };

  const displayError = error || (queryError ? 'Error al cargar categorías. Verifica que el backend esté corriendo.' : null);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-4 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            Categorías
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestión de categorías de productos</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setConfirmDeleteAll(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-bold uppercase tracking-wide shadow-sm border border-red-500/20"
          >
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            ELIMINAR TODO
          </button>
          <Link
            to="/admin/categorias/crear"
            className="flex items-center gap-2 px-6 py-3 bg-[#F5C344] text-black hover:bg-[#eab308] transition-colors text-sm font-bold uppercase tracking-wide shadow-sm border border-yellow-500/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            NUEVA CATEGORÍA
          </Link>
        </div>
      </div>

      {/* Error */}
      {displayError && (
        <ErrorAlert error={displayError} onClose={clearError} title="Error" />
      )}

      {/* Tabla */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100 text-xs uppercase tracking-wider">
                <th className="p-4 py-3 font-bold text-slate-500 w-20">ID</th>
                <th className="p-4 py-3 font-bold text-slate-500">Nombre</th>
                <th className="p-4 py-3 font-bold text-slate-500">Descripción</th>
                <th className="p-4 py-3 font-bold text-slate-500 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No hay categorías registradas
                  </td>
                </tr>
              ) : (
                categorias.map((categoria) => (
                  <tr key={categoria.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4 py-3 font-mono text-xs text-slate-500">
                      #{categoria.id}
                    </td>
                    <td className="p-4 py-3">
                      <span className="text-sm text-slate-900 font-bold">
                        {categoria.name}
                      </span>
                    </td>
                    <td className="p-4 py-3 text-sm text-slate-600">
                      {categoria.description || 'Sin descripción'}
                    </td>
                    <td className="p-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/categorias/editar/${categoria.id}`}
                          className="p-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-slate-400 transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(categoria.id, categoria.name)}
                          className="p-2 bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 text-slate-400 transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="material-symbols-outlined text-[16px]">info</span>
            {categorias.length} categorías registradas
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, nombre: '' })}
        onConfirm={confirmDeleteAction}
        title="Confirmar eliminación"
        message={`¿Estás seguro de eliminar la categoría "${confirmDelete.nombre}"? Esta acción no se puede deshacer.`}
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
        title="PELIGRO: Eliminar TODAS las categorías"
        message="¿Estás completamente seguro de que quieres ELIMINAR TODAS LAS CATEGORÍAS? Esta acción es IRREVERSIBLE y podría dejar productos sin categoría."
        confirmText="SÍ, ELIMINAR TODO"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>

  );
};

export default CategoriasList;
