const express = require('express');
const router = express.Router();
const Anime = require('../models/Anime');
const animeController = require('../controllers/animeController');

router.get('/', animeController.getAllAnimes);

router.get('/:id', async (req, res) => {
    try {
        const anime = await Anime.findByPk(req.params.id);
        if (!anime) return res.status(404).json({ error: 'Аніме не знайдено' });

        res.json({
            id: anime.id,
            title: anime.title,
            image: Buffer.from(anime.image).toString('base64'),
            imageType: anime.imageType
        });
    } catch (err) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const anime = await Anime.findByPk(req.params.id);
        if (!anime) {
            return res.status(404).json({ message: 'Аніме не знайдено' });
        }

        await anime.destroy();
        res.json({ message: 'Аніме успішно видалено' });
    } catch (err) {
        console.error('Помилка видалення аніме:', err);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

module.exports = router;
