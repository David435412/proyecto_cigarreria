import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

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

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [error, setError] = useState('');
    const [productoAEliminar, setProductoAEliminar] = useState(null);
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

    // Filtrar productos según la categoría seleccionada y estado activo
    const productosFiltrados = productos.filter(producto =>
        (categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada) && producto.estado === 'activo'
    );

    // Maneja el cambio de estado a inactivo
    const handleEliminar = (producto) => {
        setProductoAEliminar(producto);
        setShowModal(true);
    };

    // Cambia el estado del producto a inactivo
    const handleDelete = async () => {
        if (!productoAEliminar) return;

        try {
            await axios.put(`http://localhost:5000/productos/${productoAEliminar.id}`, { ...productoAEliminar, estado: 'inactivo' });
            fetchProductos();
            setShowModal(false);
        } catch (error) {
            console.error('Error al inactivar el producto', error);
            setError('No se pudo inactivar el producto.');
        } finally {
            setProductoAEliminar(null);
        }
    };

    return (
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-4">Gestión de Productos</h1>
            <p class="mb-8">
                En esta sección podrás gestionar tus productos. Puedes agregar nuevos productos
                y visualizar los productos que ya has registrado.
            </p>

            {error && <p class="text-red-500 mb-4">{error}</p>}

            <div class="mb-4">
                <button
                    onClick={() => navigate('/registro-productos')}
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <FaPlus class="inline-block mr-2" /> Registrar Producto
                </button>
            </div>

            <div class="mb-6">
                <select
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    class="p-2 border border-gray-300 rounded"
                >
                    {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.length === 0 ? (
                    <p class="text-gray-500">No hay productos disponibles en la base de datos.</p>
                ) : productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                        <div key={producto.id} class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                            <div class="w-full h-64 relative">
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    class="object-cover w-full h-full absolute inset-0"
                                />
                            </div>
                            <div class="p-4">
                                <h2 class="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                <p class="text-gray-900 font-bold mb-4">${producto.precio}</p>
                                <p class="text-gray-700 mb-4">Marca: {producto.marca}</p> 
                                <div class="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/editar-producto/${producto.id}`)}
                                        class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center"
                                    >
                                        <FaEdit class="mr-1" /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(producto)}
                                        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                                    >
                                        <FaTrash class="mr-1" /> Inactivar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p class="text-gray-500">No hay productos en esta categoría.</p>
                )}
            </div>

            {showModal && (
                <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 class="text-xl font-semibold mb-4">Confirmar Inactivación</h2>
                        <p class="mb-4">¿Estás seguro de que quieres inactivar el producto "{productoAEliminar?.nombre}"?</p>
                        <div class="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Inactivar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionProductos;
