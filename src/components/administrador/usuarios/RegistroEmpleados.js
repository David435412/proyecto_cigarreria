import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const RegistroEmpleado = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        contrasena: '',
        nombreUsuario: '',
        tipoDocumento: '',
        numeroDocumento: '',
        correo: '',
        telefono: '',
        direccion: '',
        rol: 'cajero',
        estado: 'activo'
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/usuarios', formData);
            
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Empleado registrado con éxito.',
                confirmButtonColor: '#28a745', // Verde
                confirmButtonText: 'Aceptar'
            }).then(() => {
                navigate("/gestion-usuarios");  
            });
        } catch (error) {
            console.error('Error al registrar el empleado', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al registrar el empleado.',
                confirmButtonColor: '#d33', // Rojo
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-16 mx-auto my-10 lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Registro de Empleado
                            </h1>
                            <form className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Nombre del empleado"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contrasena" className="block mb-2 text-sm font-medium text-gray-900">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        name="contrasena"
                                        id="contrasena"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nombreUsuario" className="block mb-2 text-sm font-medium text-gray-900">
                                        Nombre de Usuario
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreUsuario"
                                        id="nombreUsuario"
                                        value={formData.nombreUsuario}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Nombre de usuario"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tipoDocumento" className="block mb-2 text-sm font-medium text-gray-900">
                                        Tipo de Documento
                                    </label>
                                    <select
                                        name="tipoDocumento"
                                        id="tipoDocumento"
                                        value={formData.tipoDocumento}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        required
                                    >
                                        <option value="">Selecciona un tipo de documento</option>
                                        <option value="cedula">Cédula Ciudadana</option>
                                        <option value="libreta">Libreta Militar</option>
                                        <option value="pasaporte">Pasaporte</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="numeroDocumento" className="block mb-2 text-sm font-medium text-gray-900">
                                        Número de Documento
                                    </label>
                                    <input
                                        type="text"
                                        name="numeroDocumento"
                                        id="numeroDocumento"
                                        value={formData.numeroDocumento}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Número de documento"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="correo" className="block mb-2 text-sm font-medium text-gray-900">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        name="correo"
                                        id="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        id="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="3123456789"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        id="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Dirección del empleado"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="rol" className="block mb-2 text-sm font-medium text-gray-900">
                                        Rol
                                    </label>
                                    <select
                                        name="rol"
                                        id="rol"
                                        value={formData.rol}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    >
                                        <option value="cajero">Cajero</option>
                                        <option value="domiciliario">Domiciliario</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="col-span-2 px-8 py-4 bg-gradient-to-r from-green-400 to-green-700 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Registrar Empleado
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RegistroEmpleado;
