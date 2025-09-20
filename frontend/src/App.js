import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Member from './pages/dashboard/Member';
import Navbar from './components/Navigation';
import RegisterPage from './pages/Auth/RegisterPage';
import Login from './pages/Auth/Login';
import Footer from './components/Footer';
import MyAccount from './pages/MyAccount';
import Home from './pages/Home';
import AdminDashboard from './pages/dashboard/Admin';
import Librarian from './pages/dashboard/Librarian';
import Books from './pages/Books';
import AdminReports from './pages/dashboard/AdminSubComponents/AdminReports';


const DashboardRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        const userRole = decodedToken.role;
        switch (userRole) {
          case 'member':
            navigate('/member-dashboard');
            break;
          case 'librarian':
            navigate('/librarian-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('/member-dashboard');
            break;
        }
      } catch (e) {
        console.error("Invalid token:", e);
        localStorage.clear();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  return loading ? <div>Loading...</div> : null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <HashRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar isAuthenticated={isAuthenticated} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/books" element={<Books />} />
            
            {/* Redirect a user to their specific dashboard after login */}
            <Route path="/dashboard-redirect" element={<DashboardRedirect />} />
            
            {/* Protected Routes - only accessible if authenticated */}
            <Route path="/member-dashboard" element={<Member />} />
            <Route path="/librarian-dashboard" element={<Librarian />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-reports" element={<AdminReports />} />
            <Route path="/myaccount" element={<MyAccount />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;