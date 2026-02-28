import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1 rounded transition-colors ${
      isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'
    }`;

  return (
    <nav className="bg-indigo-600 text-white shadow">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">Vanness</span>
          <div className="flex gap-1 ml-4">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/assignments" className={linkClass}>
              Assignments
            </NavLink>
            {user?.role === 'instructor' && (
              <NavLink to="/students" className={linkClass}>
                Students
              </NavLink>
            )}
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-indigo-200">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm px-3 py-1 bg-indigo-800 rounded hover:bg-indigo-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
