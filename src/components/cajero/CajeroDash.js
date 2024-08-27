import React, { useEffect, useState } from 'react';

const CajeroDashboard = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-6 shadow-md rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-2">¡Bienvenido, {userName}!</h2>
                <p className="text-gray-700">
                    Este es tu dashboard, donde puedes gestionar productos, proveedores, ventas y pedidos. 
                </p>
            </div>

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
        </div>
    );
};

export default CajeroDashboard;
