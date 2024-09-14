import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

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

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [error, setError] = useState('');
    const [mostrarAgotados, setMostrarAgotados] = useState(false);

    const navigate = useNavigate();

    // Obtener los productos de la API
    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos', error);
            setError('No se pudieron cargar los productos.');
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    // Filtrar productos según la categoría seleccionada y estado activo o agotado
    const productosFiltrados = productos.filter(producto => {
        if (mostrarAgotados) {
            return producto.cantidad === 0;
        }
        return (categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada) && producto.estado === 'activo';
    });

    const handleCategoriaClick = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };

    const handleVerTodosClick = () => {
        setCategoriaSeleccionada('Todos'); // Establecer a 'Todos' para mostrar todos los productos
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Gestión de Productos</h1>
            <p className="mb-8 text-center">
                En esta sección podrás consultar todos los productos que ofrecemos y los productos agotados
            </p>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <div className="mb-4 flex space-x-4 place-content-center">
                <button
                    onClick={() => navigate('/productos-agotados-cajero')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 m-3"
                >
                   Productos Agotados
                </button>
            </div>

            <h2 className="text-3xl font-bold mt-8 mb-8 text-center">
                Categorías
            </h2>

            {/* Filtros */}
            <div className="mb-6 flex flex-wrap justify-center gap-4">
                {/* Círculo para mostrar todos los productos */}
                <div
                    onClick={handleVerTodosClick}
                    className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-24 h-24 flex items-center justify-center transform ${categoriaSeleccionada === 'Todos' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                >
                    Todos
                </div>

                {categorias.map(categoria => (
                    <div
                        key={categoria}
                        onClick={() => handleCategoriaClick(categoria)}
                        className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-24 h-24 flex items-center justify-center transform ${categoriaSeleccionada === categoria ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                    >
                        {categoria}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.length === 0 ? (
                    <p className="text-gray-500">No hay productos disponibles en la base de datos.</p>
                ) : productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                        <div 
                            key={producto.id} 
                            className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105"
                        >
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
                                <p className="text-gray-700 mb-4">Marca: {producto.marca}</p> 
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/editar-prod-cajero/${producto.id}`)}
                                        className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Editar
                                    </button>                                    
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay productos en esta categoría.</p>
                )}
            </div>
        </div>
    );
};

export default GestionProductos;
