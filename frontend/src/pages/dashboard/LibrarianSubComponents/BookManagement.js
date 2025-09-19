import React, { useState } from "react";
import { createBook, bulkUploadBooks } from "../../../api/api";
import { Link } from "react-router-dom";

const BookManagement = () => {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    language: "",
    publication_year: "",
    total_copies: 1,
    available_copies: 1,
    description: "",
    cover_image_url: "",
  });
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        title: "",
        author: "",
        isbn: "",
        category: "",
        language: "",
        publication_year: "",
        total_copies: 1,
        available_copies: 1,
        description: "",
        cover_image_url: "",
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to add book:", err.response?.data || err);
      setError("Failed to add book.");
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
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Bulk upload failed:", err.response?.data || err);
      setError("Bulk upload failed.");
    }
  };

  return (
    <div>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Add New Book Section */}
      <div className="card mb-4">
        <div className="card-header">Add New Book</div>
        <div className="card-body">
          <form onSubmit={handleAddBook}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={bookData.title}
                    onChange={handleBookChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={bookData.author}
                    onChange={handleBookChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">ISBN</label>
                  <input
                    type="text"
                    className="form-control"
                    name="isbn"
                    value={bookData.isbn}
                    onChange={handleBookChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={bookData.category}
                    onChange={handleBookChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Language</label>
                  <input
                    type="text"
                    className="form-control"
                    name="language"
                    value={bookData.language}
                    onChange={handleBookChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Publication Year</label>
                  <input
                    type="number"
                    className="form-control"
                    name="publication_year"
                    value={bookData.publication_year}
                    onChange={handleBookChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Copies</label>
                  <input
                    type="number"
                    className="form-control"
                    name="total_copies"
                    value={bookData.total_copies}
                    onChange={handleBookChange}
                    min="1"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={bookData.description}
                    onChange={handleBookChange}
                  ></textarea>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
          </form>
        </div>
      </div>
      {/* Bulk Upload Section */}
      <div className="card mb-4">
        <div className="card-header">Bulk Upload Books (CSV)</div>
        <div className="card-body">
          <form onSubmit={handleBulkUpload}>
            <div className="mb-3">
              <label className="form-label">Upload CSV File</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                accept=".csv"
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookManagement;