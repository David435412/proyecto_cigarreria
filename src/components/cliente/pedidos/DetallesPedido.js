import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DetallesPedido = () => {
    const { id } = useParams();
    const [pedido, setPedido] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener los detalles del pedido
        axios.get(`http://localhost:5000/pedidos/${id}`)
            .then((response) => {
                setPedido(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al obtener el pedido:', error);
                setError('Hubo un problema al obtener los detalles del pedido.');
                setLoading(false);
            });
    }, [id]);

    const handleCancelar = async () => {
        if (pedido.estadoPedido !== 'pendiente') {
            setError('Solo se pueden cancelar pedidos pendientes.');
            return;
        }

        try {
            // Actualizar el estado del pedido a 'cancelado'
            await axios.put(`http://localhost:5000/pedidos/${id}`, { ...pedido, estadoPedido: 'cancelado' });

            // Devolver la cantidad de cada producto al inventario
            await Promise.all(pedido.productos.map(async (producto) => {
                // Obtener los datos actuales del producto
                const { data: productoActual } = await axios.get(`http://localhost:5000/productos/${producto.id}`);

                // Actualizar la cantidad del producto
                const productoActualizado = {
                    ...productoActual,  // Mantener los otros campos del producto
                    cantidad: productoActual.cantidad + producto.cantidad  // Aumentar la cantidad
                };
                await axios.put(`http://localhost:5000/productos/${producto.id}`, productoActualizado);
            }));

            // Actualizar el estado del pedido localmente
            setPedido({ ...pedido, estadoPedido: 'cancelado' });
        } catch (error) {
            console.error('Error al cancelar el pedido:', error);
            setError('Hubo un problema al cancelar el pedido.');
        }
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!pedido) {
        return <p>No se encontró el pedido.</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">Detalles del Pedido</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Fecha: {new Date(pedido.fecha).toLocaleDateString()}</h2>
                <p className="text-lg">Estado del Pedido: {pedido.estadoPedido}</p>
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
                            <td className="py-4 px-4 border-b">${(producto.precio * producto.cantidad).toFixed(3)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Subtotal: ${pedido.productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0).toFixed(3)}</h2>
            </div>
            {/* Botón de Cancelar solo se muestra si el estadoPedido es "pendiente" */}
            {pedido.estadoPedido === 'pendiente' && (
                <button
                    onClick={handleCancelar}
                    className="px-8 py-4 bg-red-500 text-white font-bold rounded-full hover:shadow-lg"
                >
                    Cancelar Pedido
                </button>
            )}
            <Link
                to="/pedidos"
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-700 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
            >
                Volver a Mis Pedidos
            </Link>
        </div>
    );
};

export default DetallesPedido;
