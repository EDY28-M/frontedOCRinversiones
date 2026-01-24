import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { nombreMarcaService } from '../../../services/productService';
import ErrorAlert from '../../../components/common/ErrorAlert';

const NombreMarcaCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const [loading, setLoading] = useState(false);
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

    if (!formData.nombre.trim()) {
      setError('El nombre de la marca es obligatorio');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        Nombre: formData.nombre.trim()
      };
      
      console.log('📦 Enviando marca:', payload);
      
      await nombreMarcaService.createNombreMarca(payload);
      navigate('/admin/nombre-marca');
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Error response:', err.response);
      
      let errorMessage = 'Error al crear la marca';
      
      if (err.response?.data) {
        if (err.response.data.errors) {
          const errors = Object.values(err.response.data.errors).flat();
          errorMessage = errors.join(', ');
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
          Crear Nombre Marca
        </h1>
        <p className="text-slate-500 text-sm mt-1">Registrar nueva marca de producto</p>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
            Datos de la Marca
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <ErrorAlert error={error} onClose={clearError} title="Error de Validación" />
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

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-[#F5C344] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#eab308] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Marca'}
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

export default NombreMarcaCreate;
