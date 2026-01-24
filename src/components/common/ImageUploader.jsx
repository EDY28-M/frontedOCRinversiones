import { useState, useEffect, useCallback } from 'react';

const ImageUploader = ({ 
  images = [], 
  onChange, 
  maxImages = 4,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'] 
}) => {
  const [error, setError] = useState(null);
  const [previews, setPreviews] = useState([]);

  // Generar previews cuando cambian las imágenes
  useEffect(() => {
    const newPreviews = images.map(img => {
      if (typeof img === 'string') return { type: 'url', url: img };
      if (img instanceof File) return { type: 'file', url: URL.createObjectURL(img) };
      return null;
    }).filter(Boolean);

    setPreviews(newPreviews);

    // Cleanup de ObjectURLs
    return () => {
      newPreviews.forEach(p => {
        if (p.type === 'file') URL.revokeObjectURL(p.url);
      });
    };
  }, [images]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setError(null);

    if (images.length + files.length > maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const validFiles = [];
    for (const file of files) {
      // Validar tipo
      if (!acceptedTypes.includes(file.type)) {
        setError(`Tipo de archivo no válido: ${file.name}. Solo ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`);
        return;
      }
      // Validar tamaño
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Archivo demasiado grande: ${file.name}. Máximo ${maxSizeMB}MB`);
        return;
      }
      validFiles.push(file);
    }

    onChange([...images, ...validFiles]);
    // Reset input
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Mensajes de Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Previews existentes */}
        {previews.map((preview, idx) => (
          <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors">
            <img 
              src={preview.url} 
              alt={`Imagen ${idx + 1}`} 
              className="w-full h-full object-cover"
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

        {/* Botón Agregar */}
        {images.length < maxImages && (
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">
              {images.length === 0 ? 'Agregar imagen' : 'Agregar otra'}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Max {maxImages} imgs
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              multiple // Permitir selección múltiple
            />
          </label>
        )}
      </div>

      <p className="text-xs text-gray-500 italic">
        * Formatos permitidos: JPG, PNG, WEBP. Máximo {maxSizeMB}MB por archivo.
      </p>
    </div>
  );
};

export default ImageUploader;
