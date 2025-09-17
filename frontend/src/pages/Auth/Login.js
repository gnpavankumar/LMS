import { useState, useContext } from 'react';
import { loginUser } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
export default function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const credentials = { username, password };
      const res = await loginUser(credentials); 
      login(res.data.access, res.data.refresh);
      alert("Logged in Successfully");
      navigate('/dashboard-redirect');
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ width: "450px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Sign In</h2>
        <form method="POST" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              className="form-control"
              onChange={(e) => setUserName(e.target.value)}
              value={username}
              type="text"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <a href="#" className="text-decoration-none small">Forgot password?</a>
            <button className="btn btn-primary px-4" type="submit">Login</button>
          </div>
        </form>

        <hr />
        <p className="text-center mb-0">
          Don’t have an account?{" "}
          <a href="/register" className="fw-bold text-primary text-decoration-none">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}