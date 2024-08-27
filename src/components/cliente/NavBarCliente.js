import React, {useContext} from "react";
import { Link } from "react-router-dom";
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Logo.png'

const HeaderCliente = () => {
    const { logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <header>
                <nav class="bg-green-300 border-gray-200 px-4 lg:px-6 py-2.5 rounded-b-lg">
                    <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <Link to="/cliente-dash" class="flex items-center ">
                            <img src={Logo} alt="CigarreriaC - Logo" class="w-16 h-auto" />

                            <h1 class=" py-2 px-2  rounded-lg self-center text-3xl text-black hover:text-gray-500 italic font-serif">Colonial</h1>
                        </Link>
                        <div class="flex items-center lg:order-2">
                            <button
                                onClick={handleLogout}
                                class="text-gray-800 hover:bg-black hover:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                            >
                                Cerrar sesión
                            </button>
                            <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="mobile-menu-2" aria-expanded="false">
                                <span class="sr-only">Open main menu</span>
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                                </svg>
                                <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                            <ul class="flex flex-col mt-1 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li>
                                    <Link to="/cliente-dash" class="block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-600 lg:p-0" aria-current="page">Home</Link>
                                </li>
                                <li>
                                    <Link to="/productos" class="block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-600 lg:p-0">Productos</Link>
                                </li>
                                <li>
                                    <Link to="/pedidos" class="block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-600 lg:p-0">Pedidos</Link>
                                </li>
                                <li>
                                    <Link to="/carrito" class="block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-600 lg:p-0">Carrito</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default HeaderCliente;
