import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function PublicLayout() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-bold">ExamPro</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/about" className="hover:text-brand-600">About</Link>
            <Link to="/contact" className="hover:text-brand-600">Contact</Link>
            <button onClick={toggle} className="btn-ghost">{theme === 'dark' ? '☀️' : '🌙'}</button>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary">Get started</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10"><Outlet /></main>
    </div>
  );
}
