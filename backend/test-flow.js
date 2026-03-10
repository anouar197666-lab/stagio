async function runTests() {
    const baseURL = 'http://localhost:5000/api/v1';

    const request = async (endpoint, options = {}) => {
        const res = await fetch(`${baseURL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Request failed');
            return { status: res.status, data };
        } else {
            return { status: res.status, body: await res.blob() };
        }
    };

    try {
        console.log('--- Testing Registration ---');
        // Register Admin
        const adRes = await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name: "Admin", email: "admin@test.com", password: "password123", role: "admin" })
        });
        const adminToken = adRes.data.token;
        console.log('✅ Admin registered');

        // Login as Company
        const coRes = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: "testcompany@example.com", password: "password123" })
        });
        const companyToken = coRes.data.token;
        console.log('✅ Company logged in');

        // Login as Student
        const stRes = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: "teststudent@example.com", password: "password123" })
        });
        const studentToken = stRes.data.token;
        console.log('✅ Student logged in');

        console.log('--- Testing Flows ---');
        // Company creates an offer
        const offerRes = await request('/company/offers', {
            method: 'POST',
            body: JSON.stringify({
                title: "Frontend Developer Intern",
                description: "Looking for an awesome intern.",
                requirements: ["React", "CSS"],
                location: "Paris"
            }),
            headers: { Authorization: `Bearer ${companyToken}` }
        });
        const offerId = offerRes.data.data._id;
        console.log('✅ Company created an offer (Pending)');

        // Admin validates the offer
        await request(`/admin/offers/${offerId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: "validated" }),
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Admin validated the offer');

        // Student applies to the offer
        const appRes = await request(`/student/offers/${offerId}/apply`, {
            method: 'POST',
            body: JSON.stringify({ coverLetter: "I love React!" }),
            headers: { Authorization: `Bearer ${studentToken}` }
        });
        const appId = appRes.data.data._id;
        console.log('✅ Student applied to the offer');

        // Company accepts the student
        await request(`/company/applications/${appId}`, {
            method: 'PUT',
            body: JSON.stringify({ status: "accepted" }),
            headers: { Authorization: `Bearer ${companyToken}` }
        });
        console.log('✅ Company accepted the application');

        // Admin generates Agreement
        const pdfRes = await request(`/admin/applications/${appId}/agreement`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Admin generated PDF agreement (status code: ' + pdfRes.status + ')');

        console.log('All tests passed successfully! 🎉');
    } catch (err) {
        console.error('❌ Test failed:', err.message);
    }
}

runTests();
