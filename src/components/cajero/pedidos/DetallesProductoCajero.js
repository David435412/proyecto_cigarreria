import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Importamos el ícono de react-icons
import axios from 'axios';

const DetalleProductoCajero = () => {
    const { id } = useParams(); // Obtiene el ID del producto desde la URL
    const navigate = useNavigate(); // Hook para redireccionar
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1); // Estado para la cantidad seleccionada
    const [precioTotal, setPrecioTotal] = useState('0.00'); // Estado para el precio total
    const [mensajeAdvertencia, setMensajeAdvertencia] = useState(''); // Estado para el mensaje de advertencia

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/productos/${id}`);
                setProducto(response.data);
                setPrecioTotal(response.data.precio); // Inicializa el precio total
            } catch (error) {
                setError('Error al cargar el producto.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    const handleCantidadChange = (e) => {
        let cantidad = parseInt(e.target.value, 10);
        if (isNaN(cantidad) || cantidad < 1) {
            cantidad = 1;
        } else if (cantidad > 10) {
            cantidad = 10;
        }

        if (producto && cantidad > producto.cantidad) {
            setMensajeAdvertencia('La cantidad deseada excede la cantidad disponible.');
        } else {
            setMensajeAdvertencia('');
            setCantidadSeleccionada(cantidad);
            setPrecioTotal((parseFloat(producto.precio) * cantidad).toFixed(3)); // Actualiza el precio total
        }
    };

    const handleAgregarCarrito = () => {
        if (producto && cantidadSeleccionada > producto.cantidad) {
            setMensajeAdvertencia('La cantidad deseada excede la cantidad disponible.');
            return;
        }

        const usuarioId = localStorage.getItem('userId'); // Obtener ID de usuario del localStorage
        const carrito = JSON.parse(localStorage.getItem(`carrito_${usuarioId}`)) || [];
        
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(p => p.id === producto.id);
        if (productoExistente) {
            alert('Este producto ya está en el carrito.');
            return;
        }

        carrito.push({ ...producto, cantidad: cantidadSeleccionada });
        localStorage.setItem(`carrito_${usuarioId}`, JSON.stringify(carrito));
        navigate('/registro-pedido-cajero'); 
    };

    // Función para manejar la navegación hacia atrás
    const handleVolver = () => {
        navigate(-1); // Vuelve a la página anterior
    };

    if (loading) {
        return <div className="text-center py-4">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    if (!producto) {
        return <div className="text-center py-4">Producto no encontrado</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-center">
                <div className="relative md:w-1/3">
                    {/* Imagen del producto con filtro si está agotado */}
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className={`w-full h-auto object-cover ${producto.cantidad === 0 ? 'grayscale' : ''}`}
                    />
                    {/* Mostrar "AGOTADO" si la cantidad es 0 */}
                    {producto.cantidad === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <span className="text-white text-4xl font-bold">AGOTADO</span>
                        </div>
                    )}
                </div>
                <div className="md:w-1/2 md:pl-8">
                    <h1 className="text-3xl font-semibold mb-4">{producto.nombre}</h1>
                    <p className="text-2xl text-black font-bold mb-4">${precioTotal}</p>
                    <p className="text-gray-700 mb-4">{producto.descripcion}</p>
                    <p className="text-gray-700 mb-4">Cantidad disponible: {producto.cantidad}</p>
                    
                    {/* Mostrar input de cantidad y botón solo si hay stock */}
                    {producto.cantidad > 0 && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Cantidad</label>
                                <input
                                    type="number"
                                    value={cantidadSeleccionada}
                                    onChange={handleCantidadChange}
                                    min="1"
                                    max="10"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                                {mensajeAdvertencia && (
                                    <p className="text-red-500 mt-2">{mensajeAdvertencia}</p>
                                )}
                            </div>
                            <button
                                onClick={handleAgregarCarrito}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                            >
                                Agregar al Carrito
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Botón para volver, ubicado debajo de todo el contenido */}
            <div className="mt-8">
                <button
                    onClick={handleVolver}
                    className="bg-gray-500 text-white py-2 px-4 rounded flex items-center hover:bg-gray-600"
                >
                    <FaArrowLeft className="mr-2" /> {/* Icono de flecha hacia la izquierda */}
                    Volver
                </button>
            </div>
        </div>
    );
};

export default DetalleProductoCajero;