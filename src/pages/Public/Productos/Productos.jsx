import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Productos.module.css';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Disco Ventilado Pro',
    category: 'Frenos',
    price: 1250.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsVma_HniyiWiVw7tYyBVjA4-e6bDyqwn9LPSASpIIP5mm9IYkDJU6jY4Mk-TXov2D8MALvpId3OgNCMxh-oHhlXxPYDFmAkGGynJFjXmlneQTIJyp2oGBpSDnJU5gJo6OT_2D3F0zqU1xwY-esM2znAZvGWVNAUesgx-9IkvShjOb5X2EJkupDODfVypMojZPcCYYmuDwfDaF8KP9UyHOhQZfUoGVKPMbt9XHhsqcl8JBpgOSX8ucpS6KQqQExKL9h0LVEaGHHpM',
    tags: []
  },
  {
    id: 2,
    name: 'Kit Suspensión Racing',
    category: 'Suspensión',
    price: 3400.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD264bgFpAuAgiXuBtL9HDj82voQPySX59rv4S84D6pK0SPhZ5rM8EqxMDebNzC5QDaGIz6_RpgcGoJTSczvaYDjzcjklflk2HlTOeR3HZ9I8tlHRjOpH1pqB9t7hi9R96wXZ0AwtkJAUGjrCkw5VSdaLcnBc-fxD_kaD_hrShGXkbLysU1VxbQyZ-rD4UlUhWAfFeES3_fHSCDy3niPnDcL_rqocl_i-3Qpp5jRe7YI7_R3uGQ5spTrAq2zgR1Kpn0hpfQW3McQK0',
    tags: ['Premium']
  },
  {
    id: 3,
    name: 'Pistones Forjados',
    category: 'Motor',
    price: 850.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpSlsUvUq-_m8lXqXJjSldeyvwjKtdyNQRZYao4Wa4oqPKcizrMedtRVCWfdwuWltFCabfFkKGlvQJd1uZ8aWK0l8Yn3x6EifEVCL4js6Y6041LFopMwvaWeDuSQYVhxj_W4FYPNfNU95xFCdWtmuEN9BT3D-cLD0goRfLIMzPy_s5755wS75RiLivZZRg_Oh2r4oK1UUp8nvnLgq0IyRTaBmuvXQyyXPFkQH9_8rcRm4zKVuvyuP412ekDPSgOkR3ClY9LLlhQLM',
    tags: []
  },
  {
    id: 4,
    name: 'Filtro de Aire Cónico',
    category: 'Admisión',
    price: 120.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqz5kt_f03zOyqB45PxFsmw8ZUfpkIc5E_zEafI4XKZXFIBLd6fyhmnKmyqZ3rUzMMzugyOOEcjc81e0os5CceypC7btByHMXvTn_wvEGvctLeL6OCY1WfZJb2XTWe_g8YiSBJsmz7wFVeDTseVtAPFv024aZaOEObWSMFZWGj1CsOkYXZ49xmhwVCpymAXf1VJTGGMKFe3TsSDFlfI04OsvoMfS75neg1_zrSeVdoiXpq9xewkLE-y7zizIbmYoB0FeJAdDPRVMk',
    tags: ['Nuevo']
  },
  {
    id: 5,
    name: 'Rin Aleación 19" Sport',
    category: 'Rines',
    price: 540.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb4XJSgA7ouss9rulZm2xonXEH0nvwBkUaM8aY5DdGJWOPTBpSKfziR6O6L6-Ce51fFyxH1NCA43VutYuPvJF8B0GrqW0qKhK-QvoomeAISb8i0GUC8KtBuk8jy9Vr16rfQgcJrsrl6RmEhj1L0e-3BftjKUady_1X6oEUzlT6yPbPIxNtKZF876QNaKEc0cWCzYfgn9VIr19uaUlJDojHtR7Qd7bxzQTAugFqf9uHfgaixpERY3-k6uIVLKqlKW5_I0uoFaFbYoc',
    tags: []
  },
  {
    id: 6,
    name: 'Escape Cat-Back Inox',
    category: 'Escape',
    price: 935.00,
    originalPrice: 1100.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbO5T9WGyZ-o0BRY53bmJEBoR4IC5iu4qbFNoSHvU0ENd6eVTnCETNsNe6LJFrzZFUmgWIcMOUJgDzFDBuy3q-WffdMUVokN_Sk-GGPfnYjAV0QuPQaIW3csO3HfUbvk-Q3v9nkPAffnzKMY109Kzgi7m4I1go1tMK2o1VLCyTvpWNcDTUeHb5kViUO7NKxaz-GGP8HHCE6-UfjzjFi09LfdhvJqOoosdnLgabao4kz0KJXGGHonrCzzVjFIQofRHPd_s--y45oYE',
    tags: ['-15%']
  },
  {
    id: 7,
    name: 'Faros LED H7 Ultra',
    category: 'Iluminación',
    price: 85.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl0lYHGVwzuMKI9zZ-Dpo11J-d4Aut5oF-haD-YHaezri621EsdLIajRghxbhcUmIiX4JKtxmRlRYrfKGV8v4eX1DWPbA-w5Sbk-zYoP9ewmkMzLyDn7L4YeO2r7tzlj0ZzbL1K_N5vSnGGr1yEKOn-QIhWF0p_ov2Y__e9-Ykpw3U2ARikVT0gSE26jvhJ4WmGZzZ0ye5DbjXsCCdxh8EPUmVWF9UyDxx_63mi1TYqR-wJzbxCVf1nNU_yxAXm2rugBRCOSDWyAo',
    tags: []
  },
  {
    id: 8,
    name: 'Batería AGM 80Ah',
    category: 'Electrónica',
    price: 210.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXHfN6gmtaBuqHA21f4doasVHH3lZsnyBj5c_9HndOwJwTqnGfq5VVIOZ0qFMrtHTcJkHZIejLWGkNE1iHMgP1i1u4AZMuZ1NlntPlW4knyVWgZKzXyAOys7I7zP6vQwVp7PkLvOn7z6A3wBmK4pclZBSOC9wlLqy_WQMT-yC3bJeUl0IaQdM9fcmPOq02YFYimVM6FjjU4W24ZP9FBOPgv58CfafORMlhNlqEzXPVt3EAB74KEUbXbTvsTduE-VndinpuOc_VPxI',
    tags: []
  },
  {
    id: 9,
    name: 'Pastillas Cerámicas',
    category: 'Frenos',
    price: 650.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsVma_HniyiWiVw7tYyBVjA4-e6bDyqwn9LPSASpIIP5mm9IYkDJU6jY4Mk-TXov2D8MALvpId3OgNCMxh-oHhlXxPYDFmAkGGynJFjXmlneQTIJyp2oGBpSDnJU5gJo6OT_2D3F0zqU1xwY-esM2znAZvGWVNAUesgx-9IkvShjOb5X2EJkupDODfVypMojZPcCYYmuDwfDaF8KP9UyHOhQZfUoGVKPMbt9XHhsqcl8JBpgOSX8ucpS6KQqQExKL9h0LVEaGHHpM',
    tags: []
  },
  {
    id: 10,
    name: 'Amortiguadores Sport',
    category: 'Suspensión',
    price: 1800.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD264bgFpAuAgiXuBtL9HDj82voQPySX59rv4S84D6pK0SPhZ5rM8EqxMDebNzC5QDaGIz6_RpgcGoJTSczvaYDjzcjklflk2HlTOeR3HZ9I8tlHRjOpH1pqB9t7hi9R96wXZ0AwtkJAUGjrCkw5VSdaLcnBc-fxD_kaD_hrShGXkbLysU1VxbQyZ-rD4UlUhWAfFeES3_fHSCDy3niPnDcL_rqocl_i-3Qpp5jRe7YI7_R3uGQ5spTrAq2zgR1Kpn0hpfQW3McQK0',
    tags: []
  },
  {
    id: 11,
    name: 'Kit de Admisión Directa',
    category: 'Admisión',
    price: 2120.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqz5kt_f03zOyqB45PxFsmw8ZUfpkIc5E_zEafI4XKZXFIBLd6fyhmnKmyqZ3rUzMMzugyOOEcjc81e0os5CceypC7btByHMXvTn_wvEGvctLeL6OCY1WfZJb2XTWe_g8YiSBJsmz7wFVeDTseVtAPFv024aZaOEObWSMFZWGj1CsOkYXZ49xmhwVCpymAXf1VJTGGMKFe3TsSDFlfI04OsvoMfS75neg1_zrSeVdoiXpq9xewkLE-y7zizIbmYoB0FeJAdDPRVMk',
    tags: []
  },
  {
    id: 12,
    name: 'Rin 18" Cromo Pulido',
    category: 'Rines',
    price: 480.00,
    originalPrice: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb4XJSgA7ouss9rulZm2xonXEH0nvwBkUaM8aY5DdGJWOPTBpSKfziR6O6L6-Ce51fFyxH1NCA43VutYuPvJF8B0GrqW0qKhK-QvoomeAISb8i0GUC8KtBuk8jy9Vr16rfQgcJrsrl6RmEhj1L0e-3BftjKUady_1X6oEUzlT6yPbPIxNtKZF876QNaKEc0cWCzYfgn9VIr19uaUlJDojHtR7Qd7bxzQTAugFqf9uHfgaixpERY3-k6uIVLKqlKW5_I0uoFaFbYoc',
    tags: []
  }
];

