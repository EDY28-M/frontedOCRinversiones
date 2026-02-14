# Frontend ORC Inversiones

Sitio web y panel de administración para ORC Inversiones Perú S.A.C. Desarrollado con React 19, Vite y Tailwind CSS. Desplegado en Cloudflare Pages.

- Dominio: https://orcinversionesperu.com
- Panel admin: https://orcinversionesperu.com/admin/login

## Requisitos previos

- Node.js 20.19 o superior
- npm 9 o superior

## Levantar en local

1. Clonar el repositorio e ir al directorio del frontend:

```bash
cd fronted/frontedInversiones
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar la variable de entorno. Crear un archivo `.env` en la raíz:

```env
# Para desarrollo local (backend local)
VITE_API_BASE_URL=http://localhost:5095/api

# Para apuntar al backend en producción
# VITE_API_BASE_URL=https://backendocrinversiones.onrender.com/api
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Despliegue en producción (Cloudflare Pages)

El frontend se despliega en Cloudflare Pages conectado al repositorio de GitHub. Cada push a la rama principal dispara un deploy automático.

### Configuración en Cloudflare Pages

| Campo | Valor |
|-------|-------|
| Framework | Vite |
| Build command | `cd fronted/frontedInversiones && npm install && npm run build` |
| Output directory | `fronted/frontedInversiones/dist` |
| Variable de entorno | `VITE_API_BASE_URL` = `https://backendocrinversiones.onrender.com/api` |

### Dominio personalizado

El dominio `orcinversionesperu.com` está configurado en Cloudflare con:
- SSL/TLS automático (HTTPS)
- Redirect de `www.orcinversionesperu.com` a `orcinversionesperu.com`
- Headers de caché para assets estáticos (`/assets/*` con `max-age=31536000`)
- SPA routing: todas las rutas redirigen a `index.html`

---

## SEO y posicionamiento

El sitio ya tiene implementado SEO técnico y está indexado en Google.

### Google Search Console

- Propiedad verificada: `orcinversionesperu.com`
- Sitemap enviado: `https://orcinversionesperu.com/sitemap.xml` (5 páginas descubiertas, estado correcto)
- URL principal indexada y servida por HTTPS

### Google Maps

- El negocio está registrado en Google Maps como "ORC INVERSIONES PERU S.A.C"
- Link: https://maps.app.goo.gl/iA9sAQACR87o2Bsj7
- El mapa embebido aparece en la página "Nosotros"
- La dirección en los footers de todas las páginas enlaza directamente a Google Maps

### Archivos SEO implementados

| Archivo | Ubicación | Función |
|---------|-----------|---------|
| `robots.txt` | `public/robots.txt` | Indica a los buscadores qué rastrear y qué ignorar |
| `sitemap.xml` | `public/sitemap.xml` | Lista de URLs públicas con prioridades |
| `manifest.json` | `public/manifest.json` | Configuración PWA para instalación en móviles |

### Metadatos por página

Cada página pública tiene título, descripción y canonical URL propios gracias al hook `useDocumentMeta`. Los datos estructurados JSON-LD (schema AutoPartsStore) están en `index.html` e incluyen nombre del negocio, dirección, teléfono, horarios, marcas y coordenadas.

---

## Credenciales de acceso

### Administrador

- **URL de login:** https://orcinversionesperu.com/admin/login
- **Usuario:** admin
- **Contraseña:** Admin123!

Este usuario tiene acceso completo a todas las funciones del panel de administración.

### Vendedor

Se crean desde el panel de administración en la sección "Usuarios" con el rol "Vendedor". Los vendedores solo pueden ver el catálogo de productos, no pueden crear, editar ni eliminar nada.

---

## Estructura del sitio

### Páginas públicas (visibles para todos)

| Ruta | Página | Contenido |
|------|--------|-----------|
| `/` | Inicio | Página principal con hero, marcas destacadas y productos destacados |
| `/productos` | Catálogo | Lista de productos con filtros por categoría, marca y búsqueda |
| `/nosotros` | Nosotros | Historia de la empresa, misión, visión, ubicación con mapa |
| `/envios-provincias` | Envíos | Información sobre envíos a todo el Perú |
| `/contacto` | Contacto | Formulario de contacto que envía email |

### Panel de administración (`/admin/...`)

Solo accesible con credenciales. Requiere rol Administrador.

| Ruta | Sección | Funciones |
|------|---------|-----------|
| `/admin` | Dashboard | Redirección al módulo principal |
| `/admin/productos` | Productos | Ver, crear, editar, eliminar productos. Importación masiva desde Excel. |
| `/admin/productos/destacados` | Destacados | Marcar y desmarcar productos como destacados (aparecen en la página de inicio) |
| `/admin/categorias` | Categorías | Gestión de categorías de productos |
| `/admin/nombre-marca` | Marcas | Gestión de marcas de vehículos |
| `/admin/usuarios` | Usuarios | Crear y administrar usuarios del sistema |

### Panel de vendedor (`/vendedor/...`)

Solo accesible con credenciales de vendedor.

| Ruta | Funciones |
|------|-----------|
| `/vendedor/productos` | Ver catálogo de productos (solo lectura) |
| `/vendedor/productos/destacados` | Ver productos destacados (solo lectura) |

---

## Manual de uso del panel de administración

### Iniciar sesión

1. Ir a https://orcinversionesperu.com/admin/login
2. Ingresar usuario y contraseña
3. El sistema redirige automáticamente al panel según el rol (admin o vendedor)
4. La sesión dura 24 horas. Después de ese tiempo hay que volver a iniciar sesión.

### Gestionar productos

