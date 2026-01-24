import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ErrorAlert, ConfirmModal } from '../../../components/common';
import { useUsers, useDeleteUser } from '../../../hooks/useUsers';

const UsuariosList = () => {
  const { data: usuarios = [], isLoading: loading, error: queryError } = useUsers();
  const deleteMutation = useDeleteUser();
  
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, username: '' });
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const handleDelete = async (id, username) => {
    setConfirmDelete({ isOpen: true, id, username });
  };

  const confirmDeleteAction = async () => {
    deleteMutation.mutate(confirmDelete.id);
    setConfirmDelete({ isOpen: false, id: null, username: '' });
  };

  const displayError = error || (queryError ? 'Error al cargar usuarios. Verifica que el backend esté corriendo.' : null);

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            Usuarios
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestión de usuarios del sistema</p>
        </div>
        <Link 
          to="/admin/usuarios/crear"
          className="flex items-center gap-2 px-6 py-3 bg-[#F5C344] text-black hover:bg-[#eab308] transition-colors text-sm font-bold uppercase tracking-wide shadow-sm border border-yellow-500/20"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          NUEVO USUARIO
        </Link>
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
                <th className="p-4 py-3 font-bold text-slate-500">Usuario</th>
                <th className="p-4 py-3 font-bold text-slate-500">Email</th>
                <th className="p-4 py-3 font-bold text-slate-500 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4 py-3 font-mono text-xs text-slate-500">
                      #{usuario.id}
                    </td>
                    <td className="p-4 py-3">
                      <span className="text-sm text-slate-900 font-bold">
                        {usuario.username}
                      </span>
                    </td>
                    <td className="p-4 py-3 text-sm text-slate-600">
                      {usuario.email || 'Sin email'}
                    </td>
                    <td className="p-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          to={`/admin/usuarios/editar/${usuario.id}`}
                          className="p-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-slate-400 transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button 
                          onClick={() => handleDelete(usuario.id, usuario.username)}
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
            {usuarios.length} usuarios registrados
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, username: '' })}
        onConfirm={confirmDeleteAction}
        title="Confirmar eliminación"
        message={`¿Estás seguro de eliminar al usuario "${confirmDelete.username}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default UsuariosList;
