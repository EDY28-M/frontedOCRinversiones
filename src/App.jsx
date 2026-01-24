import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/common/NotificationContainer';
import AppRoutes from './routes';

// Configurar QueryClient con opciones por defecto
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 segundos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
          <NotificationContainer />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
