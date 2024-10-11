import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import { useTable, usePagination } from 'react-table';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [pedidoAConfirmar, setPedidoAConfirmar] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pedidos');
        setPedidos(response.data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    fetchPedidos();
  }, []); // Dependencias vacías, no debería causar bucles

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
    
  const [loading, setLoading] = useState(false);

  const confirmarEntrega = useCallback(async () => {
    if (!pedidoAConfirmar || loading) return;
  
    setLoading(true);
  
    try {
        await axios.patch(`http://localhost:5000/pedidos/${pedidoAConfirmar.id}`, { estadoPedido: 'entregado' });
  
        const pedidosActualizados = pedidos.map(pedido =>
            pedido.id === pedidoAConfirmar.id ? { ...pedido, estadoPedido: 'entregado' } : pedido
        );
  
        console.log("Pedidos actualizados:", pedidosActualizados); // Verificar aquí
  
        setPedidos(pedidosActualizados);
        setPedidoAConfirmar(null);
  
        Swal.fire({
            title: 'Pedido Marcado',
            text: `El pedido de "${pedidoAConfirmar.nombre}" ha sido marcado como entregado.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
  
        await emailjs.send('service_vlpu06s', 'template_2lgkzzq', {
            to_correo: pedidoAConfirmar.correo,
            customer_name: pedidoAConfirmar.nombre,
            delivery_date: formatearFecha(new Date()),
            products: pedidoAConfirmar.productos.map(p => `${p.nombre} - ${p.precio} x ${p.cantidad}`).join(" --- "),
            total: calcularTotal(pedidoAConfirmar.productos)
        }, 'JS01zy1f3DQ02Ojb0');
  
    } catch (error) {
        console.error('Error al confirmar la entrega:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo marcar el pedido como entregado.',
            icon: 'error'
        });
    } finally {
        setLoading(false);
    }
  }, [pedidoAConfirmar, loading, pedidos]);
        

  const mostrarDetalles = (pedido) => {
    setPedidoSeleccionado(pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? null : pedido);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString();
  };

  // Filtrar y ordenar los pedidos
  const pedidosFiltrados = useMemo(() =>
    pedidos.filter(pedido => 
      (filtroEstado === 'todos' || pedido.estadoPedido === filtroEstado) &&
      (pedido.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
    ), [pedidos, filtroEstado, filtroBusqueda] // Dependencias de useMemo
  );

  // Configuración de la tabla con react-table
  const columns = useMemo(() => [
    { Header: 'Nombre del Cliente', accessor: 'nombre' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Total', accessor: (row) => `$${calcularTotal(row.productos)}` },
    { Header: 'Estado', accessor: 'estadoPedido' },
    {
      Header: 'Acciones',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => mostrarDetalles(row.original)}
            className={`bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 ${pedidoSeleccionado && pedidoSeleccionado.id === row.original.id ? 'bg-blue-600' : ''}`}
          >
            {pedidoSeleccionado && pedidoSeleccionado.id === row.original.id ? 'Ocultar Detalles' : 'Detalles'}
          </button>
          {row.original.estadoPedido === 'pendiente' && (
            <button
                onClick={() => manejarEstadoEntrega(row.original)}
                className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
            >
                <FaCheckCircle className="inline-block mr-1" /> Marcar Entregado
            </button>
        )}

        </div>
      )
    }
  ], [pedidoSeleccionado]);
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data: pedidosFiltrados,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Gestión de Pedidos</h1>
      <p className="mb-8 text-center">
        En esta sección puedes gestionar los pedidos del sistema. Aquí podrás revisar los pedidos realizados,
        marcar los pedidos como entregados y filtrar los pedidos según su estado (pendiente, entregado, cancelado).
      </p>

      <div className="mb-4 flex space-x-4 place-content-center">
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

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="p-2 border border-gray-300 rounded"
          value={filtroBusqueda}
          onChange={(e) => setFiltroBusqueda(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-md" {...getTableProps()}>
          <thead className="bg-green-600 border-b border-gray-200">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="text-white">
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="p-4 text-left">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
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
                        className={`bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 ${pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'bg-blue-600' : ''}`}
                      >
                        {pedidoSeleccionado && pedidoSeleccionado.id === pedido.id ? 'Ocultar Detalles' : 'Detalles'}
                      </button>
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
                  {pedidoSeleccionado && pedidoSeleccionado.id === pedido.id && (
                    <tr>
                      <td colSpan="5" className="p-4 bg-gray-100">
                        <h2 className="text-xl font-semibold mb-2">Detalles del Pedido</h2>
                        <p><strong>Nombre del Cliente:</strong> {pedidoSeleccionado.nombre}</p>
                        <p><strong>Correo Electrónico:</strong> {pedidoSeleccionado.correo}</p> 
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

                       
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">No hay pedidos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {'<<'}
                </button>
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {'<'}
                </button>
                <span className="text-gray-700">
                    Página {pageIndex + 1} de {pageOptions.length}
                </span>
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {'>'}
                </button>
                <button
                    onClick={() => gotoPage(pageOptions.length - 1)}
                    disabled={!canNextPage}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {'>>'}
                </button>
            </div>
    </div>
  );
};

export default PedidosAdmin;
