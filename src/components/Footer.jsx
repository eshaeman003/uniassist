import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col" style={{ maxWidth: 280 }}>
          <div className="brand" style={{ marginBottom: 10 }}>
            <span className="brand-mark" style={{ width: 28, height: 28 }}>U</span>
            UniAssist
          </div>
          <p>A safer, smarter campus for everyone. Currently a prototype built for demonstration purposes.</p>
        </div>
        <div className="footer-col">
          <h5>Product</h5>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/register/student">For students</Link>
          <Link to="/register/university">For universities</Link>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
        </div>
        <div className="footer-col">
          <h5>Status</h5>
          <p>Prototype build — mock data only.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} UniAssist. A student project prototype.</span>
        <span>Not affiliated with any university unless registered.</span>
      </div>
    </footer>
  );
}
