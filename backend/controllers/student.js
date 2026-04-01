const User = require('../models/User');
const Offer = require('../models/Offer');
const Application = require('../models/Application');
const PDFDocument = require('pdfkit');

// =======================
// UPDATE PROFILE
// =======================
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true }
        );

        res.json({ success: true, data: user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// =======================
// GET VALIDATED OFFERS
// =======================
exports.getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({ status: 'validated' })
            .populate('company', 'name');

        res.json({ success: true, data: offers });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// =======================
// APPLY TO OFFER
// =======================
exports.applyToOffer = async (req, res) => {
    try {
        const { coverLetter } = req.body;

        const exists = await Application.findOne({
            student: req.user.id,
            offer: req.params.offerId
        });

        if (exists) {
            return res.status(400).json({ msg: 'Already applied' });
        }

        const offer = await Offer.findById(req.params.offerId);

        if (!offer) {
            return res.status(404).json({ msg: 'Offer not found' });
        }

        const application = await Application.create({
            student: req.user.id,
            company: offer.company,
            offer: offer._id,
            coverLetter
        });

        res.status(201).json({ success: true, data: application });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// =======================
// GET APPLICATIONS
// =======================
exports.getApplications = async (req, res) => {
    try {
        const apps = await Application.find({ student: req.user.id })
            .populate('company', 'name')
            .populate('offer', 'title location')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: apps });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// =======================
// PROFESSIONAL PDF
// =======================
exports.generateStudentAgreement = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id)
            .populate('student')
            .populate('company')
            .populate('offer');

        if (!app) {
            return res.status(404).json({ msg: 'Application not found' });
        }

        if (app.status !== 'accepted') {
            return res.status(403).json({ msg: 'Application not accepted yet' });
        }

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=agreement-${app._id}.pdf`
        );

        doc.pipe(res);

        // ===== HEADER =====
        doc
            .fontSize(22)
            .fillColor('#222')
            .text('INTERNSHIP AGREEMENT', { align: 'center' });

        doc.moveDown(2);

        // ===== HELPERS =====
        const sectionTitle = (title) => {
            doc.moveDown();
            doc.fontSize(14).fillColor('#555').text(title, { underline: true });
            doc.moveDown(0.5);
        };

        const field = (label, value) => {
            doc
                .fontSize(12)
                .fillColor('#000')
                .text(`${label}: `, { continued: true })
                .font('Helvetica-Bold')
                .text(value)
                .font('Helvetica');
        };

        // ===== STUDENT =====
        sectionTitle('Student Information');
        field('Full Name', app.student.name);
        field('Email', app.student.email);

        // ===== COMPANY =====
        sectionTitle('Company Information');
        field('Company Name', app.company.name);
        field('Location', app.offer.location);

        // ===== INTERNSHIP =====
        sectionTitle('Internship Details');
        field('Title', app.offer.title);
        field('Date', new Date().toLocaleDateString());

        doc.moveDown(2);

        // ===== TEXT =====
        doc
            .fontSize(11)
            .fillColor('#444')
            .text(
                'This agreement confirms that the student has been accepted for the internship position. Both parties agree to respect the internship terms and conditions.',
                { align: 'justify' }
            );

        doc.moveDown(3);

        // ===== SIGNATURE =====
        doc.fontSize(12).text('Signatures', { underline: true });

        doc.moveDown(2);
        doc.text('Student Signature: __________________________');
        doc.moveDown();
        doc.text('Company Signature: __________________________');
        doc.moveDown();
        doc.text('Date: __________________________');

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};