import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistroCliente = () => {
    const [datosFormulario, setDatosFormulario] = useState({
        nombre: '',
        contrasena: '',
        nombreUsuario: '',
        correo: '',
        telefono: '',
        direccion: '',
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
            alert('Cliente registrado con éxito');           
            navigate('/login'); // Redirige al usuario después del registro
        } catch (error) {
            console.error('Error al registrar el cliente', error);
        }
    };

    return (
        <div>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-16 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Crea tu cuenta
                            </h1>                           
                            <form className="space-y-4 md:space-y-6 grid grid-cols-2 gap-4" onSubmit={manejarEnvio}>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="correo"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        name="correo"
                                        id="correo"
                                        value={datosFormulario.correo}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="nombre@gmail.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="nombreUsuario"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Nombre de Usuario
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreUsuario"
                                        id="nombreUsuario"
                                        value={datosFormulario.nombreUsuario}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Tu nombre de usuario"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="nombre"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        value={datosFormulario.nombre}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Tu nombre completo"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="telefono"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        id="telefono"
                                        value={datosFormulario.telefono}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="3123456789"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="direccion"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        id="direccion"
                                        value={datosFormulario.direccion}
                                        onChange={manejarCambio}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Tu dirección"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="contrasena"
                                        className="block mb-2 text-sm font-medium text-gray-900"
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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        required
                                    />
                                </div>
                                <input type="hidden" name="rol" value={datosFormulario.rol} />
                                <input type="hidden" name="estado" value={datosFormulario.estado} /> {/* Campo oculto para el estado */}
                                <div className="flex items-start col-span-2">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terminos"
                                            aria-describedby="terminos"
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                                            required
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="terminos"
                                            className="font-light text-gray-500"
                                        >
                                            Acepto los{" "}
                                            <a
                                                className="font-medium text-primary-600 hover:underline"
                                                href="#"
                                            >
                                                Términos y Condiciones
                                            </a>
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg col-span-2">
                                    Crear
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RegistroCliente;
