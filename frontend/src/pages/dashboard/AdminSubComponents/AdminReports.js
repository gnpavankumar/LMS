import React, { useEffect, useState } from "react";
import { getLendingRecords } from "../../../api/api";

const AdminReports = () => {
    const [lendingRecords, setLendingRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReportsData = async () => {
            try {
                const res = await getLendingRecords();
                setLendingRecords(res.data);
            } catch (err) {
                setError("Failed to fetch lending records for reports.");
                console.error("Reports fetch error:", err.response || err);
            } finally {
                setLoading(false);
            }
        };
        fetchReportsData();
    }, []);

    if (loading) return <div>Loading reports...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Lending Reports</h2>
            <div className="card p-3">
                <h4 className="mb-3">All Lending Records</h4>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Member</th>
                                <th>Issued On</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lendingRecords.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.book_title}</td>
                                    <td>{record.member_username}</td>
                                    <td>{new Date(record.issued_on).toLocaleDateString()}</td>
                                    <td>{new Date(record.due_date).toLocaleDateString()}</td>
                                    <td>{record.return_date ? new Date(record.return_date).toLocaleDateString() : '—'}</td>
                                    <td>{record.fine_amount > 0 ? `$${record.fine_amount}` : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;