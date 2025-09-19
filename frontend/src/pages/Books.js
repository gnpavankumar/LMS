import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { useNavigate } from "react-router-dom";
import { getBooks, getBookRequests, getLendingRecords } from "../api/api";
import { jwtDecode } from "jwt-decode";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [userLendingRecords, setUserLendingRecords] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null); // New state to store the user's ID
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [language, setLanguage] = useState("");
    const [availability, setAvailability] = useState("");
    const [year, setYear] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [dropdownData, setDropdownData] = useState({ genres: [], languages: [], years: [] });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/");
            return;
        }
        try {
            const decodedToken = jwtDecode(token);
            setCurrentUserId(decodedToken.user_id);
        } catch (e) {
            console.error("Invalid token:", e);
            localStorage.clear();
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (!currentUserId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [booksRes, requestsRes, lendingRes] = await Promise.all([getBooks(), getBookRequests(), getLendingRecords()]);
                const booksArray = booksRes.data;
                const userRequestsArray = requestsRes.data;
                const userLendingRecordsArray = lendingRes.data;

                setAllBooks(booksArray);
                setBooks(booksArray);
                setUserRequests(userRequestsArray);
                setUserLendingRecords(userLendingRecordsArray);
                setError("");

                const genres = Array.from(new Set(booksArray.map(b => b.category).filter(Boolean)));
                const languages = Array.from(new Set(booksArray.map(b => b.language).filter(Boolean)));
                const years = Array.from(new Set(booksArray.map(b => b.publication_year).filter(Boolean))).sort((a, b) => a - b);
                setDropdownData({ genres, languages, years });
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load data");
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUserId]);

    const filterAndSearchBooks = () => {
        let filtered = [...allBooks];
        // ... (existing filter logic)
        setBooks(filtered);
    };

    useEffect(() => {
        filterAndSearchBooks();
    }, [search, genre, language, availability, year, allBooks]);

    const renderBooks = () => {
        if (loading) {
            return (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
        }
        if (error) {
            return (
                <div className="alert alert-danger">
                    <strong>Error:</strong> {error}
                </div>
            );
        }
        if (books.length === 0) {
            return <p>No books found.</p>;
        }
        return books.map(book => {
            const hasActiveRequest = userRequests.some(
                req => req.book === book.id && req.is_active && req.member === currentUserId
            );
            const isCurrentlyBorrowed = userLendingRecords.some(
                rec => rec.book === book.id && !rec.return_date && rec.member === currentUserId
            );
            return <BookCard key={book.id} book={book} hasActiveRequest={hasActiveRequest} isCurrentlyBorrowed={isCurrentlyBorrowed} />;
        });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Books Collection</h2>
            {/* ... (omitted for brevity, assume the JSX is here) */}
            <div className="row">
                {renderBooks()}
            </div>
        </div>
    );
}