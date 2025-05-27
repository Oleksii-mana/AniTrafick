const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', animeController.getAllAnimes);

router.get('/:id', animeController.getAnimeById);

router.delete('/:id', adminMiddleware, animeController.deleteAnime);

module.exports = router;
