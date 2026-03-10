import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, Search, Briefcase, Building, List, FileCheck, ShieldCheck, BarChart2 } from 'lucide-react';

import StudentProfile from '../components/StudentProfile';
import StudentOffers from '../components/StudentOffers';
import StudentApplications from '../components/StudentApplications';

import CompanyProfile from '../components/CompanyProfile';
import CompanyOffers from '../components/CompanyOffers';
import CompanyApplications from '../components/CompanyApplications';

import AdminStats from '../components/AdminStats';
import AdminValidation from '../components/AdminValidation';

export const StudentDashboard = () => {
    const location = useLocation();

    return (
        <div className="dashboard-grid">
            <aside className="sidebar">
                <div className="sidebar-nav">
                    <Link to="/student/dashboard" className={`sidebar-link ${location.pathname === '/student/dashboard' ? 'active' : ''}`}>
                        <User size={18} /> Profile
                    </Link>
                    <Link to="/student/dashboard/offers" className={`sidebar-link ${location.pathname.includes('/offers') ? 'active' : ''}`}>
                        <Search size={18} /> Search Offers
                    </Link>
                    <Link to="/student/dashboard/applications" className={`sidebar-link ${location.pathname.includes('/applications') ? 'active' : ''}`}>
                        <Briefcase size={18} /> My Applications
                    </Link>
                </div>
            </aside>
            <main>
                <Routes>
                    <Route path="/" element={<StudentProfile />} />
                    <Route path="/offers" element={<StudentOffers />} />
                    <Route path="/applications" element={<StudentApplications />} />
                </Routes>
            </main>
        </div>
    );
};

export const CompanyDashboard = () => {
    const location = useLocation();

    return (
        <div className="dashboard-grid">
            <aside className="sidebar">
                <div className="sidebar-nav">
                    <Link to="/company/dashboard" className={`sidebar-link ${location.pathname === '/company/dashboard' ? 'active' : ''}`}>
                        <Building size={18} /> Company Profile
                    </Link>
                    <Link to="/company/dashboard/offers" className={`sidebar-link ${location.pathname.includes('/offers') ? 'active' : ''}`}>
                        <List size={18} /> Manage Offers
                    </Link>
                    <Link to="/company/dashboard/applications" className={`sidebar-link ${location.pathname.includes('/applications') ? 'active' : ''}`}>
                        <FileCheck size={18} /> Review Applicants
                    </Link>
                </div>
            </aside>
            <main>
                <Routes>
                    <Route path="/" element={<CompanyProfile />} />
                    <Route path="/offers/*" element={<CompanyOffers />} />
                    <Route path="/applications/*" element={<CompanyApplications />} />
                </Routes>
            </main>
        </div>
    );
};

export const AdminDashboard = () => {
    const location = useLocation();

    return (
        <div className="dashboard-grid">
            <aside className="sidebar">
                <div className="sidebar-nav">
                    <Link to="/admin/dashboard" className={`sidebar-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                        <BarChart2 size={18} /> Platform Stats
                    </Link>
                    <Link to="/admin/dashboard/validation" className={`sidebar-link ${location.pathname.includes('/validation') ? 'active' : ''}`}>
                        <ShieldCheck size={18} /> Validate Offers
                    </Link>
                </div>
            </aside>
            <main>
                <Routes>
                    <Route path="/" element={<AdminStats />} />
                    <Route path="/validation" element={<AdminValidation />} />
                </Routes>
            </main>
        </div>
    );
};
