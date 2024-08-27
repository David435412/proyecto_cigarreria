import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import fuera_1 from "../assets/images/fuera_1.jpeg";
import fuera_2 from "../assets/images/fuera_2.jpeg";
import fuera_3 from "../assets/images/fuera_3.jpeg";
import fuera_4 from "../assets/images/fuera_4.jpeg";
import fuera_5 from "../assets/images/fuera_5.jpeg";
import fuera_6 from "../assets/images/fuera_6.jpeg";
import dentro_1 from "../assets/images/dentro_1.jpeg";

const Inicio = () => {

    const [camiones, setCamiones] = useState([]); // Estado para almacenar los datos de los camiones
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Estado para el índice de la imagen actual

    // Lista de imágenes para el carrusel
    const images = [fuera_1, fuera_2, fuera_3, fuera_4, fuera_5, fuera_6, dentro_1];

    useEffect(() => {
        const obtenerCamiones = async () => {
            try {
                const response = await axios.get("http://localhost:4000/camiones"); // Ajusta la URL según tu API
                setCamiones(response.data); // Guarda los datos en el estado
            } catch (error) {
                console.error('Error al obtener los camiones:', error);
            }
        };

        obtenerCamiones(); // Llama a la función cuando el componente se monta
    }, []);

    // Función para manejar la redirección
    const handleRedirect = (id) => {
        navigate(`/Detalle/${id}`);
    
    };

    // Función para avanzar a la siguiente imagen
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Función para retroceder a la imagen anterior
    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    // Avanzar automáticamente las imágenes cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            nextImage();
        }, 3000); // Cambia la imagen cada 3 segundos

        return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    }, [currentImageIndex]); // Añadir currentImageIndex como dependencia

    return (

        <section class=" place-content-center justify-items-center gap-8 mt-5 mb-5">
            <h1 class="text-center mb-4 text-2xl font-bold tracking-tight text-gray-900">Bienvenido a la Cigarreria Colonial</h1>
            <p class="text-center mb-4 text-xl font-bold tracking-tight text-gray-900">En nuestra pagina podras realizar pedidos de los diversos productos que te ofrecemos</p>

            {/* carrusel */}

            <div id="animation-carousel" className="relative h-[550px] w-4/6 m-auto" data-carousel="static">
                <div className="relative overflow-hidden rounded-lg h-[550px]">
                    <img src={images[currentImageIndex]} className="absolute block w-full h-full object-cover " alt="Imagen del carrusel" />
                </div>
                <button
                    type="button"
                    className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={prevImage}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 1 1 5l4 4" />
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>
                <button
                    type="button"
                    className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={nextImage}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 9 4-4-4-4" />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>

            <p class="text-center mt-4 mb-4 text-2xl font-bold tracking-tight text-gray-900">Estas son las categorias de los productos que ofrecemos</p>


        </section>

        
    );
};
export default Inicio;