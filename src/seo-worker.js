import { applySeoToHtml, buildSeo, shouldIntercept } from '../functions/seo-html.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

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
  },
};
