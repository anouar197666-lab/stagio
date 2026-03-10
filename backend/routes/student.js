const express = require('express');
const { updateProfile, getOffers, applyToOffer, getApplications } = require('../controllers/student');
const { generateAgreement } = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.put('/profile', updateProfile);
router.get('/offers', getOffers);
router.post('/offers/:offerId/apply', applyToOffer);
router.get('/applications', getApplications);


router.get('/applications/:id/agreement', generateAgreement);

module.exports = router;