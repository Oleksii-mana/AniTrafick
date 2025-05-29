const Favourite = require('../models/Favourite');
const Anime = require('../models/Anime');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.addToFavourites = async (req, res) => {
    try {
        const userId = req.user.id;

        const animeId = req.params.animeId;

        await Favourite.create({ userId, animeId });
        res.json({ message: 'Додано до улюблених' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Не вдалося додати в улюблені' });
    }
};

exports.getFavouritesForUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            include: {
                model: Anime,
                as: 'Favourites' 
            }
        });

        res.json(user.Favourites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Не вдалося отримати улюблені' });
    }
};

exports.removeFavourite = async (req, res) => {
    const userId = req.user.id;
    const animeId = req.params.animeId;

    try {
        await Favourite.destroy({
            where: { userId, animeId }
        });
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Не вдалося видалити з улюблених' });
    }
};

