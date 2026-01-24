import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { useCategory, useUpdateCategory } from '../../../hooks/useCategories';

const CategoriasEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { data: categoria, isLoading: loadingData, error: queryError } = useCategory(id);
  const updateMutation = useUpdateCategory();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  // Poblar formulario cuando carga la categoría
  useEffect(() => {
    if (categoria) {
      setFormData({
        name: categoria.name || '',
        description: categoria.description || '',
      });
    }
  }, [categoria]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    updateMutation.mutate(
      { id, categoryData: formData },
      {
        onSuccess: () => {
          navigate('/admin/categorias');
        },
        onError: (err) => {
          setError(err.response?.data?.message || 'Error al actualizar la categoría');
        },
      }
    );
  };

  const loading = loadingData;
  const saving = updateMutation.isPending;
  const displayError = error || (queryError ? 'Error al cargar la categoría' : null);

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="bg-white border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Editar Categoría
        </h1>
        <p className="text-slate-500 text-sm mt-1">Modificar datos de la categoría</p>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
            Datos de la Categoría
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {displayError && (
            <ErrorAlert error={displayError} onClose={clearError} title="Error" />
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-sm font-semibold resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-blue-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Actualizar Categoría'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/categorias')}
              className="px-8 py-4 bg-gray-200 text-gray-700 font-bold text-sm uppercase tracking-widest hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriasEdit;
