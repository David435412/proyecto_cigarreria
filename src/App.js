import NavBar from './components/comun/NavBar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import RegistroCliente from './components/auth/RegistroCliente';
import Login from './components/auth/Login';

const App = () => {
  return(
    <Router>
      <NavBar />
      <main>
        <Routes>
          <Route path="/registro-cliente" element={<RegistroCliente />} />              
          <Route path="/login" element={<Login />} />              
        </Routes>
      </main>
    </Router>
  )
}
 
export default App;
