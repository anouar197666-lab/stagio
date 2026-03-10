import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, Github, FileText, CheckCircle } from 'lucide-react';

const StudentProfile = () => {
    const { user, fetchUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        cvLink: '',
        github: '',
        skills: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                cvLink: user.cvLink || '',
                github: user.github || '',
                skills: user.skills ? user.skills.join(', ') : ''
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
            const dataToSubmit = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };

            await api.put('/student/profile', dataToSubmit);
            await fetchUser();
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel animate-fade-in">
            <div className="flex items-center gap-4 mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                    <User size={32} />
                </div>
                <div>
                    <h2 style={{ marginBottom: '0.2rem' }}>My Profile</h2>
                    <p style={{ margin: 0 }}>Update your digital CV and skills</p>
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
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Digital CV Link (Drive, Dropbox, etc.)</label>
                    <div style={{ position: 'relative' }}>
                        <FileText size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
                        <input type="url" name="cvLink" value={formData.cvLink} onChange={handleChange} placeholder="https://..." style={{ paddingLeft: '2.5rem', width: '100%' }} />
                    </div>
                </div>

                <div className="form-group">
                    <label>GitHub Profile</label>
                    <div style={{ position: 'relative' }}>
                        <Github size={18} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--text-muted)' }} />
                        <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." style={{ paddingLeft: '2.5rem', width: '100%' }} />
                    </div>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Skills (Comma separated)</label>
                    <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Node.js, Python, MongoDB"
                        rows="3"
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

export default StudentProfile;
