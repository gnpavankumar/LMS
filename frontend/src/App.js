import './App.css';
import {HashRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/homePage';
import Navbar from './components/Navigation';
import RegisterPage from './pages/Auth/RegisterPage';
import Login from './pages/Auth/Login';

function App() {
  const isAuthenticated=!!localStorage.getItem('access_token')
  return (
    <HashRouter>
      <Navbar isAuthenticated={isAuthenticated}/>
      <Routes>
        <Route  path="/" element={<Home/>}></Route>
        <Route  path="/register" element={isAuthenticated?<Home/>: <RegisterPage/>}></Route>
        <Route  path="/login" element={isAuthenticated?<Home/>: <Login/>}></Route>
        <Route  path="/logout" element={isAuthenticated?<Home/>: <Login/>}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
