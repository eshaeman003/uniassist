import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import Button from './Button';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/register/university', label: 'For Universities' },
  { to: '/about', label: 'About' },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="public-navbar">
      <div className="public-navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><GraduationCap size={18} /></span>
          UniAssist
        </Link>

        <nav className="public-nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="public-nav-actions">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="primary" onClick={() => navigate('/register/student')}>Get Started</Button>
          <button className="mobile-menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <div className="mobile-drawer-head">
            <Link to="/" className="brand" onClick={() => setOpen(false)}>
              <span className="brand-mark"><GraduationCap size={18} /></span>
              UniAssist
            </Link>
            <button onClick={() => setOpen(false)} aria-label="Close menu" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
              <X size={22} />
            </button>
          </div>
          <nav>
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
          </nav>
          <div className="mobile-drawer-actions">
            <Button variant="secondary" block onClick={() => { setOpen(false); navigate('/login'); }}>Login</Button>
            <Button variant="primary" block onClick={() => { setOpen(false); navigate('/register/student'); }}>Get Started</Button>
          </div>
        </div>
      )}
    </header>
  );
}
