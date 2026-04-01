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
                return <CheckCircle size={18} />;
            case 'rejected':
                return <XCircle size={18} />;
            default:
                return <Clock size={18} />;
        }
    };

    const downloadPDF = async (id) => {
        try {
            const res = await api.get(
                `/student/applications/${id}/agreement`, // ✅ FIX هنا
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
            alert("PDF error");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>

            <h2>My Applications</h2>

            {applications.length === 0 ? (
                <p>No applications yet</p>
            ) : (

                <table>

                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Role</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>PDF</th>
                        </tr>
                    </thead>

                    <tbody>

                        {applications.map((app) => (

                            <tr key={app._id}>

                                <td>{app.company.name}</td>

                                <td>{app.offer.title}</td>

                                <td>
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </td>

                                <td>
                                    {getStatusIcon(app.status)} {app.status}
                                </td>

                                <td>

                                    {app.status === "accepted" ? (
                                        <button onClick={() => downloadPDF(app._id)}>
                                            Download PDF
                                        </button>
                                    ) : "-"}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
};

export default StudentApplications;