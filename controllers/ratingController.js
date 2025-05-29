const { Rating, Anime } = require('../models/associations');

exports.submitRating = async (req, res) => {
    const { animeId } = req.params;
    const { score, isAdmin } = req.body;
    const userId = req.user?.id;

    if (!userId || !animeId) {
        return res.status(400).json({ error: 'userId або animeId відсутні' });
    }

    try {
        const anime = await Anime.findByPk(animeId);
        if (!anime) return res.status(404).json({ error: 'Аніме не знайдено' });

        console.log({ userId, animeId, isAdmin, score });

        const [rating, created] = await Rating.findOrCreate({
            where: { UserId: userId, AnimeId: animeId, isAdmin },
            defaults: { score, UserId: userId, AnimeId: animeId  }
        });

        if (!created) {
            rating.score = score;
            await rating.save();
        }

        res.json({ message: 'Оцінку збережено', rating });
    } catch (error) {
        console.error("Помилка при збереженні оцінки:", error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
};

exports.getRatings = async (req, res) => {
    const { animeId } = req.params;
    const userId = req.user ? req.user.id : null;
    const isAdmin = req.user?.isAdmin || false;

    try {
        const [adminRating, userAvg, userRating] = await Promise.all([
            Rating.findOne({ where: { animeId, isAdmin: true } }),
            Rating.findAll({ where: { animeId, isAdmin: false } }),
            userId ? Rating.findOne({ where: { animeId, userId, isAdmin: false } }) : null
        ]);

        const averageUserRating = userAvg.length
            ? userAvg.reduce((sum, r) => sum + r.score, 0) / userAvg.length
            : null;

        res.json({
            adminRating: adminRating?.score ?? null,
            averageUserRating,
            userRating: userRating?.score ?? null,
            isAdmin
        });
    } catch (error) {
        console.error("Помилка при отриманні оцінок:", error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
};
