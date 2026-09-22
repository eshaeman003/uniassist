# UniAssist

**A safer, smarter campus for everyone.**

> Prototype build — internship project. This is a frontend prototype running on mock/local data. No real university is currently using UniAssist, and no data leaves your browser.

## Overview

UniAssist is a multi-university campus support platform. Students register under their own university and get access to anonymous issue reporting, report tracking, Lost & Found, and campus announcements. Universities get an administrator dashboard to review and act on reports, manage Lost & Found and announcements, and view analytics — with every institution's data kept logically separate.

## Problem

Campus problems — broken facilities, unsafe areas, harassment concerns, Wi-Fi outages — often go unreported because students don't have a safe, simple, trackable way to raise them. Lost items rarely make it back to their owners without a shared place to post them.

## Solution

UniAssist gives every student one app to:

- Report a campus problem, anonymously if they choose, and follow it on a live status timeline
- Post or search Lost & Found items
- Read campus announcements
- See everything from a single, university-branded dashboard

...and gives every university one dashboard to:

- Triage and update reports (status, priority, assigned department, internal notes, public updates)
- Moderate Lost & Found posts
- Publish and manage announcements
- Manage a student directory
- View analytics: status distribution, category breakdown, and a resolution trend

## Features

- **Anonymous issue reporting** — the hero feature. Students can submit a report without their identity being shown to university staff in the interface. This prototype does **not** claim cryptographic or database-level anonymity yet — see [Future Supabase Integration](#future-supabase-integration).
- **Live status sync** — when an admin updates a report's status, the student sees the change immediately (same-tab, via a small pub/sub layer over localStorage). Try it: submit a report as the demo student, then update its status as the demo admin, then switch back.
- **Multi-university architecture** — every user, report, Lost & Found post, and announcement carries a `universityId`, and every query is scoped to it.
- **Full responsive layout** — down to 390px, with a mobile drawer navigation, stacking cards, and horizontally-scrollable tables.
- **Empty, loading, error, and success states** throughout, plus toasts, confirm dialogs, and accessible focus states.

## Tech Stack

- React 19 + Vite
- React Router (`react-router-dom`)
- `lucide-react` for icons
- `recharts` for charts (status bars, category pie/bar, resolution trend line)
- Plain CSS with a design-token system (no CSS framework) — white + lilac palette, Inter + Fraunces
- Data persistence: browser `localStorage`, behind a service layer (see below)

No backend is used yet. Everything runs client-side.

## Project Structure

```
src/
  assets/
  components/       Reusable UI: Button, Input, Modal, StatusBadge, ReportCard, ReportTimeline, etc.
  context/           AuthContext, ToastContext
  data/              Static/mock data: universities.js, mockData.js (seed reports, users, posts, announcements)
  layouts/           PublicLayout, AppLayout (shared student/admin shell)
  pages/
    public/          Landing, HowItWorks, About, Login, RegisterStudent, RegisterUniversity
    student/         Dashboard, ReportNew, ReportsList, ReportDetails, LostFound(+New/Details), Announcements, Profile, Settings
    admin/           AdminDashboard, AdminReports(+Details), AdminLostFound, AdminAnnouncements, AdminStudents, AdminAnalytics, AdminSettings
  services/          authService, reportService, lostFoundService, announcementService, universityService, storage.js, seed.js
  styles/            components.css, layout.css, public.css
  utils/             format.js (dates, greetings, initials)
```

The **service layer** (`src/services/`) is the only place that talks to `localStorage`. Components never call `localStorage` directly. When a real backend is connected, only the internals of these service files need to change — their function signatures are designed to map onto Supabase queries.

## How to Run

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Demo Accounts

No real authentication is performed — passwords are not verified for demo purposes.

| Role    | Email                       | Notes                                   |
|---------|------------------------------|------------------------------------------|
| Student | `esha.demo@cust.edu.pk`      | Or use **Continue as Demo Student** on the login page |
| Admin   | `admin.demo@cust.edu.pk`     | Or use **Continue as Demo Admin** on the login page   |

Both accounts belong to **Capital University of Science & Technology (CUST)**, the default demo university, and come pre-loaded with sample reports, Lost & Found posts, announcements, and students.

You can also register a brand-new student (choose any of the five demo universities and use a matching email domain) or register a brand-new university from the public site.

## Future Supabase Integration

This prototype is intentionally structured so a real backend can be dropped in without a rewrite:

- **Supabase Auth** — replace `authService.js`'s mock login/register functions with `supabase.auth.signUp` / `signInWithPassword` / `signOut`.
- **PostgreSQL** — replace the localStorage-backed collections (`reports`, `lostFound`, `announcements`, `students`, `users`) with Supabase tables of the same shape.
- **Row Level Security** — enforce that admins only see reports where `university_id` matches their own, and that an anonymous report's `user_id` is never exposed to admin-facing queries at the database level (not just hidden in the UI, as it is today).
- **Storage** — replace the data-URL image previews in `FileUpload.jsx` with Supabase Storage uploads.
- **Role-based access** — formalize `student` / `admin` roles as a Postgres enum or claims on the JWT.
- **Notifications** — the toggle rows on the student Settings page are currently inert; wire them to real notification delivery once a backend exists.
- **Edge Functions** — for things like sending real verification emails on registration (currently simulated with a "Demo verification successful" message).

## Future Improvements

- Code-split routes to reduce the initial JS bundle size
- Replace the manual timeline/status logic with server-driven state once Supabase is connected
- Add pagination to admin tables for larger datasets
- Add a proper image-upload pipeline (compression, multiple photos per Lost & Found post)
- Internationalization for non-English-speaking campuses

## Author

Built as a 6-week internship project prototype demonstrating UI/UX design, frontend development, product thinking, and application architecture.
