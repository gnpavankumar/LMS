import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { registerUser } from "../../api/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    name: "",
    phone: "",
    role: "member",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      setMessage('Registration successful! Please log in.');
      navigate("/login");
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        let errorMessage = "";
        if (errorData.username) {
          errorMessage += `Username: ${errorData.username[0]}\n`;
        }
        if (errorData.email) {
          errorMessage += `Email: ${errorData.email[0]}\n`;
        }
        if (errorData.password) {
          errorMessage += `Password: ${errorData.password[0]}\n`;
        }
        if (errorData.name) {
          errorMessage += `Name: ${errorData.name[0]}\n`;
        }
        if (errorData.phone) {
          errorMessage += `Phone: ${errorData.phone[0]}\n`;
        }
        if (errorMessage) {
          setError(errorMessage.trim());
        } else {
          setError('Registration failed. Please check your information.');
        }
      } else {
        setError('Something went wrong. Please try again later.');
      }
      console.error("Registration failed:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ width: "40rem" }}>
        <div className="card-body p-5">
          <h2 className="text-center mb-4 fw-bold text-primary">Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="col">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}
            <div className="d-grid mt-4">
              <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            Already have an account?{" "}
           <Link to="/login" className="fw-bold text-decoration-none text-primary">
            Login
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}