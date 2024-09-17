import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaArchive, FaBox } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

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
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [error, setError] = useState('');
    const [cantidad, setCantidad] = useState(''); // Estado para manejar la cantidad en el modal
    const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Producto actual en edición

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
        (categoriaSeleccionada === '' || producto.categoria === categoriaSeleccionada) && producto.estado === 'activo'
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
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    console.error('Error al inactivar el producto', error);
                    setError('No se pudo inactivar el producto.');
                }
            }
        });
    };

    // Maneja la apertura del modal para cambiar stock
    const handleCambiarStock = (producto) => {
        setProductoSeleccionado(producto);
        setCantidad(producto.cantidad); // Carga la cantidad actual en el modal
        Swal.fire({
            title: `Cambiar stock de ${producto.nombre}`,
            html: `<input type="number" id="cantidad" class="swal2-input" placeholder="Cantidad" value="${producto.cantidad}" min="0">`,
            focusConfirm: false,
            preConfirm: () => {
                const nuevaCantidad = Swal.getPopup().querySelector('#cantidad').value;
                return nuevaCantidad;
            }
        }).then(async (result) => {
            if (result.value !== undefined) {
                const nuevaCantidad = result.value;
                await actualizarStock(producto.id, nuevaCantidad);
            }
        });
    };

    // Actualiza el stock en la base de datos
    // Actualiza el stock en la base de datos
const actualizarStock = async (id, nuevaCantidad) => {
    try {
        // Solo enviamos la cantidad para actualizar
        await axios.patch(`http://localhost:5000/productos/${id}`, { cantidad: nuevaCantidad });
        fetchProductos();
        Swal.fire('Actualizado', 'El stock ha sido actualizado exitosamente', 'success');
    } catch (error) {
        console.error('Error al actualizar el stock', error);
        setError('No se pudo actualizar el stock.');
    }
};


    const handleCategoriaClick = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };

    const handleVerTodosClick = () => {
        setCategoriaSeleccionada(''); // Limpiar categoría seleccionada para mostrar todos los productos
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Gestión de Productos</h1>
            <p className="mb-8 text-center">
                En esta sección podrás gestionar tus productos. Puedes agregar nuevos productos
                y visualizar los productos que ya has registrado.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4 flex space-x-4 place-content-center">
                <button
                    onClick={() => navigate('/registro-productos')}
                    className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Producto
                </button>
                <button
                    onClick={() => navigate('/productos-inactivos')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaArchive className="inline-block mr-2" /> Productos Inactivos
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.length === 0 ? (
                    <p className="text-gray-500">No hay productos disponibles en la base de datos.</p>
                ) : productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                        <div
                            key={producto.id}
                            className={`border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 ${producto.cantidad === 0 ? 'bg-red-100' : 'bg-white'}`}
                        >
                            <div className="w-full h-64 relative">
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className={`object-cover w-full h-full absolute inset-0 ${producto.cantidad === 0 ? 'filter grayscale' : ''}`}
                                />
                                {producto.cantidad === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white text-2xl font-bold">Agotado</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                                <p className="text-gray-900 font-bold mb-4">${producto.precio}</p>
                                <p className="text-gray-700 mb-4">Marca: {producto.marca}</p>
                                <div className="flex gap-2">
                                    {producto.cantidad > 0 ? (
                                        <button
                                            onClick={() => navigate(`/editar-producto/${producto.id}`)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        >
                                            <FaEdit className="inline-block mr-2" /> Editar
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleCambiarStock(producto)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            <FaBox className="inline-block mr-2" /> Cambiar Stock
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEliminar(producto)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        <FaTrash className="inline-block mr-2" /> Inactivar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay productos disponibles en esta categoría.</p>
                )}
            </div>
        </div>
    );
};

export default GestionProductos;
