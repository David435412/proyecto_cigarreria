import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUsers } from 'react-icons/fa';
import Swal from 'sweetalert2';

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

    const handleDelete = async (usuario) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Deseas inactivar este usario?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, inactivar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await axios.put(`http://localhost:5000/usuarios/${usuario.id}`, { ...usuario, estado: 'inactivo' });
                fetchUsuarios();
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario inactivado',
                    text: 'El usuario ha sido inactivado exitosamente.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error al inactivar el usuario', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo inactivar el usuario.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Gestión de Usuarios</h1>
            <p className="mb-8">
                En esta sección podrás gestionar a los usuarios del sistema. Puedes registrar nuevos usuarios,
                visualizar los usuarios que ya has registrado y desactivarlos según sea necesario.
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {alertMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                    {alertMessage}
                </div>
            )}

            <div className="mb-4 flex space-x-4">
                <button
                    onClick={() => navigate('/registro-empleado')}
                    className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                    <FaPlus className="inline-block mr-2" /> Registrar Nuevo Usuario
                </button>
                <button
                    onClick={() => navigate('/usuarios-inactivos')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    <FaUsers className="inline-block mr-2" /> Usuarios Inactivos
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-300 border border-gray-200 rounded-lg shadow-md">
                    <thead className="bg-green-600 border-b border-gray-200">
                        <tr className="text-white">
                            <th className="p-4 text-left ">Nombre</th>
                            <th className="p-4 text-left">Nombre de Usuario</th>
                            <th className="p-4 text-left">Tipo Documento</th>
                            <th className="p-4 text-left">Número Documento</th>
                            <th className="p-4 text-left">Correo</th>
                            <th className="p-4 text-left">Teléfono</th>
                            <th className="p-4 text-left">Dirección</th>
                            <th className="p-4 text-left">Rol</th>
                            <th className="p-4 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.length > 0 ? (
                            usuarios.map((usuario) => (
                                <tr key={usuario.id} className="border-b border-gray-200">
                                    <td className="p-4">{usuario.nombre}</td>
                                    <td className="p-4">{usuario.nombreUsuario}</td>
                                    <td className="p-4">{usuario.tipoDocumento}</td>
                                    <td className="p-4">{usuario.numeroDocumento}</td>
                                    <td className="p-4">{usuario.correo}</td>
                                    <td className="p-4">{usuario.telefono}</td>
                                    <td className="p-4">{usuario.direccion}</td>
                                    <td className="p-4">{usuario.rol}</td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/editar-usuario/${usuario.id}`)}
                                            className="bg-orange-500 text-white py-1 px-2 rounded hover:bg-orange-600"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(usuario)}
                                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                        >
                                            Inactivar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="p-4 text-center text-gray-500">
                                    No hay usuarios registrados en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionUsuarios;
