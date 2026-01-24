import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { isAdmin } from '../../../utils/permissions';

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await login(formData);
      
      // Mostrar notificación de éxito
      showSuccess('¡Bienvenido! Iniciando sesión...');
      
      // Redirigir según el rol del usuario
      if (isAdmin(userData.role)) {
        navigate('/admin/', { replace: true });
      } else {
        // Vendedor va a su propia interfaz
        navigate('/vendedor/productos', { replace: true });
      }
    } catch (err) {
      // Mensajes de error más amigables
      if (err.response) {
        // El servidor respondió con un error
        if (err.response.status === 401) {
          showError('❌ Error de autenticación: Credenciales incorrectas');
        } else if (err.response.status === 500) {
          showError('⚠️ Error del servidor: Por favor, intenta más tarde');
        } else {
          showError(`❌ Error: ${err.response.data?.message || 'Error desconocido'}`);
        }
      } else if (err.request) {
        // No hubo respuesta del servidor
        showError('🔌 No se pudo conectar con el servidor. Verifica que esté funcionando');
      } else {
        // Error al configurar la petición
        showError('❌ Error al procesar la solicitud');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full font-sans overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Taller de servicio de camiones pesados"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPDU-7DqgZqFjr5rnw339dXlW-iaHbgMWr-oUlGLHmyXhtLEH2Juu0Hir_I_DybM3Gft3mxUrByH49b2ALkQrv5ENZXmqUWByWHsj7hJHfI6iFASrntTDbCF54dqIjYDpOVFWDnXaxfOTlzLo-EPypn5QPjQn2xaN2JbZy-al_q5rNoWj_puTjkhF1DvJTDkTl0Zn7oVILm2zKXW9PZfOW3kefsZIo_OmGGKMEX6LCy01TRRwIcP5GTL6318TrWnWVl8wQYDPeI6o"
        />
        <div className="absolute inset-0 bg-secondary/90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm bg-white shadow-sharp rounded-none border-t-[6px] border-primary">
          {/* Logo Section */}
          <div className="pt-10 pb-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 bg-secondary flex items-center justify-center rounded-none shadow-sm">
                <span className="material-symbols-outlined text-primary text-4xl">
                  settings
                </span>
              </div>
              <div className="flex flex-col items-start leading-none select-none">
                <h1 className="text-3xl font-extrabold text-secondary tracking-wide">
                  ORC
                </h1>
                <h2 className="text-lg font-bold text-primary tracking-tight">
                  INVERSIONES
                </h2>
                <h3 className="text-[0.6rem] font-bold text-gray-500 tracking-[0.3em] uppercase w-full">
                  PERÚ
                </h3>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-10">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-secondary uppercase tracking-widest inline-block border-b-2 border-primary pb-1">
                Ingreso
              </h2>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mt-2">
                Plataforma de Gestión
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Usuario Input */}
              <div className="group">
                <label
                  className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2"
                  htmlFor="usuario"
                >
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-[20px] group-focus-within:text-secondary transition-colors">
                      person
                    </span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-0 transition-colors rounded-none bg-gray-50 text-sm font-semibold"
                    id="usuario"
                    name="usuario"
                    placeholder="Nombre de usuario"
                    type="text"
                    value={formData.usuario}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label
                  className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-[20px] group-focus-within:text-secondary transition-colors">
                      lock
                    </span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-10 py-3 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-0 transition-colors rounded-none bg-gray-50 text-sm font-semibold"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-secondary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <a
                    className="text-xs font-bold text-gray-500 hover:text-secondary uppercase tracking-wide transition-colors duration-200 cursor-pointer"
                    href="#"
                  >
                    ¿Olvidó su clave?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-extrabold text-secondary bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 uppercase tracking-widest rounded-none shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest font-semibold">
              © 2024 ORC Inversiones Perú. V3.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
