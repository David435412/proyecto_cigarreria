import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import UserContext from './context/UserContext';

import NavBar from './components/comun/NavBar';
import NavBarAdmin from './components/administrador/NavBarAdmin';
import NavBarCliente from './components/cliente/NavBarCliente';
import NavBarCajero from './components/cajero/NavBarCajero';
import NavBarDomiciliario from './components/domiciliario/NavBarDomiciliario'

import RegistroCliente from './components/auth/RegistroCliente';
import Login from './components/auth/Login';

import AdminDash from './components/administrador/AdminDash';
import GestionProductos from './components/administrador/productos/GestionProductos';
import RegistroProductos from './components/administrador/productos/RegistroProductos';
import EditarProducto from './components/administrador/productos/EdicionProducto';

import GestionUsuarios from './components/administrador/usuarios/GestionUsuarios';
import RegistroEmpleado from './components/administrador/usuarios/RegistroEmpleados';
import EditarUsuario from './components/administrador/usuarios/EdicionUsuarios';

import GestionProveedores from './components/administrador/proveedores/GestionProveedores';
import RegistroProveedor from './components/administrador/proveedores/RegistroProveedores';
import EditarProveedor from './components/administrador/proveedores/EdicionProveedores';

import ClienteDashboard from './components/cliente/ClienteDash';
import Productos from './components/cliente/productos/Productos'
import DetalleProducto from './components/cliente/productos/DetallesProducto';
import Carrito from './components/cliente/productos/Cart';

import DatosEntrega from './components/cliente/pedidos/DatosEntrega'
import Confirmacion from './components/cliente/pedidos/Confirmacion'
import Pedidos from './components/cliente/pedidos/Pedidos'
import DetallesPedido from './components/cliente/pedidos/DetallesPedido';


import CajeroDashboard from './components/cajero/CajeroDash';

import DomiciliarioDashboard from './components/domiciliario/DomiciliarioDash';

import Footer from './components/comun/Footer';
import Inicio from './pages/Inicio';




const App = () => {
  const { role } = useContext(UserContext);

  let NavBarComponent;

  if (role === 'administrador') {
    NavBarComponent = NavBarAdmin;
  } else if (role === 'cliente'){
    NavBarComponent = NavBarCliente;
  } else if (role === 'cajero'){
    NavBarComponent = NavBarCajero;
  } else if (role === 'domiciliario'){
    NavBarComponent = NavBarDomiciliario;
  } 
  else {
    NavBarComponent = NavBar;
  }

  console.log('Current role:', role); 

  return(
    <Router>
      <NavBarComponent />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />          
          <Route path="/Inicio" element={<Inicio />} />          


          <Route path="/registro-cliente" element={<RegistroCliente />} />              
          <Route path="/login" element={<Login />} />              
          <Route path="/admin-dash" element={<AdminDash />} />  

          <Route path="/gestion-productos" element={<GestionProductos />} />
          <Route path="/registro-productos" element={<RegistroProductos />} />
          <Route path="/editar-producto/:id" element={<EditarProducto />} />

          <Route path="/gestion-usuarios" element={<GestionUsuarios />} />  
          <Route path="/registro-empleado" element={<RegistroEmpleado />} />   
          <Route path="/editar-usuario/:id" element={<EditarUsuario />} /> 
          
          <Route path="/gestion-proveedores" element={<GestionProveedores />} /> 
          <Route path="/registro-proveedor" element={<RegistroProveedor />} />      
          <Route path="/editar-proveedor/:id" element={<EditarProveedor />} /> 
        


          <Route path="/gestion-pedidos" element={<GestionPedidos />} />

          <Route path="/cliente-dash" element={<ClienteDashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} /> 

          <Route path="/datos-entrega" element={<DatosEntrega />} /> 
          <Route path="/confirmar" element={<Confirmacion />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/pedido/:id" element={<DetallesPedido />} />
          

          <Route path="/cajero-dash" element={< CajeroDashboard />} />

          <Route path="/domiciliario-dash" element={< DomiciliarioDashboard />} />
        </Routes>

        <Footer/>
      </main>
    </Router>
  );
}

export default App;
