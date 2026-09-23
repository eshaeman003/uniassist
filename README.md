# UniAssist

UniAssist is a campus safety and student-services platform. Students can submit incident reports and post lost & found items for their university; administrators triage, update, and resolve them from a dedicated dashboard. Each university's data is isolated from every other university's.

**Live demo:** _add your Vercel URL here after deploying_
**Status:** Prototype / internship project — not production-hardened.

---

## Features

**Students**
- Register and sign in under their own university
- Submit incident reports (category, location, priority, anonymous option)
- Track report status and see admin updates on a live timeline
- Post and browse Lost & Found items
- View university announcements

**Administrators**
- Register a new university (creates the institution + first admin account)
- View and triage all reports for their university
- Update report status, priority, department, and leave public/internal notes
- Every status change is logged to a timeline the student can see
- Manage Lost & Found posts (resolve, reopen, remove)
- Post announcements
- Basic analytics overview (report volume, status breakdown)

**Platform**
- Multi-tenant by design: every record is scoped to a `university_id`
- Row Level Security (RLS) enforced at the database level, not just in the UI
- Realtime updates: students see admin changes without refreshing

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React (Vite) |
| Routing | React Router |
| Backend / DB | [Supabase](https://supabase.com) — Postgres, Auth, Realtime, Row Level Security |
| Icons | lucide-react |
| Hosting | Vercel |

Supabase is not a separate service you run — it's a hosted Postgres database plus an auth/realtime layer. The "backend" of this app is the Supabase project (tables + RLS policies), accessed directly from the React client through `@supabase/supabase-js`. There is no custom Node/Express server.

---

## Project structure

```
uniassist/
├── public/
├── src/
│   ├── assets/
│   ├── components/         # Reusable UI: Button, Input, StatusBadge, ReportTimeline, etc.
│   ├── context/             # AuthContext, ToastContext
│   ├── data/                 # Static reference data (universities list, mock fallback data)
│   ├── layouts/             # AppLayout (authenticated shell), PublicLayout
│   ├── lib/
│   │   └── supabaseClient.js # Supabase client instance
│   ├── pages/
│   │   ├── public/           # Landing, Login, RegisterStudent, RegisterUniversity, About, HowItWorks
│   │   ├── student/          # Dashboard, ReportsList, ReportNew, ReportDetails, LostFound, Announcements, Profile, Settings
│   │   └── admin/            # AdminDashboard, AdminReports, AdminReportDetails, AdminLostFound,
│   │                          # AdminLostFoundDetails, AdminAnnouncements, AdminStudents, AdminAnalytics, AdminSettings
│   ├── services/             # One file per domain: authService, reportService, lostFoundService,
│   │                          # universityService, announcementService — all Supabase queries live here
│   ├── styles/
│   ├── utils/
│   ├── App.jsx                # Route definitions
│   └── main.jsx
├── .env                        # Local only — never committed
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Data model (Supabase)

| Table | Purpose |
|---|---|
| `universities` | One row per registered institution |
| `profiles` | User accounts (student / admin), linked to `auth.users` and to a `university_id` |
| `reports` | Incident reports, scoped to `university_id` and `user_id` |
| `report_timeline` | Status-change log for a report, shown to both student and admin |
| `lost_found_items` | Lost & found posts, scoped to `university_id` |

**Row Level Security** is enabled on every table. In short:
- Anyone (even signed out) can read the `universities` list and insert a new one (registration flow).
- A student can read/insert their own `reports` and `lost_found_items`.
- An admin can read/update all `reports` and `lost_found_items` belonging to their own `university_id` only — never another university's data.
- Only admins can insert into `report_timeline`.

The exact policy definitions live in your Supabase project (SQL Editor → Policies). If you're setting this project up from scratch, recreate the tables and policies before running the app — the app assumes they already exist and does not create them.

---

## Getting started

### Prerequisites
- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) project
- A GitHub account (for deployment via Vercel)

### 1. Clone and install

```bash
git clone https://github.com/eshaeman003/uniassist.git
cd uniassist
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your own Supabase project's credentials (found in Supabase → Project Settings → API):

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

`.env` is git-ignored and must never be committed. The anon key is safe to expose in a client app **only because** RLS policies are enforced on every table — without RLS, do not ship this.

### 3. Run locally

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

---

## Deployment (Vercel)

1. Push the repo to GitHub (already done for this project).
2. In Vercel: **New Project → Import** your GitHub repo.
3. Framework preset: **Vite** (Vercel usually auto-detects this).
4. Build command: `npm run build` · Output directory: `dist` (Vercel defaults are correct for Vite).
5. Under **Environment Variables**, add the same two keys as your local `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy. Every push to `main` will auto-redeploy.

In Supabase → Authentication → URL Configuration, add your Vercel domain to the allowed redirect URLs once you have it, so auth flows work in production and not just on localhost.

---


## Author

Esha Eman — BS(SE), CUST University
Built as part of a Web Development Internship at Factory Web Services.
