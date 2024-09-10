import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  // Importa SweetAlert2
import fuera_1 from "../../assets/images/fuera_2.jpeg"; // Asegúrate de tener esta imagen en la ruta correcta

const RegistroCliente = () => {
    const [datosFormulario, setDatosFormulario] = useState({
        nombre: '',
        contrasena: '',
        nombreUsuario: '',
        correo: '',
        telefono: '',
        direccion: '',
        tipoDocumento: '',  // Nuevo campo
        numeroDocumento: '',  // Nuevo campo
        estado: 'activo',
        rol: 'cliente'
    });

    const navigate = useNavigate();

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosFormulario({ ...datosFormulario, [name]: value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/usuarios', datosFormulario);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cliente registrado con éxito',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/login');
        } catch (error) {
            console.error('Error al registrar el cliente', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo registrar el cliente. Intenta nuevamente.',
            });
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            <div className="absolute inset-0">
                <img
                    src={fuera_1}
                    alt="Fondo"
                    className="w-full h-full object-cover filter blur"
                />
                <div className="absolute inset-0 bg-gray-900 opacity-40"></div>
            </div>
            <div className="relative z-10 w-full max-w-md p-6 mx-auto">
                {/* Texto "Colonial" fuera del div blanco */}
                <div className="text-center mb-6">
                    <a href="/inicio" className="text-4xl font-bold text-gray-300 hover:text-gray-100 transition-colors">
                        Colonial
                    </a>
                </div>
                <section className="bg-white bg-opacity-60 rounded-lg shadow-2xl">
                    <div className="space-y-4 p-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Crea tu cuenta
                        </h1>
                        <form className="space-y-4 md:space-y-4 grid grid-cols-2 gap-2" onSubmit={manejarEnvio}>
                            <div className="col-span-2">
                                <label
                                    htmlFor="correo"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    id="correo"
                                    value={datosFormulario.correo}
                                    onChange={manejarCambio}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                    placeholder="nombre@gmail.com"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="nombreUsuario"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Nombre de Usuario
                                </label>
                                <input
                                    type="text"
                                    name="nombreUsuario"
                                    id="nombreUsuario"
                                    value={datosFormulario.nombreUsuario}
                                    onChange={manejarCambio}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                    placeholder="Tu nombre de usuario"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="nombre"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    value={datosFormulario.nombre}
                                    onChange={manejarCambio}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                    placeholder="Tu nombre completo"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="telefono"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    id="telefono"
                                    value={datosFormulario.telefono}
                                    onChange={manejarCambio}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                    placeholder="3123456789"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="direccion"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    id="direccion"
                                    value={datosFormulario.direccion}
                                    onChange={manejarCambio}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                    placeholder="Tu dirección"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="tipoDocumento"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Tipo de Documento
                                </label>
                                <select
                                    name="tipoDocumento"
                                    id="tipoDocumento"
                                    value={datosFormulario.tipoDocumento}
                                    onChange={manejarCambio}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                    required
                                >
                                    <option value="" disabled>Selecciona el tipo de documento</option>
                                    <option value="cedula">Cédula de Ciudadanía</option>
                                    <option value="cedulae">Cédula de Extranjería</option>
                                    <option value="nit">NIT</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="numeroDocumento"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Número de Documento
                                </label>
                                <input
                                    type="text"
                                    name="numeroDocumento"
                                    id="numeroDocumento"
                                    value={datosFormulario.numeroDocumento}
                                    onChange={manejarCambio}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                    placeholder="Número de documento"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="contrasena"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    id="contrasena"
                                    value={datosFormulario.contrasena}
                                    onChange={manejarCambio}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                    required
                                />
                            </div>
                            <input type="hidden" name="rol" value={datosFormulario.rol} />
                            <input type="hidden" name="estado" value={datosFormulario.estado} />
                            <div className="col-span-2 flex justify-center">
                                <button type="submit" className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg">
                                    Crear
                                </button>
                            </div>
                        </form>
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes cuenta? <a href="/login" className="text-sm font-bold text-black">Inicia Sesión</a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RegistroCliente;
