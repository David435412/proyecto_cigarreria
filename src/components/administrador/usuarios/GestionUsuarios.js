import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    const navigate = useNavigate();

    // Obtener los usuarios desde la API
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/usuarios');
            const usuariosFiltrados = response.data.filter(usuario =>
                (usuario.rol === 'cajero' || usuario.rol === 'domiciliario') && usuario.estado === 'activo'
            );
            setUsuarios(usuariosFiltrados);
        } catch (error) {
            console.error('Error al obtener los usuarios', error);
            setError('No se pudieron cargar los usuarios.');
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleDelete = async () => {
        if (!usuarioAEliminar) return;

        try {
            await axios.put(`http://localhost:5000/usuarios/${usuarioAEliminar.id}`, { ...usuarioAEliminar, estado: 'inactivo' });
            fetchUsuarios();
            setAlertMessage('Usuario inactivado exitosamente.');
        } catch (error) {
            console.error('Error al inactivar el usuario', error);
            setError('No se pudo inactivar el usuario.');
        } finally {
            setUsuarioAEliminar(null); 
        }
    };

    return (
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-4">Gestión de Usuarios</h1>
            <p class="mb-8">
                En esta sección podrás gestionar a los usuarios del sistema. Puedes registrar nuevos usuarios,
                visualizar los usuarios que ya has registrado y desactivarlos según sea necesario.
            </p>

            {error && <p class="text-red-500 mb-4">{error}</p>}
            {alertMessage && (
                <div class="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                    {alertMessage}
                </div>
            )}

            <div class="mb-4 flex space-x-4">
                <button
                    onClick={() => navigate('/registro-empleado')}
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <FaPlus class="inline-block mr-2" /> Registrar Nuevo Usuario
                </button>
                <button
                    onClick={() => navigate('/usuarios-inactivos')}
                    class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Usuarios Inactivos
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead class="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th class="p-4 text-left">Nombre</th>
                            <th class="p-4 text-left">Nombre de Usuario</th>
                            <th class="p-4 text-left">Tipo Documento</th>
                            <th class="p-4 text-left">Número Documento</th>
                            <th class="p-4 text-left">Correo</th>
                            <th class="p-4 text-left">Teléfono</th>
                            <th class="p-4 text-left">Dirección</th>
                            <th class="p-4 text-left">Rol</th>
                            <th class="p-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <tr key={usuario.id} class="border-b border-gray-200">
                                    <td class="p-4">{usuario.nombre}</td>
                                    <td class="p-4">{usuario.nombreUsuario}</td>
                                    <td class="p-4">{usuario.tipoDocumento}</td>
                                    <td class="p-4">{usuario.numeroDocumento}</td>
                                    <td class="p-4">{usuario.correo}</td>
                                    <td class="p-4">{usuario.telefono}</td>
                                    <td class="p-4">{usuario.direccion}</td>
                                    <td class="p-4">{usuario.rol}</td>
                                    <td class="p-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/editar-usuario/${usuario.id}`)}
                                            class="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => setUsuarioAEliminar(usuario)}
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
                                    No hay usuarios registrados en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmación */}
            {usuarioAEliminar && (
                <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div class="bg-white p-6 rounded-lg shadow-lg">
                        <h3 class="text-xl mb-4">¿Estás seguro de que deseas inactivar este usuario?</h3>
                        <div class="flex justify-end gap-4">
                            <button
                                onClick={() => setUsuarioAEliminar(null)}
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

export default GestionUsuarios;
