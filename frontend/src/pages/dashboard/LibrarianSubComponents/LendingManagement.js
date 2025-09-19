import React, { useState, useEffect } from "react";
import { getLendingRecords, returnBook } from "../../../api/api";
import { Link } from "react-router-dom";

const LendingManagement = () => {
    const [lendingRecords, setLendingRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchLendingRecords();
    }, []);

    const fetchLendingRecords = async () => {
        try {
            setLoading(true);
            const res = await getLendingRecords();
            setLendingRecords(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch lending records:", err);
            setError("Failed to load lending records.");
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (recordId) => {
        try {
            await returnBook(recordId);
            setSuccess("Book marked as returned.");
            fetchLendingRecords();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Return failed:", err.response?.data || err);
            setError("Failed to mark book as returned.");
        }
    };

    return (
        <div>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card">
                <div className="card-header">All Lending Records</div>
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
                                        <th>Issued On</th>
                                        <th>Due Date</th>
                                        <th>Return Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lendingRecords.length > 0 ? (
                                        lendingRecords.map((record) => (
                                            <tr key={record.id}>
                                                <td>{record.book_title}</td>
                                                <td>{record.member_username}</td>
                                                <td>{new Date(record.issued_on).toLocaleDateString()}</td>
                                                <td>{new Date(record.due_date).toLocaleDateString()}</td>
                                                <td>
                                                    {record.return_date
                                                        ? new Date(record.return_date).toLocaleDateString()
                                                        : "—"}
                                                </td>
                                                <td>
                                                    {record.return_date ? (
                                                        <span className="text-success">Returned</span>
                                                    ) : (
                                                        "On Loan"
                                                    )}
                                                </td>
                                                <td>
                                                    {!record.return_date && (
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleReturn(record.id)}
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">
                                                No lending records found.
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

export default LendingManagement;