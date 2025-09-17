export default function Footer() {
  return (
    <footer className="bg-light text-dark border-top py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          
          {/* Brand and Copyright */}
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <h5 className="fw-semibold text-primary mb-2">📚 MyLibrary</h5>
            <p className="mb-0 small text-muted">
              &copy; {new Date().getFullYear()} MyLibrary. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="/about" className="text-decoration-none text-dark fw-light">About</a>
              </li>
              <li className="list-inline-item mx-3">
                <a href="/contact" className="text-decoration-none text-dark fw-light">Contact</a>
              </li>
              <li className="list-inline-item">
                <a href="/privacy" className="text-decoration-none text-dark fw-light">Privacy</a>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="col-md-4 text-center text-md-end">
            <a href="#" className="text-secondary me-3">
              <i className="bi bi-facebook fs-5"></i>
            </a>
            <a href="#" className="text-secondary me-3">
              <i className="bi bi-twitter fs-5"></i>
            </a>
            <a href="#" className="text-secondary">
              <i className="bi bi-instagram fs-5"></i>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}