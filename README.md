# UniAssist

UniAssist is a **full-stack campus safety and student-services web application**. Students can submit incident reports and post Lost & Found items for their university, while administrators can triage, update, and resolve reports through a dedicated dashboard. The platform supports multiple universities with isolated data for each institution.

**Live Demo:** https://uniassist-6ave58ybm-ngo-connect.vercel.app/

**Project Type:** Full-Stack Web Application

---

## Features

### Students

* Register and sign in under their own university
* Submit incident reports with category, location, priority, and anonymous options
* Track report status and view admin updates through a live timeline
* Post and browse Lost & Found items
* View university announcements

### Administrators

* Register a new university and create the first admin account
* View and triage reports belonging to their university
* Update report status, priority, department, and notes
* Maintain a timeline of report status changes
* Manage Lost & Found posts
* Post university announcements
* View basic analytics including report volume and status breakdown

### Platform

* Multi-tenant architecture with every record scoped to a `university_id`
* Row Level Security (RLS) enforced at the database level
* Authentication and role-based access control
* Realtime updates without requiring page refreshes
* Separate student and administrator workflows

---

## Tech Stack

| Layer              | Technology               |
| ------------------ | ------------------------ |
| Frontend           | React + Vite             |
| Routing            | React Router             |
| Backend & Database | Supabase                 |
| Database           | PostgreSQL               |
| Authentication     | Supabase Auth            |
| Security           | Row Level Security (RLS) |
| Realtime           | Supabase Realtime        |
| Icons              | Lucide React             |
| Hosting            | Vercel                   |

Supabase provides the application's backend infrastructure through PostgreSQL, authentication, realtime functionality, and Row Level Security. The React client communicates with Supabase through `@supabase/supabase-js`. The application does not use a separate Node.js/Express server.

---

## Project Structure

```text
uniassist/
├── public/
├── src/
│   ├── assets/
│   ├── components/          # Reusable UI components
│   ├── context/             # Authentication and application contexts
│   ├── data/                # Reference and fallback data
│   ├── layouts/             # Application layouts
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── pages/
│   │   ├── public/           # Landing, authentication, About, How It Works
│   │   ├── student/          # Student dashboard and services
│   │   └── admin/            # Administrative dashboard and management
│   ├── services/             # Supabase data and business logic
│   ├── styles/
│   ├── utils/
│   ├── App.jsx               # Route definitions
│   └── main.jsx
├── .env                      # Local environment variables
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Data Model (Supabase)

| Table              | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `universities`     | Stores registered institutions                 |
| `profiles`         | Stores student and administrator profiles      |
| `reports`          | Stores incident reports by university and user |
| `report_timeline`  | Stores report status-change history            |
| `lost_found_items` | Stores Lost & Found posts by university        |

### Row Level Security

Row Level Security is enabled across the application's database tables to ensure that university data remains isolated.

* Students can access their own reports and Lost & Found items.
* Administrators can manage reports and Lost & Found items belonging to their own university.
* Users cannot access another university's protected data.
* Administrative report updates are recorded in the report timeline.

The exact RLS policies are configured in the Supabase project.

---

## Getting Started

### Prerequisites

* Node.js 18+ and npm
* A Supabase project
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/eshaeman003/uniassist.git
cd uniassist
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Locally

```bash
npm run dev
```

The application will run at:

```text
http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## Deployment

UniAssist can be deployed through Vercel.

1. Import the GitHub repository into Vercel.
2. Select **Vite** as the framework preset.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Add the required Supabase environment variables:

   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
6. Deploy the application.

After deployment, configure the Vercel domain in Supabase Authentication settings so authentication flows work correctly in production.

---

## Author

**Esha Eman**
BS Software Engineering — CUST University

UniAssist was developed as a **full-stack web application during a Web Development Internship at Factory Web Services**, combining frontend development, authentication, database management, role-based access control, Row Level Security, and realtime functionality.
