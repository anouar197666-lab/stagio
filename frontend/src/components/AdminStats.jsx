import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, Building, Briefcase, FileText } from 'lucide-react';

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    const statCards = [
        { title: 'Total Students', count: stats?.students || 0, icon: <Users size={24} className="text-primary" />, color: 'var(--primary)', bg: 'rgba(99,102,241,0.1)' },
        { title: 'Registered Companies', count: stats?.companies || 0, icon: <Building size={24} className="text-secondary" />, color: 'var(--secondary)', bg: 'rgba(236,72,153,0.1)' },
        { title: 'Total Offers', count: stats?.offers || 0, icon: <Briefcase size={24} className="text-success" />, color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
        { title: 'Applications Sent', count: stats?.applications || 0, icon: <FileText size={24} className="text-warning" />, color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' }
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="mb-4">Platform Overview</h2>

            <div className="grid grid-cols-2">
                {statCards.map((card, index) => (
                    <div key={index} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1.25rem', borderRadius: '50%', backgroundColor: card.bg, color: card.color }}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-muted uppercase mb-1" style={{ fontSize: '0.8rem', letterSpacing: '0.05em', fontWeight: '600' }}>{card.title}</p>
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{card.count}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {stats?.pendingOffers > 0 && (
                <div className="alert alert-warning mt-4 flex justify-between items-center" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <span>You have <strong>{stats.pendingOffers}</strong> internship offers awaiting your validation.</span>
                </div>
            )}
        </div>
    );
};

export default AdminStats;
