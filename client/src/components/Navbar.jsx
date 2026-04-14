import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          ⚡ EventHub
        </Link>
        {user && (
          <div className="navbar-actions">
            <span className="navbar-user">
              {user.name}
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
