import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const StudentApplications = () => {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchApplications = async () => {
            try {
                const res = await api.get('/student/applications');
                setApplications(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();

    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle className="text-success" size={18} />;
            case 'rejected':
                return <XCircle className="text-danger" size={18} />;
            default:
                return <Clock className="text-warning" size={18} />;
        }
    };

    const downloadPDF = async (id) => {
        try {

            const res = await api.get(
                `/admin/applications/${id}/agreement`,
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', 'agreement.pdf');

            document.body.appendChild(link);
            link.click();

        } catch (err) {
            console.error(err);
            alert("Error generating PDF");
        }
    };

    if (loading)
        return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div className="animate-fade-in">

            <h2 className="mb-4">My Applications</h2>

            {applications.length === 0 ? (
                <div className="glass-panel text-center">
                    <p>You haven't applied to any internships yet.</p>
                </div>
            ) : (

                <div className="table-container glass-panel p-0">

                    <table>

                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Internship Role</th>
                                <th>Applied On</th>
                                <th>Status</th>
                                <th>Agreement</th>
                            </tr>
                        </thead>

                        <tbody>

                            {applications.map((app) => (

                                <tr key={app._id}>

                                    <td className="font-weight-600">
                                        {app.company.name}
                                    </td>

                                    <td>
                                        {app.offer.title}
                                    </td>

                                    <td>
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>

                                    <td>
                                        <div className={`badge badge-${app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'} flex items-center gap-1`}>
                                            {getStatusIcon(app.status)}
                                            {app.status}
                                        </div>
                                    </td>

                                    <td>

                                        {app.status === "accepted" ? (

                                            <button
                                                onClick={() => downloadPDF(app._id)}
                                                className="btn btn-primary"
                                            >
                                                Download PDF
                                            </button>

                                        ) : "-"

                                        }

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

export default StudentApplications;