const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const favouriteController = require('../controllers/favouriteController');

router.post('/:animeId', authMiddleware, favouriteController.addToFavourites);
router.get('/', authMiddleware, favouriteController.getFavouritesForUser);
router.delete('/:animeId', authMiddleware, favouriteController.removeFavourite);


module.exports = router;
