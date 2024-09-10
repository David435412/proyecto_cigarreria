import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';

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

    const handleRedirect = (id) => {
        navigate(`/Detalle/${id}`);
    };

    return (

        <>
        <div className="bg-green-600 text-white p-6 shadow-md mt-5 mb-5">
            <h1 className="text-center mb-4 text-4xl font-bold">
                Bienvenido a la Cigarreria Colonial, {userName}
            </h1>
            <p className="text-center mb-4 text-xl">
                En nuestra pagina podras realizar pedidos de los diversos productos que te ofrecemos
            </p>
        </div>
        <div className="container mx-auto px-4 py-8">

                <h1 className="text-3xl font-bold mt-5 mb-4">Encuentra los Mejores Productos</h1>
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
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        Ver más
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay productos disponibles.</p>
                    )}
                </div>
            </div></>
    );
};

export default ClienteDashboard;
