import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { useBrand, useUpdateBrand } from '../../../hooks/useBrands';

const NombreMarcaEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { data: marca, isLoading: loadingData, error: queryError } = useBrand(id);
  const updateMutation = useUpdateBrand();
  
  const [formData, setFormData] = useState({
    nombre: '',
    isActive: true,
  });
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  // Poblar formulario cuando carga la marca
  useEffect(() => {
    if (marca) {
      setFormData({
        nombre: marca.nombre || '',
        isActive: marca.isActive ?? true,
      });
    }
  }, [marca]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.nombre.trim()) {
      setError('El nombre de la marca es obligatorio');
      return;
    }

    const payload = {
      Nombre: formData.nombre.trim(),
      IsActive: formData.isActive
    };
    
    updateMutation.mutate(
      { id, brandData: payload },
      {
        onSuccess: () => {
          navigate('/admin/nombre-marca');
        },
        onError: (err) => {
          setError(err.response?.data?.message || 'Error al actualizar la marca');
        },
      }
    );
  };

  const loading = loadingData;
  const saving = updateMutation.isPending;
  const displayError = error || (queryError ? 'Error al cargar la marca' : null);

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="bg-white border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Editar Nombre Marca
        </h1>
        <p className="text-slate-500 text-sm mt-1">Modificar información de la marca</p>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
            Datos de la Marca
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {displayError && (
            <ErrorAlert error={displayError} onClose={clearError} title="Error de Validación" />
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nombre Marca <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
              placeholder="Ej: Bosch, NGK, etc."
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700">
              Marca activa
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-[#F5C344] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#eab308] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Actualizar Marca'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/nombre-marca')}
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

export default NombreMarcaEdit;
