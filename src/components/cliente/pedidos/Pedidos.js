import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null); // Estado para el pedido seleccionado
    const [error, setError] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false); // Estado para el modal de confirmación de cancelación
    const [pedidoACancelar, setPedidoACancelar] = useState(null); // Estado para el pedido a cancelar

    useEffect(() => {
        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
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

    const calcularTotal = (productos) => {
        const total = productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
        return total.toFixed(3);
    };

    const mostrarDetalles = (pedido) => {
        setPedidoSeleccionado(pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? null : pedido);
    };

    const manejarCancelarPedido = (pedido) => {
        setPedidoACancelar(pedido);
        setMostrarModal(true);
    };

    const cancelarPedido = async () => {
        try {
            // Sumar nuevamente las cantidades de los productos al cancelar el pedido
            await Promise.all(pedidoACancelar.productos.map(async (producto) => {
                const { data: productoActual } = await axios.get(`http://localhost:5000/productos/${producto.id}`);
                const productoActualizado = {
                    ...productoActual,
                    cantidad: productoActual.cantidad + producto.cantidad,
                };
                await axios.put(`http://localhost:5000/productos/${producto.id}`, productoActualizado);
            }));
    
            // Cambiar el estado del pedido a "cancelado"
            await axios.put(`http://localhost:5000/pedidos/${pedidoACancelar.id}`, {
                ...pedidoACancelar,
                estadoPedido: 'cancelado',
                estado: 'inactivo'
            });
    
            // Actualizar la lista de pedidos después de cambiar el estado
            setPedidos(pedidos.map(pedido => pedido.id === pedidoACancelar.id ? { ...pedido, estadoPedido: 'cancelado' } : pedido));
            setMostrarModal(false);
            setPedidoACancelar(null);
        } catch (error) {
            console.error('Error al cancelar el pedido:', error);
        }
    };
    

    const cancelarConfirmacion = () => {
        setMostrarModal(false);
        setPedidoACancelar(null);
    };

    return (
        <div className="container mx-auto px-4 py-8 my-5">
            <h1 className="text-3xl font-semibold mb-6">Mis Pedidos</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {pedidos.length === 0 ? (
                <p className="text-center text-xl">No tienes pedidos realizados aún.</p>
            ) : (
                <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-lg">
                    <thead className="bg-green-600">
                        <tr>
                            <th className="py-3 px-4 border-b text-center text-md font-medium text-white">Fecha</th>
                            <th className="py-3 px-4 border-b text-center text-md font-medium text-white">Total</th>
                            <th className="py-3 px-4 border-b text-center text-md font-medium text-white">Estado</th>
                            <th className="py-3 px-4 border-b text-center text-md font-medium text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido) => (
                            <React.Fragment key={pedido.id}>
                                <tr>
                                    <td className="py-4 px-4 border-b text-center">{new Date(pedido.fecha).toLocaleDateString()}</td>
                                    <td className="py-4 px-4 border-b text-center">${calcularTotal(pedido.productos)}</td>
                                    <td className="py-4 px-4 border-b text-center">{pedido.estadoPedido}</td>
                                    <td className="py-4 px-4 border-b text-center">
                                        <button
                                            onClick={() => mostrarDetalles(pedido)}
                                            className={`bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 ${pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'bg-indigo-700' : ''}`}
                                        >
                                            {pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                                        </button>
                                    </td>
                                </tr>
                                {pedidoSeleccionado && pedidoSeleccionado.id === pedido.id && (
                                    <tr>
                                        <td colSpan="4" className="py-4 px-4 border-b bg-gray-100">
                                            <h2 className="text-xl font-semibold mb-2">Detalles del Pedido</h2>
                                            <p><strong>Fecha:</strong> {new Date(pedidoSeleccionado.fecha).toLocaleDateString()}</p>
                                            <p><strong>Estado:</strong> {pedidoSeleccionado.estadoPedido}</p>
                                            <h3 className="text-lg font-semibold mt-2">Productos:</h3>
                                            <ul>
                                                {pedidoSeleccionado.productos.map((producto, index) => (
                                                    <li key={index} className="flex items-center mb-2">
                                                        {producto.imagen && (
                                                            <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover mr-2" />
                                                        )}
                                                        <p>{producto.nombre} - ${producto.precio} x {producto.cantidad} = ${(producto.precio * producto.cantidad).toFixed(3)}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                            <h2 className="text-xl font-semibold mt-2">Subtotal: ${calcularTotal(pedidoSeleccionado.productos)}

                                            {pedido.estadoPedido === 'pendiente' && (
                                                <button
                                                    onClick={() => manejarCancelarPedido(pedido)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                                                >
                                                    Cancelar Pedido
                                                </button>
                                            )}
                                            </h2>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}

            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirmación</h2>
                        <p>¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={cancelarConfirmacion}
                                className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600 mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={cancelarPedido}
                                className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pedidos;
