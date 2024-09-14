import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import fuera_4 from "../../assets/images/fuera_4.jpeg";
import css from "../../pages/css.css";

const AdminDashboard = () => {
    const [userName, setUserName] = useState('');
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [outOfStockAlerts, setOutOfStockAlerts] = useState([]);

    useEffect(() => {
        // Obtener el nombre del usuario desde localStorage
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
            <div className="bg-black text-white pb-5">
                <img 
                    src={fuera_4} 
                    alt="Fondo" 
                    className="w-full h-96 object-cover filter imagen brightness-50"
                />
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">¡Bienvenido, {userName}!</h1>
                    <p className="text-xl mt-2">Este es tu dashboard, donde puedes gestionar todo el sistema de manera integral. Desde aquí podrás administrar usuarios, productos, proveedores, ventas y pedidos.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Alerts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                    {outOfStockAlerts.length > 0 && (
                        <div className="bg-red-100 text-red-800 p-4 rounded-lg flex flex-col justify-between shadow-md">
                            <h3 className="text-lg font-bold">Alerta de Producto Agotado</h3>
                            <ul className="mb-4">
                                {outOfStockAlerts.map((product) => (
                                    <li key={product.id} className="mb-2">
                                        <strong>{product.nombre}</strong> - Se ha agotado. El estado ha sido cambiado a inactivo.
                                        Es recomendable agregar más cantidad de este producto.
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to="/productos-agotados"
                                className="text-blue-500 hover:underline"
                            >
                                Ver Productos Agotados
                            </Link>
                        </div>
                    )}

                    {lowStockProducts.length > 0 && (
                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg flex flex-col justify-between shadow-md">
                            <h3 className="text-lg font-bold">Alerta de Stock Bajo</h3>
                            <ul className="mb-4">
                                {lowStockProducts.map((product) => (
                                    <li key={product.id} className="mb-2">
                                        <strong>{product.nombre}</strong> - Stock bajo ({product.cantidad})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Management Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 shadow-md rounded-lg flex flex-col justify-between h-full">
                        <h2 className="text-xl font-bold mb-2">Gestión de Usuarios</h2>
                        <p className="text-gray-700 flex-grow">
                            Administra a los usuarios del sistema. Podrás realizar todas las operaciones CRUD (crear, leer, actualizar, eliminar) para los roles de cajero y domiciliario.
                        </p>
                    </div>
                    <div className="bg-white p-6 shadow-md rounded-lg flex flex-col justify-between h-full">
                        <h2 className="text-xl font-bold mb-2">Gestión de Productos</h2>
                        <p className="text-gray-700 flex-grow">
                            Administra los productos en el sistema. Podrás realizar todas las operaciones CRUD para añadir, actualizar o eliminar productos del inventario.
                        </p>
                    </div>

                    <div className="bg-white p-6 shadow-md rounded-lg flex flex-col justify-between h-full">
                        <h2 className="text-xl font-bold mb-2">Gestión de Proveedores</h2>
                        <p className="text-gray-700 flex-grow">
                            Administra a los proveedores. Podrás realizar todas las operaciones CRUD para gestionar la información de los proveedores del sistema.
                        </p>
                    </div>
                    <div className="bg-white p-6 shadow-md rounded-lg flex flex-col justify-between h-full">
                        <h2 className="text-xl font-bold mb-2">Ventas</h2>
                        <p className="text-gray-700 flex-grow">
                            Registra, consulta e inactiva ventas realizadas en el sistema. Podrás gestionar el historial de ventas y su estado.
                        </p>
                    </div>
                    <div className="bg-white p-6 shadow-md rounded-lg flex flex-col justify-between h-full">
                        <h2 className="text-xl font-bold mb-2">Pedidos</h2>
                        <p className="text-gray-700 flex-grow">
                            Consulta y modifica el estado de los pedidos realizados por los clientes. Gestiona el campo de estado de entrega para asegurar un seguimiento adecuado.
                        </p>
                    </div>
                </div>

                    
            </div>
        </>
    );
};

export default AdminDashboard;
