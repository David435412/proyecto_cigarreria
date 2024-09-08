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

const categorias = [
    'Licores',
    'Confitería',
    'Enlatados',
    'Aseo',
    'Medicamentos',
    'Helados',
    'Bebidas',
    'Lacteos',
    'Panadería'
];

const Inicio = () => {
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Para la redirección
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Estado para el índice de la imagen actual


    useEffect(() => {        
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/productos');
                const productosActivos = response.data.filter(producto => producto.estado === 'activo');
                setProductos(productosActivos);
                setFilteredProducts(productosActivos); 
            } catch (error) {
                setError('Error al obtener los productos');
                console.error('Error al obtener los productos', error);
            }
        };

        fetchProductos();
    }, []);

    useEffect(() => {       
        if (categoriaSeleccionada === '') {
            setFilteredProducts(productos);
        } else {
            setFilteredProducts(productos.filter(producto => producto.categoria === categoriaSeleccionada));
        }
    }, [categoriaSeleccionada, productos]);

    const handleVerMasClick = () => {
        alert('Inicia sesión para poder comprar productos');
        navigate('/login');
    };

    // Lista de imágenes para el carrusel
    const images = [fuera_1, fuera_2, fuera_3, fuera_4, fuera_5, fuera_6, dentro_1];

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

            <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Encuentra los Mejores Productos</h1>
            <p className="mb-8">
                En esta sección encontrarás una amplia selección de productos. 
                Usa el filtro a continuación para encontrar exactamente lo que buscas por categoría.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Filtros */}
            <div className="mb-6 flex space-x-4">
                <select 
                    value={categoriaSeleccionada} 
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)} 
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                </select>
            </div>

            {/* Productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(producto => (
                        <div key={producto.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden ">
                            <div className="w-full h-64 relative">
                                <img 
                                    src={producto.imagen} 
                                    alt={producto.nombre} 
                                    className="object-cover w-full h-full absolute inset-0" 
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>                                
                                <p className="text-gray-900 font-bold mb-4">${producto.precio}</p>
                                <button
                                    onClick={handleVerMasClick}
                                    className="w-full  bg-green-800 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-black "
                                >
                                    Ver más
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay productos disponibles.</p>
                )}
            </div>
        </div>

        </section>

        
    );
};
export default Inicio;