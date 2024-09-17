import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import fuera_4 from "../../assets/images/fuera_4.jpeg";
import css from "../../pages/css.css";

const CajeroDashboard = () => {
    const [userName, setUserName] = useState('');
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [outOfStockAlerts, setOutOfStockAlerts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }

        // Función para obtener productos con stock bajo y productos agotados
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/productos');
                const products = response.data;

                // Leer productos agotados previamente notificados
                const notifiedOutOfStock = JSON.parse(localStorage.getItem('notifiedOutOfStock')) || [];

                // Filtrar los productos con cantidad igual a 0
                const outOfStock = products.filter(product => product.cantidad === 0);

                // Filtrar los productos con cantidad menor a 20
                const lowStock = products.filter(product => product.cantidad < 20);

                // Identificar nuevos productos agotados que deben ser notificados
                const newOutOfStockAlerts = outOfStock.filter(product => 
                    !notifiedOutOfStock.includes(product.id)
                );

                // Enviar correo a cajeros y administradores sobre nuevos productos agotados
                if (newOutOfStockAlerts.length > 0) {
                    await enviarCorreoRoles(newOutOfStockAlerts);

                    // Actualizar productos notificados en el almacenamiento local
                    const updatedNotifiedOutOfStock = [
                        ...notifiedOutOfStock,
                        ...newOutOfStockAlerts.map(product => product.id)
                    ];
                    localStorage.setItem('notifiedOutOfStock', JSON.stringify(updatedNotifiedOutOfStock));
                }

                // Filtrar los productos que ya tienen stock y deberían ser removidos de la lista de notificaciones
                const productsInStock = products.filter(product => product.cantidad > 0);
                const clearedOutOfStockAlerts = notifiedOutOfStock.filter(id => 
                    !productsInStock.some(product => product.id === id)
                );

                // Limpiar productos agotados notificados del almacenamiento local
                if (clearedOutOfStockAlerts.length > 0) {
                    const remainingNotified = notifiedOutOfStock.filter(id => 
                        !clearedOutOfStockAlerts.includes(id)
                    );
                    localStorage.setItem('notifiedOutOfStock', JSON.stringify(remainingNotified));
                }

                setLowStockProducts(lowStock);
                setOutOfStockAlerts(outOfStock);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProducts();
    }, []);

    const enviarCorreoRoles = async (productosAgotados) => {
        try {
            const { data: usuarios } = await axios.get('http://localhost:5000/usuarios?rol=administrador');
            
            await Promise.all(usuarios.map(usuario => {
                return emailjs.send('service_ug49rns', 'template_ujvyb2n', {
                    to_name: usuario.nombre,
                    to_correo: usuario.correo,
                    products: productosAgotados.map(p => `${p.nombre} - ${p.cantidad}`).join(" --- "),
                    message: 'Un producto se ha agotado. Por favor, verifica el inventario.',
                }, 'fopmWs9WYBqTAX5YD');
            }));
        } catch (error) {
            console.error('Error al enviar correos:', error);
        }
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
                                        <strong>{product.nombre}</strong> - Se ha agotado. 
                                        Es recomendable agregar más cantidad de este producto.
                                    </li>
                                ))}
                            </ul>                           
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
                <div className="flex flex-wrap justify-center gap-6 mb-8 text-center">
                    <div onClick={() => navigate('/productos-cajero')} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 cursor-pointer">
                        <div className="bg-white p-6 rounded-lg flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg">
                            <div className="flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold mb-2">Gestión de Productos</h2>
                            <p className="text-gray-700 flex-grow">
                                Consulta los diversos productos que tenemos.
                            </p>
                        </div>
                    </div>

                    <div onClick={() => navigate('/proveedores-cajero')} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 cursor-pointer">
                        <div className="bg-white p-6 rounded-lg flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg">
                            <div className="flex items-center justify-center mb-4">
                                <svg class="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                  <path fill-rule="evenodd" d="M7 2a2 2 0 0 0-2 2v1a1 1 0 0 0 0 2v1a1 1 0 0 0 0 2v1a1 1 0 1 0 0 2v1a1 1 0 1 0 0 2v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 1 0 0-2v-1a1 1 0 0 0 0-2v-1a1 1 0 0 0 0-2V8a1 1 0 0 0 0-2V5a2 2 0 0 0-2-2H7Zm1 2h6v1H8V4Zm6 4V6h-4v2h4Zm0 2h-4v1h4v-1Zm-6 4h6v-1H8v1Zm6 4H8v-1h6v1Zm2-12h2v2h-2V8Zm0 4h2v2h-2v-2Zm0 4h2v1h-2v-1Zm-6-4h2v2H8v-2Z"/>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold mb-2">Gestión de Proveedores</h2>
                            <p className="text-gray-700 flex-grow">
                                Consulta proveedores para los productos.
                            </p>
                        </div>
                    </div>

                    <div onClick={() => navigate('/ventas-cajero')} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 cursor-pointer">
                        <div className="bg-white p-6 rounded-lg flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg">
                            <div className="flex items-center justify-center mb-4">
                                <svg class="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                  <path fill-rule="evenodd" d="M21 13V9a1 1 0 0 0-1-1h-2V6a1 1 0 0 0-1-1h-4V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1H3a1 1 0 0 0-1 1v4H0v2h2v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h4v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2Zm-3-4h2v4h-2v-4Zm-4 0h2v4h-2v-4Zm-4 0h2v4h-2v-4Zm-4 0h2v4H5v-4Zm6 6h-2v-2h2v2Zm4 0h-2v-2h2v2Zm4 0h-2v-2h2v2Z"/>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold mb-2">Gestión de Ventas</h2>
                            <p className="text-gray-700 flex-grow">
                                Consulta las ventas realizadas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CajeroDashboard;
