import { useState, useEffect } from 'react';

const ImageUploader = ({ 
  images = [], 
  onChange, 
  maxImages = 4
}) => {
  const [error, setError] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [previews, setPreviews] = useState([]);

  // Generar previews cuando cambian las imágenes (solo URLs string)
  useEffect(() => {
    const newPreviews = images
      .filter(img => typeof img === 'string' && img.trim())
      .map(url => ({ type: 'url', url }));
    setPreviews(newPreviews);
  }, [images]);

  // Validar si es una URL válida
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleAddUrl = () => {
    setError(null);
    const url = urlInput.trim();

    if (!url) {
      setError('Ingresa una URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('URL no válida. Debe comenzar con http:// o https://');
      return;
    }

    if (images.length >= maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    // Verificar duplicados
    if (images.includes(url)) {
      setError('Esta URL ya está agregada');
      return;
    }

    onChange([...images, url]);
    setUrlInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Campo para agregar URL */}
      {images.length < maxImages && (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            Agregar URL de Imagen (Backblaze, CDN, etc.)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://f005.backblazeb2.com/file/bucket/imagen.jpg"
              className="flex-1 px-3 py-2 border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50 text-sm"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-blue-600 text-white font-bold text-sm uppercase hover:bg-blue-700 transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Mensajes de Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Grid de previews */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Previews existentes */}
        {previews.map((preview, idx) => (
          <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors">
            <img 
              src={preview.url} 
              alt={`Imagen ${idx + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">Error</text></svg>';
              }}
            />
            
            {/* Overlay acciones */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                title="Eliminar imagen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2">
              <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider">
                Img {idx + 1}
              </span>
            </div>
          </div>
        ))}

        {/* Placeholder para espacios vacíos */}
        {images.length < maxImages && images.length > 0 && (
          <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <span className="text-xs text-gray-400">
              {maxImages - images.length} espacio(s) disponible(s)
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 italic">
        * Pega las URLs de las imágenes subidas a Backblaze u otro CDN. Máximo {maxImages} imágenes.
      </p>
    </div>
  );
};

export default ImageUploader;
