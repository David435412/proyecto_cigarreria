import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categorias = [
    'Licores',
    'Confitería',
    'Enlatados',
    'Aseo',
    'Medicamentos',
    'Helados',
    'Bebidas',
    'Lacteos',
    'Panadería'
];

const RegistroProducto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        imagen: '',
        categoria: categorias[0], // Establecer el valor predeterminado a la primera categoría
        cantidad: '',
        marca: '',
        estado: 'activo'
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verificar los datos del formulario antes de enviar
        console.log('Datos del formulario:', formData);

        try {
            await axios.post('http://localhost:5000/productos', formData);
            setAlertMessage('Producto registrado exitosamente.');

            // Limpiar el formulario
            setFormData({
                nombre: '',
                precio: '',
                descripcion: '',
                imagen: '',
                categoria: categorias[0], 
                cantidad: '',
                marca: '', 
                estado: 'activo'
            });

            // Redirigir a la vista de gestión de productos
            navigate('/gestion-productos');
        } catch (error) {
            console.error('Error al registrar el producto', error);
            setError('No se pudo registrar el producto.');
        }
    };

    return (
        <section class="bg-gray-50">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div class="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0 border border-gray-200">
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Registrar Nuevo Producto
                        </h1>

                        {error && <p class="text-red-500">{error}</p>}
                        {alertMessage && (
                            <div class="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                                {alertMessage}
                            </div>
                        )}

                        <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-900">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-900">
                                        Precio
                                    </label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-900">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-900">
                                        Imagen (URL)
                                    </label>
                                    <input
                                        type="text"
                                        name="imagen"
                                        value={formData.imagen}
                                        onChange={handleChange}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-1">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block mb-2 text-sm font-medium text-gray-900">
                                            Categoría
                                        </label>
                                        <select
                                            name="categoria"
                                            value={formData.categoria}
                                            onChange={handleChange}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            required
                                        >
                                            {categorias.map(categoria => (
                                                <option key={categoria} value={categoria}>
                                                    {categoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block mb-2 text-sm font-medium text-gray-900">
                                            Cantidad
                                        </label>
                                        <input
                                            type="number"
                                            name="cantidad"
                                            value={formData.cantidad}
                                            onChange={handleChange}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            required
                                            min="1"
                                            max="1000"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-900">
                                        Marca
                                    </label>
                                    <input
                                        type="text"
                                        name="marca"
                                        value={formData.marca}
                                        onChange={handleChange}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/gestion-productos')}
                                    class="px-8 py-4 bg-gradient-to-r from-gray-500 to-red-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    class="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Registrar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegistroProducto;
