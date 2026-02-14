import { useEffect } from 'react';

/**
 * Hook para actualizar dinámicamente los meta tags del documento.
 * Cambia el <title>, meta description, canonical URL y Open Graph tags
 * cada vez que se navega a una nueva página.
 * 
 * @param {Object} options
 * @param {string} options.title - Título de la página (aparece en la pestaña del navegador)
 * @param {string} options.description - Meta description para SEO
 * @param {string} [options.canonicalPath] - Path canónico (ej: '/productos')
 * @param {string} [options.ogTitle] - Título para Open Graph (si difiere del title)
 * @param {string} [options.ogDescription] - Descripción para Open Graph
 * @param {string} [options.ogImage] - Imagen para Open Graph
 */
export function useDocumentMeta({
    title,
    description,
    canonicalPath,
    ogTitle,
    ogDescription,
    ogImage
}) {
    useEffect(() => {
        const BASE_URL = 'https://orcinversionesperu.com';

        // Actualizar título
        if (title) {
            document.title = title;
        }

        // Actualizar meta description
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            }
        }

        // Actualizar canonical URL
        if (canonicalPath) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                document.head.appendChild(canonical);
            }
            canonical.setAttribute('href', `${BASE_URL}${canonicalPath}`);
        }

        // Actualizar Open Graph tags
        const ogTitleContent = ogTitle || title;
        const ogDescContent = ogDescription || description;

        if (ogTitleContent) {
            const ogTitleMeta = document.querySelector('meta[property="og:title"]');
            if (ogTitleMeta) ogTitleMeta.setAttribute('content', ogTitleContent);

            const twTitleMeta = document.querySelector('meta[name="twitter:title"]');
            if (twTitleMeta) twTitleMeta.setAttribute('content', ogTitleContent);
        }

        if (ogDescContent) {
            const ogDescMeta = document.querySelector('meta[property="og:description"]');
            if (ogDescMeta) ogDescMeta.setAttribute('content', ogDescContent);

            const twDescMeta = document.querySelector('meta[name="twitter:description"]');
            if (twDescMeta) twDescMeta.setAttribute('content', ogDescContent);
        }

        if (canonicalPath) {
            const ogUrlMeta = document.querySelector('meta[property="og:url"]');
            if (ogUrlMeta) ogUrlMeta.setAttribute('content', `${BASE_URL}${canonicalPath}`);
        }

        if (ogImage) {
            const ogImageMeta = document.querySelector('meta[property="og:image"]');
            if (ogImageMeta) ogImageMeta.setAttribute('content', ogImage);

            const twImageMeta = document.querySelector('meta[name="twitter:image"]');
            if (twImageMeta) twImageMeta.setAttribute('content', ogImage);
        }

        // Cleanup: restaurar valores por defecto al desmontar
        return () => {
            document.title = 'ORC Inversiones Perú - Repuestos Coreanos y Chinos para Vehículos';
        };
    }, [title, description, canonicalPath, ogTitle, ogDescription, ogImage]);
}
