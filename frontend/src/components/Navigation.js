import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { logoutUser } from '../api/api';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, logout } = useContext(UserContext);

  const getDashboardPath = () => {
    switch (userRole) {
      case "member":
        return "/member-dashboard";
      case "librarian":
        return "/librarian-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        await logoutUser(refreshToken);
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        logout();
        navigate("/login");
      }
    } else {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-4" to={getDashboardPath()}>
          <i className="bi bi-book-half me-2"></i>MyLibrary
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/books">
                    Books
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={getDashboardPath()}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/myaccount">
                    <i className="bi bi-person-circle me-1"></i>My Account
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm ms-3"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-pencil-square me-1"></i>Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm ms-3" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}