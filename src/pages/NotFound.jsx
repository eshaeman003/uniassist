import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="success-shell" style={{ minHeight: '70vh' }}>
      <div className="card success-card">
        <div className="success-icon-wrap" style={{ background: 'var(--lilac-soft)', color: 'var(--lilac-dark)' }}>
          <Compass size={30} />
        </div>
        <h1>Page not found</h1>
        <p>The page you\u2019re looking for doesn\u2019t exist or may have moved.</p>
        <Link to="/"><Button variant="primary" style={{ marginTop: 12 }}>Back to home</Button></Link>
      </div>
    </div>
  );
}
