import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Edit2, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

const CompanyOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentOffer, setCurrentOffer] = useState({
        title: '',
        description: '',
        requirements: '',
        location: ''
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await api.get('/company/offers');
            setOffers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setCurrentOffer({ ...currentOffer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...currentOffer,
                requirements: currentOffer.requirements.split(',').map(r => r.trim()).filter(r => r)
            };

            if (currentOffer._id) {
                await api.put(`/company/offers/${currentOffer._id}`, dataToSubmit);
            } else {
                await api.post('/company/offers', dataToSubmit);
            }

            setIsEditing(false);
            setCurrentOffer({ title: '', description: '', requirements: '', location: '' });
            fetchOffers();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to save offer');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                await api.delete(`/company/offers/${id}`);
                fetchOffers();
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete offer');
            }
        }
    };

    const openEdit = (offer) => {
        setCurrentOffer({
            ...offer,
            requirements: offer.requirements.join(', ')
        });
        setIsEditing(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'validated': return <span className="badge badge-success flex items-center gap-1"><CheckCircle size={12} /> Validated</span>;
            case 'rejected': return <span className="badge badge-danger flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
            default: return <span className="badge badge-warning flex items-center gap-1"><Clock size={12} /> Pending</span>;
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    if (isEditing) {
        return (
            <div className="glass-panel animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2>{currentOffer._id ? 'Edit Offer' : 'Create New Offer'}</h2>
                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-2">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Internship Title</label>
                        <input type="text" name="title" value={currentOffer.title} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Location (City, Remote, etc.)</label>
                        <input type="text" name="location" value={currentOffer.location} onChange={handleChange} required />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Requirements/Skills (Comma separated)</label>
                        <input type="text" name="requirements" value={currentOffer.requirements} onChange={handleChange} placeholder="React, Node.js, English" />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Full Description</label>
                        <textarea
                            name="description"
                            value={currentOffer.description}
                            onChange={handleChange}
                            rows="6"
                            style={{ width: '100%', resize: 'vertical' }}
                            required
                        ></textarea>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary">Save Offer</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2>Manage Offers</h2>
                <button className="btn btn-primary" onClick={() => { setCurrentOffer({ title: '', description: '', requirements: '', location: '' }); setIsEditing(true); }}>
                    <Plus size={18} /> Create Offer
                </button>
            </div>

            {offers.length === 0 ? (
                <div className="glass-panel text-center">
                    <p>You haven't posted any internship offers yet.</p>
                </div>
            ) : (
                <div className="table-container glass-panel p-0">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Posted Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((offer) => (
                                <tr key={offer._id}>
                                    <td className="font-weight-600">{offer.title}</td>
                                    <td>{offer.location}</td>
                                    <td>{new Date(offer.createdAt).toLocaleDateString()}</td>
                                    <td>{getStatusBadge(offer.status)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="flex justify-end gap-2">
                                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => openEdit(offer)} aria-label="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => handleDelete(offer._id)} aria-label="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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

export default CompanyOffers;
