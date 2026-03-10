import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Mail, Check, X, Eye } from 'lucide-react';

const CompanyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingApp, setViewingApp] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/company/applications');
            setApplications(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (window.confirm(`Are you sure you want to ${status} this application?`)) {
            try {
                await api.put(`/company/applications/${id}`, { status });
                if (viewingApp && viewingApp._id === id) {
                    setViewingApp({ ...viewingApp, status });
                }
                fetchApplications();
            } catch (err) {
                alert(err.response?.data?.error || `Failed to ${status} application`);
            }
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    if (viewingApp) {
        return (
            <div className="glass-panel animate-fade-in">
                <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                        <h2>Application Review</h2>
                        <p style={{ margin: 0 }}>Reviewing application from {viewingApp.student.name} for {viewingApp.offer.title}</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setViewingApp(null)}>Back to List</button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                        <h4 className="mb-2 text-muted uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Student Information</h4>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2"><Mail size={16} className="text-muted" /> {viewingApp.student.email}</div>
                            {viewingApp.student.cvLink && (
                                <a href={viewingApp.student.cvLink} target="_blank" rel="noopener noreferrer" className="text-primary font-weight-600" style={{ display: 'inline-block', marginTop: '0.5rem' }}>View Digital CV</a>
                            )}
                            {viewingApp.student.github && (
                                <a href={viewingApp.student.github} target="_blank" rel="noopener noreferrer" className="text-primary font-weight-600" style={{ display: 'inline-block' }}>View GitHub Profile</a>
                            )}
                        </div>
                    </div>

                    <div className="p-4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                        <h4 className="mb-2 text-muted uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {viewingApp.student.skills && viewingApp.student.skills.length > 0 ? (
                                viewingApp.student.skills.map(skill => <span key={skill} className="badge badge-primary">{skill}</span>)
                            ) : (
                                <span className="text-muted">No skills listed.</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <h4 className="mb-2 text-muted uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Cover Letter</h4>
                    <div className="p-4 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', minHeight: '100px', whiteSpace: 'pre-line' }}>
                        {viewingApp.coverLetter || <span className="text-muted">No cover letter provided.</span>}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div>
                        Current Status: <strong className={`text-${viewingApp.status === 'accepted' ? 'success' : viewingApp.status === 'rejected' ? 'danger' : 'warning'} uppercase`} style={{ fontSize: '0.9rem' }}>{viewingApp.status}</strong>
                    </div>
                    {viewingApp.status === 'pending' && (
                        <div className="flex gap-2">
                            <button className="btn btn-danger" onClick={() => handleStatusUpdate(viewingApp._id, 'rejected')}>
                                <X size={16} /> Reject
                            </button>
                            <button className="btn btn-primary" onClick={() => handleStatusUpdate(viewingApp._id, 'accepted')} style={{ backgroundColor: 'var(--success)' }}>
                                <Check size={16} /> Accept
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h2 className="mb-4">Review Applicants</h2>

            {applications.length === 0 ? (
                <div className="glass-panel text-center">
                    <p>You haven't received any applications yet.</p>
                </div>
            ) : (
                <div className="table-container glass-panel p-0">
                    <table>
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Offer</th>
                                <th>Applied On</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id}>
                                    <td>
                                        <div className="font-weight-600">{app.student.name}</div>
                                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{app.student.email}</div>
                                    </td>
                                    <td>{app.offer.title}</td>
                                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge badge-${app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => setViewingApp(app)}>
                                            <Eye size={16} className="mr-1" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CompanyApplications;
