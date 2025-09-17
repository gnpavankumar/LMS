import './App.css';

import {HashRouter, Routes, Route} from 'react-router-dom';
import Member from './pages/dashboard/Member';
import Navbar from './components/Navigation';
import RegisterPage from './pages/Auth/RegisterPage';
import Login from './pages/Auth/Login';
import Footer from './components/Footer';
import MyAccount from'./pages/MyAccount';
import Home from './pages/Home';
import AdminDashboard from './pages/dashboard/Admin';
import Librarian from './pages/dashboard/Librarian';

function App() {
  const isAuthenticated=!!localStorage.getItem('access_token')
  return (
    <HashRouter>
      {/* Full-height flex container */}
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar */}
        <Navbar isAuthenticated={isAuthenticated} />

        {/* Main content */}
        <main className="flex-grow-1">
          <Routes>
            <Route
             path="/"
              element={isAuthenticated ? <Librarian/> : <Home />}
              />
            <Route
              path="/register"
              element={isAuthenticated ? <Member /> : <RegisterPage />}
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Member /> : <Login />}
            />
            <Route
              path="/logout"
              element={isAuthenticated ? <Member /> : <Login />}
            />
            <Route path="/myaccount" element={<MyAccount />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </HashRouter>
  );
}
export default App;
