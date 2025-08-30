
import { Link } from "react-router-dom";

import axiosInstance from "../api/api";
export default function Navbar({ isAuthenticated }) {
  const handleLogout = () => {
  const refresh_token = localStorage.getItem("refresh_token");

  axiosInstance.post("/auth/logout/", { refresh: refresh_token })
    .then(() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login"; 
    })
    .catch(err => console.error(err));
};
  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">Home</Link>
      <div className="nav">
        {isAuthenticated ? (
          <>
            <Link className="nav-link" to="/tasks">Task Board</Link>
            <Link className="nav-link" to="/contact">Contact</Link>
            <Link className="nav-link" to="/logout" onClick={handleLogout} >Log out</Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/pricing">Pricing</Link>
            <Link className="nav-link" to="/contact">Contact</Link>
            <Link className="nav-link" to="/register">Register</Link>
            <Link className="nav-link" to="/login">Log in</Link>
          </>
        )}
      </div>
    </nav>
  );
}
