import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [pedidoAConfirmar, setPedidoAConfirmar] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos'); // Estado del filtro

  useEffect(() => {
    // Función para obtener pedidos desde la API
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pedidos'); // Ajusta la URL según tu configuración
        setPedidos(response.data);
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
      // Actualizar el estado de los pedidos después de la confirmación
      setPedidos(pedidos.map(pedido =>
        pedido.id === pedidoAConfirmar.id ? { ...pedido, estadoPedido: 'entregado' } : pedido
      ));
      setPedidoAConfirmar(null);
      Swal.fire('Pedido Marcado', `El pedido de "${pedidoAConfirmar.nombre}" ha sido marcado como entregado.`, 'success');
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
      Swal.fire('Error', 'No se pudo marcar el pedido como entregado.', 'error');
    }
  };

  const mostrarDetalles = (pedido) => {
    setPedidoSeleccionado(pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? null : pedido);
  };

  // Ordenar los estados de los pedidos
  const ordenEstados = {
    'pendiente': 1,
    'entregado': 2,
    'cancelado': 3
  };

  // Filtrar y ordenar los pedidos
  const pedidosFiltrados = pedidos
    .filter(pedido => filtroEstado === 'todos' || pedido.estadoPedido === filtroEstado)
    .sort((a, b) => ordenEstados[a.estadoPedido] - ordenEstados[b.estadoPedido]);

  // Función para formatear la fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Gestión de Pedidos</h1>
      <p className="mb-8">
        En esta sección puedes gestionar los pedidos del sistema. Aquí podrás revisar los pedidos realizados, 
        marcar los pedidos como entregados y filtrar los pedidos según su estado (pendiente, entregado, cancelado).
      </p>

      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setFiltroEstado('todos')}
          className={`py-2 px-4 rounded ${filtroEstado === 'todos' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltroEstado('pendiente')}
          className={`py-2 px-4 rounded ${filtroEstado === 'pendiente' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFiltroEstado('entregado')}
          className={`py-2 px-4 rounded ${filtroEstado === 'entregado' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Entregados
        </button>
        <button
          onClick={() => setFiltroEstado('cancelado')}
          className={`py-2 px-4 rounded ${filtroEstado === 'cancelado' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Cancelados
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-green-600 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left">Nombre del Cliente</th>
              <th className="p-4 text-left">Fecha</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map(pedido => (
                <React.Fragment key={pedido.id}>
                  <tr className="border-b border-gray-200">
                    <td className="p-4">{pedido.nombre}</td>
                    <td className="p-4">{formatearFecha(pedido.fecha)}</td>
                    <td className="p-4">${calcularTotal(pedido.productos)}</td>
                    <td className="p-4">{pedido.estadoPedido}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => mostrarDetalles(pedido)}
                        className={`bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 ${pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'bg-green-600' : ''}`}
                      >
                        {pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'Ocultar Detalles' : 'Detalles'}
                      </button>
                    </td>
                  </tr>
                  {pedidoSeleccionado && pedidoSeleccionado.id === pedido.id && (
                    <tr>
                      <td colSpan="5" className="p-4 bg-gray-100">
                        <h2 className="text-xl font-semibold mb-2">Detalles del Pedido</h2>
                        <p><strong>Nombre del Cliente:</strong> {pedidoSeleccionado.nombre}</p>
                        <p><strong>Fecha:</strong> {formatearFecha(pedidoSeleccionado.fecha)}</p>
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
                        <h2 className="text-xl font-semibold mt-2">Subtotal: ${calcularTotal(pedidoSeleccionado.productos)}</h2>

                        {pedido.estadoPedido === 'pendiente' && (
                          <button
                            onClick={() => manejarEstadoEntrega(pedido)}
                            className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
                          >
                            <FaCheckCircle className="inline-block mr-1" /> Marcar Entregado
                          </button>
                      )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No hay pedidos {filtroEstado === 'todos' ? '' : filtroEstado}s registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedidosAdmin;
