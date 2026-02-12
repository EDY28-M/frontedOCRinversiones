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
    if (!isPublic) return product.producto;
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

                {/* Título y códigos */}
                <div className="mb-3 sm:mb-4">
                  <h2 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                    {product.categoryName?.toUpperCase() || 'PRODUCTO'}
                  </h2>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {getDisplayTitle()}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-600 border-b border-gray-100 pb-4">
                    {!isPublic && (
                      <span className="flex items-center gap-1">
                        <span className="text-blue-600 material-symbols-outlined text-sm">qr_code</span>
                        Código: <span className="font-bold text-gray-900">{product.codigo}</span>
                      </span>
                    )}
                    {!isPublic && (
                      <span className="flex items-center gap-1">
                        <span className="text-blue-600 material-symbols-outlined text-sm">tag</span>
                        Código Com.: <span className="font-bold text-gray-900">{product.codigoComer}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                {product.descripcion && (
                  <div className="prose prose-sm text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-none">
                    <p>{product.descripcion}</p>
                  </div>
                )}

                {/* Ficha Técnica - Solo visible en vista privada (admin) */}
                {!isPublic && (
                  <div className="mb-4 sm:mb-6 md:mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-bold text-gray-900 uppercase border-l-4 border-blue-600 pl-2">
                        Ficha Técnica
                      </h3>
                    </div>

                    {fichaTecnica.length > 0 ? (
                      <div className="overflow-x-auto overflow-hidden border border-gray-200">
                        <table className="min-w-full text-xs sm:text-sm text-left">
                          <tbody className="divide-y divide-gray-200">
                            {fichaTecnica.map((item, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-2 sm:px-4 py-2 font-medium text-gray-700 w-1/3">{item.label}</td>
                                <td className="px-2 sm:px-4 py-2 text-gray-600 font-mono">{item.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="border border-gray-200 p-4 bg-gray-50 text-center">
                        <p className="text-sm text-gray-400">No hay ficha técnica disponible</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Estado y Acciones */}
                <div className="mt-auto">
                  {/* Estado de disponibilidad */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex h-3 w-3 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${product.isActive ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className={`text-sm font-medium ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {product.isActive ? 'Disponible en Stock' : 'No Disponible'}
                    </span>
                  </div>

                  {/* Selector de cantidad y botón Comprar */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3">
                    {/* Selector de cantidad */}
                    <div className="flex border border-gray-300 bg-white w-full sm:w-32">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                      >
                        -
                      </button>
                      <input
                        className="w-full text-center border-none bg-transparent focus:ring-0 text-gray-800 font-bold"
                        type="text"
                        value={quantity}
                        readOnly
                      />
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Botón Comprar */}
                    <button
                      onClick={handleComprar}
                      className="flex-1 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors font-bold uppercase tracking-wide py-3 px-4 sm:px-6 shadow-md flex justify-center items-center gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                      Comprar
                    </button>
                  </div>

                  {/* Botón Consultar con Asesor */}
                  <button
                    onClick={handleConsultar}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors font-bold uppercase tracking-wide py-3 px-4 sm:px-6 flex justify-center items-center gap-2 rounded-lg text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Consultar con Asesor
                  </button>
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