const departments = [
  { id: 'all', name: 'Todos', active: true },
  { id: 'frenos', name: 'Frenos', active: false },
  { id: 'motor', name: 'Motor', active: false },
  { id: 'suspension', name: 'Suspensión', active: false },
  { id: 'electrico', name: 'Eléctrico', active: false }
];

const brands = [
  { id: 'brembo', name: 'Brembo', checked: false },
  { id: 'bosch', name: 'Bosch', checked: true },
  { id: 'hella', name: 'Hella', checked: false }
];

const sortOptions = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-low-high', label: 'Precio: Menor a Mayor' },
  { value: 'newest', label: 'Más Recientes' }
];

export default function Productos() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState(['bosch']);
  const [priceRange, setPriceRange] = useState(2400);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const productsPerPage = 12;
  
  // Filter and sort products
  const filteredProducts = mockProducts.filter(product => {
    // Department filter
    if (selectedDepartment !== 'all' && !product.category.toLowerCase().includes(selectedDepartment)) {
      return false;
    }
    
    // Brand filter - for demo purposes, we'll use a simple match
    if (selectedBrands.length > 0 && !selectedBrands.some(brand => 
      product.name.toLowerCase().includes(brand)
    )) {
      return false;
    }
    
    // Price filter
    if (product.price > priceRange) {
      return false;
    }
    
    // Search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'newest':
        return b.id - a.id; // Assuming higher ID means newer
      default:
        return 0;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  const toggleBrand = (brandId) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };

  const resetFilters = () => {
    setSelectedDepartment('all');
    setSelectedBrands([]);
    setPriceRange(2400);
    setSortBy('relevance');
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="productos-wrapper bg-surface font-sans text-text-main antialiased">
      <div className="relative flex flex-col w-full">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white border-b border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 min-w-fit">
              <div className="text-primary">
                <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
              </div>
              <div>
                <h1 className="text-2xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h1>
                <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide relative pb-1 ${isActive ? 'text-primary font-bold nav-link-active' : 'hover:text-primary'}`
                }
                end
              >
                INICIO
              </NavLink>
              <NavLink
                to="/productos"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide relative pb-1 ${isActive ? 'text-primary font-bold nav-link-active' : 'hover:text-primary'}`
                }
              >
                CATÁLOGO
              </NavLink>
              <NavLink
                to="/servicios"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide relative pb-1 ${isActive ? 'text-primary font-bold nav-link-active' : 'hover:text-primary'}`
                }
              >
                SERVICIOS
              </NavLink>
              <NavLink
                to="/nosotros"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide relative pb-1 ${isActive ? 'text-primary font-bold nav-link-active' : 'hover:text-primary'}`
                }
              >
                EMPRESA
              </NavLink>
            </nav>
            <div className="flex-1 max-w-sm hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Buscar refacción..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-fit">
              <button className="relative p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded transition-colors group">
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-white"></span>
              </button>
              <button className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded transition-colors group">
                <span className="material-symbols-outlined text-[22px]">person</span>
              </button>
              <button
                className="lg:hidden p-2 text-gray-500 hover:text-gray-900 rounded"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row">
          {/* Mobile Filters Button */}
          <div className="lg:hidden p-4 bg-white border-b border-border-light">
            <button 
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <span className="text-sm font-medium">Filtros</span>
              <span className="material-symbols-outlined text-sm">{mobileFiltersOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
          </div>

          {/* Sidebar - Hidden on mobile unless toggled */}
          <aside className={`w-full lg:w-64 flex-shrink-0 border-r border-border-light bg-white p-6 lg:min-h-[calc(100vh-80px)] ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="mb-12">
              <h3 className="text-xs font-bold tracking-wider mb-6 uppercase text-gray-400">Departamentos</h3>
              <div className="flex flex-col gap-2">
                {departments.map(dept => (
                  <label 
                    key={dept.id}
                    className={`group flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedDepartment === dept.id ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => setSelectedDepartment(dept.id)}
                  >
                    <span className={`w-1 h-4 rounded-full transition-colors ${
                      selectedDepartment === dept.id ? 'bg-primary' : 'bg-gray-200 group-hover:bg-primary/50'
                    }`}></span>
                    <span className={`text-sm ${
                      selectedDepartment === dept.id ? 'font-bold text-gray-900' : 'font-medium text-gray-600 group-hover:text-gray-900'
                    }`}>{dept.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="border-t border-border-light pt-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold tracking-wider uppercase text-gray-400">Filtrar Por</h3>
                <button 
                  className="text-[10px] font-bold text-primary uppercase hover:underline"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
              <div className="mb-10">
                <p className="text-xs font-bold mb-4 text-gray-900 uppercase">Marca</p>
                <div className="space-y-3">
                  {brands.map(brand => (
                    <label 
                      key={brand.id}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => toggleBrand(brand.id)}
                    >
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox"
                          className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                          checked={selectedBrands.includes(brand.id)}
                          readOnly
                        />
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <p className="text-xs font-bold mb-5 text-gray-900 uppercase">Rango de Precio</p>
                <div className="px-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600 font-mono">
                  <span>$100</span>
                  <span>${priceRange}</span>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1 p-6 lg:p-10 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Componentes Destacados</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ordenar:</span>
                <select 
                  className="text-sm font-medium bg-gray-50 border-none rounded py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary cursor-pointer text-gray-900"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map(product => (
                <article key={product.id} className="group bg-white rounded-lg border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full">
                  <div className="relative w-full pt-[100%] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <img 
                        alt={product.name} 
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                        src={product.image} 
                      />
                    </div>
                    <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-primary shadow-sm border border-gray-100 transition-colors z-10">
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </button>
                    
                    {product.tags && product.tags.length > 0 && (
                      <div className={`absolute top-2 left-2 ${
                        product.tags[0] === 'Premium' ? 'bg-gray-900' :
                        product.tags[0] === 'Nuevo' ? 'bg-primary' :
                        product.tags[0] === '-15%' ? 'bg-red-100 text-primary' : 'bg-gray-900'
                      } text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide z-10`}>
                        {product.tags[0]}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      {product.originalPrice ? (
                        <div className="flex flex-col leading-none">
                          <span className="text-[10px] text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                          <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      )}
                      <button className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">
                        Ver Más
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="mt-16 flex justify-center pb-8">
              <nav className="flex items-center gap-2">
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="material-symbols-outlined text-sm">west</span>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`w-8 h-8 flex items-center justify-center rounded ${
                        currentPage === pageNum 
                          ? 'bg-primary text-white text-xs font-bold shadow-md shadow-blue-200' 
                          : 'border border-gray-200 text-gray-700 hover:border-primary hover:text-primary text-xs font-medium'
                      } transition-colors`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2 text-gray-400 text-xs">...</span>
                    <button
                      className={`w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-700 hover:border-primary hover:text-primary text-xs font-medium`}
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="material-symbols-outlined text-sm">east</span>
                </button>
              </nav>
            </div>
          </section>
        </main>

        <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-accent">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
                  </div>
                  <h1 className="text-2xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h1>
                  <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Líderes en refacciones de alto rendimiento para entusiastas del motor. Calidad garantizada en cada pieza.
                </p>
                <div className="flex gap-4">
                  <a className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-xs font-bold">IG</span>
                  </a>
                  <a className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-xs font-bold">FB</span>
                  </a>
                  <a className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-xs font-bold">TW</span>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Nuestra Empresa</h4>
                <ul className="space-y-4">
                  <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/nosotros">Sobre Nosotros</Link></li>
                  <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/contacto">Carreras</Link></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Blog Automotriz</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Socios Comerciales</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Políticas</h4>
                <ul className="space-y-4">
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Envíos y Entregas</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Devoluciones</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Garantía de Piezas</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Términos de Servicio</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Contacto</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-accent text-lg mt-0.5">location_on</span>
                    <span className="text-sm text-gray-200">Av. Revolución 1234, CDMX, México</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent text-lg">mail</span>
                    <a className="text-sm text-gray-200 hover:text-white" href="mailto:ventas@estructurapro.com">ventas@estructurapro.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent text-lg">call</span>
                    <span className="text-sm text-gray-200">+52 55 1234 5678</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-800 pt-8 text-[10px] text-blue-200 uppercase tracking-widest gap-4">
              <p>© 2024 ORC Inversiones Perú. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <a className="hover:text-white transition-colors" href="#">Facebook</a>
                <a className="hover:text-white transition-colors" href="#">Instagram</a>
                <a className="hover:text-white transition-colors" href="#">WhatsApp</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}