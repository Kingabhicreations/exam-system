import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { useAuth } from './context/AuthContext.jsx';

// =========================
// LAYOUTS
// =========================

import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import AIGenerator from './pages/admin/AIGenerator.jsx';

// =========================
// PUBLIC PAGES
// =========================

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';

// =========================
// STUDENT PAGES
// =========================

import StudentDashboard from './pages/student/Dashboard.jsx';
import StudentExams from './pages/student/Exams.jsx';
import StudentResults from './pages/student/Results.jsx';
import Leaderboard from './pages/student/Leaderboard.jsx';

// =========================
// EXAM PAGE
// =========================

import ExamPage from './pages/ExamPage.jsx';

// =========================
// PROFILE
// =========================

import Profile from './pages/Profile.jsx';

// =========================
// ADMIN PAGES
// =========================

import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminExams from './pages/admin/Exams.jsx';
import AdminQuestions from './pages/admin/Questions.jsx';
import AdminStudents from './pages/admin/Students.jsx';
import AdminAnalytics from './pages/admin/Analytics.jsx';

import LiveMonitoring from './pages/admin/LiveMonitoring.jsx';

// =========================
// PROTECTED ROUTE
// =========================

function Protected({
  children,
  role,
}) {

  const {
    user,
    loading,
  } = useAuth();

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="grid h-screen place-items-center">

        <div className="skeleton h-8 w-40" />

      </div>
    );
  }

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =========================
  // ROLE PROTECTION
  // =========================

  if (
    role &&
    user.role !== role
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

// =========================
// APP
// =========================

export default function App() {

  return (
    <Routes>

      {/* ========================= */}
      {/* PUBLIC ROUTES */}
      {/* ========================= */}

      <Route
        element={<PublicLayout />}
      >

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

      </Route>

      {/* ========================= */}
      {/* STUDENT ROUTES */}
      {/* ========================= */}

      <Route
        element={
          <Protected>
            <DashboardLayout />
          </Protected>
        }
      >

        <Route
          path="/dashboard"
          element={
            <StudentDashboard />
          }
        />

        <Route
          path="/exams"
          element={
            <StudentExams />
          }
        />

        {/* ========================= */}
        {/* EXAM PAGE */}
        {/* ========================= */}

        <Route
          path="/exam/:id"
          element={<ExamPage />}
        />

        {/* ========================= */}
        {/* RESULTS */}
        {/* ========================= */}

        <Route
          path="/results"
          element={
            <StudentResults />
          }
        />

        {/* ========================= */}
        {/* LEADERBOARD */}
        {/* ========================= */}

        <Route
          path="/leaderboard"
          element={
            <Leaderboard />
          }
        />

        {/* ========================= */}
        {/* PROFILE */}
        {/* ========================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>

      {/* ========================= */}
      {/* ADMIN ROUTES */}
      {/* ========================= */}

      <Route
        element={
          <Protected role="admin">

            <DashboardLayout admin />

          </Protected>
        }
      >

        <Route
          path="/admin"
          element={
            <AdminDashboard />
          }
        />

        <Route
          path="/admin/exams"
          element={
            <AdminExams />
          }
        />

        <Route
          path="/admin/questions"
          element={
            <AdminQuestions />
          }
        />

        <Route
          path="/admin/students"
          element={
            <AdminStudents />
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <AdminAnalytics />
          }
        />

        <Route
  path="/admin/ai-generator"
  element={<AIGenerator />}
/>

<Route
  path="/admin/live-monitoring"
  element={<LiveMonitoring />}
/>

<Route
  path="/admin/live-monitoring"
  element={<LiveMonitoring />}
/>

      </Route>

      {/* ========================= */}
      {/* 404 */}
      {/* ========================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}