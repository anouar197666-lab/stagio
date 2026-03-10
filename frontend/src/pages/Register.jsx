import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const role = await register(formData);
            navigate(`/${role}/dashboard`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container mt-4 mb-4">
            <div className="auth-card glass-panel animate-fade-in" style={{ maxWidth: '500px' }}>
                <h2>Join Stag.io</h2>
                <p>Create an account to find or offer internships</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label>Registration Type</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={formData.role === 'student'}
                                    onChange={handleChange}
                                />
                                Student
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="company"
                                    checked={formData.role === 'company'}
                                    onChange={handleChange}
                                />
                                Company
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{formData.role === 'student' ? 'Full Name' : 'Company Name'}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={formData.role === 'student' ? 'Enter your name' : 'Tech Corp Inc.'}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            minLength="6"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span> : <><UserPlus size={18} /> Create Account</>}
                    </button>
                </form>

                <p className="mt-4">
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
