import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../../../services/userService';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { useNotification } from '../../../context/NotificationContext';

const UsuariosEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { info } = useNotification();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'Vendedor',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    loadUsuario();
  }, [id]);

  const loadUsuario = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserById(id);
      setFormData({
        username: data.username || '',
        email: data.email || '',
        role: data.role || 'Vendedor',
      });
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      setError('Error al cargar el usuario');
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

    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    try {
      setSaving(true);
      await userService.updateUser(id, formData);
      info('Usuario actualizado exitosamente');
      navigate('/admin/usuarios');
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      setError(err.response?.data?.message || 'Error al actualizar el usuario');
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
          Editar Usuario
        </h1>
        <p className="text-slate-500 text-sm mt-1">Modificar datos del usuario #{id}</p>
      </div>

      {/* Formulario */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
            Datos del Usuario
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <ErrorAlert error={error} onClose={clearError} title="Error" />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nombre de Usuario <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
            >
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-blue-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Actualizar Usuario'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/usuarios')}
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

export default UsuariosEdit;
