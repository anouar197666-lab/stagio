import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, MapPin, Building, Briefcase } from 'lucide-react';

const StudentOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [applyingTo, setApplyingTo] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await api.get('/student/offers');
            setOffers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (offerId) => {
        try {
            await api.post(`/student/offers/${offerId}/apply`, { coverLetter });
            alert('Application submitted successfully!');
            setApplyingTo(null);
            setCoverLetter('');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to apply');
        }
    };

    const filteredOffers = offers.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2>Browse Internships</h2>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search roles or companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                    />
                </div>
            </div>

            {filteredOffers.length === 0 ? (
                <div className="glass-panel text-center">
                    <p>No internships found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2">
                    {filteredOffers.map((offer) => (
                        <div key={offer._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{offer.title}</h3>
                                <span className="badge badge-success">Validated</span>
                            </div>

                            <div className="flex gap-4 mb-3 text-muted" style={{ fontSize: '0.9rem' }}>
                                <span className="flex items-center gap-1"><Building size={14} /> {offer.company.name}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} /> {offer.location}</span>
                            </div>

                            <p style={{ flex: 1, fontSize: '0.95rem' }}>{offer.description.length > 150 ? offer.description.substring(0, 150) + '...' : offer.description}</p>

                            <div className="mt-2 mb-4">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {offer.requirements.slice(0, 3).map((req, i) => (
                                        <span key={i} className="badge badge-primary">{req}</span>
                                    ))}
                                    {offer.requirements.length > 3 && <span className="badge">+{offer.requirements.length - 3} more</span>}
                                </div>
                            </div>

                            {applyingTo === offer._id ? (
                                <div style={{ marginTop: 'auto', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                                    <textarea
                                        className="mb-2"
                                        style={{ width: '100%', resize: 'vertical' }}
                                        rows="3"
                                        placeholder="Write a short cover letter..."
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-between">
                                        <button className="btn btn-secondary" onClick={() => setApplyingTo(null)}>Cancel</button>
                                        <button className="btn btn-primary" onClick={() => handleApply(offer._id)}>Submit Application</button>
                                    </div>
                                </div>
                            ) : (
                                <button className="btn btn-primary mt-auto" onClick={() => setApplyingTo(offer._id)} style={{ width: '100%' }}>
                                    <Briefcase size={16} /> Apply Now
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentOffers;
