import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

const GestionVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

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
    
    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(ventaSeleccionada && ventaSeleccionada.id === venta.id ? null : venta);
    };

    // Filtrar ventas para mostrar solo las activas
    const ventasActivas = ventas.filter(venta => venta.estado === 'activo');

    return (
        <div className="container mx-auto p-4 my-5">
            <h1 className="text-2xl font-bold mb-4">Gestión de Ventas</h1>
            <p className="mb-4">Aquí puedes gestionar las ventas registradas en el sistema. Puedes ver detalles de cada venta</p>
            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => window.location.href = '/registro-venta-cajero'}
                    className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Nueva Venta
                </button>
            </div>
            <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg">
                <thead class="bg-green-600 border-b border-gray-200">
                    <tr className="text-white">
                        <th className="py-2 px-4 border-b text-left">Número Documento</th>
                        <th className="py-2 px-4 border-b text-left">Fecha Venta</th>
                        <th className="py-2 px-4 border-b text-left">Total</th>
                        <th className="py-2 px-4 border-b text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventasActivas.length > 0 ? (
                        ventasActivas.map(venta => (
                            <React.Fragment key={venta.id}>
                                <tr>
                                    <td className="py-2 px-4 border-b">{venta.numeroDocumento}</td>
                                    <td className="py-2 px-4 border-b">{venta.fechaVenta}</td>
                                    <td className="py-2 px-4 border-b">${calcularTotal(venta.productos)}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => mostrarDetalles(venta)}
                                            className={`bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 ${ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'bg-blue-600' : ''}`}
                                        >
                                            {ventaSeleccionada && ventaSeleccionada.id === venta.id ? 'Ocultar Detalles' : 'Detalles'}
                                        </button>
                                    </td>
                                </tr>
                                {ventaSeleccionada && ventaSeleccionada.id === venta.id && (
                                    <tr>
                                        <td colSpan="4" className="p-4 bg-gray-100 border-b border-gray-200">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-2">Detalles de la Venta</h2>
                                                <p><strong>Número Documento:</strong> {ventaSeleccionada.numeroDocumento}</p>
                                                <p><strong>Fecha Venta:</strong> {ventaSeleccionada.fechaVenta}</p>
                                                <p><strong>Método de Pago:</strong> {ventaSeleccionada.metodoPago}</p>
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
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-2 px-4 text-center">No hay ventas activas registradas</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GestionVentas;
