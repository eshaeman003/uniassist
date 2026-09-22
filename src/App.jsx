import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';

import Landing from './pages/public/Landing';
import HowItWorks from './pages/public/HowItWorks';
import About from './pages/public/About';
import Login from './pages/public/Login';
import RegisterStudent from './pages/public/RegisterStudent';
import RegisterUniversity from './pages/public/RegisterUniversity';

import Dashboard from './pages/student/Dashboard';
import ReportNew from './pages/student/ReportNew';
import ReportsList from './pages/student/ReportsList';
import ReportDetails from './pages/student/ReportDetails';
import LostFound from './pages/student/LostFound';
import LostFoundNew from './pages/student/LostFoundNew';
import LostFoundItemDetails from './pages/student/LostFoundItemDetails';
import Announcements from './pages/student/Announcements';
import Profile from './pages/student/Profile';
import Settings from './pages/student/Settings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminReportDetails from './pages/admin/AdminReportDetails';
import AdminLostFound from './pages/admin/AdminLostFound';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminStudents from './pages/admin/AdminStudents';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/universities" element={<Navigate to="/register/university" replace />} />
              <Route path="/register/student" element={<RegisterStudent />} />
              <Route path="/register/university" element={<RegisterUniversity />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Student application */}
            <Route
              path="/app"
              element={
                <ProtectedRoute role="student">
                  <AppLayout role="student" />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<ReportsList />} />
              <Route path="reports/new" element={<ReportNew />} />
              <Route path="reports/:id" element={<ReportDetails />} />
              <Route path="lost-found" element={<LostFound />} />
              <Route path="lost-found/new" element={<LostFoundNew />} />
              <Route path="lost-found/:id" element={<LostFoundItemDetails />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* University administrator application */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AppLayout role="admin" />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="reports/:id" element={<AdminReportDetails />} />
              <Route path="lost-found" element={<AdminLostFound />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
