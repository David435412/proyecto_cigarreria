import React, { useEffect, useState } from 'react';

const DomiciliarioDashboard = () => {
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
                    Este es tu dashboard, donde puedes gestionar todo el sistema de manera integral. Desde aquí podrás administrar pedidos.
                </p>
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

export default DomiciliarioDashboard;
