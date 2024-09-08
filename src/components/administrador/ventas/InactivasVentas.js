import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';

const VentasInactivas = () => {
    const [ventas, setVentas] = useState([]);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [ventaAActivar, setVentaAActivar] = useState(null);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Obtener las ventas inactivas desde la API
    const fetchVentasInactivas = async () => {
        try {
            const response = await axios.get('http://localhost:5000/ventas');
            const ventasInactivas = response.data.filter(venta => venta.estado === 'inactivo');
            setVentas(ventasInactivas);
        } catch (error) {
            console.error('Error al obtener las ventas inactivas', error);
            setError('No se pudieron cargar las ventas inactivas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVentasInactivas();
    }, []);

    const handleActivate = async () => {
        if (!ventaAActivar) return;

        try {
            await axios.put(`http://localhost:5000/ventas/${ventaAActivar.id}`, { ...ventaAActivar, estado: 'activo' });

            // Actualizar el inventario de productos
            await Promise.all(ventaAActivar.productos.map(async (producto) => {
                const { data: productoActual } = await axios.get(`http://localhost:5000/productos/${producto.id}`);
                const nuevaCantidad = productoActual.cantidad - producto.cantidad;
                await axios.put(`http://localhost:5000/productos/${producto.id}`, {
                    ...productoActual,
                    cantidad: nuevaCantidad
                });
            }));

            fetchVentasInactivas();
            setAlertMessage('Venta activada exitosamente.');
        } catch (error) {
            console.error('Error al activar la venta', error);
            setError('No se pudo activar la venta.');
        } finally {
            setVentaAActivar(null);
        }
    };

    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(ventaSeleccionada && ventaSeleccionada.id === venta.id ? null : venta);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Ventas Inactivas</h1>
            <p className="mb-8">
                En esta sección podrás gestionar las ventas inactivas del sistema. Puedes visualizar las ventas que están inactivas y activarlas si es necesario.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {alertMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                    {alertMessage}
                </div>
            )}

            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => navigate('/gestion-ventas')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaUsers className="inline-block mr-2" /> Volver a Gestión de Ventas
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-left">Número de Documento</th>
                            <th className="p-4 text-left">Fecha de Venta</th>
                            <th className="p-4 text-left">Total</th>
                            <th className="p-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">Cargando...</td>
                            </tr>
                        ) : ventas.length > 0 ? (
                            ventas.map((venta) => (
                                <React.Fragment key={venta.id}>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-4">{venta.numeroDocumento}</td>
                                        <td className="p-4">{venta.fechaVenta}</td>
                                        <td className="p-4">${venta.total.toFixed(3)}</td>
                                        <td className="p-4 flex gap-1">
                                            <button
                                                onClick={() => setVentaAActivar(venta)}
                                                className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                                            >
                                                Activar
                                            </button>
                                            <button
                                                onClick={() => mostrarDetalles(venta)}
                                                className={`bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 ${ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'bg-blue-600' : ''}`}
                                            >
                                                {ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'Ocultar Detalles' : 'Detalles'}
                                            </button>
                                        </td>
                                    </tr>
                                    {ventaSeleccionada && ventaSeleccionada.id === venta.id && (
                                        <tr>
                                            <td colSpan="4" className="p-4 bg-gray-100">
                                                <div>
                                                    <h2 className="text-xl font-semibold mb-2">Detalles de la Venta</h2>
                                                    <p><strong>Número Documento:</strong> {venta.numeroDocumento}</p>
                                                    <p><strong>Fecha Venta:</strong> {venta.fechaVenta}</p>
                                                    <h3 className="text-lg font-semibold mt-2">Productos:</h3>
                                                    <ul>
                                                        {venta.productos.map((producto, index) => (
                                                            <li key={index} className="flex items-center mb-2">
                                                                {producto.imagen && (
                                                                    <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover mr-2" />
                                                                )}
                                                                <p>{producto.nombre} - ${producto.precio} x {producto.cantidad}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <h2 className="text-xl font-semibold mt-2">Subtotal: ${venta.productos.reduce((total, producto) => total + (parseFloat(producto.precio) * producto.cantidad), 0).toFixed(3)}</h2>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    No hay ventas inactivas en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmación */}
            {ventaAActivar && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl mb-4">¿Estás seguro de que deseas activar esta venta?</h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setVentaAActivar(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleActivate}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Activar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VentasInactivas;
