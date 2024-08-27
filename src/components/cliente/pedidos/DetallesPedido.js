import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DetallesPedido = () => {
    const { id } = useParams();
    const [pedido, setPedido] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Obtener los detalles del pedido
        axios.get(`http://localhost:5000/pedidos/${id}`)
            .then((response) => {
                setPedido(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener el pedido:', error);
                setError('Hubo un problema al obtener los detalles del pedido.');
            });
    }, [id]);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!pedido) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">Detalles del Pedido</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Fecha: {new Date(pedido.fecha).toLocaleDateString()}</h2>
                <p className="text-lg">Estado del Pedido: {pedido.estadoPedido}</p> {/* Cambiado a estadoPedido */}
            </div>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mb-6">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Producto</th>
                        <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Cantidad</th>
                        <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Precio</th>
                        <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {pedido.productos.map((producto) => (
                        <tr key={producto.id}>
                            <td className="py-4 px-4 border-b">
                                <div className="flex items-center">
                                    <img src={producto.imagen} alt={producto.nombre} className="w-20 h-20 object-cover mr-4" />
                                    <span className="text-sm font-medium">{producto.nombre}</span>
                                </div>
                            </td>
                            <td className="py-4 px-4 border-b">{producto.cantidad}</td>
                            <td className="py-4 px-4 border-b">${producto.precio}</td>
                            <td className="py-4 px-4 border-b">${(producto.precio * producto.cantidad).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Subtotal: ${pedido.productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0).toFixed(2)}</h2>
            </div>
            {/* Botón de Cancelar solo se muestra si el estadoPedido es "pendiente" */}
            {pedido.estadoPedido === 'pendiente' && (
                <button
                    className="px-8 py-4 bg-red-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                >
                    Cancelar Pedido
                </button>
            )}
            <Link
                to="/pedidos"
                className="px-8 py-4 bg-gradient-to-r from-violet-500 to-gray-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg mt-4"
            >
                Volver a Mis Pedidos
            </Link>
        </div>
    );
};

export default DetallesPedido;
