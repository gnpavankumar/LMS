import React from 'react';
import { useState } from 'react';
import BorrowedBooks from './MemberSubComponents/BorrowedBooks';
import BookRequests from './MemberSubComponents/BookRequests';
import Reservations from './MemberSubComponents/Reservations';

const Member = () => {
    const [activeTab, setActiveTab] = useState("borrowed");

    const renderContent = () => {
        switch (activeTab) {
            case "borrowed":
                return <BorrowedBooks />;
            case "requests":
                return <BookRequests />;
            case "reservations":
                return <Reservations />;
            default:
                return <BorrowedBooks />;
        }
    };

    return (
        <div className="container mt-4">
            <h2>Member Dashboard</h2>
            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <ul className="nav nav-pills card-header-pills">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "borrowed" ? "active" : ""}`}
                                onClick={() => setActiveTab("borrowed")}
                            >
                                Borrowed Books
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "requests" ? "active" : ""}`}
                                onClick={() => setActiveTab("requests")}
                            >
                                Book Requests
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "reservations" ? "active" : ""}`}
                                onClick={() => setActiveTab("reservations")}
                            >
                                Reservations
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Member;