import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { useCreateCategory } from '../../../hooks/useCategories';
import { validateCategoryName, getCategoryFormError } from '../../../utils/categoryForm';

const CategoriasCreate = () => {
  const navigate = useNavigate();
  const createMutation = useCreateCategory();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const nameError = validateCategoryName(formData.name);
    if (nameError) {
      setError(nameError);
      return;
    }

    const payload = {
      Name: formData.name.trim(),
      Description: formData.description?.trim() || null
    };
    
    createMutation.mutate(payload, {
      onSuccess: () => {
        navigate('/admin/categorias');
      },
      onError: (err) => {
        setError(getCategoryFormError(err, 'No se pudo crear la categoría.'));
      },
    });
  };

  const loading = createMutation.isPending;

  return (
    <div className="p-4 ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Crear Categoría
        </h1>
        <p className="text-slate-500 text-sm mt-1">Registrar nueva categoría de productos</p>
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
            <ErrorAlert error={error} onClose={clearError} title="No se pudo guardar" />
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
              placeholder="Ej: Repuestos de Motor"
              required
            />
            <p className="mt-2 text-xs text-slate-500">
              Usa un nombre con letras, de al menos 3 caracteres. Ejemplo: Motor, Frenos. No sirve solo un número.
            </p>
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
              placeholder="Descripción opcional de la categoría..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-[#F5C344] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#eab308] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Categoría'}
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

export default CategoriasCreate;
