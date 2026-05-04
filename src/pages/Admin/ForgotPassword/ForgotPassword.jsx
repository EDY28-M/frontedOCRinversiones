import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../../services/authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [serverStatus, setServerStatus] = useState('checking');
    const warmupStarted = useRef(false);

    // Warmup del servidor
    useEffect(() => {
        if (warmupStarted.current) return;
        warmupStarted.current = true;

        const wakeUpServer = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 45000);
                const response = await fetch(`${API_BASE_URL}/auth/ping`, {
                    signal: controller.signal,
                    cache: 'no-store',
                });
                clearTimeout(timeoutId);
                if (response.ok) setServerStatus('ready');
            } catch {
                setServerStatus('ready');
            }
        };

        setServerStatus('waking');
        const timer = setTimeout(wakeUpServer, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err) {
            if (err.response?.status === 400) {
                setError('Por favor, ingresa un correo electrónico válido');
            } else if (err.request) {
                setError('No se pudo conectar con el servidor. Intenta más tarde');
            } else {
                setError('Ocurrió un error. Intenta más tarde');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full font-admin overflow-hidden bg-gray-900">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    alt="Taller de servicio de camiones pesados"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPDU-7DqgZqFjr5rnw339dXlW-iaHbgMWr-oUlGLHmyXhtLEH2Juu0Hir_I_DybM3Gft3mxUrByH49b2ALkQrv5ENZXmqUWByWHsj7hJHfI6iFASrntTDbCF54dqIjYDpOVFWDnXaxfOTlzLo-EPypn5QPjQn2xaN2JbZy-al_q5rNoWj_puTjkhF1DvJTDkTl0Zn7oVILm2zKXW9PZfOW3kefsZIo_OmGGKMEX6LCy01TRRwIcP5GTL6318TrWnWVl8wQYDPeI6o"
                />
                <div className="absolute inset-0 bg-secondary/90 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Card */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm bg-white shadow-sharp rounded-none border-t-[6px] border-primary">
                    {/* Logo Section */}
                    <div className="pt-10 pb-6 flex flex-col items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 bg-secondary flex items-center justify-center rounded-none shadow-sm">
                                <span className="material-symbols-outlined text-primary text-4xl">
                                    settings
                                </span>
                            </div>
                            <div className="flex flex-col items-start leading-none select-none">
                                <h1 className="text-3xl font-extrabold text-secondary tracking-wide">
                                    ORC
                                </h1>
                                <h2 className="text-lg font-bold text-accent tracking-tight">
                                    INVERSIONES
                                </h2>
                                <h3 className="text-[0.6rem] font-bold text-gray-500 tracking-[0.3em] uppercase w-full">
                                    PERÚ
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 pb-10">
                        <div className="mb-8 text-center">
                            <h2 className="text-xl font-bold text-secondary uppercase tracking-widest inline-block border-b-2 border-primary pb-1">
                                Recuperar Clave
                            </h2>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mt-2">
                                Ingresa tu correo electrónico
                            </p>
                        </div>

                        {sent ? (
                            /* Success State */
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined text-green-600 text-3xl">
                                        mark_email_read
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-secondary mb-2">
                                        ¡Correo enviado!
                                    </p>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Si el correo <span className="font-bold">{email}</span> está registrado,
                                        recibirás un enlace para restablecer tu contraseña.
                                        Revisa también tu carpeta de spam.
                                    </p>
                                </div>
                                <Link
                                    to="/admin/login"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary uppercase tracking-wide transition-colors duration-200 mt-4"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        arrow_back
                                    </span>
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        ) : (
                            /* Form State */
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Input */}
                                <div className="group">
                                    <label
                                        className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2"
                                        htmlFor="email"
                                    >
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-gray-400 text-[20px] group-focus-within:text-secondary transition-colors">
                                                mail
                                            </span>
                                        </div>
                                        <input
                                            className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-0 transition-colors rounded-none bg-gray-50 text-sm font-semibold"
                                            id="email"
                                            name="email"
                                            placeholder="tu@correo.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 py-2 px-3 rounded-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-2">
                                    {serverStatus === 'waking' && (
                                        <div className="flex items-center justify-center gap-2 mb-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 py-2 px-3 rounded-sm animate-pulse">
                                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            <span className="font-semibold uppercase tracking-wide">Conectando al servidor...</span>
                                        </div>
                                    )}
                                    <button
                                        className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-extrabold text-black bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200 uppercase tracking-widest rounded-none shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Enviando...
                                            </span>
                                        ) : 'Enviar Enlace'}
                                    </button>
                                </div>

                                {/* Back Link */}
                                <div className="text-center">
                                    <Link
                                        to="/admin/login"
                                        className="text-xs font-bold text-gray-500 hover:text-secondary uppercase tracking-wide transition-colors duration-200"
                                    >
                                        ← Volver al inicio de sesión
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest font-semibold">
                            © 2024 ORC Inversiones Perú. V3.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
