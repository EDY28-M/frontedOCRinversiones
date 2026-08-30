import { applySeoToHtml, buildSeo, shouldIntercept } from './seo-html.js';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const response = await context.next();

  if (!shouldIntercept(url.pathname)) {
    return response;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  try {
    const html = await response.text();
    const seo = await buildSeo(url.pathname);
    const injected = applySeoToHtml(html, seo);
    const headers = new Headers(response.headers);
    headers.set('cache-control', 'public, max-age=120');
    return new Response(injected, {
      status: response.status,
      headers,
    });
  } catch {
    return response;
  }
}
