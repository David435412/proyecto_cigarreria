import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import emailjs from 'emailjs-com';
import fuera_2 from "../../assets/images/fuera_2.jpeg";

const RecuperacionContrasena = () => {
    const [correo, setCorreo] = useState('');
    const navigate = useNavigate();

    // Función para generar un código aleatorio de 6 dígitos
    const generarCodigo = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Función para enviar el correo de recuperación
    const enviarCorreoRecuperacion = async (correo) => {
        try {
            const { data: usuarios } = await axios.get(`http://localhost:5000/usuarios?correo=${correo}`);

            if (usuarios.length > 0) {
                const usuario = usuarios[0];
                const codigo = generarCodigo();

                // Guardar el código en la base de datos o localStorage para validarlo después
                await axios.patch(`http://localhost:5000/usuarios/${usuario.id}`, { codigoRecuperacion: codigo });

                // Enviar el correo con EmailJS
                await emailjs.send('service_podqncg', 'template_xnpls19', {
                    to_name: usuario.nombre,
                    to_correo: usuario.correo,
                    message: `Tu código de restablecimiento es: ${codigo}. Utiliza este código para restablecer tu contraseña.`,
                    from_name: 'Colonial Support'
                }, 'it57DOPi1-ZuX3rXe');

                return true; // Código enviado con éxito
            } else {
                return false; // No se encontró el correo
            }
        } catch (error) {
            console.error('Error al enviar correo de recuperación:', error);
            return false;
        }
    };

    // Función para manejar los cambios en el campo de correo
    const handleChange = (e) => {
        setCorreo(e.target.value); // Actualiza el estado con el valor ingresado
    };

    // Manejador del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificación básica del correo
        const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!correoRegex.test(correo)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo inválido',
                text: 'Por favor, introduce un correo válido.',
            });
            return;
        }

        // Llamar a la función de enviar el correo
        const correoEnviado = await enviarCorreoRecuperacion(correo);

        if (correoEnviado) {
            Swal.fire({
                icon: 'success',
                title: 'Correo enviado',
                text: 'Te hemos enviado un código de restablecimiento. Revisa tu correo.',
            });
            // Redirigir a la vista para ingresar el código
            navigate('/ingresar_codigo');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Correo no encontrado',
                text: 'El correo proporcionado no está registrado.',
            });
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            <div className="absolute inset-0">
                <img
                    src={fuera_2}  // Ahora está definido
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
                            Restablecer tu Contraseña
                        </h1>
                        <form className="space-y-4 text-center" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="correo"
                                    className="text-left block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="correo"
                                    id="correo"
                                    value={correo}
                                    onChange={handleChange} // Usar la función handleChange
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Tu correo electrónico registrado"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white font-bold rounded-2xl shadow-lg transition-transform transform-gpu hover:scale-105 hover:shadow-xl"
                            >
                                Recuperar Contraseña
                            </button>
                        </form>
                        <p className="text-sm text-gray-600">
                            ¿Ya la recordaste? <a href="/login" className="text-sm font-bold text-black">Inicia Sesión</a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RecuperacionContrasena;
