import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png"

const Footer = () => {

    return (
        <>
        <footer class="bg-green-500 border-gray-200 px-4 lg:px-6 py-2.5 rounded-t-lg">
            <div class="w-full mx-auto p-2 md:py-8">
                <div>
                    <a class="flex items-center mb-2 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src={Logo} class="w-16 h-16"></img>
                        <span class="self-center text-3xl italic font-serif whitespace-nowrap text-black"> Colonial</span>
                    </a>
                </div>
                <hr class="my-3 border-black sm:mx-auto lg:my-4" />
                <span class="block text-sm text-gray-800 sm:text-center ">Estamos ubicados en chapinero alto Calle 57 #5-04</span>
                <span class="block text-sm text-gray-800 sm:text-center ">Contactenos al número fijo 3475838</span>
                <span class="block text-sm text-gray-800 sm:text-center ">o por whatsapp a los números 313 3000604 - 321 3313788</span>

            </div>
        </footer>
        </>
    );
};

export default Footer;