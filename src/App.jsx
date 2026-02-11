import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/common/NotificationContainer';
import ChunkErrorBoundary from './components/common/ChunkErrorBoundary';
import AppRoutes from './routes';

// Configurar QueryClient con opciones optimizadas para rendimiento
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo antes de considerar datos obsoletos (5 minutos)
      staleTime: 5 * 60 * 1000,
      // Tiempo que los datos permanecen en caché (10 minutos)
      gcTime: 10 * 60 * 1000,
      // No refetch al volver al foco (mejor rendimiento)
      refetchOnWindowFocus: false,
      // No refetch al reconectar (los datos ya están en caché)
      refetchOnReconnect: false,
      // Reintentos configurados
      retry: (failureCount, error) => {
        // No reintentar en errores 4xx (cliente)
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Habilitar placeholder data para mejor UX
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      // Reintentos para mutaciones solo en errores de red
      retry: (failureCount, error) => {
        if (!error?.status && failureCount < 2) return true;
        return false;
      },
    },
  },
});

function App() {
  return (
    <ChunkErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
            <NotificationContainer />
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ChunkErrorBoundary>
  );
}

export default App;
