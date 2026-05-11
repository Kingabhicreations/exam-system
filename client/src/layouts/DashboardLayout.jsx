import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../context/AuthContext.jsx';

import {
  useTheme,
} from '../context/ThemeContext.jsx';

import {

  Trophy,

  LayoutDashboard,

  BookOpen,

  FileText,

  User,

  LogOut,

  Moon,

  Sun,

  Shield,

  BarChart3,

  Users,

  HelpCircle,

  Brain,

  Monitor,

} from 'lucide-react';

// =========================
// STUDENT NAV
// =========================

const studentNav = [

  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },

  {
    to: '/exams',
    label: 'Exams',
    icon: BookOpen,
  },

  {
    to: '/results',
    label: 'Results',
    icon: FileText,
  },

  {
    to: '/leaderboard',
    label: 'Leaderboard',
    icon: Trophy,
  },

  {
    to: '/profile',
    label: 'Profile',
    icon: User,
  },
];

// =========================
// ADMIN NAV
// =========================

const adminNav = [

  {
    to: '/admin',
    label: 'Overview',
    icon: LayoutDashboard,
  },

  {
    to: '/admin/exams',
    label: 'Exams',
    icon: BookOpen,
  },

  {
    to: '/admin/questions',
    label: 'Questions',
    icon: HelpCircle,
  },

  {
    to: '/admin/students',
    label: 'Students',
    icon: Users,
  },

  {
    to: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
  },

  {
    to: '/admin/ai-generator',
    label: 'AI Generator',
    icon: Brain,
  },

  {
    to: '/admin/live-monitoring',
    label: 'Live Monitoring',
    icon: Monitor,
  },
];

// =========================
// DASHBOARD LAYOUT
// =========================

export default function DashboardLayout({
  admin = false,
}) {

  const {
    user,
    logout,
  } = useAuth();

  const {
    theme,
    toggle,
  } = useTheme();

  const navigate =
    useNavigate();

  const items =
    admin
      ? adminNav
      : studentNav;

  return (
    <div className="grid min-h-screen bg-black text-white md:grid-cols-[280px_1fr]">

      {/* SIDEBAR */}

      <aside className="hidden border-r border-white/10 bg-white/5 p-6 backdrop-blur md:flex md:flex-col">

        {/* LOGO */}

        <div className="mb-10">

          <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-4xl font-black text-transparent">

            ExamPro

          </h1>

          {admin && (

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-sm text-red-400">

              <Shield size={14} />

              Admin Panel

            </div>
          )}

        </div>

        {/* NAVIGATION */}

        <nav className="flex flex-col gap-3">

          {items.map((item) => {

            const Icon =
              item.icon;

            return (

              <NavLink
                key={item.to}
                to={item.to}
                end

                className={({
                  isActive,
                }) =>
                  `flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'hover:bg-white/10'
                  }`
                }
              >

                <Icon size={20} />

                {item.label}

              </NavLink>
            );
          })}

        </nav>

        {/* USER SECTION */}

        <div className="mt-auto">

          {/* USER CARD */}

          <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">

            <p className="text-sm opacity-60">

              Logged in as

            </p>

            <h2 className="mt-2 text-lg font-bold">

              {user?.name}

            </h2>

            <p className="mt-1 text-xs opacity-50">

              {user?.email}

            </p>

          </div>

          {/* THEME BUTTON */}

          <button
            onClick={toggle}
            className="mb-3 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-3 transition-all hover:bg-white/10"
          >

            {theme === 'dark'
              ? (
                <>
                  <Sun size={18} />
                  Light Mode
                </>
              )
              : (
                <>
                  <Moon size={18} />
                  Dark Mode
                </>
              )}

          </button>

          {/* LOGOUT */}

          <button
            onClick={() => {

              logout();

              navigate('/');
            }}

            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 text-red-400 transition-all hover:bg-red-500/20"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="min-h-screen p-6 md:p-10">

        <Outlet />

      </main>

    </div>
  );
}