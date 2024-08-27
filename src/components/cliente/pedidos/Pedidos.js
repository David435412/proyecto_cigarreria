import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
            // Obtener los pedidos del usuario
            axios.get(`http://localhost:5000/pedidos?usuarioId=${usuarioId}`)
                .then((response) => {
                    setPedidos(response.data);
                })
                .catch((error) => {
                    console.error('Error al obtener los pedidos:', error);
                    setError('Hubo un problema al obtener los pedidos.');
                });
        }
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">Mis Pedidos</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {pedidos.length === 0 ? (
                <p className="text-center text-xl">No tienes pedidos realizados aún.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Fecha</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Estado</th>
                            <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id}>
                                <td className="py-4 px-4 border-b">{new Date(pedido.fecha).toLocaleDateString()}</td>
                                <td className="py-4 px-4 border-b">${pedido.productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0).toFixed(3)}</td>
                                <td className="py-4 px-4 border-b">{pedido.estadoPedido}</td>
                                <td className="py-4 px-4 border-b">
                                    <Link to={`/pedido/${pedido.id}`}>
                                        <button className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                                            Ver más
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Pedidos;
