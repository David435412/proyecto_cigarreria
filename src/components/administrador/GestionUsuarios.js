import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [usuarioIdToDelete, setUsuarioIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:5000/usuarios');
                const usuariosFiltrados = response.data.filter(usuario => 
                    (usuario.rol === 'cajero' || usuario.rol === 'domiciliario') && usuario.estado === 'activo'
                );
                setUsuarios(usuariosFiltrados);
            } catch (error) {
                console.error('Hubo un error al obtener los usuarios', error);
                setError('No se pudieron cargar los usuarios.');
            }
        };

        fetchUsuarios();
    }, []);

    const handleRegistrarClick = () => {
        navigate('/registro-empleado');
    };

    const handleUsuariosInactivosClick = () => {
        navigate('/usuarios-inactivos');
    };

    const handleEditarClick = (id) => {
        navigate(`/editar-usuario/${id}`);
    };

    const handleOpenModal = (id) => {
        setUsuarioIdToDelete(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUsuarioIdToDelete(null);
    };

    const handleDeleteUsuario = async () => {
        try {
            if (usuarioIdToDelete) {               
                await axios.put(`http://localhost:5000/usuarios/${usuarioIdToDelete}`, { estado: 'inactivo' });
                setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioIdToDelete));
                handleCloseModal();
            }
        } catch (error) {
            console.error('Hubo un error al desactivar el usuario:', error);
        }
    };

    return (
        <div class="container mx-auto px-4 py-8">
            <div class="bg-white p-6 shadow-md rounded-lg mb-8 flex items-center justify-between">
                <h2 class="text-2xl font-bold mb-2 text-gray-800">Gestión de Usuarios</h2>
                <p class="text-gray-600">
                    Aquí puedes gestionar a los usuarios del sistema. Puedes registrar, editar o desactivar a los usuarios de tipo cajero y domiciliario.
                </p>
            </div>

            <div class="mb-8 flex items-center gap-4">
                <button 
                    onClick={handleRegistrarClick} 
                    class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600">
                    Registrar Nuevo Usuario
                </button>
                <button 
                    onClick={handleUsuariosInactivosClick} 
                    class="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600">
                    Usuarios Inactivos
                </button>
            </div>

            {error && <p class="text-red-500 mb-4">{error}</p>}

            {usuarios.length > 0 ? (
                <table class="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
                    <thead>
                        <tr>
                            <th class="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Nombre</th>
                            <th class="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Nombre de Usuario</th>
                            <th class="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Tipo Documento</th>
                            <th class="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Número Documento</th>
                            <th class="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Correo</th>
                            <th class="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Teléfono</th>
                            <th class="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Dirección</th>
                            <th class="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Rol</th>                           
                            <th class="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id} class="hover:bg-gray-100">
                                <td class="py-3 px-4 border-b border-gray-200 text-gray-800">{usuario.nombre}</td>
                                <td class="py-3 px-4 border-b border-gray-200 text-gray-800">{usuario.nombreUsuario}</td>
                                <td class="py-3 px-4 border-b border-gray-200 text-gray-800">{usuario.tipoDocumento}</td>
                                <td class="py-3 px-4 border-b border-gray-200 text-gray-800">{usuario.numeroDocumento}</td>
                                <td class="py-3 px-4 border-b border-gray-200 text-gray-800">{usuario.correo}</td>
                                <td class="py-3 px-4 border-b border-gray-200 text-gray-800">{usuario.telefono}</td>
                                <td class="py-3 px-4 border-b border-gray-200 text-gray-800">{usuario.direccion}</td>
                                <td class="py-3 px-4 border-b border-gray-200 text-gray-800">{usuario.rol}</td>                                
                                <td class="py-3 px-4 border-b border-gray-200">
                                    <button 
                                        onClick={() => handleEditarClick(usuario.id)}
                                        class="bg-yellow-400 text-white px-3 py-1 my-2 rounded-md mr-2 hover:bg-yellow-500">
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleOpenModal(usuario.id)}
                                        class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                                        Inactivar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p class="text-gray-600">No hay usuarios registrados en el sistema.</p>
            )}

            {showModal && (
                <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 class="text-lg font-bold mb-4">Confirmación de Inactivación</h3>
                        <p class="mb-4">¿Estás seguro de que quieres inactivar este usuario?</p>
                        <div class="flex justify-end">
                            <button 
                                onClick={handleCloseModal} 
                                class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
                                Cancelar
                            </button>
                            <button 
                                onClick={handleDeleteUsuario} 
                                class="bg-red-500 text-white px-4 py-2 rounded-md">
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
