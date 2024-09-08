import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaRedo, FaArrowLeft } from 'react-icons/fa';

const categorias = [
    'Todos',
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

const ProductosInactivos = () => {
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [error, setError] = useState('');
    const [productoAReactivar, setProductoAReactivar] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    // Filtrar productos según la categoría seleccionada y estado inactivo
    const productosFiltrados = productos.filter(producto =>
        (categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada) && producto.estado === 'inactivo'
    );

    // Maneja el cambio de estado a activo
    const handleReactivar = (producto) => {
        setProductoAReactivar(producto);
        setShowModal(true);
    };

    // Cambia el estado del producto a activo
    const handleActivate = async () => {
        if (!productoAReactivar) return;

        try {
            await axios.put(`http://localhost:5000/productos/${productoAReactivar.id}`, { ...productoAReactivar, estado: 'activo' });
            fetchProductos();
            setShowModal(false);
        } catch (error) {
            console.error('Error al reactivar el producto', error);
            setError('No se pudo reactivar el producto.');
        } finally {
            setProductoAReactivar(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Productos Inactivos</h1>
            <p className="mb-8">
                Aquí puedes gestionar los productos que han sido inactivados. Puedes reactivar los productos según sea necesario.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4 flex items-center gap-4">
                <button
                    onClick={() => navigate('/gestion-productos')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
                >
                    <FaArrowLeft className="mr-2" /> Volver a Productos Activos
                </button>
            </div>

            <div className="mb-6">
                <select
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.length === 0 ? (
                    <p className="text-gray-500">No hay productos disponibles en la base de datos.</p>
                ) : productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
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
                                <p className="text-gray-700 mb-4">Marca: {producto.marca}</p> 
                                <div className="flex gap-1">                                    
                                    <button
                                        onClick={() => handleReactivar(producto)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
                                    >
                                        <FaRedo className="mr-1" /> Reactivar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay productos en esta categoría.</p>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-xl font-semibold mb-4">Confirmar Reactivación</h2>
                        <p className="mb-4">¿Estás seguro de que quieres reactivar el producto "{productoAReactivar?.nombre}"?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleActivate}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Reactivar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductosInactivos;