**Crear un producto:**
1. Ir a Productos > botón "Crear Producto"
2. Llenar los campos obligatorios: código, código comercial, nombre del producto
3. Seleccionar categoría y marca (deben existir previamente)
4. Subir imágenes (máximo 4). La primera es la imagen principal.
5. Opcionalmente agregar descripción y ficha técnica
6. Guardar

**Editar un producto:**
1. En la lista de productos, hacer clic en el botón de editar
2. Modificar los campos necesarios
3. Se pueden cambiar o eliminar imágenes
4. Guardar cambios

**Activar/desactivar productos:**
- Los productos desactivados no aparecen en el catálogo público
- Usar el interruptor de estado en la lista de productos

**Productos destacados:**
- Ir a Productos > Destacados
- Marcar los productos que deben aparecer en la sección de destacados de la página de inicio
- Se recomienda tener entre 4 y 8 productos destacados para que la vista se vea bien

**Importación masiva desde Excel:**
1. Ir a Productos
2. Usar la opción de importación masiva
3. El archivo Excel debe tener las columnas en el formato esperado
4. El sistema valida los datos y muestra errores si los hay antes de importar

### Gestionar categorías

1. Ir a Categorías
2. Crear nuevas categorías con nombre y descripción
3. Las categorías se usan para clasificar productos en el catálogo público
4. Solo aparecen en el catálogo público las categorías que tienen al menos un producto activo con imagen

### Gestionar marcas

1. Ir a Marcas
2. Crear las marcas de vehículos (JAC, Foton, Hyundai, etc.)
3. Las marcas se asignan a cada producto
4. Solo aparecen en los filtros del catálogo público las marcas que tienen al menos un producto activo con imagen

### Gestionar usuarios

1. Ir a Usuarios
2. Se pueden crear usuarios con dos roles: Administrador o Vendedor
3. Los vendedores solo pueden ver productos, no modificarlos
4. Se puede desactivar un usuario para bloquear su acceso sin eliminarlo

---

## Cosas que NO se deben hacer

Estas acciones pueden causar problemas en el sistema o dejarlo inestable:

### En producción

1. **No eliminar todas las categorías o marcas de golpe** si hay productos asociados. Primero eliminar o reasignar los productos. Si se eliminan las categorías/marcas mientras hay productos que las usan, esos productos quedan en un estado inconsistente.

2. **No borrar el usuario admin (ID 1)**. Es el usuario principal del sistema. Si se elimina, se pierde el acceso al panel. Para recuperarlo se debe llamar al endpoint `/api/setup/fix-admin` del backend.

3. **No subir imágenes mayores a 5 MB por producto**. El sistema las procesa y almacena en base64 en la base de datos. Imágenes muy grandes ralentizan la carga del catálogo y consumen almacenamiento innecesario en la BD.

4. **No importar archivos Excel con más de 500 productos a la vez**. La importación masiva tiene un rate limit de 10 requests y un timeout. Para catálogos grandes, dividir el archivo en lotes.

5. **No modificar los archivos `robots.txt`, `sitemap.xml` ni los meta tags en `index.html`** sin saber lo que se hace. Estos archivos controlan cómo Google indexa el sitio. Cambios incorrectos pueden hacer que el sitio desaparezca de los resultados de búsqueda.

6. **No cambiar el dominio en Cloudflare** sin actualizar también la configuración de CORS en el backend (variable `CorsOrigins` en Render), el `sitemap.xml`, y los canonical URLs en el código.

### En desarrollo

1. **No hacer push directo a `main`** sin probar antes en local. Cloudflare Pages hace deploy automático con cada push a main.

2. **No borrar ni renombrar la carpeta `public/`** ya que contiene archivos críticos: `robots.txt`, `sitemap.xml`, `manifest.json`, `_headers`, `_redirects`, service worker e iconos.

3. **No cambiar la estructura de rutas** sin actualizar también el `sitemap.xml` y los canonical URLs en el hook `useDocumentMeta`.

4. **No actualizar React o Vite a versiones mayores** sin verificar compatibilidad. El proyecto usa React 19 y Vite 7 que requieren Node.js 20+.

---

## Estructura de archivos

```
fronted/frontedInversiones/
├── public/
│   ├── robots.txt             # Guía para crawlers de buscadores
│   ├── sitemap.xml            # Mapa del sitio para Google
│   ├── manifest.json          # Configuración PWA
│   ├── service-worker.js      # Service worker para caché offline
│   ├── _headers               # Headers de Cloudflare Pages
│   └── _redirects             # Reglas de rewrite para SPA
├── src/
│   ├── pages/
│   │   ├── Public/            # Páginas visibles para todos
│   │   ├── Admin/             # Panel de administración
│   │   └── Vendedor/          # Panel de vendedor
│   ├── components/            # Componentes reutilizables
│   ├── hooks/                 # Hooks personalizados (useDocumentMeta, etc.)
│   ├── context/               # Contextos de React (Auth, Notifications)
│   ├── routes/                # Configuración de rutas
│   ├── services/              # Lógica de conexión con la API
│   ├── utils/                 # Utilidades y helpers
│   └── api/                   # Configuración de Axios
├── index.html                 # HTML principal con meta tags SEO y JSON-LD
├── vite.config.js             # Configuración de Vite
├── tailwind.config.js         # Configuración de Tailwind CSS
└── package.json               # Dependencias y scripts
```

---

## Tecnologías principales

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.2.4 | Framework de UI |
| Vite | 7.3.1 | Bundler y servidor de desarrollo |
| Tailwind CSS | 3.4.19 | Estilos utilitarios |
| React Router | 7.13.0 | Navegación SPA |
| TanStack Query | 5.x | Gestión de estado del servidor y caché |
| Axios | 1.x | Peticiones HTTP al backend |
