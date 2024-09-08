import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaArchive } from 'react-icons/fa';

const GestionVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [ventaAEliminar, setVentaAEliminar] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Función para obtener ventas desde la API
        const fetchVentas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/ventas'); // Ajusta la URL según tu configuración
                setVentas(response.data);
            } catch (error) {
                console.error('Error al obtener las ventas:', error);
            }
        };

        fetchVentas();
    }, []);

    const calcularTotal = (productos) => {
        const total = productos.reduce((total, producto) => total + (parseFloat(producto.precio) * producto.cantidad), 0);
        return total.toFixed(3);
    };

    const manejarEliminarVenta = (venta) => {
        setVentaAEliminar(venta);
        setMostrarModal(true);
    };

    const eliminarVenta = async () => {
        try {
            // Obtener los detalles actuales de los productos en la venta
            const productos = ventaAEliminar.productos;

            // Devolver la cantidad de los productos al inventario
            await Promise.all(productos.map(async (producto) => {
                // Obtener los datos actuales del producto
                const { data: productoActual } = await axios.get(`http://localhost:5000/productos/${producto.id}`);

                // Calcular la nueva cantidad
                const nuevaCantidad = productoActual.cantidad + producto.cantidad;

                // Actualizar la cantidad del producto
                await axios.put(`http://localhost:5000/productos/${producto.id}`, {
                    ...productoActual,  // Mantener los otros campos del producto
                    cantidad: nuevaCantidad  // Incrementar la cantidad
                });
            }));

            // Cambiar el estado de la venta a 'inactivo'
            await axios.put(`http://localhost:5000/ventas/${ventaAEliminar.id}`, {
                ...ventaAEliminar,
                estado: 'inactivo'
            });

            // Actualizar la lista de ventas después de cambiar el estado
            setVentas(ventas.map(venta => venta.id === ventaAEliminar.id ? { ...venta, estado: 'inactivo' } : venta));
            setMostrarModal(false);
            setVentaAEliminar(null);
        } catch (error) {
            console.error('Error al eliminar la venta:', error);
        }
    };

    const cancelarConfirmacion = () => {
        setMostrarModal(false);
        setVentaAEliminar(null);
    };

    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(ventaSeleccionada && ventaSeleccionada.id === venta.id ? null : venta);
    };

    // Filtrar ventas para mostrar solo las activas
    const ventasActivas = ventas.filter(venta => venta.estado === 'activo');

    return (
        <div className="container mx-auto p-4 my-10">
            <h1 className="text-2xl font-bold mb-4">Gestión de Ventas</h1>
            <p className="mb-4">Aquí puedes gestionar las ventas registradas en el sistema. Puedes ver detalles de cada venta, así como inactivar ventas si es necesario.</p>
            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => window.location.href = '/registro-venta'}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Nueva Venta
                </button>
                <button
                    onClick={() => navigate('/ventas-inactivas')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaArchive className="inline-block mr-2" /> Ventas Inactivas
                </button>
            </div>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-center">Número Documento</th>
                        <th className="py-2 px-4 border-b text-center">Fecha Venta</th>
                        <th className="py-2 px-4 border-b text-center">Total</th>
                        <th className="py-2 px-4 border-b text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventasActivas.length > 0 ? (
                        ventasActivas.map(venta => (
                            <React.Fragment key={venta.id}>
                                <tr>
                                    <td className="py-2 px-4 border-b text-center">{venta.numeroDocumento}</td>
                                    <td className="py-2 px-4 border-b text-center">{venta.fechaVenta}</td>
                                    <td className="py-2 px-4 border-b text-center">${calcularTotal(venta.productos)}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <button
                                            onClick={() => mostrarDetalles(venta)}
                                            className={`bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 mr-2 ${ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'bg-green-600' : ''}`}
                                        >
                                            {ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'Ocultar Detalles' : 'Detalles'}
                                        </button>
                                        <button
                                            onClick={() => manejarEliminarVenta(venta)}
                                            className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 "
                                        >
                                            Inactivar
                                        </button>
                                    </td>
                                </tr>
                                {ventaSeleccionada && ventaSeleccionada.id === venta.id && (
                                    <tr>
                                        <td colSpan="5" className="py-4 px-4 border-b bg-gray-100">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-2">Detalles de la Venta</h2>
                                                <p><strong>Número Documento:</strong> {venta.numeroDocumento}</p>
                                                <p><strong>Fecha Venta:</strong> {venta.fechaVenta}</p>
                                                <p><strong>Método de Pago:</strong> {venta.metodoPago}</p>
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
                                                <h2 className="text-xl font-semibold mt-2">Subtotal: ${calcularTotal(venta.productos)}</h2>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-2 px-4 text-center">No hay ventas activas registradas</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirmación</h2>
                        <p>¿Estás seguro de que deseas cambiar el estado de esta venta a inactivo? Esta acción no se puede deshacer.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={cancelarConfirmacion}
                                className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600 mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={eliminarVenta}
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

export default GestionVentas;
