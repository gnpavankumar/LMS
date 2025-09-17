import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container text-center py-5">
        <div className="mb-4">
          <i className="bi bi-journal-bookmark-fill display-1 text-primary"></i>
        </div>
        <h1 className="display-4 fw-bold mb-3">Welcome to <span className="text-primary">LibraryApp</span></h1>
        <p className="lead text-muted mb-4">
          Discover, borrow, and manage your books online. Your reading journey starts here.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Link to="/login" className="btn btn-primary btn-lg px-4 me-sm-3">
            Login to Continue
          </Link>
          <Link to="/books" className="btn btn-outline-primary btn-lg px-4">
            Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
