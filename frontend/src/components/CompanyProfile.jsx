import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Building, MapPin, Briefcase, CheckCircle } from 'lucide-react';

const CompanyProfile = () => {
    const { user, fetchUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        industry: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                description: user.description || '',
                industry: user.industry || '',
                location: user.location || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.put('/company/profile', formData);
            await fetchUser();
            setMessage({ type: 'success', text: 'Company profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel animate-fade-in">
            <div className="flex items-center gap-4 mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(236,72,153,0.1)', color: 'var(--secondary)' }}>
                    <Building size={32} />
                </div>
                <div>
                    <h2 style={{ marginBottom: '0.2rem' }}>Company Profile</h2>
                    <p style={{ margin: 0 }}>Update details about your organization</p>
                </div>
            </div>

            {message && (
                <div className={`alert ${message.type === 'error' ? 'alert-danger' : ''}`} style={{ backgroundColor: message.type === 'success' ? 'rgba(16,185,129,0.1)' : '', color: message.type === 'success' ? 'var(--success)' : '' }}>
                    {message.type === 'success' && <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-2">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Company Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Industry</label>
                    <div style={{ position: 'relative' }}>
                        <Briefcase size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
                        <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. Technology, Finance, Healthcare" style={{ paddingLeft: '2.5rem', width: '100%' }} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Location (City, Country)</label>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Paris, France" style={{ paddingLeft: '2.5rem', width: '100%' }} />
                    </div>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Company Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell students about your company, mission, and culture..."
                        rows="5"
                        style={{ width: '100%', resize: 'vertical' }}
                    ></textarea>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyProfile;
