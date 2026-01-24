import { useState, useCallback } from 'react';

/**
 * Hook centralizado para manejo de errores
 * 
 * PRINCIPIOS:
 * - Los errores NUNCA se limpian automáticamente
 * - Solo el usuario puede cerrar/limpiar un error
 * - Proporciona métodos claros para set/clear
 * 
 * @example
 * const { error, setError, clearError, hasError } = useError();
 * 
 * // En catch:
 * setError('Mensaje de error');
 * 
 * // En el JSX:
 * {hasError && <ErrorAlert error={error} onClose={clearError} />}
 */
export const useError = (initialError = null) => {
  const [error, setErrorState] = useState(initialError);

  // Establecer error con mensaje o objeto de error
  const setError = useCallback((errorInput) => {
    if (typeof errorInput === 'string') {
      setErrorState(errorInput);
    } else if (errorInput instanceof Error) {
      setErrorState(errorInput.message);
    } else if (errorInput?.message) {
      setErrorState(errorInput.message);
    } else if (errorInput?.response?.data?.message) {
      // Error de Axios con respuesta del servidor
      setErrorState(errorInput.response.data.message);
    } else {
      setErrorState(String(errorInput));
    }
  }, []);

  // Limpiar error - SOLO debe llamarse por acción del usuario
  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  // Helper para verificar si hay error
  const hasError = error !== null && error !== '' && error !== undefined;

  return {
    error,
    setError,
    clearError,
    hasError,
  };
};

/**
 * Hook para manejar errores de formularios con campos específicos
 * 
 * @example
 * const { errors, setFieldError, clearFieldError, clearAllErrors } = useFormErrors();
 * setFieldError('email', 'Email inválido');
 */
export const useFormErrors = () => {
  const [errors, setErrors] = useState({});

  const setFieldError = useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors,
  };
};

export default useError;
