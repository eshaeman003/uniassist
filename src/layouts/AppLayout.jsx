import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Menu, X, LogOut, User as UserIcon, Settings as SettingsIcon,
  LayoutDashboard, FileWarning, PlusCircle, Search, Megaphone, Users, BarChart3, Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UniversityBadge from '../components/UniversityBadge';
import { initials } from '../utils/format';

const STUDENT_NAV = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/reports/new', label: 'Report a Problem', icon: PlusCircle },
  { to: '/app/reports', label: 'My Reports', icon: FileWarning },
  { to: '/app/lost-found', label: 'Lost & Found', icon: Search },
  { to: '/app/announcements', label: 'Announcements', icon: Megaphone },
];

const ADMIN_NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/reports', label: 'Reports', icon: FileWarning },
  { to: '/admin/lost-found', label: 'Lost & Found', icon: Search },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AppLayout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = role === 'admin' ? ADMIN_NAV : STUDENT_NAV;
  const profilePath = role === 'admin' ? '/admin/settings' : '/app/profile';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = (
    <>
      <div className="app-sidebar-brand">
        <div className="brand">
          <span className="brand-mark"><GraduationCap size={18} /></span>
          UniAssist {role === 'admin' && <span style={{ color: 'var(--text-faint)', fontWeight: 500, fontSize: '0.8rem' }}>Admin</span>}
        </div>
      </div>

      {user?.university && (
        <div style={{ padding: '0 10px 16px' }}>
          <UniversityBadge university={user.university} />
        </div>
      )}

      <nav className="app-nav" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setDrawerOpen(false)}
          >
            <item.icon size={17} /> {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="app-nav-divider" />

      <div className="app-user-chip">
        <span className="app-user-avatar">{initials(user?.name)}</span>
        <span className="app-user-meta">
          <strong>{user?.name}</strong>
          <span>{user?.email}</span>
        </span>
      </div>

      <div className="app-sidebar-footer">
        {role === 'admin' && (
          <NavLink to="/admin/settings" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>
            <Building2 size={17} /> University Settings
          </NavLink>
        )}
        <NavLink to={profilePath} className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>
          <UserIcon size={17} /> Profile
        </NavLink>
        {role === 'student' && (
          <NavLink to="/app/settings" className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>
            <SettingsIcon size={17} /> Settings
          </NavLink>
        )}
        <button className="app-nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }} onClick={handleLogout}>
          <LogOut size={17} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <aside className="app-sidebar">{SidebarContent}</aside>

      {drawerOpen && (
        <>
          <div className="app-mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="app-mobile-drawer">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            {SidebarContent}
          </div>
        </>
      )}

      <div className="app-main">
        <div className="app-topbar">
          <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
            <Menu size={22} />
          </button>
          <div className="brand" style={{ fontSize: '0.95rem' }}>
            <span className="brand-mark" style={{ width: 26, height: 26 }}><GraduationCap size={14} /></span>
            UniAssist
          </div>
          <button onClick={() => navigate(profilePath)} className="app-user-avatar" aria-label="Open profile">
            {initials(user?.name)}
          </button>
        </div>

        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}