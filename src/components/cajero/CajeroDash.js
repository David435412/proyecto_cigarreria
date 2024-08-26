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
        <div class="container mx-auto px-4 py-8">
            <div class="bg-white p-6 shadow-md rounded-lg mb-8">
                <h2 class="text-2xl font-bold mb-2">¡Bienvenido, {userName}!</h2>                
            </div>
        </div>
    );
};

export default CajeroDashboard;