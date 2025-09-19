import React, { useState, useEffect } from "react";
import { getBookRequests, fulfillRequest } from "../../../api/api";
import { Link } from "react-router-dom";

const RequestManagement = () => {
    const [bookRequests, setBookRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await getBookRequests();
            setBookRequests(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch requests:", err);
            setError("Failed to load book requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleFulfillRequest = async (requestId) => {
        try {
            await fulfillRequest(requestId);
            setSuccess("Book request fulfilled successfully!");
            fetchRequests();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Fulfill request failed:", err.response?.data || err);
            setError(err.response?.data?.error || "Failed to fulfill request.");
        }
    };

    return (
        <div>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card">
                <div className="card-header">Pending Book Requests</div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Book Title</th>
                                        <th>Member</th>
                                        <th>Requested On</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookRequests.length > 0 ? (
                                        bookRequests.map((req) => (
                                            <tr key={req.id}>
                                                <td>{req.book_title}</td>
                                                <td>{req.member_username}</td>
                                                <td>{new Date(req.request_date).toLocaleDateString()}</td>
                                                <td>
                                                    {req.status === 'lending' && <span className="badge bg-success">Lending in progress</span>}
                                                    {req.status === 'reserved' && <span className="badge bg-warning">Reserved</span>}
                                                    {req.status === 'pending' && <span className="badge bg-info">Pending</span>}
                                                </td>
                                                <td>
                                                    {req.is_active && (req.status === 'lending' || req.status === 'pending') && (
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleFulfillRequest(req.id)}
                                                        >
                                                            Lend
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">
                                                No active book requests.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestManagement;