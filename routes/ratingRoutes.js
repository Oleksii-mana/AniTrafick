const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:animeId', authMiddleware.optional, ratingController.getRatings);
router.post('/:animeId', authMiddleware.required, ratingController.submitRating);

module.exports = router;
