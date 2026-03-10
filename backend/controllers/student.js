const ErrorResponse = require('../utils/errorResponse');
const { Student } = require('../models/User');
const Offer = require('../models/Offer');
const Application = require('../models/Application');

// @desc    Update student profile
// @route   PUT /api/v1/student/profile
// @access  Private (Student only)
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, skills, cvLink, github } = req.body;

        const student = await Student.findByIdAndUpdate(
            req.user.id,
            { name, skills, cvLink, github },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: student });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all validated offers (Search functionality)
// @route   GET /api/v1/student/offers
// @access  Private (Student only)
exports.getOffers = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        // Fields to exclude from filtering
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource - only validated offers
        query = Offer.find({ ...JSON.parse(queryStr), status: 'validated' }).populate('company', 'name email industry location');

        // Executing query
        const offers = await query;

        res.status(200).json({ success: true, count: offers.length, data: offers });
    } catch (err) {
        next(err);
    }
};

// @desc    Apply to an offer
// @route   POST /api/v1/student/offers/:offerId/apply
// @access  Private (Student only)
exports.applyToOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.offerId);

        if (!offer) {
            return next(new ErrorResponse(`Offer not found with id of ${req.params.offerId}`, 404));
        }

        if (offer.status !== 'validated') {
            return next(new ErrorResponse('You can only apply to validated offers', 400));
        }

        const { coverLetter } = req.body;

        const application = await Application.create({
            student: req.user.id,
            offer: offer._id,
            company: offer.company,
            coverLetter
        });

        res.status(201).json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
};

// @desc    Get student applications
// @route   GET /api/v1/student/applications
// @access  Private (Student only)
exports.getApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ student: req.user.id })
            .populate('offer', 'title location status')
            .populate('company', 'name industry');

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        next(err);
    }
};
