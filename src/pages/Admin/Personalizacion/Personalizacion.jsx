import { useCallback, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorAlert, PageLoader } from '../../../components/common';
import { useNotification } from '../../../context/NotificationContext';
import { siteSettingsService } from '../../../services/siteSettingsService';
import { siteSettingsKeys } from '../../../hooks/usePublicSiteSettings';
import { resolveMediaUrl } from '../../../utils/mediaUrl';
import { SHOWCASE_SHAPES, ShowcaseShapePreview } from '../../../components/common/CategoryLinesShowcase';

function previewSrc(url) {
  return resolveMediaUrl(url);
}

function ImageSlot({
  label,
  hint,
  url,
  onUpload,
  onClear,
  isSaving,
}) {
  const inputRef = useRef(null);
  const src = previewSrc(url);

  return (
    <div className="border border-gray-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">{label}</p>
      <div className="flex items-start gap-4">
        <div className="w-28 h-28 bg-slate-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
          {src ? (
            <img src={src} alt="" className="w-full h-full object-contain" />
          ) : (
            <span className="material-symbols-outlined text-slate-300 text-3xl">image</span>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-[#F5C344] text-black text-xs font-bold uppercase tracking-wide hover:bg-[#eab308] disabled:opacity-50"
            >
              {src ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
            {src && (
              <button
                type="button"
                disabled={isSaving}
                onClick={onClear}
                className="px-4 py-2 border border-gray-200 text-slate-600 text-xs font-bold uppercase tracking-wide hover:bg-gray-50 disabled:opacity-50"
              >
                Quitar
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) onUpload(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Personalizacion() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useNotification();
  const [error, setError] = useState(null);

  const settingsQuery = useQuery({
    queryKey: ['admin-site-settings'],
    queryFn: () => siteSettingsService.get(),
    staleTime: 5 * 1000,
  });

  const categoriesQuery = useQuery({
    queryKey: ['admin-category-media'],
    queryFn: () => siteSettingsService.getCategoryMedia(),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const invalidatePublic = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: siteSettingsKeys.public });
    queryClient.invalidateQueries({ queryKey: ['public-categories'] });
    queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
    queryClient.invalidateQueries({ queryKey: ['admin-category-media'] });
  }, [queryClient]);

  const logoMutation = useMutation({
    mutationFn: (file) => siteSettingsService.uploadLogo(file),
    onSuccess: () => {
      invalidatePublic();
      success('Logo actualizado');
    },
    onError: (err) => showError(err?.data?.message || err.message || 'No se pudo subir el logo'),
  });

  const showcaseMutation = useMutation({
    mutationFn: (shape) => siteSettingsService.updateShowcase(shape),
    onSuccess: () => {
      invalidatePublic();
      success('Forma de la vitrina actualizada');
    },
    onError: (err) => showError(err?.data?.message || err.message || 'No se pudo guardar la forma'),
  });

  const clearLogoMutation = useMutation({
    mutationFn: () => siteSettingsService.updateLogoUrl(''),
    onSuccess: () => {
      invalidatePublic();
      success('Logo restablecido');
    },
    onError: (err) => showError(err?.data?.message || err.message || 'No se pudo quitar el logo'),
  });

  const categoryImageMutation = useMutation({
    mutationFn: ({ id, file }) => siteSettingsService.uploadCategoryImage(id, file),
    onSuccess: () => {
      invalidatePublic();
      success('Imagen de categoría actualizada');
    },
    onError: (err) => showError(err?.data?.message || err.message || 'No se pudo subir la imagen'),
  });

  const categoryOverlayMutation = useMutation({
    mutationFn: ({ id, file }) => siteSettingsService.uploadCategoryOverlay(id, file),
    onSuccess: () => {
      invalidatePublic();
      success('Capa superior actualizada');
    },
    onError: (err) => showError(err?.data?.message || err.message || 'No se pudo subir la capa'),
  });

  const clearCategoryMutation = useMutation({
    mutationFn: ({ id, field }) =>
      siteSettingsService.updateCategoryMedia(id, { [field]: '' }),
    onSuccess: () => {
      invalidatePublic();
      success('Imagen quitada');
    },
    onError: (err) => showError(err?.data?.message || err.message || 'No se pudo quitar la imagen'),
  });

  const logoUrl = settingsQuery.data?.logoUrl || settingsQuery.data?.LogoUrl || '';
  const showcaseShape = settingsQuery.data?.showcaseShape || settingsQuery.data?.ShowcaseShape || 'gear';
  const categories = categoriesQuery.data || [];
  const loading = settingsQuery.isLoading || categoriesQuery.isLoading;
  const saving =
    logoMutation.isPending ||
    clearLogoMutation.isPending ||
    showcaseMutation.isPending ||
    categoryImageMutation.isPending ||
    categoryOverlayMutation.isPending ||
    clearCategoryMutation.isPending;

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">Personalización</h1>
        <p className="text-slate-500 text-sm mt-1">
          Logo del sitio e imágenes de las líneas de pieza que se muestran en el inicio.
        </p>
      </div>

      {error && <ErrorAlert error={error} onClose={() => setError(null)} title="Error" />}

      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">Logo del sitio</h2>
        <ImageSlot
          label="Logo"
          hint="Se muestra en el encabezado y pie de la web pública y en este panel. JPG, PNG, WEBP o SVG. Máximo 4 MB."
          url={logoUrl}
          isSaving={saving}
          onUpload={(file) => logoMutation.mutate(file)}
          onClear={() => clearLogoMutation.mutate()}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
          Forma de las líneas en inicio
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Marco de pieza para la vitrina debajo de Especialistas en Marcas. El listado sale de Categorías: si creas, editas o borras una línea, se refleja en el inicio.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {SHOWCASE_SHAPES.map((item) => {
            const active = showcaseShape === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={saving}
                onClick={() => showcaseMutation.mutate(item.id)}
                className={`border text-left overflow-hidden ${
                  active ? 'border-[#F5C344] ring-2 ring-[#F5C344]' : 'border-gray-200 hover:border-slate-400'
                } disabled:opacity-50`}
              >
                <ShowcaseShapePreview shape={item.id} />
                <span className="block px-2 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-700">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
          Líneas de pieza (categorías)
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Estas fotos aparecen en el selector del inicio. La imagen base es el fondo; la capa superior se dibuja encima.
        </p>
        <div className="space-y-6">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-500">No hay categorías. Créalas primero en Categorías.</p>
          ) : (
            categories.map((cat) => {
              const id = cat.id || cat.Id;
              const name = cat.name || cat.Name || 'Categoría';
              const imageUrl = cat.imageUrl || cat.ImageUrl || '';
              const overlayUrl = cat.overlayImageUrl || cat.OverlayImageUrl || '';
              return (
                <div key={id} className="border border-gray-200 bg-slate-50">
                  <div className="px-4 py-3 border-b border-gray-200 bg-white">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">{name}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 p-4">
                    <ImageSlot
                      label="Imagen de la línea"
                      hint="Foto de la pieza (pernos, pistón, etc.)."
                      url={imageUrl}
                      isSaving={saving}
                      onUpload={(file) => categoryImageMutation.mutate({ id, file })}
                      onClear={() => clearCategoryMutation.mutate({ id, field: 'imageUrl' })}
                    />
                    <ImageSlot
                      label="Capa encima (opcional)"
                      hint="Se superpone sobre la imagen de la línea."
                      url={overlayUrl}
                      isSaving={saving}
                      onUpload={(file) => categoryOverlayMutation.mutate({ id, file })}
                      onClear={() => clearCategoryMutation.mutate({ id, field: 'overlayImageUrl' })}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
