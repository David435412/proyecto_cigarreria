import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        correo: '',
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
                    correo: formData.correo,
                    contrasena: formData.contrasena
                }
            });

            const user = response.data[0];
            if (user) {
                // Verifica que el estado del usuario sea 'activo'
                if (user.estado === 'activo') {
                    localStorage.setItem('userId', user.id);
                    localStorage.setItem('role', user.rol);
                    localStorage.setItem('name', user.nombre);

                    switch (user.rol) {
                        case 'administrador':
                            navigate('/admin-dash');
                            break;
                        case 'cliente':
                            navigate('/cliente-dash');
                            break;
                        case 'cajero':
                            navigate('/cajero-dash');
                            break;
                        case 'domiciliario':
                            navigate('/domiciliario-dash');
                            break;
                        default:
                            navigate('/');
                            break;
                    }
                    window.location.reload();
                } else {
                    setError('Tu cuenta no está activa. Contacta con soporte.');
                }
            } else {
                setError('Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            setError('Ocurrió un error al intentar iniciar sesión.');
        }
    };

    return (
        <div>
            <section class="bg-gray-50">
                <div class="flex flex-col items-center justify-center m-auto my-10 lg:py-0">
                    <div class="w-full rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0 border">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Inicia Sesión con tu cuenta!
                            </h1>
                            {error && <p class="text-red-500">{error}</p>}
                            <form class="space-y-4 md:space-y-6 text-center" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        htmlFor="correo"
                                        class="text-left block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        name="correo"
                                        id="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Tu correo electrónico"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="contrasena"
                                        class="text-left block mb-2 text-sm font-medium text-gray-900"
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
                                <button
                                    type="submit"
                                    class=" w-4/6 px-6 py-3 bg-gradient-to-r from-green-400 to-green-700 text-white font-bold rounded-2xl transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg m-auto"
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
