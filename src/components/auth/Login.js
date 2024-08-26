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

                switch (user.rol) {
                    case 'administrador':
                        alert("Ingreso exitoso como Administrador");
                        navigate('/admin-dash');
                        break;
                    case 'cliente':
                        alert("Ingreso exitoso como Cliente");
                        navigate('/cliente-dash');
                        break;
                    case 'cajero':
                        alert("Ingreso exitoso como Cajero");
                        navigate('/cajero-dash');
                        break;
                    case 'domiciliario':
                        alert("Ingreso exitoso como Domiciliario");
                        navigate('/domiciliario-dash');
                        break;
                    default:
                        navigate('/');
                        break;
                    
                }
                window.location.reload();
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
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0 border border-gray-200">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Inicia Sesión con tu cuenta!
                            </h1>
                            {error && <p className="text-red-500">{error}</p>}
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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
                                        value={formData.nombreUsuario}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Tu nombre de usuario"
                                        required
                                    />
                                </div>
                                <div>
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
                                        value={formData.contrasena}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="remember"
                                                aria-describedby="remember"
                                                type="checkbox"
                                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label
                                                htmlFor="remember"
                                                className="text-gray-500"
                                            >
                                                Recuérdame
                                            </label>
                                        </div>
                                    </div>
                                    <a
                                        href="#"
                                        className="text-sm font-medium text-blue-600 hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Ingresar
                                </button>
                            </form>
                            <p className="text-sm text-gray-600">
                                ¿Aún no tienes cuenta? <a href="/registro-cliente" className="text-sm font-bold text-black">Regístrate</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
