import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://localhost:3000/usuarios');
                console.log('Respuesta de la API:', response.data); // Verifica los datos obtenidos
                // Filtrar para mostrar solo los usuarios con roles "cajero" y "domiciliario"
                const usuariosFiltrados = response.data.usuarios.filter(usuario => 
                    usuario.rol === 'cajero' || usuario.rol === 'domiciliario'
                );
                setUsuarios(usuariosFiltrados);
            } catch (error) {
                console.error('Hubo un error al obtener los usuarios:', error);
                setError('No se pudieron cargar los usuarios.');
            }
        };

        fetchUsuarios();
    }, []);

    const handleRegistrarClick = () => {
        navigate('/registro-empleado');  // Redirige a la vista de registro de empleados
    };

    const handleEditarClick = (id) => {
        navigate(`/editar-empleado/${id}`);  // Redirige a la vista de edición de empleados
    };

    const handleEliminarClick = (id) => {
        // Lógica para eliminar el empleado
        axios.delete(`http://localhost:3000/usuarios/${id}`)
            .then(() => {
                setUsuarios(usuarios.filter(usuario => usuario.id !== id));
            })
            .catch(error => {
                console.error('Hubo un error al eliminar el usuario:', error);
            });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-6 shadow-md rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-2">Gestión de Usuarios</h2>
                <p className="text-gray-700">
                    Aquí puedes gestionar a los usuarios del sistema. Puedes registrar, editar o eliminar a los usuarios de tipo cajero y domiciliario.
                </p>
            </div>

            <div className="mb-8">
                <button 
                    onClick={handleRegistrarClick} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600">
                    Registrar Nuevo Usuario
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {usuarios.length > 0 ? (
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Nombre</th>
                            <th className="py-2 px-4 border-b">Nombre de Usuario</th>
                            <th className="py-2 px-4 border-b">Correo</th>
                            <th className="py-2 px-4 border-b">Teléfono</th>
                            <th className="py-2 px-4 border-b">Dirección</th>
                            <th className="py-2 px-4 border-b">Rol</th>
                            <th className="py-2 px-4 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td className="py-2 px-4 border-b">{usuario.nombre}</td>
                                <td className="py-2 px-4 border-b">{usuario.nombreUsuario}</td>
                                <td className="py-2 px-4 border-b">{usuario.correo}</td>
                                <td className="py-2 px-4 border-b">{usuario.telefono}</td>
                                <td className="py-2 px-4 border-b">{usuario.direccion}</td>
                                <td className="py-2 px-4 border-b">{usuario.rol}</td>
                                <td className="py-2 px-4 border-b">
                                    <button 
                                        onClick={() => handleEditarClick(usuario.id)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2 hover:bg-yellow-600">
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleEliminarClick(usuario.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-700">No hay usuarios registrados en el sistema.</p>
            )}
        </div>
    );
};

export default GestionUsuarios;
