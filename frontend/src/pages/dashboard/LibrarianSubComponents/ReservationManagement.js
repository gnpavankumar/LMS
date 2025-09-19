import React, { useState, useEffect } from "react";
import { getReservations, cancelReservation } from "../../../api/api";
import { Link } from "react-router-dom";

const ReservationManagement = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const res = await getReservations();
            setReservations(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch reservations:", err);
            setError("Failed to load reservation data.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (reservationId) => {
        try {
            await cancelReservation(reservationId);
            setSuccess("Reservation cancelled successfully!");
            fetchReservations(); 
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Cancel failed:", err.response?.data || err);
            setError("Failed to cancel reservation.");
        }
    };
    
    return (
        <div>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card">
                <div className="card-header">Active Reservations</div>
                <div className="card-body">
                    {/* ... (loading spinner is unchanged) */}
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Book Title</th>
                                    <th>Member</th>
                                    <th>Reservation Date</th>
                                    <th>Position</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length > 0 ? (
                                    reservations.map((res) => (
                                        <tr key={res.id}>
                                            <td>{res.book_title}</td>
                                            <td>{res.member_username}</td>
                                            <td>{new Date(res.reservation_date).toLocaleDateString()}</td>
                                            <td>{res.position}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleCancel(res.id)}
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No active reservations.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationManagement;