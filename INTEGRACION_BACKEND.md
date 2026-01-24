# 🔗 INTEGRACIÓN FRONTEND-BACKEND COMPLETADA

## ✅ Configuración Realizada

### 1. **Configuración de API**
- **URL Backend:** `http://localhost:5095/api`
- **Archivo:** `.env` creado con la variable `VITE_API_BASE_URL`
- **Interceptores configurados:** JWT Bearer token automático en cada request

### 2. **Servicios Implementados**

#### **AuthService** (`src/services/authService.js`)
- `login(credentials)` - Autenticación con username/password
- `logout()` - Cierre de sesión (llama al backend)
- `getCurrentUser()` - Decodifica JWT para obtener datos del usuario

#### **ProductService** (`src/services/productService.js`)
- `getAllProducts()` - Listar todos los productos
- `getProductById(id)` - Obtener producto por ID
- `createProduct(productData)` - Crear producto
- `updateProduct(id, productData)` - Actualizar producto
- `deleteProduct(id)` - Eliminar producto

#### **CategoryService** (`src/services/productService.js`)
- `getAllCategories()` - Listar categorías
- `getCategoryById(id)` - Obtener categoría por ID
- `createCategory(categoryData)` - Crear categoría
- `updateCategory(id, categoryData)` - Actualizar categoría
- `deleteCategory(id)` - Eliminar categoría

### 3. **Autenticación JWT**

El sistema usa JWT (JSON Web Token) para la autenticación:

```javascript
// Headers automáticos en cada request
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Flujo de autenticación:**
1. Usuario inicia sesión con username/password
2. Backend devuelve JWT con datos: `{ token, username, email, role, expiresAt }`
3. Token se guarda en localStorage
4. Cada request incluye el token automáticamente
5. Si el token expira (401), se redirige a login

### 4. **Página de Productos Conectada**

La página de productos (`/admin/productos`) ahora:
- ✅ Carga productos reales del backend
- ✅ Muestra spinner de carga
- ✅ Maneja errores de conexión
- ✅ Permite activar/desactivar productos
- ✅ Permite eliminar productos (con confirmación)
- ✅ Filtra por estado (Todos/Publicados/Borradores)

### 5. **Estructura de Datos**

#### **Login Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### **Login Response:**
```json
{
  "token": "eyJhbGc...",
  "username": "admin",
  "email": "admin@orc.com",
  "role": "Admin",
  "expiresAt": "2026-01-24T14:55:00Z"
}
```

#### **Producto:**
```json
{
  "id": 1,
  "codigoOEM": "OEM-8854-X",
  "codigoPD": "PROD-001",
  "descripcion": "Excavadora Hidráulica ZX200",
  "fichaTecnica": "...",
  "imagenPrincipal": "url",
  "imagen2": "url",
  "imagen3": "url",
  "imagen4": "url",
  "categoryId": 1,
  "category": {
    "id": 1,
    "nombre": "Maquinaria Pesada"
  },
  "isActive": true
}
```

## 🚀 Cómo Usar

### **Iniciar Backend:**
```bash
# Puerto 5095
cd backendORCinverisones
dotnet run
```

### **Iniciar Frontend:**
```bash
cd fronted\frontedInversiones
npm run dev
# Puerto 5173
```

### **Acceder a la aplicación:**
1. Abrir `http://localhost:5173/admin/login`
2. Iniciar sesión (credenciales del backend)
3. Serás redirigido a `/admin/productos`
4. Los productos se cargan automáticamente del backend

## 🔧 Configuración Adicional

### **Variables de Entorno (.env):**
```env
VITE_API_BASE_URL=http://localhost:5095/api
```

### **CORS en Backend:**
Asegúrate de que el backend tenga CORS habilitado para `http://localhost:5173`

## 📝 Endpoints Disponibles

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Iniciar sesión | ❌ |
| POST | `/api/auth/logout` | Cerrar sesión | ✅ |
| GET | `/api/products` | Listar productos | ✅ |
| GET | `/api/products/{id}` | Obtener producto | ✅ |
| POST | `/api/products` | Crear producto | ✅ |
| PUT | `/api/products/{id}` | Actualizar producto | ✅ |
| DELETE | `/api/products/{id}` | Eliminar producto | ✅ |
| GET | `/api/categories` | Listar categorías | ✅ |
| GET | `/api/categories/{id}` | Obtener categoría | ✅ |
| POST | `/api/categories` | Crear categoría | ✅ |
| PUT | `/api/categories/{id}` | Actualizar categoría | ✅ |
| DELETE | `/api/categories/{id}` | Eliminar categoría | ✅ |

## ⚠️ Notas Importantes

1. **Token Expira en 24 horas:** Configurable en backend (`Jwt:ExpirationHours`)
2. **Autenticación requerida:** Todos los endpoints excepto login requieren JWT
3. **Roles:** Algunos endpoints requieren rol Admin o Vendedor
4. **CORS:** El backend debe aceptar requests desde `http://localhost:5173`
5. **SQL Server:** Backend requiere conexión a SQL Server

## 🎯 Próximos Pasos

Para continuar el desarrollo:

1. **Crear Modal de Nuevo Producto:** Formulario para agregar productos
2. **Editar Producto:** Modal de edición con datos del backend
3. **Búsqueda:** Implementar búsqueda en tiempo real
4. **Paginación:** Implementar paginación real del backend
5. **Categorías:** Página de gestión de categorías
6. **Usuarios:** Página de gestión de usuarios (solo Admin)
7. **Roles:** Página de gestión de roles (solo Admin)

## 🐛 Troubleshooting

### **Error de conexión:**
```
Error al cargar productos. Verifica que el backend esté corriendo.
```
**Solución:** Verificar que el backend esté corriendo en `http://localhost:5095`

### **Error 401 Unauthorized:**
**Solución:** Token expirado o inválido. Inicia sesión nuevamente.

### **Error 403 Forbidden:**
**Solución:** Usuario no tiene permisos para esa operación.

### **CORS Error:**
**Solución:** Configurar CORS en el backend para aceptar `http://localhost:5173`

---

✨ **¡Integración Completada Exitosamente!** ✨
