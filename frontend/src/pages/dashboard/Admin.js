import React, { useEffect, useState } from "react";
import { getAdminDashboard, registerUser, getLendingRecords } from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [lendingRecords, setLendingRecords] = useState([]);
    const [newUserData, setNewUserData] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        phone: "",
        role: "librarian",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // The fetchDashboardData function is now defined inside the useEffect
    // This removes the dependency warning and ensures the component
    // only runs the effect once when it mounts.
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const decodedToken = jwtDecode(token);
                if (decodedToken.role !== "admin") {
                    setError("You do not have permission to view this page.");
                    setLoading(false);
                    return;
                }

                const [adminRes, lendingRes] = await Promise.all([
                    getAdminDashboard(),
                    getLendingRecords()
                ]);
                setAdminData(adminRes.data);
                setLendingRecords(lendingRes.data);
            } catch (err) {
                setError("Failed to load dashboard data.");
                console.error("Dashboard fetch error:", err.response || err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]); // The dependency array now only includes 'navigate'

    const handleUserFormChange = (e) => {
        setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const payload = { ...newUserData, password: newUserData.password };
            await registerUser(payload);
            setSuccess(`User ${newUserData.username} created successfully!`);
            setNewUserData({
                username: "",
                email: "",
                password: "",
                name: "",
                phone: "",
                role: "librarian",
            });
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create user.");
        }
    };
    
    const getLendingStats = () => {
        const totalBooks = lendingRecords.length;
        const currentlyBorrowed = lendingRecords.filter(rec => !rec.return_date).length;
        const overdueBooks = lendingRecords.filter(rec => rec.is_overdue).length;
        return { totalBooks, currentlyBorrowed, overdueBooks };
    };

    const lendingStats = getLendingStats();

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
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Create New User (Librarian)</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCreateUser}>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control" name="username" value={newUserData.username} onChange={handleUserFormChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={newUserData.email} onChange={handleUserFormChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" name="password" value={newUserData.password} onChange={handleUserFormChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" name="name" value={newUserData.name} onChange={handleUserFormChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="tel" className="form-control" name="phone" value={newUserData.phone} onChange={handleUserFormChange} />
                                </div>
                                <div className="mb-3 d-none">
                                    <input type="hidden" name="role" value="librarian" />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Create Librarian</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Lending Statistics and Reports</h5>
                        </div>
                        <div className="card-body">
                            <p><strong>Total Lending Records:</strong> {lendingStats.totalBooks}</p>
                            <p><strong>Books Currently Borrowed:</strong> {lendingStats.currentlyBorrowed}</p>
                            <p><strong>Overdue Books:</strong> {lendingStats.overdueBooks}</p>
                            <div className="mt-4">
                                <Link to="/admin-reports" className="btn btn-secondary">Generate Reports</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;