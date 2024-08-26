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
import GestionUsuarios from './components/administrador/GestionUsuarios';
import RegistroEmpleado from './components/administrador/RegistroEmpleados';
import EditarUsuario from './components/administrador/EdicionUsuarios';
import ClienteDashboard from './components/cliente/ClienteDash';
import CajeroDashboard from './components/cajero/CajeroDash';
import DomiciliarioDashboard from './components/domiciliario/DomiciliarioDash';


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
          <Route path="/registro-cliente" element={<RegistroCliente />} />              
          <Route path="/login" element={<Login />} />              
          <Route path="/admin-dash" element={<AdminDash />} />    
          <Route path="/gestion-usuarios" element={<GestionUsuarios />} />    
          <Route path="/registro-empleado" element={<RegistroEmpleado />} />   
          <Route path="/editar-usuario/:id" element={<EditarUsuario />} />   
          <Route path="/cliente-dash" element={<ClienteDashboard />} />
          <Route path="/cajero-dash" element={< CajeroDashboard />} />
          <Route path="/domiciliario-dash" element={< DomiciliarioDashboard />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
