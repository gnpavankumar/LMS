import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  
  const [error, setError] = useState(null); // State to store error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const url = "http://127.0.0.1:8000/api/auth/register/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match!");
      return;
    }

    axios
      .post(url, formData)
      .then(() => {
        // Use a state variable for a success message if needed, or redirect directly
        alert("User registered successfully!");
        navigate("/login"); // Redirect to the login page
      })
      .catch((err) => {
        // Improved error handling
        const errorData = err.response?.data;
        if (errorData) {
          let errorMessage = "";
          // Check for specific field errors and append to the message
          if (errorData.username) {
            errorMessage += `Username: ${errorData.username.join(", ")}\n`;
          }
          if (errorData.email) {
            errorMessage += `Email: ${errorData.email.join(", ")}\n`;
          }
          if (errorData.password) {
            errorMessage += `Password: ${errorData.password.join(", ")}\n`;
          }
          if (errorMessage) {
            setError(errorMessage.trim());
          } else {
            setError("Something went wrong. Please check your information.");
          }
        } else {
          setError("Something went wrong. Please try again later.");
        }
        console.log(err);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg border-0 rounded-4" style={{ width: "40rem" }}>
        <div className="card-body p-5">
          <h2 className="text-center mb-4 fw-bold text-primary">Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label"> Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter name"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Enter phone number"
              />
            </div>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Password</label>
                <input
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="col">
                <label className="form-label">Confirm Password</label>
                <input
                  className="form-control"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            
            {/* Display error message */}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-grid">
              <button className="btn btn-primary btn-lg" type="submit">
                Register
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="fw-bold text-decoration-none text-primary">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}