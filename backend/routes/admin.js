const express = require('express');
const { getStats, getPendingOffers, updateOfferStatus, generateAgreement } = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/offers/pending', getPendingOffers);
router.put('/offers/:id/status', updateOfferStatus);
router.get('/applications/:id/agreement', generateAgreement);

module.exports = router;
