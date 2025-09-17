import { Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { logoutUser } from "../api/api";


export default function Navbar({ isAuthenticated }) {
  const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            try {
                await logoutUser(refreshToken);
            } catch (err) {
                console.error("Logout failed:", err);
            } finally {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                
            }
        }
    };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom py-3">
      <div className="container">
        {/* Brand / Logo */}
        <Link className="navbar-brand fw-bold text-primary fs-4" to="/">
          <i className="bi bi-book-half me-2"></i>MyLibrary
        </Link>

        {/* Collapse button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/tasks">
                    <i className="bi bi-journal-text me-1"></i>Lending
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