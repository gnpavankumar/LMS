import React, { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/api";

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAdminDashboard();
        setAdminData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data. You may not have access to this page.");
        console.error("Dashboard fetch error:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">No dashboard data available.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <div className="card p-3">
        <h4>Admin Profile</h4>
        <hr />
        <p><strong>Username:</strong> {adminData.username}</p>
        <p><strong>Email:</strong> {adminData.email}</p>
        <p><strong>Name:</strong> {adminData.name}</p>
        <p><strong>Phone:</strong> {adminData.phone}</p>
        <p><strong>Role:</strong> {adminData.role}</p>
        
      </div>
    </div>
  );
};

export default AdminDashboard;