const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    offer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Offer',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    coverLetter: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from applying to the same offer twice
ApplicationSchema.index({ student: 1, offer: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
