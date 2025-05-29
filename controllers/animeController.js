const Anime = require('../models/Anime');
const fs = require('fs');
const Rating = require('../models/Rating')

exports.createAnime = async (req, res) => {
    try {
        const title = req.body.title;
        const imageBuffer = req.file.buffer;
        const imageType = req.file.mimetype; 

        const newAnime = await Anime.create({ title, image: imageBuffer, imageType });
        res.json({ id: newAnime.id, title: newAnime.title });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка при додаванні аніме' });
    }
};

exports.getAllAnimes = async (req, res) => {
    const animes = await Anime.findAll();
    const processed = animes.map(a => ({
        id: a.id,
        title: a.title,
        image: `data:${a.imageType};base64,${Buffer.from(a.image).toString('base64')}`
    }));
    res.json(processed);
};


exports.getAnimeById = async (req, res) => {
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
};

exports.deleteAnime = async (req, res) => {
    try {
        const anime = await Anime.findByPk(req.params.id);
        if (!anime) {
            return res.status(404).json({ message: 'Аніме не знайдено' });
        }

        await Rating.destroy({ where: { AnimeId: anime.id } });
        await anime.destroy();
        res.json({ message: 'Аніме успішно видалено' });
    } catch (err) {
        console.error('Помилка видалення аніме:', err);
        res.status(500).json({ message: 'Помилка сервера' });
    }
};