import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { nombreMarcaService } from '../../../services/productService';
import { ErrorAlert, ConfirmModal } from '../../../components/common';
import { useNotification } from '../../../context/NotificationContext';

const NombreMarcaList = () => {
  const { error: showErrorNotif } = useNotification();
  const [nombreMarcas, setNombreMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, nombre: '' });

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    loadNombreMarcas();
  }, []);

  const loadNombreMarcas = async () => {
    try {
      setLoading(true);
      const data = await nombreMarcaService.getAllNombreMarcas();
      setNombreMarcas(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar marcas:', err);
      setError('Error al cargar las marcas. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    setConfirmDelete({ isOpen: true, id, nombre });
  };

  const confirmDeleteAction = async () => {
    try {
      await nombreMarcaService.deleteNombreMarca(confirmDelete.id);
      showErrorNotif('Marca eliminada exitosamente');
      await loadNombreMarcas();
    } catch (err) {
      console.error('Error al eliminar marca:', err);
      setError('Error al eliminar la marca.');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            Nombre Marca
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestión de marcas de productos</p>
        </div>
        <Link 
          to="/admin/nombre-marca/crear"
          className="flex items-center gap-2 px-6 py-3 bg-[#F5C344] text-black hover:bg-[#eab308] transition-colors text-sm font-bold uppercase tracking-wide shadow-sm border border-yellow-500/20"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          NUEVA MARCA
        </Link>
      </div>

      {/* Error */}
      {error && (
        <ErrorAlert error={error} onClose={clearError} title="Error" />
      )}

      {/* Tabla */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100 text-xs uppercase tracking-wider">
                <th className="p-4 py-3 font-bold text-slate-500 w-20">ID</th>
                <th className="p-4 py-3 font-bold text-slate-500">Nombre Marca</th>
                <th className="p-4 py-3 font-bold text-slate-500 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {nombreMarcas.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500">
                    No hay marcas registradas
                  </td>
                </tr>
              ) : (
                nombreMarcas.map((marca) => (
                  <tr key={marca.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4 py-3 font-mono text-xs text-slate-500">
                      #{marca.id}
                    </td>
                    <td className="p-4 py-3">
                      <span className="text-sm text-slate-900 font-bold">
                        {marca.nombre}
                      </span>
                    </td>
                    <td className="p-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          to={`/admin/nombre-marca/editar/${marca.id}`}
                          className="p-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-slate-400 transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button 
                          onClick={() => handleDelete(marca.id, marca.nombre)}
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
            {nombreMarcas.length} marcas registradas
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, nombre: '' })}
        onConfirm={confirmDeleteAction}
        title="Confirmar eliminación"
        message={`¿Estás seguro de eliminar la marca "${confirmDelete.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default NombreMarcaList;
