const ErrorResponse = require('../utils/errorResponse');
const { User, Student, Company } = require('../models/User');
const Offer = require('../models/Offer');
const Application = require('../models/Application');
const PDFDocument = require('pdfkit');
// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res, next) => {
    try {
        const studentCount = await Student.countDocuments();
        const companyCount = await Company.countDocuments();
        const offerCount = await Offer.countDocuments();
        const applicationCount = await Application.countDocuments();

        const pendingOffers = await Offer.countDocuments({ status: 'pending' });

        res.status(200).json({
            success: true,
            data: {
                students: studentCount,
                companies: companyCount,
                offers: offerCount,
                applications: applicationCount,
                pendingOffers
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get pending offers for validation
// @route   GET /api/v1/admin/offers/pending
// @access  Private (Admin only)
exports.getPendingOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find({ status: 'pending' }).populate('company', 'name email industry location');

        res.status(200).json({ success: true, count: offers.length, data: offers });
    } catch (err) {
        next(err);
    }
};

// @desc    Validate or Reject offer
// @route   PUT /api/v1/admin/offers/:id/status
// @access  Private (Admin only)
exports.updateOfferStatus = async (req, res, next) => {
    try {
        let offer = await Offer.findById(req.params.id);

        if (!offer) {
            return next(new ErrorResponse(`Offer not found with id of ${req.params.id}`, 404));
        }

        const { status } = req.body;

        if (!['validated', 'rejected'].includes(status)) {
            return next(new ErrorResponse('Invalid status', 400));
        }

        offer = await Offer.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: offer });
    } catch (err) {
        next(err);
    }
};

// @desc    Generate Internship Agreement PDF
// @route   GET /api/v1/admin/applications/:id/agreement
// @access  Private (Admin only)
exports.generateAgreement = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('student', 'name email')
            .populate('offer', 'title location')
            .populate('company', 'name email location');

        if (!application) {
            return next(new ErrorResponse(`Application not found with id of ${req.params.id}`, 404));
        }

        if (application.status !== 'accepted') {
            return next(new ErrorResponse(`Cannot generate agreement for application with status ${application.status}`, 400));
        }

        // Generate PDF
        const doc = new PDFDocument();
        let filename = `Agreement_${application._id}.pdf`;
        // Stripping special characters
        filename = encodeURIComponent(filename);

        // Settings for response
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        // Text
        doc.fontSize(25).text('Stag.io Internship Agreement', 100, 100);

        doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();
        doc.moveDown();

        doc.fontSize(16).text(`Company: ${application.company.name}`);
        doc.fontSize(14).text(`Location: ${application.company.location}`);
        doc.moveDown();

        doc.fontSize(16).text(`Student: ${application.student.name}`);
        doc.fontSize(14).text(`Email: ${application.student.email}`);
        doc.moveDown();

        doc.fontSize(16).text(`Internship Subject: ${application.offer.title}`);
        doc.fontSize(14).text(`Location: ${application.offer.location}`);
        doc.moveDown();
        doc.moveDown();

        doc.fontSize(12).text('This document serves as proof of the internship agreement between the stated parties, facilitated by the Stag.io platform. Both parties agree to abide by the terms set forth in the full contract (not included).');

        doc.pipe(res);
        doc.end();

    } catch (err) {
        next(err);
    }
};
