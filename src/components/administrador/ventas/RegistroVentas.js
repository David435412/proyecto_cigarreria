import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistroVentas = () => {
    const [productos, setProductos] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
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
        if (searchQuery === '') {
            setFilteredProducts(productos);
        } else {
            setFilteredProducts(
                productos.filter(producto =>
                    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, productos]);

    const handleAddProduct = (producto) => {
        if (!productosSeleccionados.find(p => p.id === producto.id)) {
            setProductosSeleccionados(prev => [...prev, { ...producto, cantidad: 1 }]);
        }
    };

    const handleRemoveProduct = (productoId) => {
        setProductosSeleccionados(prev => prev.filter(producto => producto.id !== productoId));
    };

    const handleQuantityChange = (productoId, cantidad) => {
        setProductosSeleccionados(prev => 
            prev.map(producto => 
                producto.id === productoId ? { ...producto, cantidad: Number(cantidad) } : producto
            )
        );
    };

    const handleSubmit = () => {
        // Redirige a la página de confirmación de venta y pasa los datos de los productos seleccionados
        navigate('/confirmar-venta', { state: { productosSeleccionados } });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Registro de Ventas</h1>
            <p className="mb-8">
                En esta sección podrás registrar nuevas ventas. Utiliza la barra de búsqueda para encontrar productos,
                selecciona los productos que deseas incluir en la venta y da clic en Continuar.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Productos Seleccionados */}
            <div className="mb-8">
                {productosSeleccionados.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Productos Seleccionados</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {productosSeleccionados.map(producto => (
                                <div key={producto.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex items-center p-4">
                                    <div className="w-16 h-16 relative mr-4">
                                        <img
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                            className="object-cover w-full h-full absolute inset-0"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
                                        <input
                                            type="number"
                                            min="1"
                                            value={producto.cantidad}
                                            onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                                            className="p-2 border border-gray-300 rounded w-full"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleRemoveProduct(producto.id)}
                                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Botón Registrar Venta */}
            <div className="mb-8 flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Continuar
                </button>
            </div>

            {/* Barra de búsqueda y productos */}
            <div className="mb-6 flex flex-col space-y-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos por nombre"
                    className="p-2 border border-gray-300 rounded w-full"
                />

                {/* Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(producto => (
                            <div key={producto.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
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
                                        onClick={() => handleAddProduct(producto)}
                                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay productos disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistroVentas;
