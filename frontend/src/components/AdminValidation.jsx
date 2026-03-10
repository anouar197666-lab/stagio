import { useState, useEffect } from 'react';
import api from '../utils/api';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

const AdminValidation = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingOffers = async () => {
        try {
            const res = await api.get('/admin/offers/pending');
            setOffers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOffers();
    }, []);

    const handleValidation = async (id, status) => {
        const action = status === 'validated' ? 'validate' : 'reject';
        if (window.confirm(`Are you sure you want to ${action} this offer?`)) {
            try {
                await api.put(`/admin/offers/${id}/status`, { status });
                fetchPendingOffers();
            } catch (err) {
                alert(err.response?.data?.error || `Failed to ${action} offer`);
            }
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div className="animate-fade-in">
            <h2 className="mb-4">Pending Internship Validations</h2>

            {offers.length === 0 ? (
                <div className="glass-panel text-center">
                    <CheckCircle className="text-success mb-2 inline-block mx-auto" size={48} />
                    <h3>All Caught Up!</h3>
                    <p>There are no pending internship offers to validate at this time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2">
                    {offers.map((offer) => (
                        <div key={offer._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{offer.title}</h3>
                                <span className="badge badge-warning">Pending Review</span>
                            </div>

                            <div className="mb-3">
                                <span className="font-weight-600 block">{offer.company.name}</span>
                                <span className="text-muted block mt-1" style={{ fontSize: '0.9rem' }}>{offer.company.industry} • {offer.location}</span>
                            </div>

                            <div className="mb-4" style={{ flex: 1 }}>
                                <h4 className="text-muted uppercase mb-1" style={{ fontSize: '0.75rem' }}>Description</h4>
                                <p style={{ fontSize: '0.95rem' }}>{offer.description}</p>
                            </div>

                            <div className="flex gap-2 mt-auto pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleValidation(offer._id, 'rejected')}>
                                    <XCircle size={16} /> Reject
                                </button>
                                <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--success)' }} onClick={() => handleValidation(offer._id, 'validated')}>
                                    <CheckCircle size={16} /> Validate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminValidation;
