import React, { useEffect, useState } from 'react';
import { getReservations } from '../../../api/api';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const reservationsResponse = await getReservations();
                setReservations(reservationsResponse.data);
            } catch (err) {
                setError("Failed to load reservations.");
                console.error("Reservations fetch error:", err.response || err);
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []);

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

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><i className="bi bi-calendar-check me-2"></i>My Reservations</h5>
            </div>
            <div className="card-body">
                {reservations.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Reservation Date</th>
                                    <th>Position</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((res) => (
                                    <tr key={res.id}>
                                        <td>{res.book_title}</td>
                                        <td>{new Date(res.reservation_date).toLocaleDateString()}</td>
                                        <td>{res.position}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted">You have no active reservations.</p>
                )}
            </div>
        </div>
    );
};

export default Reservations;