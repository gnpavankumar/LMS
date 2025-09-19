import React, { useState } from "react";
import BookManagement from "./LibrarianSubComponents/BookManagement";
import LendingManagement from "./LibrarianSubComponents/LendingManagement";
import RequestManagement from "./LibrarianSubComponents/RequestManagement";
import ReservationManagement from "./LibrarianSubComponents/ReservationManagement"; 
import { Link } from "react-router-dom";

const Librarian = () => {
    const [activeTab, setActiveTab] = useState("requests");

    const renderContent = () => {
        switch (activeTab) {
            case "requests":
                return <RequestManagement />;
            case "lending":
                return <LendingManagement />;
            case "reservations":
                return <ReservationManagement />; 
            case "books":
                return <BookManagement />;
            default:
                return <RequestManagement />;
        }
    };

    return (
        <div className="container mt-4">
            <h2>Librarian Dashboard</h2>
            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <ul className="nav nav-pills card-header-pills">
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
                                className={`nav-link ${activeTab === "lending" ? "active" : ""}`}
                                onClick={() => setActiveTab("lending")}
                            >
                                Lending Records
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
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "books" ? "active" : ""}`}
                                onClick={() => setActiveTab("books")}
                            >
                                Book Management
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

export default Librarian;