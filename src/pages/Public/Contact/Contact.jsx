import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    alert('Mensaje enviado. Nos pondremos en contacto pronto.');
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-secondary mb-4 uppercase tracking-wider border-b-4 border-primary inline-block pb-2">
            Contacto
          </h1>
          <p className="text-gray-600 text-lg mt-6">
            Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulario */}
          <div className="bg-white p-8 shadow-lg border-t-4 border-primary">
            <h2 className="text-2xl font-bold text-secondary mb-6 uppercase tracking-wide">
              Envíanos un Mensaje
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-secondary focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-secondary focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-secondary focus:outline-none transition-colors bg-gray-50 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-secondary focus:outline-none transition-colors bg-gray-50 text-sm font-semibold resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-secondary font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-md hover:shadow-lg"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Información */}
          <div className="space-y-8">
            <div className="bg-white p-8 shadow-lg border-t-4 border-primary">
              <h2 className="text-2xl font-bold text-secondary mb-6 uppercase tracking-wide">
                Información de Contacto
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary mb-1 uppercase text-sm">Dirección</h3>
                    <p className="text-gray-600 text-sm">
                      Perú<br />
                      [Dirección completa aquí]
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">phone</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary mb-1 uppercase text-sm">Teléfono</h3>
                    <p className="text-gray-600 text-sm">+51 XXX XXX XXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">email</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary mb-1 uppercase text-sm">Email</h3>
                    <p className="text-gray-600 text-sm">info@orcinversiones.pe</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary mb-1 uppercase text-sm">Horario</h3>
                    <p className="text-gray-600 text-sm">
                      Lunes - Viernes: 8:00 AM - 6:00 PM<br />
                      Sábados: 8:00 AM - 2:00 PM
                    </p>
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

export default Contact;
