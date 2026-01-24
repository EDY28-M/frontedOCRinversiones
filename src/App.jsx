import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/common/NotificationContainer';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
        <NotificationContainer />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
