import React from "react";
import { Link } from "react-router-dom";
import Logo from '../../assets/images/Logo.png'

const Header = () => {
    return (
        <>
            <header>
                <nav class="bg-green-500 border-gray-200 px-4 py-2.5 rounded-b-lg">
                    <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <Link to="/inicio" class="flex items-center ">
                            <img src={Logo} alt="CigarreriaC - Logo" class="w-16 h-auto" />

                            <h1 class=" py-2 px-2  rounded-lg self-center text-3xl text-black hover:text-gray-500 italic font-serif">Colonial</h1>
                        </Link>
                        <div class="flex items-center lg:order-2">
                            <a href="/login" class="text-gray-800 hover:bg-black hover:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-4  py-2  mr-2 focus:outline-none">Log in</a>
                            <a href="/registro-cliente" class="text-gray-800 hover:bg-black hover:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-4 py-2 mr-2 focus:outline-none">Registrate</a>

                        </div>
                        <div class="hidden justify-between items-center w-full lg:flex lg:w-auto " id="mobile-menu-2">
                            <ul class="flex flex-col mt-1 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li>
                                    <a href="/inicio" class="block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-600 lg:p-0" aria-current="page">Home</a>
                                </li>
                                <li>
                                    <a href="pedidos-a" class="block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-600 lg:p-0">Pedidos
                                    </a>
                                </li>
                                <li>
                                    <a href="/carrito-a" class="block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-gray-600 lg:p-0 ">Carrito</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>


    );
};
export default Header;