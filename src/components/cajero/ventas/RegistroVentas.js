import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaBeer, FaCandyCane, FaBox, FaSoap, FaPills, FaIceCream, FaWineBottle, FaCheese, FaBreadSlice, FaShoppingCart } from 'react-icons/fa';

const categorias = [
    { nombre: 'Licores', icono: <FaWineBottle /> },
    { nombre: 'Confitería', icono: <FaCandyCane /> },
    { nombre: 'Enlatados', icono: <FaBox /> },
    { nombre: 'Aseo', icono: <FaSoap /> },
    { nombre: 'Drogas', icono: <FaPills /> },
    { nombre: 'Helados', icono: <FaIceCream /> },
    { nombre: 'Bebidas', icono: <FaBeer /> },
    { nombre: 'Lacteos', icono: <FaCheese /> },
    { nombre: 'Despensa', icono: <FaBreadSlice /> }
];

const RegistroVentas = () => {
    const [productos, setProductos] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [error, setError] = useState(null);
    const [carritoVisible, setCarritoVisible] = useState(false);

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

    const handleCategoriaClick = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };

    const handleVerTodosClick = () => {
        setCategoriaSeleccionada('Todos');
    };

    return (
        <div className="container mx-auto px-4 py-8 relative">
            <h1 className="text-3xl font-bold mb-4">Registro de Ventas</h1>
            <p className="mb-8">
                En esta sección podrás registrar nuevas ventas. Utiliza la barra de búsqueda para encontrar productos,
                selecciona los productos que deseas incluir en la venta y da clic en Continuar.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Icono del carrito en la esquina superior derecha */}
            <div
                onClick={() => setCarritoVisible(!carritoVisible)}
                className="fixed top-4 right-4 bg-green-600 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-green-700"
            >
                <FaShoppingCart size={24} />
            </div>

            {/* Carrito emergente */}
            {carritoVisible && (
                <div className="fixed top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-sm w-full z-50">
                    <div className="p-4 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4">Carrito</h2>

                        <div className="flex flex-col space-y-4">
                            {productosSeleccionados.length > 0 ? (
                                productosSeleccionados.map(producto => (
                                    <div key={producto.id} className="flex flex-col mb-4 bg-gray-100 p-2 rounded-md border border-gray-200">
                                        <div className="flex items-center mb-2">
                                            <div className="w-16 h-16 relative mr-4">
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                    className="object-cover w-full h-full rounded"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold">{producto.nombre}</h3>
                                                <p className="text-gray-600 text-sm">Precio: ${Number(producto.precio).toFixed(3)}</p>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={producto.cantidad}
                                                    onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                                                    className="mt-1 p-1 border border-gray-300 rounded w-full text-sm"
                                                />
                                                <p className="text-gray-800 text-sm mt-1">
                                                    Total: ${(Number(producto.precio) * Number(producto.cantidad)).toFixed(3)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveProduct(producto.id)}
                                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 w-20 mt-2"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                ))
                            ) : (
                                <p>No hay productos en el carrito.</p>
                            )}
                            <button
                                onClick={handleSubmit}
                                className="bg-green-600 text-white my-4 px-4 py-2 rounded mt-4 hover:bg-green-700 w-full"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                <div className="mb-6 flex flex-wrap justify-center gap-4">
                    <div
                        onClick={handleVerTodosClick}
                        className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-16 h-16 flex flex-col items-center justify-center transform ${categoriaSeleccionada === 'Todos' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-600 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                        >
                        <p className="text-center">Todos</p>
                    </div>
                    {categorias.map((categoria, index) => (
                        <div
                            key={index}
                            onClick={() => handleCategoriaClick(categoria.nombre)}
                            className={`bg-gray-300 cursor-pointer p-3 border rounded-full shadow-xl text-sm font-medium text-center transition-transform duration-300 ease-in-out w-16 h-16 flex flex-col items-center justify-center transform ${categoriaSeleccionada === categoria.nombre ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-black border-gray-300'} hover:bg-green-500 hover:text-white hover:scale-110 hover:-translate-y-2 hover:shadow-2xl`}
                            >
                            {categoria.icono}
                            <p className="text-center">{categoria.nombre}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tarjetas de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(producto => (
                    <div key={producto.id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-md flex flex-col">
                        <div className="w-full h-64 relative mb-4">
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="object-cover w-full h-full rounded-t-md"
                            />
                        </div>
                        <div className="flex-1 mt-2 flex flex-col">
                            <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                            <p className="text-gray-600 text-sm">Precio: ${Number(producto.precio).toFixed(3)}</p>
                            <p className="text-gray-600 text-sm">Marca: {producto.marca}</p>
                            <p className="text-gray-600 text-sm">Cantidad: {producto.cantidad}</p>
                            <div className="mt-auto">
                                <button
                                    onClick={() => handleAddProduct(producto)}
                                    className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 w-full"
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default RegistroVentas;
