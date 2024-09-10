import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaArchive } from 'react-icons/fa';
import Swal from 'sweetalert2';

const GestionVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/ventas');
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

    const manejarEliminarVenta = async (venta) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Cambiar el estado de esta venta a inactivo no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, inactivar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const productos = venta.productos;

                    // Devolver la cantidad de los productos al inventario
                    await Promise.all(productos.map(async (producto) => {
                        const { data: productoActual } = await axios.get(`http://localhost:5000/productos/${producto.id}`);
                        const nuevaCantidad = productoActual.cantidad + producto.cantidad;
                        await axios.put(`http://localhost:5000/productos/${producto.id}`, {
                            ...productoActual,
                            cantidad: nuevaCantidad
                        });
                    }));

                    // Cambiar el estado de la venta a 'inactivo'
                    await axios.put(`http://localhost:5000/ventas/${venta.id}`, {
                        ...venta,
                        estado: 'inactivo'
                    });

                    // Actualizar la lista de ventas
                    setVentas(ventas.map(v => v.id === venta.id ? { ...v, estado: 'inactivo' } : v));

                    Swal.fire(
                        '¡Venta inactivada!',
                        'La venta ha sido cambiada a estado inactivo.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error al inactivar la venta:', error);
                    Swal.fire(
                        'Error',
                        'Hubo un error al intentar inactivar la venta.',
                        'error'
                    );
                }
            }
        });
    };

    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(ventaSeleccionada && ventaSeleccionada.id === venta.id ? null : venta);
    };

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
            <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg">
                <thead className="bg-green-600 border-b border-gray-200">
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
                                            className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
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
        </div>
    );
};

export default GestionVentas;
