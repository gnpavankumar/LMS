import React, { useEffect, useState } from "react";
import BookCard from "../BookCard";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../../api/api";

function Member() {
  const [books, setBooks] = useState([]);
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

  // Fetch books with filters
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (genre) params.category = genre;
        if (language) params.language = language;
        if (year) params.publication_year = year;
        if (availability === "available") params.available = "true";
        else if (availability === "unavailable") params.available = "false";

        const res = await getBooks(params);
        const data = res.data;
        const booksArray =
          Array.isArray(data) ? data :
          Array.isArray(data.results) ? data.results :
          Array.isArray(data.books) ? data.books : [];

        setBooks(booksArray);
        setError("");

        // Extract dropdown options from response
        const genres = Array.from(new Map(booksArray.map(b => [b.category?.id, b.category])).values()).filter(Boolean);
        const languages = Array.from(new Map(booksArray.map(b => [b.language?.id, b.language])).values()).filter(Boolean);
        const years = Array.from(new Set(booksArray.map(b => b.publication_year).filter(Boolean))).sort();

        setDropdownData({ genres, languages, years });
      } catch (err) {
        console.error("Error loading books:", err);
        setError("Failed to load books");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [search, genre, language, availability, year, navigate]);

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
              {dropdownData.genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
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
              {dropdownData.languages.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
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
              {dropdownData.years.map((y) => (
                <option key={y} value={y}>{y}</option>
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

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Books Grid */}
      <div className="row">
        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : books.length > 0 ? (
          books.map((book) => <BookCard key={book.id} book={book} />)
        ) : (
          !error && <p>No books found.</p>
        )}
      </div>
    </div>
  );
}

export default Member;