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
                    onClick={() => navigate('/registro-prod-cajero')}
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
                                        onClick={() => navigate(`/editar-prod-cajero/${producto.id}`)}
                                        class="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 flex items-center"
                                    >
                                        <FaEdit class="mr-1" /> Editar
                                    </button>                                    
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p class="text-gray-500">No hay productos en esta categoría.</p>
                )}
            </div>
          
        </div>
    );
};

export default GestionProductos;
