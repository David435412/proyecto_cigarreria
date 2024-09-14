import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2'; 
import fuera_1 from "../assets/images/fuera_4.jpeg";
import css from "./css.css"

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
    const navigate = useNavigate();

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

    const handleVerMasClick = (id) => {
        Swal.fire({
            title: 'Iniciar sesión',
            text: 'Debes iniciar sesión para poder comprar este producto. ¿Quieres ir a la página de inicio de sesión?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ir al inicio de sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/login`);
            }
        });
    };

    const handleCategoriaClick = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };

    const handleVerTodosClick = () => {
        setCategoriaSeleccionada(''); // Limpiar categoría seleccionada para mostrar todos los productos
    };

    return (
        <section className="place-content-center justify-items-center gap-8 mb-5 bg-gray-100 min-h-screen">
            <header className="bg-black text-white pb-5">
                <img 
                    src={fuera_1} 
                    alt="Fondo" 
                    className="w-full h-96 object-cover filter imagen brightness-50"
                />
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Bienvenido a la Cigarrería Colonial</h1>
                    <p className="text-xl mt-2">Encuentra y realiza pedidos de los mejores productos</p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-4 text-center">Categorías</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Filtros */}
                <div className="mb-6 flex flex-wrap justify-center gap-4">
                    {/* Círculo para mostrar todos los productos */}
                    <div
                        onClick={handleVerTodosClick}
                        className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-24 h-24 flex items-center justify-center transform ${
                            categoriaSeleccionada === '' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'
                        } hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                    >
                        Todos
                    </div>

                    {categorias.map(categoria => (
                        <div
                            key={categoria}
                            onClick={() => handleCategoriaClick(categoria)}
                            className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-24 h-24 flex items-center justify-center transform ${
                                categoriaSeleccionada === categoria ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'
                            } hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                        >
                            {categoria}
                        </div>
                    ))}
                </div>

                {/* Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(producto => (
                            <div key={producto.id} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl">
                                <div className="w-full h-64 relative">
                                    <img 
                                        src={producto.imagen} 
                                        alt={producto.nombre} 
                                        className="object-cover w-full h-full absolute inset-0" 
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold mb-2">{producto.nombre}</h3>
                                    <p className="text-gray-900 font-bold mb-4">${producto.precio}</p>
                                    <button
                                        onClick={() => handleVerMasClick(producto.id)}
                                        className="mt-auto w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
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
