import { useCallback, useRef, useEffect } from 'react';

/**
 * Hook para crear callbacks memoizados con acceso a las últimas dependencias
 * Útil para callbacks que necesitan estar en effect dependencies pero no cambiar
 */
export function useMemoizedCallback(callback, deps) {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args) => callbackRef.current(...args), deps);
}

/**
 * Hook para debounce de valores
 */
export function useDebouncedValue(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook para throttle de funciones
 */
export function useThrottledCallback(callback, delay = 300) {
  const timeoutRef = useRef(null);
  const lastCallRef = useRef(0);
  
  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - (now - lastCallRef.current));
    }
  }, [callback, delay]);
}

/**
 * Hook para medir rendimiento de renderizado
 * Solo en desarrollo
 */
export function useRenderPerf(componentName) {
  const renderCount = useRef(0);
  const startTime = useRef(0);
  
  useEffect(() => {
    if (startTime.current === 0) {
      startTime.current = performance.now();
      return;
    }
    
    renderCount.current += 1;
    const elapsed = performance.now() - startTime.current;
    
    if (import.meta.env.DEV && elapsed > 16) { // 16ms = 60fps
      console.warn(`[PERF] ${componentName} render #${renderCount.current} tomó ${elapsed.toFixed(2)}ms`);
    }
    
    startTime.current = performance.now();
  });
  
  return renderCount.current;
}

import { useState } from 'react';

/**
 * Hook para intersection observer (lazy loading, infinite scroll)
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [options, hasIntersected]);
  
  return { ref: elementRef, isIntersecting, hasIntersected };
}

/**
 * Hook para localStorage con sincronización
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Disparar evento para sincronización entre tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(valueToStore),
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  // Sincronización entre tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);
  
  return [storedValue, setValue];
}

/**
 * Hook para medir tamaño de ventana con throttle
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    let timeoutId = null;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 200);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);
  
  return size;
}
