import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CajeroDashboard = () => {
    const [userName, setUserName] = useState('');
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [outOfStockAlerts, setOutOfStockAlerts] = useState([]);

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }

        // Función para obtener productos con stock bajo y productos agotados
        const fetchProducts = async () => {
            try {
                // Consulta a la API de json-server
                const response = await axios.get('http://localhost:5000/productos');
                const products = response.data;

                // Filtra los productos con cantidad menor a 20
                const lowStock = products.filter(product => product.cantidad < 20);

                // Filtra los productos con cantidad igual a 0
                const outOfStock = products.filter(product => product.cantidad === 0);

                // Actualiza el estado de los productos agotados a inactivo
                const updatedOutOfStock = [];
                for (const product of outOfStock) {
                    await axios.patch(`http://localhost:5000/productos/${product.id}`, { estado: 'inactivo' });
                    updatedOutOfStock.push(product);
                }

                // Actualiza el estado de los productos con stock disponible a activo
                const updatedLowStock = [];
                for (const product of lowStock) {
                    if (product.cantidad > 0) {
                        await axios.patch(`http://localhost:5000/productos/${product.id}`, { estado: 'activo' });
                        updatedLowStock.push(product);
                    }
                }

                setLowStockProducts(updatedLowStock);
                setOutOfStockAlerts(updatedOutOfStock);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProducts();
    }, []);

    return (

        <>
        <div className="bg-green-600 text-white p-6 shadow-md mt-5 ">
            <h2 className="text-center mb-4 text-4xl font-bold">¡Bienvenido, {userName}!</h2>
            <p className="text-center mb-4 text-xl">
            Este es tu dashboard, donde puedes gestionar productos, proveedores, ventas y pedidos.
            </p>
        </div>
        <div className="container mx-auto px-4 py-8">
                {outOfStockAlerts.length > 0 && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-8">
                        <h3 className="text-lg font-bold">Alerta de Producto Agotado</h3>
                        <ul>
                            {outOfStockAlerts.map((product) => (
                                <li key={product.id} className="mb-2">
                                    <strong>{product.nombre}</strong> - Se ha agotado. El estado ha sido cambiado a inactivo.
                                    Es recomendable agregar más cantidad de este producto.
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <Link
                                to="/productos-agotados-cajero"
                                className="text-blue-500 hover:underline"
                            >
                                Ver Productos Agotados
                            </Link>
                        </div>
                    </div>
                )}

                {lowStockProducts.length > 0 && (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-8">
                        <h3 className="text-lg font-bold">Alerta de Stock Bajo</h3>
                        <ul>
                            {lowStockProducts.map((product) => (
                                <li key={product.id} className="mb-2">
                                    <strong>{product.nombre}</strong> - Stock bajo ({product.cantidad})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                    {/* Gestión de Productos */}
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Gestión de Productos</h2>
                        <p className="text-gray-700">
                            Administra los productos en el sistema. Podrás realizar todas las operaciones CRUD para añadir y actualizar productos del inventario.
                        </p>
                    </div>

                    {/* Gestión de Proveedores */}
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Gestión de Proveedores</h2>
                        <p className="text-gray-700">
                            Administra a los proveedores. Podrás realizar todas las operaciones CRUD para gestionar la información de los proveedores del sistema.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                    {/* Ventas */}
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Ventas</h2>
                        <p className="text-gray-700">
                            Registra y consulta las ventas realizadas en el sistema. Podrás gestionar el historial de ventas.
                        </p>
                    </div>

                    {/* Pedidos */}
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Pedidos</h2>
                        <p className="text-gray-700">
                            Consulta el estado de los pedidos realizados por los clientes. Podrás visualizar el seguimiento adecuado.
                        </p>
                    </div>
                </div>
            </div></>
    );
};

export default CajeroDashboard;
