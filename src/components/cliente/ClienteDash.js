import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import fuera_1 from "../../assets/images/fuera_4.jpeg";
import css from "../../pages/css.css";

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

const ClienteDashboard = () => {
    const [productos, setProductos] = useState([]);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate(); // Para la redirección

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }

        const fetchDatos = async () => {
            try {
                const productosResponse = await axios.get('http://localhost:5000/productos');
                const pedidosResponse = await axios.get('http://localhost:5000/pedidos');

                const productosActivos = productosResponse.data.filter(producto => producto.estado === 'activo');
                setProductos(productosActivos);

                // Contar la cantidad total vendida de cada producto
                const conteoProductos = {};
                pedidosResponse.data.forEach(pedido => {
                    pedido.productos.forEach(producto => {
                        if (!conteoProductos[producto.id]) {
                            conteoProductos[producto.id] = {
                                ...producto,
                                cantidadTotal: 0
                            };
                        }
                        conteoProductos[producto.id].cantidadTotal += producto.cantidad;
                    });
                });

                // Convertir el objeto a un array y ordenar por cantidad total vendida
                const productosMasVendidosArray = Object.values(conteoProductos);
                productosMasVendidosArray.sort((a, b) => b.cantidadTotal - a.cantidadTotal);

                // Obtener los primeros 5 productos más vendidos
                setProductosMasVendidos(productosMasVendidosArray.slice(0, 4));
                setFilteredProducts(productosActivos);

                // Depuración
                console.log('Productos activos:', productosActivos);
                console.log('Pedidos:', pedidosResponse.data);
                console.log('Conteo de productos:', conteoProductos);
                console.log('Productos más vendidos:', productosMasVendidosArray);

            } catch (error) {
                setError('Error al obtener los datos');
                console.error('Error al obtener los datos', error);
            }
        };

        fetchDatos();
    }, []);

    useEffect(() => {
        if (categoriaSeleccionada === '') {
            setFilteredProducts(productos);
        } else {
            setFilteredProducts(productos.filter(producto => producto.categoria === categoriaSeleccionada));
        }
    }, [categoriaSeleccionada, productos]);

    const handleRedirect = (id) => {
        navigate(`/Detalle/${id}`);
    };

    const handleCategoriaClick = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };

    const handleVerTodosClick = () => {
        setCategoriaSeleccionada(''); // Limpiar categoría seleccionada para mostrar todos los productos
    };

    return (
        <>
            <div className="bg-black text-white pb-5">
                <img 
                    src={fuera_1} 
                    alt="Fondo" 
                    className="w-full h-96 object-cover filter imagen brightness-50"
                />
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Bienvenido a la Cigarrería Colonial</h1>
                    <p className="text-xl mt-2">Encuentra y realiza pedidos de los mejores productos</p>
                </div>
            </div>

            {/* Productos más vendidos */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mt-5 mb-4 text-center">Productos más vendidos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productosMasVendidos.length > 0 ? (
                        productosMasVendidos.map(producto => (
                            <Link
                                to={`/producto/${producto.id}`}
                                key={producto.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col"
                            >
                                <div className="w-full h-64 relative flex-shrink-0">
                                    <img
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        className="object-cover w-full h-full" />
                                </div>
                                <div className="p-4 flex flex-col justify-between flex-grow">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                        <p className="text-gray-900 font-bold mb-4">${producto.precio}</p>
                                    </div>
                                    <button
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No hay productos más vendidos disponibles.</p>
                    )}
                </div>
            </div>

            {/* Categorías y productos */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mt-5 mb-4 text-center">Categorías</h1>
                <p className="mb-8 text-center">
                    En esta sección encontrarás una amplia selección de productos.
                    Usa el filtro a continuación para encontrar exactamente lo que buscas por categoría.
                </p>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Filtros */}
                <div className="mb-6 flex flex-wrap justify-center gap-4">
                    {/* Círculo para mostrar todos los productos */}
                    <div
                        onClick={handleVerTodosClick}
                        className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-24 h-24 flex items-center justify-center transform ${categoriaSeleccionada === '' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
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

                {/* Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(producto => (
                            <Link
                                to={`/producto/${producto.id}`}
                                key={producto.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105"
                            >
                                <div className="w-full h-64 relative">
                                    <img
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        className="object-cover w-full h-full absolute inset-0" />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                    <p className="text-gray-900 font-bold mb-4">${producto.precio}</p>
                                    <button
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-auto"
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay productos disponibles en esta categoría.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ClienteDashboard;
