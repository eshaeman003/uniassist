import { ShieldCheck, Layers, Code2, Rocket } from 'lucide-react';

const POINTS = [
  {
    icon: ShieldCheck,
    title: 'Why UniAssist exists',
    desc: 'Many campus problems go unreported because students don\u2019t have a safe, simple channel to raise them. UniAssist gives every student a direct, trackable way to flag issues — privately when they need to.',
  },
  {
    icon: Layers,
    title: 'Multi-university by design',
    desc: 'The platform is built so any university can onboard, with student accounts, reports, and Lost & Found data logically scoped to that institution from day one.',
  },
  {
    icon: Code2,
    title: 'Current state: prototype',
    desc: 'This build runs entirely on mock data and the browser\u2019s local storage. There is no live backend yet, and no real university is currently using UniAssist.',
  },
  {
    icon: Rocket,
    title: 'What\u2019s next',
    desc: 'The next phase connects Supabase for authentication, a PostgreSQL database, and Row Level Security so report anonymity is enforced at the data layer, not just in the interface.',
  },
];

export default function About() {
  return (
    <div>
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="section-inner" style={{ maxWidth: 720 }}>
          <span className="eyebrow-pill">About the project</span>
          <h1 className="hero-heading" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.8rem)' }}>
            A campus support platform, built as a prototype.
          </h1>
          <p className="hero-sub">
            UniAssist is a frontend prototype demonstrating product thinking, UI/UX design, and application
            architecture for a multi-university campus support platform. It is not deployed at any real institution.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner feature-grid">
          {POINTS.map((p) => (
            <div className="card feature-card" key={p.title}>
              <div className="step-icon-wrap"><p.icon size={20} /></div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
