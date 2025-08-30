import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/auth/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        alert("User Created Successfully ");
        
      })
      .catch((err) => {
        console.error(err);
        
        alert("Something went wrong ");
      });
  };

  return (
    <div
      className="shadow-lg border border-warning rounded-3 p-3 mx-auto my-5"
      style={{ maxWidth: "23%", minHeight: "60%" }}
    >
      <h1 className="text-center my-4" style={{ fontFamily: "Verdana" }}>
        Sign Up
      </h1>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-4" name="username"
            value={formData.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            // required="True"
          />
          <input
            className="form-control mb-4"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="text"
            placeholder="Email"
          />
          <input
            className="form-control mb-4"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
          />
          <input
            className="form-control mb-4"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
          />
          <div className="d-grid gap-2 col-4 mx-auto">
            <button className="btn btn-success" type="submit">
              Register
            </button>
          </div>
        </form>

        <div className="my-3 text-center">
          Have an account?{" "}
          <a href="/login" className="text-decoration-none fw-bold">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
