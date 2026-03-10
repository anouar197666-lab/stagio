import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Briefcase, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        return `/${user.role}/dashboard`;
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">Stag.io</Link>

            <div className="nav-links">
                {/* Simple Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem' }}
                    aria-label="Toggle Theme"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                {user ? (
                    <>
                        <Link to={getDashboardLink()} className="nav-link">
                            <LayoutDashboard size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                            Dashboard
                        </Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                            <LogOut size={16} style={{ display: 'inline', marginRight: '4px' }} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
