import React from "react";

function BookCard({ book }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            className="card-img-top"
            alt={book.title || "Book cover"}
            style={{ height: "250px", objectFit: "cover" }}
          />
        ) : null}
        <div className="card-body">
          <h5 className="card-title">{book.title || "Untitled"}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {(book.author || "Unknown Author") + " • " + (book.publication_year || "-")}
          </h6>
          <p className="card-text" style={{ fontSize: "0.9rem" }}>
            {book.description
              ? book.description.length > 100
                ? book.description.substring(0, 100) + "..."
                : book.description
              : "No description available."}
          </p>
          <span className="badge bg-primary me-2">{book.category || "Unknown"}</span>
          <span className="badge bg-secondary">{book.language || "Unknown"}</span>
        </div>
        <div className="card-footer text-muted">
          Available:{" "}
          <strong>
            {book.available_copies != null ? book.available_copies : 0}
          </strong>{" "}
          /{" "}
          {book.total_copies != null ? book.total_copies : 0}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
