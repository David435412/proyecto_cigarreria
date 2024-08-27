import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  
  useEffect(() => {
    // Función para obtener pedidos desde la API
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pedidos'); // Ajusta la URL según tu configuración
        // Filtrar pedidos con estado 'pendiente'
        const pedidosPendientes = response.data.filter(pedido => pedido.estadoPedido === 'pendiente');
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

  
  
  const mostrarDetalles = (pedido) => {
    setPedidoSeleccionado(pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? null : pedido);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pedidos Pendientes</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr>
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
              <tr key={pedido.id}>
                <td className="py-2 px-4 border-b">{pedido.nombre}</td>
                <td className="py-2 px-4 border-b">{pedido.fecha}</td>
                <td className="py-2 px-4 border-b">${calcularTotal(pedido.productos)}</td>
                <td className="py-2 px-4 border-b">{pedido.estadoPedido}</td>
                <td className="py-2 px-4 border-b text-center">                  
                  <button
                    onClick={() => mostrarDetalles(pedido)}
                    className={`bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 ${pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'bg-green-600' : ''}`}
                  >
                    {pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'Ocultar Detalles' : 'Detalles'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-2 px-4 text-center">No hay pedidos pendientes</td>
            </tr>
          )}
        </tbody>
      </table>

      {pedidoSeleccionado && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Detalles del Pedido</h2>
          <p><strong>Nombre del Cliente:</strong> {pedidoSeleccionado.nombre}</p>
          <p><strong>Fecha:</strong> {pedidoSeleccionado.fecha}</p>
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
        </div>
      )}
      
    </div>
  );
};

export default PedidosAdmin;
