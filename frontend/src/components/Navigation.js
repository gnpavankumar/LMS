
import { Link } from "react-router-dom";

export default function Navbar({ isAuthenticated }) {
    
  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">Home</Link>
      <div className="nav">
        {isAuthenticated ? (
          <>
            <Link className="nav-link" to="/tasks">Task Board</Link>
            <Link className="nav-link" to="/contact">Contact</Link>
            <Link className="nav-link" to="/logout">Log out</Link>
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
