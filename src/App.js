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

import GestionPedidos from './components/administrador/pedidos/PedidosAdmin'

import GestionVentas from './components/administrador/ventas/GestionVentas';
import RegistroVenta from './components/administrador/ventas/RegistroVentas';
import ConfirmacionVenta from './components/administrador/ventas/ConfirmacionVenta';

import ClienteDashboard from './components/cliente/ClienteDash';
<<<<<<< HEAD

import Productos from './components/cliente/productos/Productos'
=======
>>>>>>> e3d54321d9c056ee45617d0d503e6a4ca73ac4e5
import DetalleProducto from './components/cliente/productos/DetallesProducto';
import Carrito from './components/cliente/productos/Cart';

import DatosEntrega from './components/cliente/pedidos/DatosEntrega'
import Confirmacion from './components/cliente/pedidos/Confirmacion'
import Pedidos from './components/cliente/pedidos/Pedidos'
import DetallesPedido from './components/cliente/pedidos/DetallesPedido';


import CajeroDashboard from './components/cajero/CajeroDash';

import ProductosCajero from './components/cajero/productos/Productos'
import RegistroProdutosCa from './components/cajero/productos/RegistroProductos'
import EdicionProductosCa from './components/cajero/productos/EdicionProductos'

import ProveedoresCajero from './components/cajero/proveedores/Proveedores'
import RegistroProveedoresCa from './components/cajero/proveedores/RegistroProveedores'
import EdicionProveedoresCa from './components/cajero/proveedores/EdicionProveedores'

import VentasCajero from './components/cajero/ventas/Ventas';
import RegistroVentasCa from './components/cajero/ventas/RegistroVentas';
import ConfirmarVentasCa from './components/cajero/ventas/Confirmacionventas'

import PedidosCajero from './components/cajero/pedidos/Pedidos'


import DomiciliarioDashboard from './components/domiciliario/DomiciliarioDash';


import Footer from './components/comun/Footer';
import Inicio from './pages/Inicio';
import PedidosAntes from './components/comun/Pedidos'
import CartAntes from './components/comun/Cart'




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
          <Route path="/pedidos-a" element={<PedidosAntes />} /> 
          <Route path="/carrito-a" element={<CartAntes />} />

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

          <Route path="/gestion-ventas" element={<GestionVentas />} /> 
          <Route path="/registro-venta" element={<RegistroVenta />} />
          <Route path="/confirmar-venta" element={<ConfirmacionVenta />} />



          <Route path="/cliente-dash" element={<ClienteDashboard />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} /> 

          <Route path="/datos-entrega" element={<DatosEntrega />} /> 
          <Route path="/confirmar" element={<Confirmacion />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/pedido/:id" element={<DetallesPedido />} />
          

          <Route path="/cajero-dash" element={< CajeroDashboard />} />
          <Route path="/productos-cajero" element={<ProductosCajero />} />
          <Route path="/registro-prod-cajero" element={<RegistroProdutosCa />} />
          <Route path="/editar-prod-cajero/:id" element={<EdicionProductosCa />} />

          <Route path="/proveedores-cajero" element={<ProveedoresCajero />} />
          <Route path="/registro-prov-cajero" element={<RegistroProveedoresCa />} />
          <Route path="/editar-prov-cajero/:id" element={<EdicionProveedoresCa />} />

          <Route path="/ventas-cajero" element={<VentasCajero />} />
          <Route path="/registro-venta-cajero" element={<RegistroVentasCa />} />
          <Route path="/confirmar-ventas-cajero" element={<ConfirmarVentasCa />} />

          <Route path="/pedidos-cajero" element={<PedidosCajero />} />

          <Route path="/domiciliario-dash" element={< DomiciliarioDashboard />} />


        </Routes>

        <Footer/>
      </main>
    </Router>
  );
}

export default App;
