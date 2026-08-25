import { useState, useEffect } from 'react';
import { getAllValidImageUrls } from '../utils/imageUtils';

const ProductDetailModal = ({ product, onClose, isPublic = false }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [quantity, setQuantity] = useState(1);

  // Número de WhatsApp de la empresa
  const whatsappNumber = "51984244498";

  // Helper function to remove code from title
  const getDisplayTitle = () => {
    if (!product?.producto) return '';
    // if (!isPublic) return product.producto; // Eliminar esta línea para que siempre limpie el código
    if (!product.codigo) return product.producto;

    try {
      // Escape special regex chars
      const escapedCode = product.codigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match: whitespace(opt) + (opt) + code + )opt
      const pattern = new RegExp(`\\s*\\(?${escapedCode}\\)?`, 'gi');
      return product.producto.replace(pattern, '').trim();
    } catch (e) {
      return product.producto;
    }
  };

  useEffect(() => {
    if (product) {
      // Recopilar solo imágenes con URL válida
      const productImages = getAllValidImageUrls(product);

      setImages(productImages);
      setSelectedImage(productImages[0] || null);
      setImageErrors(new Set());
      setQuantity(1); // Reset quantity when product changes
    }
  }, [product]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleComprar = () => {
    const mensaje = `¡Hola! Me interesa comprar:

📦 *Producto:* ${product.producto}
🔢 *Cantidad:* ${quantity}
📋 *Código:* ${product.codigo || 'N/A'}

Por favor, quisiera más información sobre disponibilidad y precio.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleConsultar = () => {
    const mensaje = `¡Hola! Tengo una consulta sobre el producto:

📦 *Producto:* ${product.producto}
📋 *Código:* ${product.codigo || 'N/A'}

¿Podrían brindarme más información?`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!product) return null;

  // Parse ficha técnica si existe (formato JSON o string)
  let fichaTecnica = [];
  try {
    if (product.fichaTecnica) {
      fichaTecnica = JSON.parse(product.fichaTecnica);
    }
  } catch (e) {
    // Si no es JSON, tratar como texto plano
    fichaTecnica = [];
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-7xl my-4 md:my-8 shadow-2xl relative max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors group"
        >
          <span className="material-symbols-outlined text-gray-600 group-hover:text-red-600">close</span>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Breadcrumb */}
          <nav className="text-xs uppercase font-medium text-gray-500 mb-4 sm:mb-6 tracking-wider pr-10">
            <ol className="list-none p-0 inline-flex flex-wrap">
              <li className="flex items-center">
                <span>Inicio</span>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span>{product.categoryName || 'Productos'}</span>
                <span className="mx-2">/</span>
              </li>
              <li className="text-blue-600 font-bold truncate max-w-xs">
                {product.producto}
              </li>
            </ol>
          </nav>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

            {/* IZQUIERDA - Imágenes */}
            <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">

              {/* Imagen Principal */}
              {images.length > 0 ? (
                <>
                  <div className="relative border border-gray-200 p-2 sm:p-4 md:p-8 shadow-sm group bg-white">
                    {/* Badges */}
                    <div className="absolute top-0 left-0 flex flex-col gap-1 sm:gap-2 p-2 sm:p-4 z-10">
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wide shadow-sm">
                        {product.categoryName || 'Producto'}
                      </span>
                      {product.marcaNombre && (
                        <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 uppercase tracking-wide shadow-sm">
                          {product.marcaNombre}
                        </span>
                      )}
                    </div>

                    <div className="w-full flex items-center justify-center overflow-hidden bg-gray-50 border border-gray-100">
                      <img
                        alt={product.producto}
                        className="object-contain w-full h-auto max-h-[350px] sm:max-h-[400px] md:max-h-[500px] transform group-hover:scale-105 transition-transform duration-500"
                        src={selectedImage}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          setImageErrors(prev => new Set(prev).add(selectedImage));
                          // Auto-seleccionar la siguiente imagen válida
                          const nextValid = images.find(img => img !== selectedImage && !imageErrors.has(img));
                          if (nextValid) setSelectedImage(nextValid);
                        }}
                      />
                    </div>
                  </div>

                  {/* Miniaturas (solo si hay más de 1 imagen) */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 sm:gap-4">
                      {images.filter(img => !imageErrors.has(img)).map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className={`border-2 p-1 bg-white transition-all ${selectedImage === img
                            ? 'border-blue-600'
                            : 'border-gray-200 hover:border-blue-400'
                            }`}
                        >
                          <img
                            alt={`Vista ${index + 1}`}
                            className={`w-full h-12 sm:h-20 object-cover transition-opacity ${selectedImage === img ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                              }`}
                            src={img}
                            onError={(e) => {
                              e.target.parentElement.style.display = 'none';
                              setImageErrors(prev => new Set(prev).add(img));
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="border border-gray-200 p-8 bg-gray-50 flex items-center justify-center h-96">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-gray-300 text-6xl mb-2">image_not_supported</span>
                    <p className="text-gray-400">Sin imágenes disponibles</p>
                  </div>
                </div>
              )}
            </div>

            {/* DERECHA - Información */}
            <div className="lg:col-span-5 flex">
              <div className="bg-white border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8 w-full flex flex-col">

                {/* Título y Marca */}
                <div className="mb-3 sm:mb-4">
                  {product.marcaNombre && (
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {product.marcaNombre}
                    </p>
                  )}
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-3">
                    {getDisplayTitle()}
                  </h1>

                  <div className="space-y-1 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    {product.codigo && (
                      <p>
                        SKU <span className="font-semibold text-gray-900 font-mono">{product.codigo}</span>
                      </p>
                    )}
                    <p>
                      Vendido por <span className="font-semibold text-gray-900">ORC Inversiones Perú</span>
                    </p>
                    {product.categoryName && (
                      <p>
                        Categoría <span className="font-semibold text-gray-900">{product.categoryName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Descripción (si existe) */}
                {product.descripcion && (
                  <div className="prose prose-sm text-gray-600 mb-4 max-w-none">
                    <p>{product.descripcion}</p>
                  </div>
                )}

                {/* Estado y Acciones */}
                <div className="mt-auto">
                  {/* Estado de disponibilidad */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-green-500 shrink-0"></span>
                    <span className="text-sm font-semibold text-green-600">
                      {product.isActive ? 'Disponible en Stock' : 'No Disponible'}
                    </span>
                  </div>

                  {/* Selector de cantidad y botón Comprar */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center h-12 border-2 border-gray-300 rounded overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        className="w-10 h-full text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold tabular-nums border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        className="w-10 h-full text-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleComprar}
                      className="flex-1 h-12 rounded bg-[#d4a017] hover:bg-[#b8860b] text-white font-bold text-sm sm:text-base uppercase tracking-wide transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                      COMPRAR
                    </button>
                  </div>

                  {/* Botón Consultar con Asesor */}
                  <button
                    type="button"
                    onClick={handleConsultar}
                    className="w-full h-12 rounded bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-sm sm:text-base uppercase tracking-wide transition-colors shadow-sm flex items-center justify-center gap-2 mb-5"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    CONSULTAR CON ASESOR
                  </button>

                  {/* Envíos y Asesoría */}
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">Disponible envío a domicilio</p>
                        <button
                          type="button"
                          onClick={handleConsultar}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Consultar
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">Disponible retiro en tienda</p>
                        <p className="text-[11px] text-gray-500">Av. Nicolás Ayllón 4329 - Ate, Lima</p>
                        <button
                          type="button"
                          onClick={handleConsultar}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Consultar
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-green-50 text-[#25D366] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">Asesoría por WhatsApp</p>
                        <button
                          type="button"
                          onClick={handleConsultar}
                          className="text-xs text-[#25D366] font-medium hover:underline"
                        >
                          Escribir ahora
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
