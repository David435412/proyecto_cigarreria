import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaArchive, FaBox } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Importa los estilos de SweetAlert2

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

    // Maneja la confirmación de eliminación utilizando SweetAlert2
    const handleEliminar = (producto) => {
        Swal.fire({
            title: 'Confirmar Inactivación',
            text: `¿Estás seguro de que quieres inactivar el producto "${producto.nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Inactivar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/productos/${producto.id}`, { ...producto, estado: 'inactivo' });
                    fetchProductos();
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Producto inactivado exitosamente.',
                        icon: 'success',
                        timer: 1500, // La alerta se mostrará durante 1.5 segundos
                        showConfirmButton: false,


                    });
                } catch (error) {
                    console.error('Error al inactivar el producto', error);
                    setError('No se pudo inactivar el producto.');
                }
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Gestión de Productos</h1>
            <p className="mb-8">
                En esta sección podrás gestionar tus productos. Puedes agregar nuevos productos
                y visualizar los productos que ya has registrado.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => navigate('/registro-productos')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Producto
                </button>
                <button
                    onClick={() => navigate('/productos-inactivos')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaArchive className="inline-block mr-2" /> Productos Inactivos
                </button>
                <button
                    onClick={() => navigate('/productos-agotados')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    <FaBox className="inline-block mr-2" /> Productos Agotados
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
                        <div key={producto.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
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
                                        onClick={() => navigate(`/editar-producto/${producto.id}`)}
                                        className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(producto)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center"
                                    >
                                        <FaTrash className="mr-1" /> Inactivar
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
