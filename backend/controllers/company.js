const ErrorResponse = require('../utils/errorResponse');
const { Company } = require('../models/User');
const Offer = require('../models/Offer');
const Application = require('../models/Application');

// @desc    Update company profile
// @route   PUT /api/v1/company/profile
// @access  Private (Company only)
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, description, industry, location } = req.body;

        const company = await Company.findByIdAndUpdate(
            req.user.id,
            { name, description, industry, location },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: company });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new offer
// @route   POST /api/v1/company/offers
// @access  Private (Company only)
exports.createOffer = async (req, res, next) => {
    try {
        req.body.company = req.user.id;

        const offer = await Offer.create(req.body);

        res.status(201).json({ success: true, data: offer });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all offers created by company
// @route   GET /api/v1/company/offers
// @access  Private (Company only)
exports.getOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find({ company: req.user.id });

        res.status(200).json({ success: true, count: offers.length, data: offers });
    } catch (err) {
        next(err);
    }
};

// @desc    Update an offer
// @route   PUT /api/v1/company/offers/:id
// @access  Private (Company only)
exports.updateOffer = async (req, res, next) => {
    try {
        let offer = await Offer.findById(req.params.id);

        if (!offer) {
            return next(new ErrorResponse(`Offer not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is offer owner
        if (offer.company.toString() !== req.user.id) {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this offer`, 401));
        }

        // Only allow changing status back to pending if they edit it, or keep it same.
        // Usually edits require re-validation from admin
        req.body.status = 'pending';

        offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: offer });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete an offer
// @route   DELETE /api/v1/company/offers/:id
// @access  Private (Company only)
exports.deleteOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (!offer) {
            return next(new ErrorResponse(`Offer not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is offer owner
        if (offer.company.toString() !== req.user.id) {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this offer`, 401));
        }

        await Offer.findByIdAndDelete(req.params.id);

        // Also delete applications
        await Application.deleteMany({ offer: req.params.id });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Get applicants for company's offers
// @route   GET /api/v1/company/applications
// @access  Private (Company only)
exports.getApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ company: req.user.id })
            .populate({
                path: 'student',
                select: 'name email cvLink skills github'
            })
            .populate('offer', 'title status');

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        next(err);
    }
};

// @desc    Accept/Reject candidate
// @route   PUT /api/v1/company/applications/:id
// @access  Private (Company only)
exports.updateApplicationStatus = async (req, res, next) => {
    try {
        let application = await Application.findById(req.params.id);

        if (!application) {
            return next(new ErrorResponse(`Application not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is company owner of application
        if (application.company.toString() !== req.user.id) {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this application`, 401));
        }

        const { status } = req.body;

        if (!['accepted', 'rejected', 'pending'].includes(status)) {
            return next(new ErrorResponse(`Invalid status. Must be accepted, rejected, or pending`, 400));
        }

        application = await Application.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
};
