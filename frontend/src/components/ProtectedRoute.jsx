import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their specific dashboard if they try to access an unauthorized route
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return children;
};

export default ProtectedRoute;
