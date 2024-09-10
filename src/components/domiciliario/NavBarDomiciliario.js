import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Logo.png';

const HeaderDomiciliario = () => {
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <header>
            <nav className="bg-gray-300 border-b border-gray-300 px-4 py-3 rounded-b-lg shadow-md relative">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/domiciliario-dash" className="flex items-center space-x-3">
                        <img src={Logo} alt="Logo" className="w-16 h-auto" />
                        <h1 className="text-2xl text-gray-900 font-bold italic">Colonial</h1>
                    </Link>
                    <div className="flex items-center lg:order-2 space-x-2 relative">
                        {/* Menú desplegable de usuario */}
                        <div className="relative">
                            <button onClick={toggleUserMenu} className="text-gray-900 focus:outline-none">
                                <FaUserCircle className="w-6 h-6" />
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                    <ul className="py-2">
                                        <li>
                                            <Link
                                                to="/perfil"
                                                className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                                                onClick={toggleUserMenu}
                                            >
                                                Mi perfil
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        {/* Icono de hamburguesa */}
                        <button onClick={toggleMenu} className="lg:hidden text-gray-900">
                            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                    {/* Menú desplegable en móviles */}
                    <div className={`lg:hidden fixed top-0 left-0 w-full bg-gray-200 border-b border-gray-300 py-4 px-6 transition-transform transform ${isOpen ? "translate-y-0" : "-translate-y-full"} z-50`}>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/domiciliario-dash" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300" onClick={toggleMenu}>Inicio</Link>
                            </li>
                            <li>
                                <Link to="/pedidos-domiciliario" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300" onClick={toggleMenu}>Pedidos</Link>
                            </li>
                        </ul>
                    </div>
                    {/* Menú para pantallas grandes */}
                    <div className="hidden lg:flex lg:w-auto">
                        <ul className="flex flex-col mt-2 space-y-1 font-medium lg:flex-row lg:space-x-8 lg:space-y-0 lg:mt-0">
                            <li>
                                <Link to="/domiciliario-dash" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300" aria-current="page">Inicio</Link>
                            </li>
                            <li>
                                <Link to="/pedidos-domiciliario" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300">Pedidos</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderDomiciliario;
