import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        const usuarioId = localStorage.getItem('userId'); // Obtener ID de usuario del localStorage
        const carritoData = JSON.parse(localStorage.getItem(`carrito_${usuarioId}`)) || [];
        setCarrito(carritoData);
    }, []);

    const handleEliminar = (id) => {
        const usuarioId = localStorage.getItem('userId');
        const nuevoCarrito = carrito.filter((producto) => producto.id !== id);
        setCarrito(nuevoCarrito);
        localStorage.setItem(`carrito_${usuarioId}`, JSON.stringify(nuevoCarrito));
    };

    const handleCantidadChange = (id, cantidad) => {
        const usuarioId = localStorage.getItem('userId');
        const nuevoCarrito = carrito.map((producto) =>
            producto.id === id ? { ...producto, cantidad: Math.max(1, Math.min(10, cantidad)) } : producto
        );
        setCarrito(nuevoCarrito);
        localStorage.setItem(`carrito_${usuarioId}`, JSON.stringify(nuevoCarrito));
    };

    const calcularTotal = () => {
        return carrito.reduce((total, producto) => total + parseFloat(producto.precio) * producto.cantidad, 0).toFixed(2);
    };

    return (
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-semibold mb-6">Carrito de Compras</h1>
            {carrito.length === 0 ? (
                <div class="text-center py-8">
                    <p class="text-xl mb-4">El carrito está vacío.</p>
                    <Link to="/productos" class="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500">Volver a la tienda</Link>
                </div>
            ) : (
                <div>
                    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Producto</th>
                                <th class="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Cantidad</th>
                                <th class="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Precio</th>
                                <th class="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total</th>
                                <th class="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map((producto) => (
                                <tr key={producto.id}>
                                    <td class="py-4 px-4 border-b">
                                        <div class="flex items-center">
                                            <img src={producto.imagen} alt={producto.nombre} class="w-20 h-20 object-cover mr-4" />
                                            <span class="text-sm font-medium">{producto.nombre}</span>
                                        </div>
                                    </td>
                                    <td class="py-4 px-4 border-b">
                                        <input
                                            type="number"
                                            value={producto.cantidad}
                                            min="1"
                                            max="10"
                                            onChange={(e) => handleCantidadChange(producto.id, parseInt(e.target.value, 10))}
                                            class="w-20 p-2 border border-gray-300 rounded"
                                        />
                                    </td>
                                    <td class="py-4 px-4 border-b">${producto.precio}</td>
                                    <td class="py-4 px-4 border-b">${(producto.precio * producto.cantidad).toFixed(2)}</td>
                                    <td class="py-4 px-4 border-b">
                                        <button
                                            onClick={() => handleEliminar(producto.id)}
                                            class="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-500 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div class="mt-6 flex justify-between items-center">
                        <h2 class="text-xl font-semibold">Subtotal: ${calcularTotal()}</h2>
                        <Link 
                        to="/formulario-pedido" 
                        class="px-8 py-4 bg-gradient-to-r from-green-700 to-green-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                        >Proceder al Pago</Link>
                    </div>
                </div>
            )}
            <div class="mt-6 text-center">
                <Link 
                to="/productos" 
                class="px-8 py-4 bg-gradient-to-r from-violet-500 to-gray-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                >Seguir Comprando
                </Link>
            </div>
        </div>
    );
};

export default Carrito;
