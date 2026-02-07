// Middleware para SPA routing en Cloudflare Pages
export async function onRequest(context) {
  try {
    // Intentar servir el asset estático primero
    const response = await context.next();
    
    // Si es exitoso, retornar la respuesta
    if (response.status !== 404) {
      return response;
    }
    
    // Si es 404 y no es un archivo estático, servir index.html
    const url = new URL(context.request.url);
    const path = url.pathname;
    
    // Si la ruta tiene extensión de archivo, retornar 404
    if (path.match(/\.[a-zA-Z0-9]+$/)) {
      return response;
    }
    
    // Para rutas sin extensión (rutas del SPA), servir index.html
    const indexUrl = new URL('/index.html', url.origin);
    return context.env.ASSETS.fetch(indexUrl);
    
  } catch (error) {
    // En caso de error, intentar servir index.html
    const url = new URL(context.request.url);
    const indexUrl = new URL('/index.html', url.origin);
    return context.env.ASSETS.fetch(indexUrl);
  }
}
