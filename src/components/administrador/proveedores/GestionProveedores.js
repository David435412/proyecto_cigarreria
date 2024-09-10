import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaArchive } from 'react-icons/fa';
import Swal from 'sweetalert2';

const GestionProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [mostrarInactivos, setMostrarInactivos] = useState(false);

    const navigate = useNavigate();

    // Obtener los proveedores desde la API
    const fetchProveedores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/proveedores');
            const proveedoresFiltrados = response.data.filter(proveedor =>
                mostrarInactivos ? true : proveedor.estado === 'activo'
            );
            setProveedores(proveedoresFiltrados);
        } catch (error) {
            console.error('Error al obtener los proveedores', error);
            setError('No se pudieron cargar los proveedores.');
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, [mostrarInactivos]);

    // Maneja el cambio de estado a inactivo utilizando SweetAlert
    const handleEliminar = (proveedor) => {
        Swal.fire({
            title: 'Confirmar Inactivación',
            text: `¿Estás seguro de que quieres inactivar el proveedor "${proveedor.nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Inactivar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/proveedores/${proveedor.id}`, { ...proveedor, estado: 'inactivo' });
                    fetchProveedores();
                    setAlertMessage('Proveedor inactivado exitosamente.');
                } catch (error) {
                    console.error('Error al inactivar el proveedor', error);
                    setError('No se pudo inactivar el proveedor.');
                }
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Gestión de Proveedores</h1>
            <p className="mb-8">
                En esta sección podrás gestionar a los proveedores del sistema. Puedes registrar nuevos proveedores,
                visualizar los proveedores que ya has registrado y desactivarlos según sea necesario.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {alertMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                    {alertMessage}
                </div>
            )}

            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => navigate('/registro-proveedor')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Nuevo proveedor
                </button>
                <button
                    onClick={() => navigate('/proveedores-inactivos')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaArchive className="inline-block mr-2" /> Proveedores Inactivos
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-green-600 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-left">Nombre</th>
                            <th className="p-4 text-left">Teléfono</th>
                            <th className="p-4 text-left">Correo</th>
                            <th className="p-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.length > 0 ? (
                            proveedores.map((proveedor) => (
                                <tr key={proveedor.id} className="border-b border-gray-200">
                                    <td className="p-4">{proveedor.nombre}</td>
                                    <td className="p-4">{proveedor.telefono}</td>
                                    <td className="p-4">{proveedor.correo}</td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/editar-proveedor/${proveedor.id}`)}
                                            className="bg-orange-500 text-white py-1 px-2 rounded hover:bg-orange-600"
                                        >
                                            <FaEdit className="inline-block mr-1" /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(proveedor)}
                                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                        >
                                            <FaTrash className="inline-block mr-1" /> Inactivar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    No hay proveedores {mostrarInactivos ? 'inactivos' : 'activos'} registrados en el sistema.
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
