import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        nombreUsuario: '',
        contrasena: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/usuarios', {
                params: {
                    nombreUsuario: formData.nombreUsuario,
                    contrasena: formData.contrasena
                }
            });

            const user = response.data[0];
            if (user) {
                localStorage.setItem('userId', user.id);
                localStorage.setItem('role', user.rol);
                localStorage.setItem('name', user.nombre);

                if (user.rol === 'cliente') {
                    alert("Ingreso exitoso");
                    navigate('#');
                } else if (user.rol === 'tienda') {
                    alert("Ingreso exitoso");
                    navigate('#');
                }
            } else {
                setError('Nombre de usuario o contraseña incorrectos. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            setError('Ocurrió un error al intentar iniciar sesión.');
        }
    };

    return (
        <div>
            <section class="bg-gray-50">
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">                   
                    <div class="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0 border border-gray-200">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Inicia Sesión con tu cuenta!
                            </h1>
                            {error && <p class="text-red-500">{error}</p>}
                            <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        htmlFor="nombreUsuario"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Nombre de Usuario
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreUsuario"
                                        id="nombreUsuario"
                                        value={formData.nombreUsuario}
                                        onChange={handleChange}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Tu nombre de usuario"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="contrasena"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        name="contrasena"
                                        id="contrasena"
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input
                                                id="remember"
                                                aria-describedby="remember"
                                                type="checkbox"
                                                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                                            />
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label
                                                htmlFor="remember"
                                                class="text-gray-500"
                                            >
                                                Recuérdame
                                            </label>
                                        </div>
                                    </div>
                                    <a
                                        href="#"
                                        class="text-sm font-medium text-blue-600 hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <button
                                    type="submit"
                                    class="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Ingresar
                                </button>
                            </form>
                            <p class="text-sm text-gray-600">
                                ¿Aún no tienes cuenta? <a href="/registro-cliente" class="text-sm font-bold text-black">Regístrate</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
