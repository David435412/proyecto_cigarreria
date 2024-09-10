import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Profile = () => {
    const [userData, setUserData] = useState({
        nombre: '',
        nombreUsuario: '',
        correo: '',
        telefono: '',
        direccion: '',
        tipoDocumento: '',
        numeroDocumento: '',
        contrasena: ''  // Para comparación de contraseña
    });
    const [editedData, setEditedData] = useState({ ...userData });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchData = () => {
            const nombre = localStorage.getItem('name');
            const nombreUsuario = localStorage.getItem('username');
            const correo = localStorage.getItem('email');
            const telefono = localStorage.getItem('phone');
            const direccion = localStorage.getItem('address');
            const tipoDocumento = localStorage.getItem('documentType');
            const numeroDocumento = localStorage.getItem('documentNumber');
            const contrasena = localStorage.getItem('password');
            const id = localStorage.getItem('userId');
            const rol = localStorage.getItem('role');
            const estado = localStorage.getItem('status');

            setUserData({
                nombre,
                nombreUsuario,
                correo,
                telefono,
                direccion,
                tipoDocumento,
                numeroDocumento,
                contrasena
               
            });
            setEditedData({
                nombre,
                nombreUsuario,
                correo,
                telefono,
                direccion,
                tipoDocumento,
                numeroDocumento,
                rol,
                estado,
                contrasena
            });
            setUserId(id);
        };

        fetchData();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:5000/usuarios/${userId}`, editedData);

            localStorage.setItem('name', editedData.nombre);
            localStorage.setItem('username', editedData.nombreUsuario);
            localStorage.setItem('email', editedData.correo);
            localStorage.setItem('phone', editedData.telefono);
            localStorage.setItem('address', editedData.direccion);
            localStorage.setItem('documentType', editedData.tipoDocumento);
            localStorage.setItem('documentNumber', editedData.numeroDocumento);
            localStorage.setItem('password', editedData.contrasena);
            localStorage.setItem('role', editedData.rol);
            localStorage.setItem('status', editedData.estado);

            setUserData(editedData);
            closeModal();
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    };

    const handleChangePassword = async () => {
        const { value: currentPassword } = await Swal.fire({
            title: 'Ingrese su contraseña actual',
            input: 'password',
            inputLabel: 'Contraseña actual',
            inputPlaceholder: 'Ingrese su contraseña actual',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debe ingresar su contraseña actual';
                }
            }
        });
    
        if (currentPassword) {
            try {
                const response = await axios.get(`http://localhost:5000/usuarios/${userId}`);
                const user = response.data;
    
                if (currentPassword === user.contrasena) {
                    const { value: newPassword } = await Swal.fire({
                        title: 'Ingrese su nueva contraseña',
                        input: 'password',
                        inputLabel: 'Nueva contraseña',
                        inputPlaceholder: 'Ingrese su nueva contraseña',
                        showCancelButton: true,
                        confirmButtonText: 'Cambiar',
                        cancelButtonText: 'Cancelar',
                        inputValidator: (value) => {
                            if (!value) {
                                return 'Debe ingresar una nueva contraseña';
                            }
                        }
                    });
    
                    if (newPassword) {
                        await axios.put(`http://localhost:5000/usuarios/${userId}`, {
                            ...user,
                            contrasena: newPassword
                        });

                        localStorage.setItem('password', newPassword);
                        setUserData({ ...userData, contrasena: newPassword });
    
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Contraseña cambiada con éxito',
                            icon: 'success',
                            confirmButtonText: 'Aceptar'
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'La contraseña actual no coincide',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al verificar la contraseña',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    };

    return (
        <div className="max-w-4xl bg-gray-200 mx-auto mt-10 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Perfil del Usuario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Nombre</p>
                    <p className="text-lg text-gray-800">{userData.nombre}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Nombre de Usuario</p>
                    <p className="text-lg text-gray-800">{userData.nombreUsuario}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Correo</p>
                    <p className="text-lg text-gray-800">{userData.correo}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Teléfono</p>
                    <p className="text-lg text-gray-800">{userData.telefono}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm md:col-span-2">
                    <p className="text-sm font-semibold text-gray-500">Dirección</p>
                    <p className="text-lg text-gray-800">{userData.direccion}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Tipo de Documento</p>
                    <p className="text-lg text-gray-800">{userData.tipoDocumento}</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-500">Número de Documento</p>
                    <p className="text-lg text-gray-800">{userData.numeroDocumento}</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                <button 
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={openModal}
                >
                    Editar Perfil
                </button>
                <button
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={handleChangePassword}
                >
                    Cambiar Contraseña
                </button>
            </div>

            {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">Editar Perfil</h2>
            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nombre">
                        Nombre
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={editedData.nombre}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nombreUsuario">
                        Nombre de Usuario
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="nombreUsuario"
                        name="nombreUsuario"
                        value={editedData.nombreUsuario}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="correo">
                        Correo
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="email"
                        id="correo"
                        name="correo"
                        value={editedData.correo}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="telefono">
                        Teléfono
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={editedData.telefono}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="direccion">
                        Dirección
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={editedData.direccion}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="tipoDocumento">
                        Tipo de Documento
                    </label>
                    <select
                        id="tipoDocumento"
                        name="tipoDocumento"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={editedData.tipoDocumento}
                        onChange={handleSelectChange}
                    >
                        <option value="">Seleccione...</option>
                        <option value="cedula">Cédula de Ciudadanía</option>
                        <option value="cedulae">Cédula de Extranjería</option>
                        <option value="nit">NIT</option>
                    </select>
                </div>
                {/* Número de Documento ocupa todo el ancho */}
                <div className="col-span-2">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="numeroDocumento">
                        Número de Documento
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="numeroDocumento"
                        name="numeroDocumento"
                        value={editedData.numeroDocumento}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Botones de acción */}
                <div className="col-span-2 flex justify-end mt-6 space-x-4">
                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleSaveChanges}
                    >
                        Guardar Cambios
                    </button>
                    <button
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={closeModal}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
)}


  
        </div>
    );
};

export default Profile;
