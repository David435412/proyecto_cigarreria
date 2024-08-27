import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetalleProducto = () => {
    const { id } = useParams(); // Obtiene el ID del producto desde la URL
    const navigate = useNavigate(); // Hook para redireccionar
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1); // Estado para la cantidad seleccionada
    const [precioTotal, setPrecioTotal] = useState('0.00'); // Estado para el precio total

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
        
        // Asegúrate de que la cantidad sea entre 1 y 10
        if (isNaN(cantidad) || cantidad < 1) {
            cantidad = 1;
        } else if (cantidad > 10) {
            cantidad = 10;
        }
        
        setCantidadSeleccionada(cantidad);
        setPrecioTotal((parseFloat(producto.precio) * cantidad).toFixed(3)); // Actualiza el precio total
    };

    const handleAgregarCarrito = () => {
        const usuarioId = localStorage.getItem('userId'); // Obtener ID de usuario del localStorage
        const carrito = JSON.parse(localStorage.getItem(`carrito_${usuarioId}`)) || [];
        carrito.push({ ...producto, cantidad: cantidadSeleccionada });
        localStorage.setItem(`carrito_${usuarioId}`, JSON.stringify(carrito));
        navigate('/carrito'); 
    };

    if (loading) {
        return <div class="text-center py-4">Cargando...</div>;
    }

    if (error) {
        return <div class="text-center py-4 text-red-500">{error}</div>;
    }

    if (!producto) {
        return <div class="text-center py-4">Producto no encontrado</div>;
    }

    return (
        <div class="container mx-auto px-4 py-8">
            <div class="flex flex-col md:flex-row">
                <div class="md:w-1/2">
                    <img src={producto.imagen} alt={producto.nombre} class="w-full h-auto object-cover" />
                </div>
                <div class="md:w-1/2 md:pl-8">
                    <h1 class="text-3xl font-semibold mb-4">{producto.nombre}</h1>
                    <p class="text-2xl text-indigo-600 font-bold mb-4">${precioTotal}</p>
                    <p class="text-gray-700 mb-4">{producto.descripcion}</p>
                    <p class="text-gray-700 mb-4">Cantidad disponible: {producto.cantidad}</p>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-2">Cantidad</label>
                        <input
                            type="number"
                            value={cantidadSeleccionada}
                            onChange={handleCantidadChange}
                            min="1"
                            max="10"
                            class="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button
                        onClick={handleAgregarCarrito}
                        class="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500"
                    >
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;
