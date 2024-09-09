import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const ConfirmacionVenta = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { productosSeleccionados } = location.state || {};

    const [tipoDocumento, setTipoDocumento] = useState('');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [estado, setEstado] = useState('activo'); 
    const [error, setError] = useState(null);

    const total = productosSeleccionados.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    const totalConTresDecimales = total.toFixed(3);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!tipoDocumento || !numeroDocumento || !metodoPago) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        const venta = {
            productos: productosSeleccionados,
            tipoDocumento,
            numeroDocumento,
            total,
            fechaVenta: new Date().toLocaleDateString(),
            metodoPago,
            estado 
        };

        try {
            // Registrar la venta
            await axios.post('http://localhost:5000/ventas', venta);

            // Actualizar la cantidad de cada producto en el inventario
            await Promise.all(productosSeleccionados.map(async (producto) => {
                // Obtener los datos actuales del producto
                const { data: productoActual } = await axios.get(`http://localhost:5000/productos/${producto.id}`);

                // Calcular la nueva cantidad
                const nuevaCantidad = productoActual.cantidad - producto.cantidad;

                // Actualizar la cantidad del producto
                if (nuevaCantidad < 0) {
                    throw new Error(`No hay suficiente stock para el producto ${producto.nombre}`);
                }

                await axios.put(`http://localhost:5000/productos/${producto.id}`, {
                    ...productoActual,  // Mantener los otros campos del producto
                    cantidad: nuevaCantidad  // Disminuir la cantidad
                });
            }));

            // Limpiar el localStorage
            localStorage.removeItem('productosSeleccionados');

            Swal.fire({
                title: 'Éxito',
                text: 'La venta se registró correctamente.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            }).then(() => {         
                navigate('/ventas-cajero');
            });
        } catch (error) {
            setError(`Error al registrar la venta: ${error.message}`);
            console.error('Error al registrar la venta', error);
        }
    };

    const handleAddMoreProducts = () => {
        navigate(-1);  // Volver a la página anterior sin recargar
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Confirmación de Venta</h1>
            <p className="mb-8">
                A continuación se muestran los detalles de la venta. Completa el formulario para registrar la venta.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Detalles de la Venta */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Detalles de la Venta</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productosSeleccionados.map(producto => (
                        <div key={producto.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden p-4">
                            <div className="w-full h-32 relative mb-4">
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="object-cover w-full h-full absolute inset-0"
                                />
                            </div>
                            <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
                            <p className="text-gray-900 mb-2">Cantidad: {producto.cantidad}</p>
                            <p className="text-gray-900 mb-2">Precio Unitario: ${producto.precio}</p>
                            <p className="text-gray-900 font-bold">Total: ${ (producto.precio * producto.cantidad).toFixed(3) }</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-lg font-bold">
                    <p>Total Venta: ${totalConTresDecimales}</p>
                </div>
            </div>

            {/* Formulario para Datos de Venta */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                    <label htmlFor="tipoDocumento" className="block text-sm font-medium mb-1">Tipo de Documento:</label>
                    <select
                        id="tipoDocumento"
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="CE">Cédula de Extranjería</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="numeroDocumento" className="block text-sm font-medium mb-1">Número de Documento:</label>
                    <input
                        type="text"
                        id="numeroDocumento"
                        value={numeroDocumento}
                        onChange={(e) => setNumeroDocumento(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="metodoPago" className="block text-sm font-medium mb-1">Método de Pago:</label>
                    <select
                        id="metodoPago"
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                        required
                    >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                        <option value="Nequi">Nequi</option>
                        <option value="Daviplata">Daviplata</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="estado" className="block text-sm font-medium mb-1">Estado:</label>
                    <input
                        type="text"
                        id="estado"
                        value={estado}
                        readOnly
                        className="p-2 border border-gray-300 rounded w-full bg-gray-100"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
                >
                    Confirmar Venta
                </button>

                <button
                    type="button"
                    onClick={handleAddMoreProducts}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Agregar Más Productos
                </button>
            </form>
        </div>
    );
};

export default ConfirmacionVenta;
