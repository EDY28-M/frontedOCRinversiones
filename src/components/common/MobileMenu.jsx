import { Link, NavLink } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * MobileMenu - Slide-over drawer navigation
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Function to close the menu
 */
const MobileMenu = ({ isOpen, onClose }) => {
    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-slide-in-right">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">settings_b_roll</span>
                        <div>
                            <h2 className="text-xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h2>
                            <p className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
                    <NavLink
                        to="/"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `text-xl font-display font-medium tracking-wide transition-colors flex items-center justify-between group ${isActive ? 'text-primary' : 'text-gray-800 hover:text-primary'
                            }`
                        }
                    >
                        INICIO
                        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                    </NavLink>

                    <NavLink
                        to="/productos"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `text-xl font-display font-medium tracking-wide transition-colors flex items-center justify-between group ${isActive ? 'text-primary' : 'text-gray-800 hover:text-primary'
                            }`
                        }
                    >
                        CATÁLOGO
                        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                    </NavLink>

                    <NavLink
                        to="/servicios"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `text-xl font-display font-medium tracking-wide transition-colors flex items-center justify-between group ${isActive ? 'text-primary' : 'text-gray-800 hover:text-primary'
                            }`
                        }
                    >
                        SERVICIOS
                        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                    </NavLink>

                    <NavLink
                        to="/nosotros"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `text-xl font-display font-medium tracking-wide transition-colors flex items-center justify-between group ${isActive ? 'text-primary' : 'text-gray-800 hover:text-primary'
                            }`
                        }
                    >
                        EMPRESA
                        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                    </NavLink>
                </nav>


            </div>
        </div>
    );
};

export default MobileMenu;
