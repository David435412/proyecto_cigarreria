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

        <>
        <div className="bg-green-600 text-white p-6 shadow-md mt-5 ">
            <h2 className="text-center mb-4 text-4xl font-bold">¡Bienvenido, {userName}!</h2>
            <p className="text-center mb-4 text-xl">
            Este es tu dashboard, donde puedes gestionar todo el sistema de manera integral. Desde aquí podrás administrar pedidos.
            </p>
        </div>
        <div class="container mx-auto px-4 py-8">
                
                <div class="grid grid-cols-1 gap-6 mb-8">
                    <div class="bg-white p-6 shadow-md rounded-lg">
                        <h2 class="text-xl font-bold mb-2">Pedidos</h2>
                        <p class="text-gray-700">
                            Consulta y modifica el estado de los pedidos realizados por los clientes. Gestiona el campo de estado de entrega para asegurar un seguimiento adecuado.
                        </p>
                    </div>
                </div>
            </div></>
    );
};

export default DomiciliarioDashboard;
