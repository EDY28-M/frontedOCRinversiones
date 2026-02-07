# Login Component - React

Este componente es una réplica exacta del diseño login.html original, convertido a React con Tailwind CSS.

## 🎨 Características del Diseño

- **Diseño Corporativo Profesional**: Usando los colores de marca ORC Inversiones
- **Fondo con Imagen**: Imagen de fondo con overlays degradados
- **Formulario Estilizado**: Inputs con iconos Material Symbols
- **Totalmente Responsive**: Funciona en todos los dispositivos
- **Animaciones Suaves**: Transiciones y efectos hover profesionales
- **Estado de Carga**: Muestra feedback durante el login

## 🎯 Colores de Marca

- **Primary (Amarillo Mate)**: `#F4C430`
- **Secondary (Azul Profundo)**: `#002060`
- **Background Light**: `#F3F4F6`
- **Background Dark**: `#111827`

## 📁 Archivos Creados

```
src/
├── pages/
│   ├── Login/
│   │   └── Login.jsx           # Componente principal del login
│   └── Dashboard/
│       └── Dashboard.jsx        # Página después del login
└── routes/
    └── index.jsx                # Rutas con protección
```

## 🚀 Uso

### Importar el componente:

```jsx
import Login from './pages/Login/Login';
```

### El componente maneja:

- ✅ Estado del formulario (usuario, contraseña)
- ✅ Validación requerida
- ✅ Integración con AuthContext
- ✅ Manejo de errores
- ✅ Estado de carga
- ✅ Redirección después del login
- ✅ Link "¿Olvidó su clave?"

## 🔐 Funcionalidad

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    await login(formData); // Llama al AuthContext
    navigate('/dashboard');  // Redirige al dashboard
  } catch (err) {
    setError(err.message);   // Muestra error
  } finally {
    setIsLoading(false);
  }
};
```

## 🎨 Estilos Principales

### Card Principal:
- Fondo blanco
- Sombra `shadow-sharp`
- Border superior amarillo de 6px
- Sin border-radius (`rounded-none`)

### Inputs:
- Border de 2px gris claro
- Focus: border azul (secondary)
- Iconos Material Symbols
- Placeholder gris suave
- Sin border-radius

### Botón:
- Fondo amarillo (primary)
- Texto azul (secondary)
- Hover: amarillo más claro
- Active: scale 0.99
- Uppercase + tracking amplio

## 📦 Dependencias Usadas

- `react-router-dom`: Navegación
- `tailwindcss`: Estilos
- `@tailwindcss/forms`: Estilos de formularios
- Material Symbols (Google Fonts)
- Montserrat (Google Fonts)

## 🔄 Rutas Configuradas

```jsx
/login      → Login page (público)
/dashboard  → Dashboard (protegido)
/           → Redirige a /login
*           → Redirige a /login
```

## 🛡️ Rutas Protegidas

El componente `PrivateRoute` protege rutas que requieren autenticación:

```jsx
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
```

## 💡 Notas de Diseño

1. **Fidelidad al Original**: El diseño es 100% idéntico al login.html
2. **Profesionalismo**: Usa las mejores prácticas de React
3. **Escalabilidad**: Fácil de mantener y extender
4. **Performance**: Optimizado con React hooks
5. **UX**: Feedback visual en todos los estados

## 🎯 Diferencias con el HTML Original

- ✅ Manejo de estado con React hooks
- ✅ Integración con sistema de autenticación
- ✅ Mensajes de error dinámicos
- ✅ Estado de carga
- ✅ Validación de formulario
- ✅ Navegación programática
- ✅ Componente reutilizable

## 🚦 Para Probar

```bash
npm run dev
```

Visita: http://localhost:5173/login

---

**Diseño Original**: login.html  
**Conversión**: React + Tailwind CSS  
**Versión**: 1.0.0
