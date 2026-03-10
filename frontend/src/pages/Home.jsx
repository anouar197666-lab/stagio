import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Briefcase, Award } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home-container">
            <div className="hero text-center" style={{ padding: '4rem 0' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Your Career Starts Here
                </h1>
                <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                    Connect with top companies and find the perfect internship to kickstart your professional journey.
                </p>

                {!user && (
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            Get Started for Free
                        </Link>
                        <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            Login
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 mt-4">
                <div className="glass-panel text-center">
                    <div className="icon-wrapper" style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.1)', color: 'var(--primary)', marginBottom: '1rem' }}>
                        <Search size={32} />
                    </div>
                    <h3>Find Internships</h3>
                    <p>Browse through hundreds of validated internship offers from top European companies.</p>
                </div>

                <div className="glass-panel text-center">
                    <div className="icon-wrapper" style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(236,72,153,0.1)', color: 'var(--secondary)', marginBottom: '1rem' }}>
                        <Briefcase size={32} />
                    </div>
                    <h3>Post Offers</h3>
                    <p>Companies can easily post and manage internship opportunities to find the best talent.</p>
                </div>

                <div className="glass-panel text-center">
                    <div className="icon-wrapper" style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success)', marginBottom: '1rem' }}>
                        <Award size={32} />
                    </div>
                    <h3>Validated Quality</h3>
                    <p>Every internship is validated by our administration to ensure strict quality standards.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
