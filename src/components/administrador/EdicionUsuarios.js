import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const roles = ['cajero', 'domiciliario'];
const tiposDocumento = ['cedula', 'pasaporte', 'tarjeta de identidad'];

const EditarUsuario = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        contrasena: '',
        nombreUsuario: '',
        tipoDocumento: '',
        numeroDocumento: '',
        correo: '',
        telefono: '',
        direccion: '',
        rol: ''       
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/usuarios/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error al obtener el usuario', error);
                setError('No se pudo cargar el usuario.');
            }
        };

        fetchUsuario();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`http://localhost:5000/usuarios/${id}`, formData);
            alert('Usuario actualizado exitosamente.');
            
            navigate('/gestion-usuarios');
        } catch (error) {
            console.error('Error al actualizar el usuario', error);
            setError('No se pudo actualizar el usuario.');
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1 className="text-3xl font-bold mb-4">Editar Usuario</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {alertMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                        {alertMessage}
                    </div>
                )}

                <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-4xl xl:p-0 border border-gray-200">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form className="grid grid-cols-1 gap-6 md:grid-cols-3" onSubmit={handleSubmit}>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Contraseña</label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    name="nombreUsuario"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.nombreUsuario}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Tipo de Documento</label>
                                <select
                                    name="tipoDocumento"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.tipoDocumento}
                                    onChange={handleChange}
                                    required
                                >
                                    {tiposDocumento.map(tipo => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Número de Documento</label>
                                <input
                                    type="text"
                                    name="numeroDocumento"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.numeroDocumento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="correo"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Rol</label>
                                <select
                                    name="rol"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    required
                                >
                                    {roles.map(rol => (
                                        <option key={rol} value={rol}>{rol}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-3 flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/gestion-usuarios')}
                                    className="px-8 py-4 bg-gradient-to-r from-gray-500 to-red-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Actualizar Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditarUsuario;
