# 🔐 Credenciales y Troubleshooting - ORC Inversiones

## 📋 Credenciales por Defecto

### **Usuario Administrador:**
```
Username: admin
Password: Admin123
Email: admin@orcinversiones.com
Rol: Administrador
```

### **Roles Disponibles:**
1. **Administrador (ID: 1)** - Acceso total al sistema
2. **Vendedor (ID: 2)** - Acceso restringido a productos

---

## 🐛 Troubleshooting - Error 401 Unauthorized

Si recibes un error 401 al intentar iniciar sesión, verifica lo siguiente:

### **1. Verifica que el Backend esté Corriendo**
```bash
cd C:\Users\cater\source\repos\backendORCinverisones\backend
dotnet run
```
Debe mostrar: `Now listening on: http://localhost:5095`

### **2. Verifica la Base de Datos**
El backend usa SQL Server. Asegúrate de que:
- SQL Server está corriendo
- La cadena de conexión en `appsettings.json` es correcta
- Las migraciones se aplicaron: `dotnet ef database update`

### **3. Verifica el Seed de Datos**
El usuario admin se crea automáticamente al iniciar la aplicación si la tabla Users está vacía.

Si no existe, puedes crearlo manualmente ejecutando el seeder:
```csharp
// En DatabaseSeeder.cs
context.Users.Add(new User
{
    Username = "admin",
    Email = "admin@orcinversiones.com",
    PasswordHash = "$2a$11$xJKVqYXN5YHJfGJdKk5h5.N1xKzO9QqQX8Z3rQK5sX6Z8K9vQr5YW", // Admin123
    RoleId = 1,
    IsActive = true
});
```

### **4. Verifica la Contraseña**
Las contraseñas se hashean con **BCrypt.Net**. Asegúrate de:
- Escribir correctamente: `Admin123` (con A mayúscula)
- No copiar/pegar con espacios extras
- Verificar que el teclado esté en inglés

### **5. Verifica los Logs del Backend**
Busca en la consola del backend:
```
Executed DbCommand ... SELECT TOP(1) [u].[Id] ... WHERE [u].[Username] = @__username_0
```

Si aparece la consulta SQL pero retorna 401, significa:
- ✅ El usuario existe en la BD
- ❌ La contraseña es incorrecta

### **6. Verifica CORS**
El backend debe aceptar requests desde `http://localhost:5173`

En `Program.cs` debe existir:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader());
});
```

---

## 🔧 Cómo Crear un Nuevo Usuario Manualmente

### **Opción 1: Con SQL Server Management Studio**
```sql
-- Generar hash de contraseña con BCrypt
-- Usa una herramienta online: https://bcrypt-generator.com/
-- O ejecuta el backend con el generador PasswordHashGenerator.cs

INSERT INTO Users (Username, Email, PasswordHash, RoleId, IsActive, CreatedAt, UpdatedAt)
VALUES ('miusuario', 'email@ejemplo.com', '$2a$11$HASH_AQUI', 1, 1, GETDATE(), GETDATE());
```

### **Opción 2: Con el Backend (endpoint protegido)**
```bash
POST http://localhost:5095/api/users
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "username": "nuevousuario",
  "email": "nuevo@ejemplo.com",
  "password": "Password123",
  "roleId": 2
}
```

---

## 🔍 Verificar Logs en el Frontend

Abre la **Consola del Navegador** (F12) y busca:

### **Logs exitosos:**
```
🔧 Axios Config - API Base URL: http://localhost:5095/api
📤 Enviando credenciales: { usuario: "admin", password: "***" }
🔐 AuthService.login - Enviando al backend: { username: "admin", password: "***" }
📡 Request: { method: "POST", url: "/auth/login", hasToken: false }
✅ Response: { status: 200, data: { token: "...", username: "admin", ... } }
✅ Login exitoso
```

### **Logs de error:**
```
❌ Response Error: { status: 401, data: { message: "Invalid credentials" } }
❌ Error en login: AxiosError
❌ AuthService.login - Error: { status: 401, message: "..." }
```

---

## 🎯 Casos Comunes de Error

### **Error: "No se pudo conectar con el servidor"**
**Causa:** Backend no está corriendo
**Solución:** Inicia el backend con `dotnet run`

### **Error: "Credenciales inválidas"**
**Causa:** Usuario o contraseña incorrecta
**Solución:** Usa `admin` / `Admin123` (verifica mayúsculas)

### **Error: "CORS policy"**
**Causa:** Backend no acepta requests desde localhost:5173
**Solución:** Agrega política CORS en el backend

### **Error: "Token expirado"**
**Causa:** El token JWT expiró (24 horas por defecto)
**Solución:** Vuelve a iniciar sesión

---

## 📊 Verificar Estado de la Base de Datos

```sql
-- Ver usuarios existentes
SELECT Id, Username, Email, RoleId, IsActive FROM Users;

-- Ver roles
SELECT * FROM Roles;

-- Verificar productos
SELECT COUNT(*) AS TotalProductos FROM Products;

-- Verificar categorías
SELECT * FROM Categories;
```

---

## 🚀 Iniciar Todo Desde Cero

### **1. Backend:**
```bash
cd C:\Users\cater\source\repos\backendORCinverisones\backend
dotnet clean
dotnet build
dotnet ef database drop --force  # ⚠️ CUIDADO: Borra toda la BD
dotnet ef database update
dotnet run
```

### **2. Frontend:**
```bash
cd C:\Users\cater\source\repos\backendORCinverisones\fronted\frontedInversiones
npm install
npm run dev
```

### **3. Acceder:**
1. Backend: http://localhost:5095
2. Frontend: http://localhost:5173/admin/login
3. Credenciales: `admin` / `Admin123`

---

## 💡 Tips Adicionales

1. **Modo Desarrollo:** Las credenciales de prueba se muestran automáticamente en la página de login
2. **Consola del Navegador:** Siempre revisa F12 para ver logs detallados
3. **Logs del Backend:** Revisa la consola donde corre `dotnet run`
4. **Postman/Thunder Client:** Prueba los endpoints directamente para verificar que funcionen
5. **SQL Server:** Usa SSMS o Azure Data Studio para verificar la BD directamente

---

✅ **Si sigues teniendo problemas, revisa los logs de la consola del navegador y del backend para identificar el error específico.**
