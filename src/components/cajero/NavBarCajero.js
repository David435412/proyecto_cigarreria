import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Logo.png';

const HeaderCajero = () => {
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header>
            <nav className="bg-gray-300 border-b border-gray-300 px-4 py-3 rounded-b-lg shadow-md relative">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/cajero-dash" className="flex items-center space-x-3">
                        <img src={Logo} alt="Logo" className="w-16 h-auto" />
                        <h1 className="text-2xl text-gray-900 font-bold italic">Colonial</h1>
                    </Link>
                    <div className="flex items-center lg:order-2 space-x-2">
                        <button
                            onClick={handleLogout}
                            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-4 py-2 transition duration-300"
                        >
                            Cerrar sesión
                        </button>
                        <button onClick={toggleMenu} className="lg:hidden text-gray-900">
                            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                    {/* Menú desplegable en móviles */}
                    <div className={`lg:hidden fixed top-0 left-0 w-full bg-gray-200 border-b border-gray-300 py-4 px-6 transition-transform transform ${isOpen ? "translate-y-0" : "-translate-y-full"} z-50`}>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/cajero-dash" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300" onClick={toggleMenu}>Inicio</Link>
                            </li>
                            <li>
                                <Link to="/productos-cajero" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300" onClick={toggleMenu}>Productos</Link>
                            </li>
                            <li>
                                <Link to="/proveedores-cajero" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300" onClick={toggleMenu}>Proveedores</Link>
                            </li>
                            <li>
                                <Link to="/ventas-cajero" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300" onClick={toggleMenu}>Ventas</Link>
                            </li>
                            <li>
                                <Link to="/pedidos-cajero" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300" onClick={toggleMenu}>Pedidos</Link>
                            </li>
                        </ul>
                    </div>
                    {/* Menú para pantallas grandes */}
                    <div className="hidden lg:flex lg:w-auto">
                        <ul className="flex flex-col mt-2 space-y-1 font-medium lg:flex-row lg:space-x-8 lg:space-y-0 lg:mt-0">
                            <li>
                                <Link to="/cajero-dash" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300" aria-current="page">Inicio</Link>
                            </li>
                            <li>
                                <Link to="/productos-cajero" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300">Productos</Link>
                            </li>
                            <li>
                                <Link to="/proveedores-cajero" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300">Proveedores</Link>
                            </li>
                            <li>
                                <Link to="/ventas-cajero" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300">Ventas</Link>
                            </li>
                            <li>
                                <Link to="/pedidos-cajero" className="block py-2 px-4 text-gray-900 hover:bg-gray-300 rounded-lg transition duration-300">Pedidos</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HeaderCajero;
