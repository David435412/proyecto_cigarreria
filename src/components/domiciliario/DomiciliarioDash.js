import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns'; // Importar la función format de date-fns
import fuera_4 from "../../assets/images/fuera_4.jpeg";
import css from "../../pages/css.css";
import emailjs from 'emailjs-com'; // Importar emailjs

const DomiciliarioDashboard = () => {
    const [userName, setUserName] = useState('');
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [pedidoAConfirmar, setPedidoAConfirmar] = useState(null);

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const userId = localStorage.getItem('userId'); // Obtener userId del localStorage

        if (storedName) {
            setUserName(storedName);
        }

        const fetchPedidos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/pedidos');
                const pedidosPendientes = response.data.filter(pedido => pedido.estadoPedido === 'pendiente' && pedido.asignado === userId); // Filtrar por userId
                setPedidos(pedidosPendientes);
            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    const calcularTotal = (productos) => {
        return productos.reduce((total, producto) => total + (parseFloat(producto.precio) * producto.cantidad), 0).toFixed(3);
    };

    const manejarEstadoEntrega = (pedido) => {
        setPedidoAConfirmar(pedido);
        Swal.fire({
            title: 'Confirmar Entrega',
            html: `<p>¿Estás seguro de que deseas marcar el pedido de "<strong>${pedido.nombre}</strong>" como entregado?</p>
                   <p><strong>Esta acción no se puede deshacer</strong></p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#FF4D4D'
        }).then((result) => {
            if (result.isConfirmed) {
                confirmarEntrega();
            }
        });
    };

    const confirmarEntrega = async () => {
        try {
            await axios.patch(`http://localhost:5000/pedidos/${pedidoAConfirmar.id}`, {
                estadoPedido: 'entregado'
            });
            setPedidos(pedidos.map(pedido =>
                pedido.id === pedidoAConfirmar.id ? { ...pedido, estadoPedido: 'entregado' } : pedido
            ));
            setPedidoAConfirmar(null);
            Swal.fire({
                title: 'Pedido entregado',
                text: 'El estado del pedido ha sido actualizado a "entregado".',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Enviar correo de confirmación
            await emailjs.send('service_vlpu06s', 'template_2lgkzzq', {
                to_correo: pedidoAConfirmar.correo,
                customer_name: pedidoAConfirmar.nombre,
                delivery_date: formatFecha(new Date()),
                products: pedidoAConfirmar.productos.map(p => `${p.nombre} - ${p.precio} x ${p.cantidad}`).join(" --- "),
                total: calcularTotal(pedidoAConfirmar.productos)
            }, 'JS01zy1f3DQ02Ojb0');

        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar el estado del pedido.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const mostrarDetalles = (pedido) => {
        setPedidoSeleccionado(pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? null : pedido);
    };

    // Función para formatear la fecha
    const formatFecha = (fecha) => {
        return format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss');
    };

    return (
        <>
            <div className="bg-black text-white pb-5">
                <img
                    src={fuera_4}
                    alt="Fondo"
                    className="w-full h-96 object-cover filter imagen brightness-50"
                />
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">¡Bienvenido, {userName}!</h1>
                    <p className="text-xl mt-2">Este es el dashboard de domiciliarios, donde puedes realizar la entrega de los pedidos que tienes asignados</p>
                </div>
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Pedidos Pendientes</h2>
                        <p className="text-gray-700">
                            Consulta y modifica el estado de los pedidos realizados por los clientes. Gestiona el campo de estado de entrega para asegurar un seguimiento adecuado.
                        </p>
                        <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg mt-4">
                            <thead className="bg-green-600 border-b border-gray-200">
                                <tr className="text-white">
                                    <th className="py-2 px-4 border-b">Nombre del Cliente</th>
                                    <th className="py-2 px-4 border-b">Fecha</th>
                                    <th className="py-2 px-4 border-b">Total</th>
                                    <th className="py-2 px-4 border-b">Estado</th>
                                    <th className="py-2 px-4 border-b">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.length > 0 ? (
                                    pedidos.map(pedido => (
                                        <React.Fragment key={pedido.id}>
                                            <tr>
                                                <td className="py-2 px-4 border-b">{pedido.nombre}</td>
                                                <td className="py-2 px-4 border-b">{formatFecha(pedido.fecha)}</td>
                                                <td className="py-2 px-4 border-b">${calcularTotal(pedido.productos)}</td>
                                                <td className="py-2 px-4 border-b">{pedido.estadoPedido}</td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    <button
                                                        onClick={() => manejarEstadoEntrega(pedido)}
                                                        className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
                                                    >
                                                        <FaCheckCircle className="inline-block mr-1" /> Marcar Entregado
                                                    </button>
                                                    <button
                                                        onClick={() => mostrarDetalles(pedido)}
                                                        className={`ml-2 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 ${pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'bg-blue-600' : ''}`}
                                                    >
                                                        {pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'Ocultar Detalles' : 'Detalles'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {pedidoSeleccionado && pedidoSeleccionado.id === pedido.id && (
                                                <tr>
                                                    <td colSpan="5" className="bg-gray-100 p-4 border-b">
                                                        <h2 className="text-xl font-semibold mb-2">Detalles del Pedido</h2>
                                                        <p><strong>Nombre del Cliente:</strong> {pedidoSeleccionado.nombre}</p>
                                                        <p><strong>Correo Electrónico:</strong> {pedidoSeleccionado.correo}</p>
                                                        <p><strong>Fecha:</strong> {formatFecha(pedidoSeleccionado.fecha)}</p>
                                                        <p><strong>Dirección de Entrega:</strong> {pedidoSeleccionado.direccion}</p>
                                                        <p><strong>Estado:</strong> {pedidoSeleccionado.estadoPedido}</p>
                                                        <h3 className="text-lg font-semibold mt-2">Productos:</h3>
                                                        <ul>
                                                            {pedidoSeleccionado.productos.map((producto, index) => (
                                                                <li key={index} className="flex items-center mb-2">
                                                                    {producto.imagen && (
                                                                        <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover mr-2" />
                                                                    )}
                                                                    <p>{producto.nombre} - ${producto.precio} x {producto.cantidad}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <p><strong>Total:</strong> ${calcularTotal(pedidoSeleccionado.productos)}</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-gray-600">No hay pedidos pendientes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DomiciliarioDashboard;
