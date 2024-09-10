import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const GestionProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const navigate = useNavigate();

    // Obtener los usuarios desde la API
    const fetchProveedores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/proveedores');
            // Aquí simplemente guardamos todos los proveedores sin filtrarlos
            const proveedoresFiltrados = response.data.filter(proveedor =>
                ( proveedor.estado === 'activo')
            );
            setProveedores(proveedoresFiltrados);
        } catch (error) {
            console.error('Error al obtener los proveedores', error);
            setError('No se pudieron cargar los proveedores.');
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    return (
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-4">Gestión de Proveedores</h1>
            <p class="mb-8">
                En esta sección podrás gestionar a los proveedores del sistema. Puedes registrar nuevos proveedores,
                visualizar los proveedores que ya has registrado y editarlos.
            </p>

            {error && <p class="text-red-500 mb-4">{error}</p>}
            {alertMessage && (
                <div class="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                    {alertMessage}
                </div>
            )}

            <div class="mb-4 flex space-x-4">
                <button
                    onClick={() => navigate('/registro-prov-cajero')}
                    class="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                    <FaPlus class="inline-block mr-2" /> Registrar Nuevo proveedor
                </button>               
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-md">
                    <thead class="bg-green-600 border-b border-gray-200">
                        <tr class='text-white'>
                            <th class="p-4 text-left">Nombre</th>
                            <th class="p-4 text-left">Teléfono</th>
                            <th class="p-4 text-left">Correo</th>
                            <th class="p-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.length > 0 ? (
                            proveedores.map((proveedor) => (
                                <tr key={proveedor.id} class="border-b border-gray-200">
                                    <td class="p-4">{proveedor.nombre}</td>
                                    <td class="p-4">{proveedor.telefono}</td>
                                    <td class="p-4">{proveedor.correo}</td>
                                    <td class="p-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/editar-prov-cajero/${proveedor.id}`)}
                                            class="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
                                        >
                                            Editar
                                        </button>                                        
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" class="p-4 text-center text-gray-500">
                                    No hay proveedores registrados en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionProveedores;
