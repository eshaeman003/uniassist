import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, MapPinned, Megaphone, PackageSearch, Users2, ClipboardCheck,
  Sparkles, Lock, TrendingUp,
} from 'lucide-react';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import { universities } from '../../data/universities';

const STEPS = [
  { title: 'Join your university', desc: 'Register with your university email and student ID. Your account is scoped to your own campus.', icon: Users2 },
  { title: 'Report or find what you need', desc: 'Flag a campus issue privately, or browse Lost & Found for something you misplaced.', icon: ClipboardCheck },
  { title: 'Track updates', desc: 'Follow your report from submitted to resolved, with real updates from your university.', icon: TrendingUp },
  { title: 'Help improve campus life', desc: 'Every report and post helps your university spot patterns and act faster.', icon: Sparkles },
];

const FEATURES = [
  { title: 'Anonymous issue reporting', desc: 'Report unsafe areas, harassment concerns, or maintenance problems without your name attached.', icon: ShieldCheck },
  { title: 'Lost & Found, done properly', desc: 'Post or search for lost items across your campus, organized by category and location.', icon: PackageSearch },
  { title: 'Campus announcements', desc: 'Stay on top of maintenance notices, events, and safety alerts from your university.', icon: Megaphone },
  { title: 'Live report tracking', desc: 'A clear timeline shows exactly where your report stands — submitted, reviewed, in progress, resolved.', icon: MapPinned },
  { title: 'Built for every university', desc: 'Each institution gets its own space, with student and staff data kept logically separate.', icon: Users2 },
  { title: 'Designed for trust', desc: 'Clear language about what is and isn\u2019t private, with no dark patterns.', icon: Lock },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-grid">
          <div>
            <span className="eyebrow-pill"><Sparkles size={14} /> Prototype — built for a 6-week internship project</span>
            <h1 className="hero-heading">Make your campus better, together.</h1>
            <p className="hero-sub">
              UniAssist gives students a safe and simple way to report campus problems, find lost belongings,
              stay informed, and connect with their university.
            </p>
            <div className="hero-cta-row">
              <Button variant="primary" size="lg" icon={ArrowRight} onClick={() => (window.location.href = '/register/student')}>
                Get Started
              </Button>
              <Link to="/register/university">
                <Button variant="secondary" size="lg">I&rsquo;m a University</Button>
              </Link>
            </div>
            <div className="hero-trust">
              <ShieldCheck size={16} color="var(--lilac-dark)" />
              Privacy-first reporting, built with future Supabase-backed security in mind.
            </div>
          </div>

          <div className="hero-mock" aria-hidden="true">
            <div className="hero-mock-head">
              <UniversityBadgeMini />
              <StatusBadge status="In Progress" />
            </div>
            <div className="hero-mock-body">
              <div className="grid-3" style={{ gap: 10 }}>
                <MiniStat label="My Reports" value="4" />
                <MiniStat label="In Progress" value="2" />
                <MiniStat label="Resolved" value="2" />
              </div>
              <div className="card card-tight" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Broken AC — Lab 3</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Facilities · 2 days ago</div>
                </div>
                <StatusBadge status="Under Review" />
              </div>
              <div className="card card-tight" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Wi-Fi issue — Block A</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Technology · 4 days ago</div>
                </div>
                <StatusBadge status="In Progress" />
              </div>
              <div className="card card-tight" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Black Wallet</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Lost &amp; Found · Library</div>
                </div>
                <StatusBadge status="Found" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section-sunken" id="how-it-works">
        <div className="section-inner">
          <div className="section-heading">
            <h2>How UniAssist works</h2>
            <p>From your first report to a resolved issue, every step is visible.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div className="card step-card" key={s.title}>
                <div className="step-index">{String(i + 1).padStart(2, '0')}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Everything your campus needs in one place</h2>
            <p>UniAssist brings reporting, lost &amp; found, and announcements into a single, well-designed app.</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div className="card feature-card" key={f.title}>
                <div className="step-icon-wrap"><f.icon size={20} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy spotlight */}
      <section className="section section-sunken">
        <div className="section-inner privacy-spotlight">
          <div>
            <span className="eyebrow-pill"><Lock size={14} /> The hero feature</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)', marginBottom: 14 }}>
              Report what matters, without putting your name on it.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 18 }}>
              Some problems are hard to report publicly — an unsafe area, a harassment concern, a maintenance
              issue you\u2019d rather not attach your name to. UniAssist lets students choose to submit anonymously,
              so university staff only see what they need to resolve the issue.
            </p>
            <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              This is currently a frontend prototype, so anonymity is not yet cryptographically enforced. The
              architecture is designed so true database-level privacy can be added with Supabase Row Level Security.
            </p>
          </div>
          <div className="privacy-spotlight-visual">
            <div className="privacy-card" style={{ background: 'var(--white)' }}>
              <div className="privacy-card-icon"><ShieldCheck size={18} /></div>
              <div className="privacy-card-body">
                <h4>Protect your identity</h4>
                <p>Your identity will remain private. University staff will only see the information required to resolve your report.</p>
                <div className="toggle-row">
                  <span className="toggle-label">Submit anonymously</span>
                  <span className="switch">
                    <input type="checkbox" checked readOnly aria-label="Submit anonymously (preview)" />
                    <span className="switch-track" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Universities */}
      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Built for multiple universities</h2>
            <p>Each institution gets its own space on UniAssist, with student and report data kept logically separate.</p>
          </div>
          <div className="uni-strip">
            {universities.map((u) => (
              <div className="uni-chip" key={u.id}>
                <span className="university-badge-mark">{u.shortName.slice(0, 3)}</span>
                {u.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="cta-banner">
            <div>
              <h2>Ready to try the prototype?</h2>
              <p>Create a demo student account, or jump straight in with a demo login.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register/student"><Button variant="primary" size="lg">Get Started</Button></Link>
              <Link to="/login"><Button variant="secondary" size="lg" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>Login</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="card card-tight" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}

function UniversityBadgeMini() {
  return (
    <span className="university-badge">
      <span className="university-badge-mark">CUS</span>
      CUST
    </span>
  );
}
