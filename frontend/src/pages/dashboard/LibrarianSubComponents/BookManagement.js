import React, { useState, useEffect } from "react";
import { createBook, bulkUploadBooks, getBooks, updateBook, deleteBook } from "../../../api/api";
import { Link } from "react-router-dom";

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [bookData, setBookData] = useState({
        title: "", author: "", isbn: "", category: "", language: "",
        publication_year: "", total_copies: 1, description: "", cover_image_url: "",
    });
    const [csvFile, setCsvFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingBookId, setEditingBookId] = useState(null);
    const [activeTab, setActiveTab] = useState("manage"); // New state for tabs

    // State for filtering
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [language, setLanguage] = useState("");
    const [year, setYear] = useState("");
    const [dropdownData, setDropdownData] = useState({ genres: [], languages: [], years: [] });

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await getBooks();
            const booksArray = res.data;
            setBooks(booksArray);
            setAllBooks(booksArray);
            
            // Populate dropdowns from all fetched books
            const genres = Array.from(new Set(booksArray.map(b => b.category).filter(Boolean)));
            const languages = Array.from(new Set(booksArray.map(b => b.language).filter(Boolean)));
            const years = Array.from(new Set(booksArray.map(b => b.publication_year).filter(Boolean))).sort((a, b) => a - b);
            setDropdownData({ genres, languages, years });
        } catch (err) {
            console.error("Failed to fetch books:", err);
            setError("Failed to load book data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);
    
    // Client-side filtering logic
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
        setBooks(filtered);
    };

    useEffect(() => {
        filterAndSearchBooks();
    }, [search, genre, language, year, allBooks]);

    const handleBookChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await createBook(bookData);
            setSuccess("Book added successfully!");
            setBookData({
                title: "", author: "", isbn: "", category: "", language: "",
                publication_year: "", total_copies: 1, description: "", cover_image_url: ""
            });
            fetchBooks();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to add book:", err.response?.data || err);
            setError(err.response?.data?.error || "Failed to add book.");
        }
    };

    const handleEditClick = (book) => {
        setEditingBookId(book.id);
        setBookData(book);
        setActiveTab("add-edit");
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        try {
            await updateBook(editingBookId, bookData);
            setSuccess("Book updated successfully!");
            setEditingBookId(null);
            setBookData({
                title: "", author: "", isbn: "", category: "", language: "",
                publication_year: "", total_copies: 1, description: "", cover_image_url: ""
            });
            fetchBooks();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to update book:", err.response?.data || err);
            setError(err.response?.data?.error || "Failed to update book.");
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await deleteBook(bookId);
                setSuccess("Book deleted successfully!");
                fetchBooks();
                setTimeout(() => setSuccess(null), 3000);
            } catch (err) {
                console.error("Failed to delete book:", err.response?.data || err);
                setError("Failed to delete book.");
            }
        }
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!csvFile) {
            setError("Please select a CSV file.");
            return;
        }
        try {
            await bulkUploadBooks(csvFile);
            setSuccess("Books uploaded successfully!");
            setCsvFile(null);
            fetchBooks();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Bulk upload failed:", err.response?.data || err);
            setError("Bulk upload failed.");
        }
    };

    const renderContent = () => {
        if (activeTab === "add-edit") {
            return (
                <form onSubmit={editingBookId ? handleUpdateBook : handleAddBook}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" name="title" value={bookData.title} onChange={handleBookChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Author</label>
                                <input type="text" className="form-control" name="author" value={bookData.author} onChange={handleBookChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">ISBN</label>
                                <input type="text" className="form-control" name="isbn" value={bookData.isbn} onChange={handleBookChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input type="text" className="form-control" name="category" value={bookData.category} onChange={handleBookChange} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Language</label>
                                <input type="text" className="form-control" name="language" value={bookData.language} onChange={handleBookChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Publication Year</label>
                                <input type="number" className="form-control" name="publication_year" value={bookData.publication_year} onChange={handleBookChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Total Copies</label>
                                <input type="number" className="form-control" name="total_copies" value={bookData.total_copies} onChange={handleBookChange} min="1" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" name="description" value={bookData.description} onChange={handleBookChange}></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Cover Image URL</label>
                                <input type="text" className="form-control" name="cover_image_url" value={bookData.cover_image_url} onChange={handleBookChange} />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">
                        {editingBookId ? "Update Book" : "Add Book"}
                    </button>
                    {editingBookId && (
                        <button type="button" className="btn btn-secondary" onClick={() => { setEditingBookId(null); setBookData({}); }}>Cancel</button>
                    )}
                </form>
            );
        } else if (activeTab === "bulk-upload") {
            return (
                <form onSubmit={handleBulkUpload}>
                    <div className="mb-3">
                        <label className="form-label">Upload CSV File</label>
                        <input type="file" className="form-control" onChange={handleFileChange} accept=".csv" />
                    </div>
                    <button type="submit" className="btn btn-secondary">Upload</button>
                </form>
            );
        } else {
            return (
                <>
                    {/* All Books List with Filters */}
                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Search books by title, author, or ISBN..."
                                className="form-control"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
                            />
                            <button className="btn btn-primary" type="button" onClick={() => setSearch(searchInput)}>Search</button>
                        </div>
                    </div>
                    {/* Filters */}
                    <div className="mb-4">
                        <div className="row">
                            <div className="col-md-4">
                                <select className="form-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
                                    <option value="">All Genres</option>
                                    {dropdownData.genres.map((g, index) => <option key={index} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                    <option value="">All Languages</option>
                                    {dropdownData.languages.map((l, index) => <option key={index} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                                    <option value="">All Years</option>
                                    {dropdownData.years.map((y, index) => <option key={index} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>ISBN</th>
                                        <th>Copies</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.length > 0 ? (
                                        books.map((book) => (
                                            <tr key={book.id}>
                                                <td>{book.title}</td>
                                                <td>{book.author}</td>
                                                <td>{book.isbn}</td>
                                                <td>{book.available_copies} / {book.total_copies}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-info me-2" onClick={() => handleEditClick(book)}>Edit</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No books found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            );
        }
    };

    return (
        <div className="container mt-4">
            <h2>Book Management</h2>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <ul className="nav nav-pills card-header-pills">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>Manage Catalog</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'add-edit' ? 'active' : ''}`} onClick={() => setActiveTab('add-edit')}>Add/Edit Book</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'bulk-upload' ? 'active' : ''}`} onClick={() => setActiveTab('bulk-upload')}>Bulk Upload</button>
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

export default BookManagement;