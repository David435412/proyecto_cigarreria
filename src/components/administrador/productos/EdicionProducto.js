import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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

const EditarProducto = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        imagen: '',
        categoria: '',
        cantidad: '',
        marca: '',
        estado: 'activo'
    });
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/productos/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error al obtener el producto', error);
                setError('No se pudo cargar el producto.');
            }
        };

        fetchProducto();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:5000/productos/${id}`, formData);
            alert('Producto actualizado exitosamente.');
            navigate('/gestion-productos');
        } catch (error) {
            console.error('Error al actualizar el producto', error);
            setError('No se pudo actualizar el producto.');
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1 className="text-3xl font-bold mb-4">Editar Producto</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {alertMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                        {alertMessage}
                    </div>
                )}

                <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-4xl xl:p-0 border border-gray-200">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
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
                                <label className="block text-gray-700 font-medium">Precio</label>
                                <input
                                    type="number"
                                    name="precio"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Imagen (URL)</label>
                                <input
                                    type="text"
                                    name="imagen"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.imagen}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Categoría</label>
                                <select
                                    name="categoria"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    required
                                >
                                    {categorias.map(categoria => (
                                        <option key={categoria} value={categoria}>{categoria}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-gray-700 font-medium">Cantidad</label>
                                <input
                                    type="number"
                                    name="cantidad"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    max="1000"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-gray-700 font-medium">Marca</label>
                                <input
                                    type="text"
                                    name="marca"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                                    value={formData.marca}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-2 flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/gestion-productos')}
                                    className="px-8 py-4 bg-gradient-to-r from-gray-500 to-red-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Actualizar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditarProducto;