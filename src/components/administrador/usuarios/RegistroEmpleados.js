import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2

// Función simple para "encriptar" la contraseña
const encriptarContrasena = (contrasena) => {
    let contrasenaEncriptada = '';
    for (let i = 0; i < contrasena.length; i++) {
        // Cambia el carácter al siguiente en el código ASCII
        contrasenaEncriptada += String.fromCharCode(contrasena.charCodeAt(i) + 3);
    }
    return contrasenaEncriptada;
};

// Validación de la contraseña
const validarContrasena = (contrasena) => {
    const minLength = 8;
    const longitudValida = contrasena.length >= minLength;
    const tieneMayusculas = /[A-Z]/.test(contrasena);
    const tieneMinusculas = /[a-z]/.test(contrasena);
    const tieneNumeros = /[0-9]/.test(contrasena);

    return {
        longitud: longitudValida,
        mayusculas: tieneMayusculas,
        minusculas: tieneMinusculas,
        numeros: tieneNumeros
    };
};

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

    const [validacionesContrasena, setValidacionesContrasena] = useState({
        longitud: false,
        mayusculas: false,
        minusculas: false,
        numeros: false
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'contrasena') {
            const validaciones = validarContrasena(value);
            setValidacionesContrasena(validaciones);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar la contraseña antes de enviar el formulario
        const validaciones = validarContrasena(formData.contrasena);
        if (validaciones.longitud && validaciones.mayusculas && validaciones.minusculas && validaciones.numeros) {
            try {
                // Encripta la contraseña antes de enviarla
                const contrasenaEncriptada = encriptarContrasena(formData.contrasena);

                // Crea los datos a enviar, reemplazando la contraseña con la encriptada
                const datosAEnviar = {
                    ...formData,
                    contrasena: contrasenaEncriptada // Guarda la contraseña encriptada
                };

                await axios.post('http://localhost:5000/usuarios', datosAEnviar);
                
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
        }
    };

    return (
        <div className="flex justify-center py-10 bg-gray-50">
            <section className="w-full max-w-3xl bg-white rounded-lg shadow-2xl">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Registro de Empleado
                    </h1>
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                                <option value="" disabled>Seleccione el tipo de documento</option>
                                <option value="DNI">DNI</option>
                                <option value="Pasaporte">Pasaporte</option>
                                <option value="Cédula">Cédula</option>
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
                                placeholder="Correo electrónico"
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
                                placeholder="Número de teléfono"
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
                                placeholder="Dirección"
                            />
                        </div>
                        <div>
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Contraseña"
                                required
                            />
                            {validacionesContrasena.longitud === false && (
                                <div className="mt-2 text-red-600 text-sm flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Al menos 8 caracteres
                                </div>
                            )}
                            {validacionesContrasena.mayusculas === false && validacionesContrasena.longitud && (
                                <div className="mt-2 text-red-600 text-sm flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Contiene al menos una letra mayúscula
                                </div>
                            )}
                            {validacionesContrasena.minusculas === false && validacionesContrasena.mayusculas && validacionesContrasena.longitud && (
                                <div className="mt-2 text-red-600 text-sm flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Contiene al menos una letra minúscula
                                </div>
                            )}
                            {validacionesContrasena.numeros === false && validacionesContrasena.minusculas && validacionesContrasena.mayusculas && validacionesContrasena.longitud && (
                                <div className="mt-2 text-red-600 text-sm flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Contiene al menos un número
                                </div>
                            )}
                            {validacionesContrasena.longitud && validacionesContrasena.mayusculas && validacionesContrasena.minusculas && validacionesContrasena.numeros && (
                                <div className="mt-2 text-green-600 text-sm flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Contraseña segura
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 w-full"                        >
                            Registrar
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default RegistroEmpleado;
