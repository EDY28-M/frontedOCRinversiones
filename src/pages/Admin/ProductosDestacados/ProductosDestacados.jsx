import { useState } from 'react';

const ProductosDestacados = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            Productos Destacados
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona los productos destacados que se mostrarán en la página principal
          </p>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="bg-white border border-gray-300 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3 placeholder-slate-400 transition-all font-mono shadow-sm"
            placeholder="BUSCAR PRODUCTOS..."
            type="text"
          />
        </div>
        <select className="bg-white border border-gray-300 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 p-3 cursor-pointer font-mono shadow-sm uppercase tracking-wide min-w-[200px]">
          <option>TODAS LAS CATEGORÍAS</option>
          <option>FRENOS</option>
          <option>SUSPENSIÓN</option>
          <option>MOTOR</option>
          <option>ADMISIÓN</option>
          <option>RINES</option>
          <option>ESCAPE</option>
          <option>ILUMINACIÓN</option>
          <option>ELECTRÓNICA</option>
        </select>
      </div>

      {/* Contenedor de Productos */}
      <div className="bg-white border border-gray-200 shadow-sm flex flex-col">
        {/* Header interno con paginación */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
          <div className="text-sm text-slate-600 font-mono">
            Mostrando <span className="font-bold">12</span> productos
          </div>
          
          {/* Paginación */}
          <nav className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <span className="material-symbols-outlined text-sm">west</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-xs font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium">3</button>
            <span className="px-2 text-gray-400 text-xs">...</span>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <span className="material-symbols-outlined text-sm">east</span>
            </button>
          </nav>
        </div>

        {/* Grid de productos */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {/* Producto 1 */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Disco de Freno" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsVma_HniyiWiVw7tYyBVjA4-e6bDyqwn9LPSASpIIP5mm9IYkDJU6jY4Mk-TXov2D8MALvpId3OgNCMxh-oHhlXxPYDFmAkGGynJFjXmlneQTIJyp2oGBpSDnJU5gJo6OT_2D3F0zqU1xwY-esM2znAZvGWVNAUesgx-9IkvShjOb5X2EJkupDODfVypMojZPcCYYmuDwfDaF8KP9UyHOhQZfUoGVKPMbt9XHhsqcl8JBpgOSX8ucpS6KQqQExKL9h0LVEaGHHpM"/>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Frenos</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Disco Ventilado Pro</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$1,250.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 2 (Premium) */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Suspensión" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuD264bgFpAuAgiXuBtL9HDj82voQPySX59rv4S84D6pK0SPhZ5rM8EqxMDebNzC5QDaGIz6_RpgcGoJTSczvaYDjzcjklflk2HlTOeR3HZ9I8tlHRjOpH1pqB9t7hi9R96wXZ0AwtkJAUGjrCkw5VSdaLcnBc-fxD_kaD_hrShGXkbLysU1VxbQyZ-rD4UlUhWAfFeES3_fHSCDy3niPnDcL_rqocl_i-3Qpp5jRe7YI7_R3uGQ5spTrAq2zgR1Kpn0hpfQW3McQK0"/>
                </div>
                <div className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide z-10">Premium</div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suspensión</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Kit Suspensión Racing</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$3,400.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 3 */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Motor" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpSlsUvUq-_m8lXqXJjSldeyvwjKtdyNQRZYao4Wa4oqPKcizrMedtRVCWfdwuWltFCabfFkKGlvQJd1uZ8aWK0l8Yn3x6EifEVCL4js6Y6041LFopMwvaWeDuSQYVhxj_W4FYPNfNU95xFCdWtmuEN9BT3D-cLD0goRfLIMzPy_s5755wS75RiLivZZRg_Oh2r4oK1UUp8nvnLgq0IyRTaBmuvXQyyXPFkQH9_8rcRm4zKVuvyuP412ekDPSgOkR3ClY9LLlhQLM"/>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Motor</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Pistones Forjados</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$850.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 4 (Nuevo) */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Admisión" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqz5kt_f03zOyqB45PxFsmw8ZUfpkIc5E_zEafI4XKZXFIBLd6fyhmnKmyqZ3rUzMMzugyOOEcjc81e0os5CceypC7btByHMXvTn_wvEGvctLeL6OCY1WfZJb2XTWe_g8YiSBJsmz7wFVeDTseVtAPFv024aZaOEObWSMFZWGj1CsOkYXZ49xmhwVCpymAXf1VJTGGMKFe3TsSDFlfI04OsvoMfS75neg1_zrSeVdoiXpq9xewkLE-y7zizIbmYoB0FeJAdDPRVMk"/>
                </div>
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide z-10">Nuevo</div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admisión</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Filtro de Aire Cónico</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$120.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 5 */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Rines" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb4XJSgA7ouss9rulZm2xonXEH0nvwBkUaM8aY5DdGJWOPTBpSKfziR6O6L6-Ce51fFyxH1NCA43VutYuPvJF8B0GrqW0qKhK-QvoomeAISb8i0GUC8KtBuk8jy9Vr16rfQgcJrsrl6RmEhj1L0e-3BftjKUady_1X6oEUzlT6yPbPIxNtKZF876QNaKEc0cWCzYfgn9VIr19uaUlJDojHtR7Qd7bxzQTAugFqf9uHfgaixpERY3-k6uIVLKqlKW5_I0uoFaFbYoc"/>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rines</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Rin Aleación 19" Sport</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$540.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 6 (-15%) */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Escape" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbO5T9WGyZ-o0BRY53bmJEBoR4IC5iu4qbFNoSHvU0ENd6eVTnCETNsNe6LJFrzZFUmgWIcMOUJgDzFDBuy3q-WffdMUVokN_Sk-GGPfnYjAV0QuPQaIW3csO3HfUbvk-Q3v9nkPAffnzKMY109Kzgi7m4I1go1tMK2o1VLCyTvpWNcDTUeHb5kViUO7NKxaz-GGP8HHCE6-UfjzjFi09LfdhvJqOoosdnLgabao4kz0KJXGGHonrCzzVjFIQofRHPd_s--y45oYE"/>
                </div>
                <div className="absolute top-2 left-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide z-10">-15%</div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Escape</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Escape Cat-Back Inox</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <div className="flex flex-col leading-none">
                    <span className="text-[10px] text-gray-400 line-through">$1,100.00</span>
                    <span className="text-base font-bold text-gray-900">$935.00</span>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 7 */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Iluminación" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl0lYHGVwzuMKI9zZ-Dpo11J-d4Aut5oF-haD-YHaezri621EsdLIajRghxbhcUmIiX4JKtxmRlRYrfKGV8v4eX1DWPbA-w5Sbk-zYoP9ewmkMzLyDn7L4YeO2r7tzlj0ZzbL1K_N5vSnGGr1yEKOn-QIhWF0p_ov2Y__e9-Ykpw3U2ARikVT0gSE26jvhJ4WmGZzZ0ye5DbjXsCCdxh8EPUmVWF9UyDxx_63mi1TYqR-wJzbxCVf1nNU_yxAXm2rugBRCOSDWyAo"/>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Iluminación</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Faros LED H7 Ultra</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$85.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 8 */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Batería" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXHfN6gmtaBuqHA21f4doasVHH3lZsnyBj5c_9HndOwJwTqnGfq5VVIOZ0qFMrtHTcJkHZIejLWGkNE1iHMgP1i1u4AZMuZ1NlntPlW4knyVWgZKzXyAOys7I7zP6vQwVp7PkLvOn7z6A3wBmK4pclZBSOC9wlLqy_WQMT-yC3bJeUl0IaQdM9fcmPOq02YFYimVM6FjjU4W24ZP9FBOPgv58CfafORMlhNlqEzXPVt3EAB74KEUbXbTvsTduE-VndinpuOc_VPxI"/>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Electrónica</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Batería AGM 80Ah</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$210.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 9 */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Pastillas" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsVma_HniyiWiVw7tYyBVjA4-e6bDyqwn9LPSASpIIP5mm9IYkDJU6jY4Mk-TXov2D8MALvpId3OgNCMxh-oHhlXxPYDFmAkGGynJFjXmlneQTIJyp2oGBpSDnJU5gJo6OT_2D3F0zqU1xwY-esM2znAZvGWVNAUesgx-9IkvShjOb5X2EJkupDODfVypMojZPcCYYmuDwfDaF8KP9UyHOhQZfUoGVKPMbt9XHhsqcl8JBpgOSX8ucpS6KQqQExKL9h0LVEaGHHpM"/>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Frenos</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Pastillas Cerámicas</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$650.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 10 */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Amortiguadores" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuD264bgFpAuAgiXuBtL9HDj82voQPySX59rv4S84D6pK0SPhZ5rM8EqxMDebNzC5QDaGIz6_RpgcGoJTSczvaYDjzcjklflk2HlTOeR3HZ9I8tlHRjOpH1pqB9t7hi9R96wXZ0AwtkJAUGjrCkw5VSdaLcnBc-fxD_kaD_hrShGXkbLysU1VxbQyZ-rD4UlUhWAfFeES3_fHSCDy3niPnDcL_rqocl_i-3Qpp5jRe7YI7_R3uGQ5spTrAq2zgR1Kpn0hpfQW3McQK0"/>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suspensión</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Amortiguadores Sport</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$1,800.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 11 */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Kit Admisión" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqz5kt_f03zOyqB45PxFsmw8ZUfpkIc5E_zEafI4XKZXFIBLd6fyhmnKmyqZ3rUzMMzugyOOEcjc81e0os5CceypC7btByHMXvTn_wvEGvctLeL6OCY1WfZJb2XTWe_g8YiSBJsmz7wFVeDTseVtAPFv024aZaOEObWSMFZWGj1CsOkYXZ49xmhwVCpymAXf1VJTGGMKFe3TsSDFlfI04OsvoMfS75neg1_zrSeVdoiXpq9xewkLE-y7zizIbmYoB0FeJAdDPRVMk"/>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Admisión</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Kit de Admisión Directa</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$2,120.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

            {/* Producto 12 */}
            <article className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
              <div className="relative w-full pt-[100%] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img alt="Rin 18" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb4XJSgA7ouss9rulZm2xonXEH0nvwBkUaM8aY5DdGJWOPTBpSKfziR6O6L6-Ce51fFyxH1NCA43VutYuPvJF8B0GrqW0qKhK-QvoomeAISb8i0GUC8KtBuk8jy9Vr16rfQgcJrsrl6RmEhj1L0e-3BftjKUady_1X6oEUzlT6yPbPIxNtKZF876QNaKEc0cWCzYfgn9VIr19uaUlJDojHtR7Qd7bxzQTAugFqf9uHfgaixpERY3-k6uIVLKqlKW5_I0uoFaFbYoc"/>
                </div>
                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-red-600 shadow-sm border border-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rines</p>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">Rin 18" Cromo Pulido</h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-base font-bold text-gray-900">$480.00</span>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">Ver Más</button>
                </div>
              </div>
            </article>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductosDestacados;
