import { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

// Tiempo mínimo entre notificaciones idénticas (ms)
const DEDUP_WINDOW = 1500;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const recentRef = useRef(new Map()); // key: "type:message" → timestamp

  const addNotification = useCallback((message, type = 'info') => {
    // Deduplicar: ignorar si el mismo mensaje+tipo se mostró hace poco
    const dedupKey = `${type}:${message}`;
    const now = Date.now();
    const lastShown = recentRef.current.get(dedupKey);
    if (lastShown && now - lastShown < DEDUP_WINDOW) {
      return null; // Ignorar duplicado
    }
    recentRef.current.set(dedupKey, now);

    // Limpiar entradas antiguas del mapa (evitar memory leak)
    if (recentRef.current.size > 20) {
      for (const [key, ts] of recentRef.current) {
        if (now - ts > DEDUP_WINDOW) recentRef.current.delete(key);
      }
    }

    const id = now;
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Métodos de conveniencia
  const success = useCallback((message) => addNotification(message, 'success'), [addNotification]);
  const error = useCallback((message) => addNotification(message, 'error'), [addNotification]);
  const warning = useCallback((message) => addNotification(message, 'warning'), [addNotification]);
  const info = useCallback((message) => addNotification(message, 'info'), [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, success, error, warning, info }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
