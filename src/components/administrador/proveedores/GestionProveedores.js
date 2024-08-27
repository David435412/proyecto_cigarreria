import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const GestionProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

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

    const handleDelete = async () => {
        if (!proveedorAEliminar) return;

        try {
            await axios.put(`http://localhost:5000/proveedores/${proveedorAEliminar.id}`, { ...proveedorAEliminar, estado: 'inactivo' });
            fetchProveedores();
            setAlertMessage('Proveedor inactivado exitosamente.');
        } catch (error) {
            console.error('Error al inactivar el proveedor', error);
            setError('No se pudo inactivar el proveedor.');
        } finally {
            setProveedorAEliminar(null); 
        }
    };

    return (
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-4">Gestión de Proveedores</h1>
            <p class="mb-8">
                En esta sección podrás gestionar a los proveedores del sistema. Puedes registrar nuevos proveedores,
                visualizar los proveedores que ya has registrado y desactivarlos según sea necesario.
            </p>

            {error && <p class="text-red-500 mb-4">{error}</p>}
            {alertMessage && (
                <div class="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                    {alertMessage}
                </div>
            )}

            <div class="mb-4 flex space-x-4">
                <button
                    onClick={() => navigate('/registro-proveedor')}
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <FaPlus class="inline-block mr-2" /> Registrar Nuevo proveedor
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead class="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th class="p-4 text-left">Nombre</th>
                            <th class="p-4 text-left">Teléfono</th>
                            <th class="p-4 text-left">Correo</th>
                            <th class="p-4 text-left">Estado</th>
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
                                    <td class="p-4">{proveedor.estado}</td>
                                    <td class="p-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/editar-proveedor/${proveedor.id}`)}
                                            class="bg-orange-500 text-white py-1 px-2 rounded hover:bg-orange-600"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => setProveedorAEliminar(proveedor)}
                                            class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                        >
                                            Inactivar
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

            {/* Modal de confirmación */}
            {proveedorAEliminar && (
                <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div class="bg-white p-6 rounded-lg shadow-lg">
                        <h3 class="text-xl mb-4">¿Estás seguro de que deseas inactivar este proveedor?</h3>
                        <div class="flex justify-end gap-4">
                            <button
                                onClick={() => setProveedorAEliminar(null)}
                                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Inactivar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionProveedores;
