import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryService } from '../../../services/productService';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { useNotification } from '../../../context/NotificationContext';

const CategoriasEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { info } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    loadCategoria();
  }, [id]);

  const loadCategoria = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategoryById(id);
      setFormData({
        name: data.name || '',
        description: data.description || '',
      });
      setError(null);
    } catch (err) {
      console.error('Error al cargar categoría:', err);
      setError('Error al cargar la categoría');
    } finally {
      setLoading(false);
    }
  };

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

    try {
      setSaving(true);
      await categoryService.updateCategory(id, formData);
      info('Categoría actualizada exitosamente');
      navigate('/admin/categorias');
    } catch (err) {
      console.error('Error al actualizar categoría:', err);
      setError(err.response?.data?.message || 'Error al actualizar la categoría');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Editar Categoría
        </h1>
        <p className="text-slate-500 text-sm mt-1">Modificar datos de la categoría #{id}</p>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
            Datos de la Categoría
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <ErrorAlert error={error} onClose={clearError} title="Error" />
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
