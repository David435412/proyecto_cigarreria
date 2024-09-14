import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

const RegistroVentas = () => {
    const [productos, setProductos] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedProducts = localStorage.getItem('productosSeleccionados');
        if (storedProducts) {
            setProductosSeleccionados(JSON.parse(storedProducts));
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
        let productosFiltrados = productos;

        if (searchQuery !== '') {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (categoriaSeleccionada !== 'Todos') {
            productosFiltrados = productosFiltrados.filter(producto =>
                producto.categoria === categoriaSeleccionada
            );
        }

        setFilteredProducts(productosFiltrados);
    }, [searchQuery, categoriaSeleccionada, productos]);

    const handleAddProduct = (producto) => {
        if (!productosSeleccionados.find(p => p.id === producto.id)) {
            const updatedSelection = [...productosSeleccionados, { ...producto, cantidad: 1 }];
            setProductosSeleccionados(updatedSelection);
            localStorage.setItem('productosSeleccionados', JSON.stringify(updatedSelection));
        }
    };

    const handleRemoveProduct = (productoId) => {
        const updatedSelection = productosSeleccionados.filter(producto => producto.id !== productoId);
        setProductosSeleccionados(updatedSelection);
        localStorage.setItem('productosSeleccionados', JSON.stringify(updatedSelection));
    };

    const handleQuantityChange = (productoId, cantidad) => {
        const updatedSelection = productosSeleccionados.map(producto =>
            producto.id === productoId ? { ...producto, cantidad: Number(cantidad) } : producto
        );
        setProductosSeleccionados(updatedSelection);
        localStorage.setItem('productosSeleccionados', JSON.stringify(updatedSelection));
    };

    const handleSubmit = () => {
        if (productosSeleccionados.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'Debe seleccionar al menos un producto antes de continuar.',
                icon: 'warning',
                confirmButtonColor: '#197419',
            });
        } else {
            navigate('/confirmar-ventas-cajero', { state: { productosSeleccionados } });
        }
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
                        <div className="flex flex-col space-y-4">
                            {productosSeleccionados.map(producto => (
                                <div key={producto.id} className="w-full bg-white border border-gray-200 rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105 hover:bg-green-100">
                                    <div className="flex items-center mb-4">
                                        <div className="w-16 h-16 relative mr-4">
                                            <img
                                                src={producto.imagen}
                                                alt={producto.nombre}
                                                className="object-cover w-full h-full rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
                                            <p className="text-gray-900">Precio Unitario: ${Number(producto.precio).toFixed(3)}</p>
                                            <input
                                                type="number"
                                                min="1"
                                                value={producto.cantidad}
                                                onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                                                className="p-2 border border-gray-300 rounded w-full mt-2"
                                            />
                                            <p className="text-gray-900 mt-2">
                                                Total: ${(Number(producto.precio) * Number(producto.cantidad)).toFixed(3)}
                                            </p>
                                        </div>
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
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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

                {/* Filtros por categorías */}
                <div className="mb-4 m-auto">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Categorías</h2>
                    <div className="flex flex-wrap gap-4">
                        <div
                            onClick={() => setCategoriaSeleccionada('Todos')}
                            className={`cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-24 h-24 flex items-center justify-center transform ${categoriaSeleccionada === 'Todos' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                        >
                            Todos
                        </div>

                        {categorias.map(categoria => (
                            <div
                                key={categoria}
                                onClick={() => setCategoriaSeleccionada(categoria)}
                                className={`cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-24 h-24 flex items-center justify-center transform ${categoriaSeleccionada === categoria ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                            >
                                {categoria}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(producto => (
                            <div
                                key={producto.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:bg-green-100"
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
                                    <p className="text-gray-900 font-bold mb-4">${Number(producto.precio).toFixed(3)}</p>
                                    <button
                                        onClick={() => handleAddProduct(producto)}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
