import React, { useEffect, useState } from 'react';
import { getLendingRecords } from '../../../api/api';

const BorrowedBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const lendingResponse = await getLendingRecords();
                setBorrowedBooks(lendingResponse.data);
            } catch (err) {
                setError("Failed to load borrowed books.");
                console.error("Borrowed books fetch error:", err.response || err);
            } finally {
                setLoading(false);
            }
        };
        fetchBorrowedBooks();
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
    <div className="card shadow-sm mb-4">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0"><i className="bi bi-book me-2"></i>My Borrowed Books</h5>
        </div>
        <div className="card-body">
            {borrowedBooks.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Issued On</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowedBooks.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.book_title}</td>
                                    <td>{new Date(book.issued_on).toLocaleDateString()}</td>
                                    <td className={book.is_overdue ? 'text-danger fw-bold' : ''}>
                                        {new Date(book.due_date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {book.return_date ? new Date(book.return_date).toLocaleDateString() : '—'} {/* Display return date */}
                                    </td>
                                    <td>{book.fine_amount > 0 ? `$${book.fine_amount}` : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-muted">You have not borrowed any books yet.</p>
            )}
        </div>
    </div>
);
};

export default BorrowedBooks;