import { Link } from 'react-router-dom';
import { Users2, ClipboardCheck, TrendingUp, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';

const STEPS = [
  {
    icon: Users2,
    title: 'Join your university',
    desc: 'Choose your university and register with your university email and registration number. Your account and data stay scoped to your own campus.',
  },
  {
    icon: ClipboardCheck,
    title: 'Report or find what you need',
    desc: 'Submit a campus issue — anonymously if you prefer — or post and browse Lost & Found items in a few taps.',
  },
  {
    icon: TrendingUp,
    title: 'Track updates',
    desc: 'Every report gets a unique ID and a visible timeline, from Submitted through Under Review, In Progress, and Resolved.',
  },
  {
    icon: Sparkles,
    title: 'Help improve campus life',
    desc: 'Your reports feed directly into your university\u2019s dashboard, helping staff spot patterns and respond faster.',
  },
];

export default function HowItWorks() {
  return (
    <div>
      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="section-inner" style={{ maxWidth: 720 }}>
          <span className="eyebrow-pill"><ShieldCheck size={14} /> How it works</span>
          <h1 className="hero-heading" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.8rem)' }}>
            From a campus problem to a resolved report.
          </h1>
          <p className="hero-sub">
            UniAssist is built around one loop: students flag what needs attention, universities act on it, and
            everyone can see progress along the way.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div className="card step-card" key={s.title}>
                <div className="step-index">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-icon-wrap"><s.icon size={20} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-sunken">
        <div className="section-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 14 }}>For students</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
              Report a broken facility, an unsafe area, or a concern you\u2019d rather keep private — then track it
              from your dashboard. Post something you lost or found, and check campus announcements, all in one app.
            </p>
            <Link to="/register/student"><Button variant="primary" icon={ArrowRight}>Create a student account</Button></Link>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 14 }}>For universities</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
              Get a dedicated dashboard to review reports, manage Lost & Found, publish announcements, and see
              analytics across categories — with your data kept separate from every other institution on the platform.
            </p>
            <Link to="/register/university"><Button variant="secondary" icon={ArrowRight}>Register your university</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
