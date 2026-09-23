import { ShieldCheck, Layers, Database, Rocket } from 'lucide-react';

const POINTS = [
  {
    icon: ShieldCheck,
    title: 'Built around the student journey',
    desc: 'UniAssist is designed as a centralized student support platform that helps students navigate everyday university life more easily. From raising campus concerns to finding lost items and accessing university-specific services, the goal is to bring common student needs into one accessible platform.',
  },
  {
    icon: Layers,
    title: 'Designed for multiple universities',
    desc: 'UniAssist is built with a multi-university architecture so different institutions can onboard their own students and manage their data independently. Student accounts, reports, and university resources are logically scoped to the institution they belong to.',
  },
  {
    icon: Database,
    title: 'A full-stack application',
    desc: 'UniAssist is more than a frontend interface. The application uses a React and Vite frontend connected to Supabase for authentication, PostgreSQL data storage, and Row Level Security. User accounts and application data are handled through the backend rather than relying on mock data or browser-only storage.',
  },
  {
    icon: Rocket,
    title: 'Built to become a real campus platform',
    desc: 'The current deployment demonstrates the complete product experience from interface to backend. The platform can be extended with additional university services, workflows, notifications, moderation tools, and institution-specific features as it moves toward real-world adoption.',
  },
];

export default function About() {
  return (
    <div>
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="section-inner" style={{ maxWidth: 780 }}>
          <span className="eyebrow-pill">About UniAssist</span>

          <h1
            className="hero-heading"
            style={{ fontSize: 'clamp(2rem, 3.6vw, 2.8rem)' }}
          >
            Making the university journey simpler, one student need at a time.
          </h1>

          <p className="hero-sub">
            UniAssist is a full-stack student support platform designed to
            make university life easier by bringing everyday campus needs
            into one centralized experience. It connects students with
            university-specific services, support workflows, and campus
            resources through a simple and accessible interface.
          </p>

          <p className="hero-sub">
            The platform combines product design, frontend development, and
            backend architecture to create a functional end-to-end
            application rather than a static interface. Students can have
            their own accounts, interact with platform features, and work
            with data that is securely stored and managed through the
            backend.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner feature-grid">
          {POINTS.map((p) => (
            <div className="card feature-card" key={p.title}>
              <div className="step-icon-wrap">
                <p.icon size={20} />
              </div>

              <h3>{p.title}</h3>

              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="section-inner" style={{ maxWidth: 780 }}>
          <div className="card">
            <span className="eyebrow-pill">The vision</span>

            <h2>
              One platform for the everyday challenges of university life.
            </h2>

            <p>
              University life involves much more than attending classes.
              Students may need to report campus issues, look for lost
              belongings, access university information, communicate with
              support systems, and keep track of different requests and
              services. UniAssist aims to bring these experiences together in
              one reliable digital space.
            </p>

            <p>
              The platform is designed with a multi-university approach, so
              each institution can have its own student community and
              university-specific data while keeping the underlying product
              structure scalable.
            </p>

            <p>
              UniAssist is currently a deployed full-stack project and
              demonstrates the complete flow from user interface and
              authentication to persistent database storage and backend
              security. It is not currently being used as an official
              platform by a real university, but its architecture is designed
              with that future use case in mind.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}