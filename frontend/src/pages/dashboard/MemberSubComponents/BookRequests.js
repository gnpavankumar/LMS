import React, { useEffect, useState } from 'react';
import { getBookRequests, cancelBookRequest } from '../../../api/api';

const BookRequests = () => {
    const [bookRequests, setBookRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // New state for success messages
    const [errorMessage, setErrorMessage] = useState(null); // New state for error messages

    useEffect(() => {
        const fetchBookRequests = async () => {
            try {
                const requestsResponse = await getBookRequests();
                setBookRequests(requestsResponse.data);
            } catch (err) {
                setError("Failed to load book requests.");
                console.error("Book requests fetch error:", err.response || err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookRequests();
    }, []);

    const handleCancelRequest = async (requestId) => {
        setSuccessMessage(null); // Clear previous messages
        setErrorMessage(null); // Clear previous messages
        try {
            await cancelBookRequest(requestId);
            setSuccessMessage("Request cancelled successfully.");
            const requestsResponse = await getBookRequests();
            setBookRequests(requestsResponse.data);
            // Hide the message after a few seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setErrorMessage(err.response?.data?.error || "Failed to cancel request.");
            console.error("Cancel request error:", err.response || err);
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }
    const sortedRequests = [...bookRequests].sort((a, b) => new Date(b.request_date) - new Date(a.request_date));

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><i className="bi bi-list me-2"></i>My Book Requests</h5>
            </div>
            <div className="card-body">
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                
                {sortedRequests.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Book Title</th>
                                    <th>Requested On</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td>{req.book_title}</td>
                                        <td>{new Date(req.request_date).toLocaleDateString()}</td>
                                        <td>
                                            {req.status === 'lending' && <span className="badge bg-success">Approved</span>}
                                            {req.status === 'reserved' && <span className="badge bg-warning">Reserved</span>}
                                            {req.status === 'pending' && <span className="badge bg-info">Pending</span>}
                                            {req.status === 'fulfilled' && <span className="badge bg-primary">Fulfilled</span>}
                                            {req.status === 'denied' && <span className="badge bg-danger">Denied</span>}
                                        </td>
                                        <td>
                                            {req.is_active && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleCancelRequest(req.id)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted">You have no pending book requests.</p>
                )}
            </div>
        </div>
    );
};

export default BookRequests;