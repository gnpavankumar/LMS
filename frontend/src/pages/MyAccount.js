import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from '../api/api' // Ensure the correct import path

function MyAccount() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getUserProfile()
      .then((res) => {
        setProfile(res.data);
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load user info.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone, 
    };
    if (password) payload.password = password;

    updateUserProfile(profile.id,payload)
      .then(() => {
        setSuccess(" Profile updated successfully!");
        setPassword("");
        setProfile({ ...user });
        setSubmitting(false);
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setError(" Failed to update profile.");
        setSubmitting(false);
      });
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error && !profile) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      {/* Profile Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0"><i className="bi bi-person-circle me-2"></i>Profile Overview</h5>
        </div>
        <div className="card-body">
          <p><strong>Username:</strong> {profile?.username}</p>
          <p><strong>Email:</strong> {profile?.email}</p>
          <p><strong>Name:</strong> {profile?.name}</p> 
          <p><strong>Phone:</strong> {profile?.phone}</p> 
          <p><strong>Role:</strong> {profile?.role}</p> 
        </div>
      </div>

      {/* Update Form */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0"><i className="bi bi-pencil-square me-2"></i>Edit Profile</h5>
        </div>
        <div className="card-body">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name" // Corrected field name
                  value={user.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  className="form-control"
                  name="phone" // Corrected field name
                  value={user.phone || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-4"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;