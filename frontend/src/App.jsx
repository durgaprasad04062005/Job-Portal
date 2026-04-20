import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentApplications from './pages/student/StudentApplications';
import SavedJobs from './pages/student/SavedJobs';

// Employer pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import ViewApplicants from './pages/employer/ViewApplicants';

// Admin pages — private, ADMIN role only
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminJobs from './pages/admin/AdminJobs';

// Shared pages
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import NotificationsPage from './pages/NotificationsPage';

import Spinner from './components/ui/Spinner';

// ─────────────────────────────────────────────
// Route guards
// ─────────────────────────────────────────────

/**
 * AdminRoute — only ADMIN role can access.
 * Anyone else (including unauthenticated) is redirected to /login.
 */
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (!user) return <Navigate to="/login" state={{ from: 'admin' }} replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

/**
 * AuthRoute — must be logged in, but any role is fine.
 * Used for dashboards, profile, notifications, etc.
 * Optionally restrict to specific roles via the `roles` prop.
 */
function AuthRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    // Wrong role — send to their own dashboard
    return <Navigate to={dashboardPath(user.role)} replace />;
  }
  return children;
}

/**
 * GuestRoute — redirects already-logged-in users away from login/register.
 * Sends them to their dashboard so they don't see the auth pages again.
 */
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;
  return children;
}

function dashboardPath(role) {
  if (role === 'STUDENT')  return '/student/dashboard';
  if (role === 'EMPLOYER') return '/employer/dashboard';
  if (role === 'ADMIN')    return '/admin/dashboard';
  return '/';
}

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
            success: { style: { background: '#10b981' } },
            error:   { style: { background: '#ef4444' } },
          }}
        />
        <Routes>

          {/* ── Fully public — no login required ── */}
          <Route path="/"               element={<LandingPage />} />
          <Route path="/jobs"           element={<JobListings />} />
          <Route path="/jobs/:id"       element={<JobDetails />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />

          {/* ── Auth pages — redirect if already logged in ── */}
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* ── Student — must be logged in as STUDENT ── */}
          <Route path="/student/dashboard"   element={<AuthRoute roles={['STUDENT']}><StudentDashboard /></AuthRoute>} />
          <Route path="/student/profile"     element={<AuthRoute roles={['STUDENT']}><StudentProfile /></AuthRoute>} />
          <Route path="/student/applications" element={<AuthRoute roles={['STUDENT']}><StudentApplications /></AuthRoute>} />
          <Route path="/student/saved-jobs"  element={<AuthRoute roles={['STUDENT']}><SavedJobs /></AuthRoute>} />

          {/* ── Employer — must be logged in as EMPLOYER ── */}
          <Route path="/employer/dashboard"            element={<AuthRoute roles={['EMPLOYER']}><EmployerDashboard /></AuthRoute>} />
          <Route path="/employer/post-job"             element={<AuthRoute roles={['EMPLOYER']}><PostJob /></AuthRoute>} />
          <Route path="/employer/jobs"                 element={<AuthRoute roles={['EMPLOYER']}><ManageJobs /></AuthRoute>} />
          <Route path="/employer/jobs/:jobId/applicants" element={<AuthRoute roles={['EMPLOYER']}><ViewApplicants /></AuthRoute>} />

          {/* ── Shared authenticated — any logged-in role ── */}
          <Route path="/notifications" element={<AuthRoute><NotificationsPage /></AuthRoute>} />
          <Route path="/profile/me"    element={<AuthRoute><StudentProfile /></AuthRoute>} />

          {/* ── Admin — PRIVATE, ADMIN role only ── */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users"     element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/jobs"      element={<AdminRoute><AdminJobs /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
