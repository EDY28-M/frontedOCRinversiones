# Fronted Inversiones - Arquitectura del Proyecto

Proyecto React con arquitectura profesional y escalable.

## 🏗️ Estructura del Proyecto

```
frontedInversiones/
├── public/                  # Archivos públicos estáticos
├── src/
│   ├── api/                # Configuración de APIs (Axios)
│   │   └── axiosConfig.js  # Instancia de Axios configurada
│   ├── assets/             # Recursos estáticos
│   │   ├── images/         # Imágenes
│   │   └── styles/         # Estilos globales
│   │       └── global.css  # Estilos CSS globales
│   ├── components/         # Componentes reutilizables
│   │   └── README.md       # Guía de componentes
│   ├── config/             # Configuraciones
│   │   └── index.js        # Config general de la app
│   ├── constants/          # Constantes de la aplicación
│   │   └── index.js        # API endpoints, roles, status
│   ├── context/            # React Context API
│   │   └── AuthContext.jsx # Context de autenticación
│   ├── hooks/              # Custom React Hooks
│   │   └── useFetch.js     # Hook para peticiones HTTP
│   ├── layouts/            # Layouts principales
│   │   └── MainLayout.jsx  # Layout principal con header/footer
│   ├── pages/              # Páginas/Vistas
│   │   └── README.md       # Guía de páginas
│   ├── routes/             # Configuración de rutas
│   │   └── index.jsx       # React Router setup
│   ├── services/           # Servicios API
│   │   └── authService.js  # Servicios de autenticación
│   ├── utils/              # Utilidades y helpers
│   │   └── formatters.js   # Funciones de formato
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Punto de entrada
├── .env.example            # Variables de entorno (ejemplo)
├── package.json            # Dependencias y scripts
└── vite.config.js          # Configuración de Vite
```

## 📦 Dependencias Principales

- **React 19.2.0** - Biblioteca de UI
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Vite 7.x** - Build tool y dev server

## 🚀 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (http://localhost:5173)
npm run build    # Construir para producción
npm run preview  # Preview de build de producción
npm run lint     # Ejecutar ESLint
```

## 📁 Convenciones de Carpetas

### `/components`
Componentes reutilizables de UI. Cada componente en su propia carpeta:
```
components/
  Button/
    Button.jsx
    Button.css
```

### `/pages`
Vistas/páginas de la aplicación:
```
pages/
  Home/
    Home.jsx
    Home.css
  Dashboard/
    Dashboard.jsx
```

### `/services`
Lógica de negocio y llamadas a API:
- authService.js
- userService.js
- productService.js

### `/hooks`
Custom hooks de React:
- useFetch.js
- useAuth.js
- useForm.js

### `/context`
React Context providers para estado global:
- AuthContext.jsx
- ThemeContext.jsx

### `/utils`
Funciones de utilidad reutilizables:
- formatters.js
- validators.js
- helpers.js

### `/constants`
Constantes de la aplicación:
- API endpoints
- Roles de usuario
- Estados
- Configuraciones fijas

## 🔧 Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Axios Configuration

Configurado con:
- Base URL
- Timeout (10s)
- Interceptores de request (añade token)
- Interceptores de response (maneja 401)

### React Router

Configurado con BrowserRouter y layout principal.

## 🔐 Autenticación

El proyecto incluye:
- `AuthContext` para manejo de estado de autenticación
- `authService` para login/logout/register
- Token JWT en localStorage
- Redirección automática en 401

## 💡 Uso

### Crear un nuevo componente
```jsx
// src/components/Button/Button.jsx
const Button = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
```

### Crear una nueva página
```jsx
// src/pages/Dashboard/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="dashboard">
      <h1>Welcome {user?.name}</h1>
    </div>
  );
};

export default Dashboard;
```

### Crear un servicio
```jsx
// src/services/userService.js
import axiosInstance from '../api/axiosConfig';

export const userService = {
  getAll: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },
};
```

### Usar custom hook
```jsx
import { useFetch } from '../hooks/useFetch';
import { userService } from '../services/userService';

const UserList = () => {
  const { data, loading, error } = useFetch(userService.getAll);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* render data */}</div>;
};
```

## 🎨 Estilos

Variables CSS globales en `src/assets/styles/global.css`:
- --primary-color
- --secondary-color
- --success-color
- --danger-color
- etc.

## 📝 Notas

- Usa componentes funcionales con hooks
- Mantén componentes pequeños y reutilizables
- Coloca lógica compleja en custom hooks
- Usa Context para estado global
- Usa services para llamadas a API
- Mantén las páginas limpias (solo orquestación)

---

**Versión:** 1.0.0  
**React:** 19.2.0  
**Vite:** 7.2.4
