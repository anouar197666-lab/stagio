const express = require('express');
const {
    updateProfile,
    createOffer,
    getOffers,
    updateOffer,
    deleteOffer,
    getApplications,
    updateApplicationStatus
} = require('../controllers/company');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('company'));

router.put('/profile', updateProfile);
router.route('/offers')
    .post(createOffer)
    .get(getOffers);
router.route('/offers/:id')
    .put(updateOffer)
    .delete(deleteOffer);

router.get('/applications', getApplications);
router.put('/applications/:id', updateApplicationStatus);

module.exports = router;
