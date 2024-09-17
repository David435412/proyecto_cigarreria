import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';

const DatosEntrega = () => {
    const [carrito, setCarrito] = useState([]);
    const [direccion, setDireccion] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('localStorage contents:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            console.log(`${key}: ${localStorage.getItem(key)}`);
        }
        // Obtener datos del carrito del localStorage
        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
            const carritoData = JSON.parse(localStorage.getItem(`carrito_${usuarioId}`)) || [];
            setCarrito(carritoData);
        }

        // Obtener datos del usuario desde localStorage
        const userName = localStorage.getItem('name');
        if (userName) {
            setNombre(userName);
        }
        const userEmail = localStorage.getItem('email');
        if (userEmail) {
            setCorreo(userEmail);
        }
        const userPhone = localStorage.getItem('phone');
        if (userPhone) {
            setTelefono(userPhone);
        }

    }, []);

    const handleDireccionChange = (e) => {
        setDireccion(e.target.value);
    };

    const enviarCorreoCajeros = async (pedido) => {
        try {
            // Obtener los correos y nombres de los cajeros
            const { data: cajeros } = await axios.get('http://localhost:5000/usuarios?rol=cajero');
            
            // Enviar el correo a cada cajero
            await Promise.all(cajeros.map(cajero => {
                return emailjs.send('service_ngt31qb', 'template_1wsxgoh', {
                    to_name: cajero.nombre, 
                    to_correo: cajero.correo, 
                    customer_name: pedido.nombre,
                    customer_email: pedido.correo,
                    customer_phone: pedido.telefono,
                    delivery_address: pedido.direccion,
                    order_date: new Date().toLocaleDateString(),
                    products: pedido.productos.map(p => `${p.nombre} - ${p.precio} X ${p.cantidad}`).join(" --- "),
                    total_amount: calcularTotal(pedido.productos),
                }, 'JS01zy1f3DQ02Ojb0');
            }));
        } catch (error) {
            console.error('Error al enviar correos:', error);
        }
    };
    
    

    const handleConfirmar = async () => {
        if (!direccion.trim()) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        const usuarioId = localStorage.getItem('userId');
        if (usuarioId) {
            const pedido = {
                usuarioId,
                direccion,
                nombre,
                correo,
                telefono,
                productos: carrito,
                fecha: new Date().toISOString(),
                estadoPedido: 'pendiente',
                estado: 'activo',
                metodoPago: 'efectivo',
            };

            try {
                const response = await axios.post('http://localhost:5000/pedidos', pedido);

                await Promise.all(carrito.map(async (producto) => {
                    const { data: productoActual } = await axios.get(`http://localhost:5000/productos/${producto.id}`);
                    const productoActualizado = {
                        ...productoActual,
                        cantidad: productoActual.cantidad - producto.cantidad,
                    };
                    await axios.put(`http://localhost:5000/productos/${producto.id}`, productoActualizado);
                }));

                // Enviar correos a los cajeros
                await enviarCorreoCajeros(pedido);

                localStorage.removeItem(`carrito_${usuarioId}`);
                localStorage.removeItem('datosCarrito');
                localStorage.removeItem('direccionEntrega');

                navigate('/confirmar', { state: { pedidoId: response.data.id } });
            } catch (error) {
                console.error('Error al crear el pedido:', error);
                setError('Hubo un problema al procesar tu pedido.');
            }
        }
    };

    const calcularTotal = (productos) => {
        return productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0).toFixed(3);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6">Datos de Entrega</h1>
            {carrito.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-xl mb-4">El carrito está vacío.</p>
                    <Link to="/productos" className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500">Volver a la tienda</Link>
                </div>
            ) : (
                <div>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mb-6">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Producto</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Cantidad</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Precio</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map((producto) => (
                                <tr key={producto.id}>
                                    <td className="py-4 px-4 border-b">
                                        <div className="flex items-center">
                                            <img src={producto.imagen} alt={producto.nombre} className="w-20 h-20 object-cover mr-4" />
                                            <span className="text-sm font-medium">{producto.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 border-b">{producto.cantidad}</td>
                                    <td className="py-4 px-4 border-b">${producto.precio}</td>
                                    <td className="py-4 px-4 border-b">${(producto.precio * producto.cantidad).toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Subtotal: ${calcularTotal(carrito)}</h2>
                    </div>
                    {/* Mostrar datos de usuario como texto en lugar de inputs */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Nombre: {nombre}</p>
                    </div>
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Correo Electrónico: {correo}</p>
                    </div>
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Teléfono: {telefono}</p>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">Dirección de Entrega</label>
                        <input
                            type="text"
                            id="direccion"
                            value={direccion}
                            onChange={handleDireccionChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Ingresa tu dirección de entrega"
                        />
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                    <button
                        onClick={handleConfirmar}
                        className="px-8 py-4 bg-gradient-to-r from-green-700 to-green-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                    >
                        Confirmar y Proceder al Pago
                    </button>
                </div>
            )}
            <div className="mt-6 text-center">
                <Link
                    to="/cliente-dash"
                    className="px-5 py-3 bg-gray-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                >
                    Seguir comprando
                </Link>
            </div>
        </div>
    );
};

export default DatosEntrega;
