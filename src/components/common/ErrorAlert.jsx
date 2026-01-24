/**
 * ErrorAlert - Componente de alerta de error persistente
 * 
 * CARACTERÍSTICAS:
 * - Permanece visible hasta que el usuario lo cierre
 * - Diseño consistente en toda la aplicación
 * - Soporta diferentes variantes (error, warning, info)
 * - Accesible con ARIA labels
 * 
 * @param {string} error - Mensaje de error a mostrar
 * @param {function} onClose - Callback cuando el usuario cierra la alerta (REQUERIDO)
 * @param {string} title - Título opcional (default: 'Error')
 * @param {string} variant - 'error' | 'warning' | 'info' (default: 'error')
 * @param {React.ReactNode} children - Contenido adicional opcional
 */
const ErrorAlert = ({ 
  error, 
  onClose, 
  title = 'Error', 
  variant = 'error',
  children 
}) => {
  if (!error) return null;

  const variants = {
    error: {
      container: 'bg-red-50 border-red-500',
      icon: 'error',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      closeHover: 'hover:text-red-600',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-500',
      icon: 'warning',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
      closeHover: 'hover:text-yellow-600',
    },
    info: {
      container: 'bg-blue-50 border-blue-500',
      icon: 'info',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
      closeHover: 'hover:text-blue-600',
    },
  };

  const styles = variants[variant] || variants.error;

  return (
    <div 
      className={`mb-4 border-2 p-4 ${styles.container}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        {/* Icono */}
        <div className="flex-shrink-0">
          <span className={`material-symbols-outlined ${styles.iconColor} text-2xl`}>
            {styles.icon}
          </span>
        </div>
        
        {/* Contenido */}
        <div className="flex-1">
          <h3 className={`${styles.titleColor} font-bold text-sm mb-1 uppercase tracking-wide`}>
            ⚠️ {title}
          </h3>
          <p className={`${styles.textColor} text-sm font-semibold leading-relaxed`}>
            {error}
          </p>
          {children && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-30">
              {children}
            </div>
          )}
        </div>
        
        {/* Botón cerrar - Solo acción del usuario puede cerrar el error */}
        <button
          type="button"
          onClick={onClose}
          className={`flex-shrink-0 text-gray-400 ${styles.closeHover} transition-colors p-1`}
          aria-label="Cerrar alerta"
          title="Cerrar"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
    </div>
  );
};

/**
 * ErrorAlertInline - Versión inline sin botón de cierre
 * Útil para errores de validación de campos
 */
export const ErrorAlertInline = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <p 
      className={`text-red-600 text-xs font-semibold mt-1 ${className}`}
      role="alert"
    >
      {error}
    </p>
  );
};

export default ErrorAlert;
