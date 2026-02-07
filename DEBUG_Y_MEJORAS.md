# 🔍 DEBUG Y MEJORAS IMPLEMENTADAS

## ✅ Cambios Realizados

### 1. **Logging Mejorado en Todo el Sistema**

#### **axiosConfig.js** - Interceptores con logs detallados:
```javascript
✅ Log de cada request: método, URL, token presente
✅ Log de cada response: status, datos
✅ Log de errores con detalles completos
✅ Redirección automática en 401
```

#### **authService.js** - Debugging completo:
```javascript
✅ Log de credenciales enviadas (password oculto)
✅ Log de respuesta del backend
✅ Log de errores con status y datos
✅ Log de decodificación de JWT
```

#### **Login.jsx** - Manejo robusto de errores:
```javascript
✅ Distinción entre tipos de error:
   - 401: Credenciales inválidas
   - 500: Error del servidor
   - Sin respuesta: Backend no disponible
✅ Mensajes de error específicos para cada caso
✅ Logs detallados en consola del navegador
```

### 2. **Credenciales de Prueba Visibles en Desarrollo**

En la página de login, cuando está en modo desarrollo (`npm run dev`), se muestra un banner azul con las credenciales:

```
🔑 Credenciales de Prueba:
Usuario: admin
Contraseña: Admin123
```

### 3. **Página de Test HTML Independiente**

Creado `test-login.html` - Una herramienta de debugging standalone:
- ✅ Test directo al backend sin frontend React
- ✅ Test de login
- ✅ Test de get products con token
- ✅ Logs con colores en tiempo real
- ✅ No requiere compilación ni npm

**Cómo usar:**
```bash
# Abrir directamente en el navegador
start test-login.html
```

### 4. **Documentación Completa**

#### **CREDENCIALES_Y_TROUBLESHOOTING.md**
- ✅ Credenciales por defecto
- ✅ Guía de troubleshooting paso a paso
- ✅ Casos comunes de error
- ✅ Cómo verificar la base de datos
- ✅ Cómo crear usuarios manualmente

## 🔍 Cómo Usar el Sistema de Debug

### **Opción 1: Logs en el Frontend React**

1. Inicia el frontend:
```bash
npm run dev
```

2. Abre el navegador en `http://localhost:5173/admin/login`

3. Abre la consola del navegador (F12)

4. Intenta hacer login

5. Revisa los logs:
```
🔧 Axios Config - API Base URL: http://localhost:5095/api
📤 Enviando credenciales: { usuario: "admin", password: "***" }
🔐 AuthService.login - Enviando al backend: { username: "admin", password: "***" }
📡 Request: { method: "POST", url: "/auth/login", hasToken: false, data: {...} }
✅ Response: { status: 200, url: "/auth/login", data: { token: "...", username: "admin" } }
✅ AuthService.login - Respuesta del backend: { token: "TOKEN_RECEIVED", username: "admin", role: "Admin" }
✅ Login exitoso
```

### **Opción 2: Test HTML Standalone**

1. Abre `test-login.html` en el navegador

2. Verifica que el backend esté corriendo

3. Click en "Test Login"

4. Verifica los logs en pantalla

5. Si funciona, click en "Test Get Products"

### **Opción 3: Verificar Backend Directamente**

Usa curl o Postman:

```bash
# Test Login
curl -X POST http://localhost:5095/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123"}'

# Debería retornar:
{
  "token": "eyJhbGc...",
  "username": "admin",
  "email": "admin@orcinversiones.com",
  "role": "Admin",
  "expiresAt": "2026-01-24T..."
}
```

## 🐛 Diagnóstico de Problemas

### **Caso 1: Error 401 - Credenciales Inválidas**

**Logs del Backend:**
```
SELECT TOP(1) [u].[Id] ... WHERE [u].[Username] = @__username_0
Executing UnauthorizedObjectResult
Request finished HTTP/1.1 POST ... - 401
```

**Significado:**
- ✅ Usuario existe en la BD
- ❌ Contraseña incorrecta

**Solución:**
1. Verifica la contraseña: `Admin123` (con A mayúscula)
2. Usa `test-login.html` para probar
3. Si persiste, regenera el hash de contraseña

**Regenerar hash:**
```csharp
// En PasswordHashGenerator.cs
var hash = BCrypt.Net.BCrypt.HashPassword("Admin123");
Console.WriteLine(hash);
```

### **Caso 2: No se puede conectar al servidor**

**Logs del Frontend:**
```
❌ Response Error: { message: "Network Error" }
No se pudo conectar con el servidor
```

**Solución:**
1. Verifica que el backend esté corriendo:
```bash
dotnet run
```

2. Verifica el puerto: `http://localhost:5095`

3. Verifica el archivo `.env`:
```
VITE_API_BASE_URL=http://localhost:5095/api
```

### **Caso 3: CORS Error**

**Error en navegador:**
```
Access to fetch at 'http://localhost:5095/api/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solución:**
Verifica que el backend tenga CORS configurado en `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader());
});
```

### **Caso 4: Usuario no existe**

**Logs del Backend:**
```
SELECT TOP(1) [u].[Id] ... WHERE [u].[Username] = @__username_0
// No retorna resultados
Executing UnauthorizedObjectResult
```

**Solución:**
1. Verifica usuarios en la BD:
```sql
SELECT * FROM Users;
```

2. Si no hay usuarios, corre el seeder:
```bash
dotnet run
```

3. O crea el usuario manualmente (ver CREDENCIALES_Y_TROUBLESHOOTING.md)

## 📊 Estructura de Logs por Componente

### **Frontend - Console (F12)**
```
🔧 = Configuración
📤 = Enviando datos
🔐 = Autenticación
📡 = Request HTTP
✅ = Éxito
❌ = Error
⚠️ = Advertencia
👤 = Usuario
```

### **Backend - Console (dotnet run)**
```
info: = Información general
warn: = Advertencia
dbug: = Debug (solo en Development)
```

### **Test HTML - Pantalla**
```
[Timestamp] Mensaje
Color verde = Éxito
Color rojo = Error
Color cian = Información
```

## 🎯 Checklist de Verificación

Antes de reportar un error, verifica:

- [ ] Backend está corriendo en puerto 5095
- [ ] SQL Server está corriendo
- [ ] Base de datos tiene el usuario admin
- [ ] Frontend está corriendo en puerto 5173
- [ ] Archivo `.env` existe y tiene la URL correcta
- [ ] Contraseña es exactamente `Admin123` (con A mayúscula)
- [ ] No hay espacios en usuario o contraseña
- [ ] CORS está habilitado en el backend
- [ ] Consola del navegador no muestra errores de red

## 🚀 Test Rápido Paso a Paso

1. **Backend:**
```bash
cd backend
dotnet run
# Debe decir: Now listening on: http://localhost:5095
```

2. **Test Directo:**
```bash
# Abre test-login.html en el navegador
# Click "Test Login"
# Debe mostrar: ✅ LOGIN EXITOSO!
```

3. **Frontend:**
```bash
cd fronted/frontedInversiones
npm run dev
# Abre http://localhost:5173/admin/login
# Login con: admin / Admin123
# F12 para ver logs
```

---

✅ **Con estos cambios, ahora tienes logging completo en cada capa del sistema para diagnosticar cualquier problema de autenticación.**
