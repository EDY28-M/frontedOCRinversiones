import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/userService';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { useNotification } from '../../../context/NotificationContext';

const UsuariosCreate = () => {
  const navigate = useNavigate();
  const { warning } = useNotification();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: 2, // Default: Vendedor role (ID 2)
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

    // Validaciones
    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return;
    }
    if (!formData.password) {
      setError('La contraseña es obligatoria');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      
      // Asegurar capitalización correcta para el backend
      const payload = {
        Username: formData.username.trim(),
        Email: formData.email.trim(),
        Password: formData.password,
        RoleId: parseInt(formData.roleId),
      };
      
      console.log('📦 Enviando usuario:', { ...payload, Password: '***' });
      
      await userService.createUser(payload);
      warning('Usuario creado exitosamente');
      navigate('/admin/usuarios');
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Error response:', err.response);
      
      // Extraer mensaje de error del backend
      let errorMessage = 'Error al crear el usuario';
      
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
          Crear Usuario
        </h1>
        <p className="text-slate-500 text-sm mt-1">Registrar nuevo usuario del sistema</p>
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
            <ErrorAlert error={error} onClose={clearError} title="Error de Validación" />
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
                placeholder="Ej: jperez"
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
                placeholder="usuario@empresa.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
            >
              <option value="1">Administrador</option>
              <option value="2">Vendedor</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-[#F5C344] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#eab308] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Usuario'}
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

export default UsuariosCreate;
