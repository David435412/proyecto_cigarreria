import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTable, useFilters, usePagination } from 'react-table';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaPlus, FaArchive } from 'react-icons/fa';

const GestionVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [filteredVentas, setFilteredVentas] = useState([]);
    const [filterInput, setFilterInput] = useState('');
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [mostrarInactivas, setMostrarInactivas] = useState(false);
    const navigate = useNavigate();

    const fetchVentas = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/ventas');
            setVentas(response.data);
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    }, []);

    useEffect(() => {
        fetchVentas();
    }, [fetchVentas]);

    useEffect(() => {
        const filtered = ventas.filter(venta =>
            (mostrarInactivas ? venta.estado === 'inactivo' : venta.estado === 'activo') &&
            (venta.numeroDocumento.toLowerCase().includes(filterInput.toLowerCase()) ||
            venta.fechaVenta.toLowerCase().includes(filterInput.toLowerCase()))
        );
        setFilteredVentas(filtered);
    }, [filterInput, ventas, mostrarInactivas]);

    const handleFilterChange = e => {
        setFilterInput(e.target.value || '');
    };

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
                    fetchVentas();

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

    const manejarReactivarVenta = async (venta) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Cambiar el estado de esta venta a activo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, reactivar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Cambiar el estado de la venta a 'activo'
                    await axios.put(`http://localhost:5000/ventas/${venta.id}`, {
                        ...venta,
                        estado: 'activo'
                    });

                    // Actualizar la lista de ventas
                    fetchVentas();

                    Swal.fire(
                        '¡Venta reactivada!',
                        'La venta ha sido cambiada a estado activo.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error al reactivar la venta:', error);
                    Swal.fire(
                        'Error',
                        'Hubo un error al intentar reactivar la venta.',
                        'error'
                    );
                }
            }
        });
    };

    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(ventaSeleccionada && ventaSeleccionada.id === venta.id ? null : venta);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Número Documento',
                accessor: 'numeroDocumento',
                Filter: ColumnFilter,
            },
            {
                Header: 'Fecha Venta',
                accessor: 'fechaVenta',
                Filter: ColumnFilter,
            },
            {
                Header: 'Total',
                accessor: row => `$${calcularTotal(row.productos)}`,
                id: 'total',
                Filter: ColumnFilter,
            },
            {
                Header: 'Acciones',
                Cell: ({ row }) => (
                    <div className="flex space-x-2 justify-center">
                        {row.original.estado === 'activo' ? (
                            <>
                                <button
                                    onClick={() => mostrarDetalles(row.original)}
                                    className={`bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 ${ventaSeleccionada && ventaSeleccionada.id === row.original.id ? 'bg-blue-600' : ''}`}
                                >
                                    {ventaSeleccionada && ventaSeleccionada.id === row.original.id ? 'Ocultar Detalles' : 'Detalles'}
                                </button>
                                <button
                                    onClick={() => manejarEliminarVenta(row.original)}
                                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                >
                                    Inactivar
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => manejarReactivarVenta(row.original)}
                                className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                            >
                                Reactivar
                            </button>
                        )}
                    </div>
                )
            }
        ],
        [ventaSeleccionada, mostrarInactivas]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state: { pageIndex },
        gotoPage,
        canPreviousPage,
        previousPage,
        canNextPage,
        nextPage,
        pageOptions,
        setFilter,
    } = useTable(
        {
            columns,
            data: filteredVentas,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useFilters,
        usePagination
    );

    return (
        <div className="container mx-auto px-4 my-8">
            <h1 className="text-3xl font-bold mb-4 text-center">Gestión de Ventas</h1>
            <p className="mb-4 text-center">Aquí puedes gestionar las ventas registradas en el sistema. Puedes ver detalles de cada venta, así como inactivar o reactivar ventas si es necesario.</p>
            <div className="mb-4 flex space-x-4 place-content-center">
                <button
                    onClick={() => navigate('/registro-venta')}
                    className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Nueva Venta
                </button>
                <button
                    onClick={() => setMostrarInactivas(!mostrarInactivas)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaArchive className="inline-block mr-2" /> {mostrarInactivas ? 'Mostrar Activas' : 'Mostrar Inactivas'}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table {...getTableProps()} className="w-full border-collapse border border-gray-300 mx-auto">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} className="bg-green-600">
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()} className="border p-2 text-white text-center">
                                        {column.render('Header')}
                                        {column.canFilter ? column.render('Filter') : null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <React.Fragment key={row.id}>
                                    <tr {...row.getRowProps()} className="bg-white hover:bg-gray-100">
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()} className="border p-2 text-black text-center">
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                    {ventaSeleccionada && ventaSeleccionada.id === row.original.id && (
                                        <tr>
                                            <td colSpan="5" className="py-4 px-4 border-b bg-gray-100">
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
                                                    <p className="font-bold mt-2">Total: ${calcularTotal(ventaSeleccionada.productos)}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
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
        </div>
    );
};

const ColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={e => setFilter(e.target.value || undefined)}
            placeholder={`Buscar ${count} registros...`}
            className="border border-gray-300 p-1 rounded"
        />
    );
};

export default GestionVentas;
