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
    const [currentUserId, setCurrentUserId] = useState(null);
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

                const genres = Array.from(new Set(booksArray.map(b => b.category).filter(Boolean))).sort();
                const languages = Array.from(new Set(booksArray.map(b => b.language).filter(Boolean))).sort();
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
    }, [currentUserId, navigate]);

    const filterAndSearchBooks = () => {
        let filtered = [...allBooks];

        if (search.trim()) {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase()) ||
                (book.isbn && book.isbn.includes(search))
            );
        }

        if (genre) {
            filtered = filtered.filter(book => book.category === genre);
        }

        if (language) {
            filtered = filtered.filter(book => book.language === language);
        }

        if (year) {
            filtered = filtered.filter(book => book.publication_year === parseInt(year));
        }

        if (availability) {
            if (availability === "available") {
                filtered = filtered.filter(book => book.available_copies > 0);
            } else {
                filtered = filtered.filter(book => book.available_copies <= 0);
            }
        }

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
            const isCurrentlyBorrowed = userLendingRecords.some(rec => 
                String(rec.book?.id ?? rec.book) === String(book.id) &&
                !rec.return_date &&
                String(rec.member) === String(currentUserId)
);

            return <BookCard key={book.id} book={book} hasActiveRequest={hasActiveRequest} isCurrentlyBorrowed={isCurrentlyBorrowed} />;
        });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Books Collection</h2>
            {/* Search Bar */}
            <div className="mb-4">
                <div className="input-group">
                    <span className="input-group-text" id="search-addon">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        placeholder="Search books..."
                        className="form-control"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
                        aria-label="Search books"
                        aria-describedby="search-addon"
                    />
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => setSearch(searchInput)}
                    >
                        Search
                    </button>
                </div>
            </div>
            {/* Filters */}
            <div className="mb-4">
                <div className="row">
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            aria-label="Select genre"
                        >
                            <option value="">All Genres</option>
                            {dropdownData.genres.map((g, index) => (
                                <option key={index} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            aria-label="Select language"
                        >
                            <option value="">All Languages</option>
                            {dropdownData.languages.map((l, index) => (
                                <option key={index} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            aria-label="Select year"
                        >
                            <option value="">All Years</option>
                            {dropdownData.years.map((y, index) => (
                                <option key={index} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            aria-label="Select availability"
                        >
                            <option value="">All Availability</option>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* Books Grid */}
            <div className="row">
                {renderBooks()}
            </div>
        </div>
    );
}