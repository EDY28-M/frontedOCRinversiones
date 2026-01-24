import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { nombreMarcaService } from '../../../services/productService';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { useNotification } from '../../../context/NotificationContext';

const NombreMarcaEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { info } = useNotification();
  const [formData, setFormData] = useState({
    nombre: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    loadMarca();
  }, [id]);

  const loadMarca = async () => {
    try {
      setLoading(true);
      const data = await nombreMarcaService.getNombreMarcaById(id);
      setFormData({
        nombre: data.nombre || '',
        isActive: data.isActive ?? true,
      });
      setError(null);
    } catch (err) {
      console.error('Error al cargar marca:', err);
      setError('Error al cargar la marca');
    } finally {
      setLoading(false);
    }
  };

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

    try {
      setSaving(true);
      
      const payload = {
        Nombre: formData.nombre.trim(),
        IsActive: formData.isActive
      };
      
      await nombreMarcaService.updateNombreMarca(id, payload);
      info('Marca actualizada exitosamente');
      navigate('/admin/nombre-marca');
    } catch (err) {
      console.error('Error al actualizar marca:', err);
      setError(err.response?.data?.message || 'Error al actualizar la marca');
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
