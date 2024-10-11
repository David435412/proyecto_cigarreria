import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Carrito = ({ onClose }) => { // Añadido onClose como prop
    const [carrito, setCarrito] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState({});    
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
            // Obtener datos del carrito del localStorage
            const carritoData = JSON.parse(localStorage.getItem(`carrito_${usuarioId}`)) || [];
            setCarrito(carritoData);

            // Obtener la disponibilidad de productos
            const fetchDisponibilidad = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/productos'); // O la URL que devuelva todos los productos
                    const productos = response.data;
                    const disponibilidad = productos.reduce((acc, producto) => {
                        acc[producto.id] = producto.cantidad;
                        return acc;
                    }, {});
                    setProductosDisponibles(disponibilidad);
                } catch (error) {
                    console.error('Error al cargar la disponibilidad de productos:', error);
                }
            };

            fetchDisponibilidad();
        }
    }, []);

    const handleEliminar = (id) => {
        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
            // Filtrar el carrito para eliminar el producto seleccionado
            const nuevoCarrito = carrito.filter((producto) => producto.id !== id);
            setCarrito(nuevoCarrito);
            // Actualizar localStorage con el nuevo carrito
            localStorage.setItem(`carrito_${usuarioId}`, JSON.stringify(nuevoCarrito));
        }
    };

    const handleCantidadChange = (id, cantidad) => {
        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
            const cantidadDisponible = productosDisponibles[id] || 0;
            // Limitar la cantidad a la disponible
            const nuevaCantidad = Math.max(1, Math.min(cantidadDisponible, cantidad));
            // Actualizar la cantidad del producto en el carrito
            const nuevoCarrito = carrito.map((producto) =>
                producto.id === id ? { ...producto, cantidad: nuevaCantidad } : producto
            );
            setCarrito(nuevoCarrito);
            // Actualizar localStorage con el nuevo carrito
            localStorage.setItem(`carrito_${usuarioId}`, JSON.stringify(nuevoCarrito));
        }
    };

    const calcularTotal = () => {
        return carrito.reduce((total, producto) => total + parseFloat(producto.precio) * producto.cantidad, 0).toFixed(3);
    };

    const handleProcederAlPago = () => {
        // Guardar los datos del carrito en el localStorage para el proceso de pago
        localStorage.setItem('datosCarrito', JSON.stringify(carrito));
    };

    return (
        <div className="container mx-auto px-4 py-8 my-5">
            <h1 className="text-3xl font-semibold mb-6">Carrito de Compras</h1>
            {carrito.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-xl mb-4">El carrito está vacío.</p>
                </div>
            ) : (
                <div>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Producto</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Cantidad</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Precio</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map((producto) => (
                                <tr key={producto.id}>
                                    <td className="py-4 px-4 border-b">
                                        <div className="flex items-center">
                                            <img src={producto.imagen} alt={producto.nombre} className="w-20 h-20 object-cover mr-4" />
                                            <span className="text-sm font-medium">{producto.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 border-b">
                                        <input
                                            type="number"
                                            value={producto.cantidad}
                                            min="1"
                                            max={productosDisponibles[producto.id] || 10}
                                            onChange={(e) => handleCantidadChange(producto.id, parseInt(e.target.value, 10))}
                                            className="w-20 p-2 border border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="py-4 px-4 border-b"> ${parseFloat(producto.precio).toFixed(3)}</td>
                                    <td className="py-4 px-4 border-b">${(producto.precio * producto.cantidad).toFixed(3)}</td>
                                    <td className="py-4 px-4 border-b">
                                        <button
                                            onClick={() => handleEliminar(producto.id)}
                                            className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-500 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Subtotal: ${calcularTotal()}</h2>
                        <Link 
                            to="/datos-entrega"
                            onClick={handleProcederAlPago}
                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"                        >
                            Proceder al Pago
                        </Link>
                    </div>
                </div>
            )}
            <div className="mt-6 text-center">
                <button 
                    onClick={() => navigate('/cliente-dash')} // Llamada a la función para cerrar el modal
                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500"
                    >
                    Seguir Comprando
                </button>
            </div>
        </div>
    );
};

export default Carrito;
