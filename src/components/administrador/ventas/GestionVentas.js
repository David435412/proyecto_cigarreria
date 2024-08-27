import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

const GestionVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [ventaAEliminar, setVentaAEliminar] = useState(null);

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
            await axios.put(`http://localhost:5000/ventas/${ventaAEliminar.id}`, {
                ...ventaAEliminar,
                estado: 'inactivo'
            });
            // Actualizar la lista de ventas después de cambiar el estado
            setVentas(ventas.map(venta => venta.id === ventaAEliminar.id ? { ...venta, estado: 'inactivo' } : venta));
            setMostrarModal(false);
            setVentaAEliminar(null);
        } catch (error) {
            console.error('Error al cambiar el estado de la venta:', error);
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Ventas</h1>
            <p className="mb-4">Aquí puedes gestionar las ventas registradas en el sistema. Puedes ver detalles de cada venta, así como eliminar ventas inactivas si es necesario.</p>
            <div class="mb-4 flex space-x-4">
                <button
                    onClick={() => window.location.href = '/registro-venta'}
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <FaPlus class="inline-block mr-2" />  Registrar Nueva Venta
                </button>
            </div>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Número Documento</th>
                        <th className="py-2 px-4 border-b">Fecha Venta</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Estado</th>
                        <th className="py-2 px-4 border-b">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventasActivas.length > 0 ? (
                        ventasActivas.map(venta => (
                            <tr key={venta.id}>
                                <td className="py-2 px-4 border-b">{venta.numeroDocumento}</td>
                                <td className="py-2 px-4 border-b">{venta.fechaVenta}</td>
                                <td className="py-2 px-4 border-b">${calcularTotal(venta.productos)}</td>
                                <td className="py-2 px-4 border-b">{venta.estado}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        onClick={() => manejarEliminarVenta(venta)}
                                        className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 mr-2"
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={() => mostrarDetalles(venta)}
                                        className={`bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 ${ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'bg-green-600' : ''}`}
                                    >
                                        {ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'Ocultar Detalles' : 'Detalles'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-2 px-4 text-center">No hay ventas activas registradas</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {ventaSeleccionada && (
                <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Detalles de la Venta</h2>
                    <p><strong>Número Documento:</strong> {ventaSeleccionada.numeroDocumento}</p>
                    <p><strong>Fecha Venta:</strong> {ventaSeleccionada.fechaVenta}</p>
                    <p><strong>Estado:</strong> {ventaSeleccionada.estado}</p>
                    <h3 className="text-lg font-semibold mt-2">Productos:</h3>
                    <ul>
                        {ventaSeleccionada.productos.map((producto, index) => (
                            <li key={index} className="flex items-center mb-2">
                                {producto.imagen && (
                                    <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover mr-2" />
                                )}
                                <p>{producto.nombre} - ${producto.precio} x {producto.cantidad}</p>
                            </li>
                        ))}
                    </ul>
                    <h2 className="text-xl font-semibold mt-2">Subtotal: ${calcularTotal(ventaSeleccionada.productos)}</h2>
                </div>
            )}

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
