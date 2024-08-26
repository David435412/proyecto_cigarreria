import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    return (
        <div class="container mx-auto px-4 py-8">
            <div class="bg-white p-6 shadow-md rounded-lg mb-8">
                <h2 class="text-2xl font-bold mb-2">¡Bienvenido, {userName}!</h2>
                <p class="text-gray-700">
                    Este es tu dashboard, donde puedes gestionar todo el sistema de manera integral. Desde aquí podrás administrar usuarios, productos, proveedores, ventas y pedidos.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                <div class="bg-white p-6 shadow-md rounded-lg">
                    <h2 class="text-xl font-bold mb-2">Gestión de Usuarios</h2>
                    <p class="text-gray-700">
                        Administra a los usuarios del sistema. Podrás realizar todas las operaciones CRUD (crear, leer, actualizar, eliminar) para los roles de cajero y domiciliario.
                    </p>
                </div>
                <div class="bg-white p-6 shadow-md rounded-lg">
                    <h2 class="text-xl font-bold mb-2">Gestión de Productos</h2>
                    <p class="text-gray-700">
                        Administra los productos en el sistema. Podrás realizar todas las operaciones CRUD para añadir, actualizar o eliminar productos del inventario.
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                <div class="bg-white p-6 shadow-md rounded-lg">
                    <h2 class="text-xl font-bold mb-2">Gestión de Proveedores</h2>
                    <p class="text-gray-700">
                        Administra a los proveedores. Podrás realizar todas las operaciones CRUD para gestionar la información de los proveedores del sistema.
                    </p>
                </div>
                <div class="bg-white p-6 shadow-md rounded-lg">
                    <h2 class="text-xl font-bold mb-2">Ventas</h2>
                    <p class="text-gray-700">
                        Registra, consulta e inactiva ventas realizadas en el sistema. Podrás gestionar el historial de ventas y su estado.
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 mb-8">
                <div class="bg-white p-6 shadow-md rounded-lg">
                    <h2 class="text-xl font-bold mb-2">Pedidos</h2>
                    <p class="text-gray-700">
                        Consulta y modifica el estado de los pedidos realizados por los clientes. Gestiona el campo de estado de entrega para asegurar un seguimiento adecuado.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
