const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const adminMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Немає токена авторизації' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Доступ заборонено: лише для адміністратора' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Помилка доступу адміністратора' });
    }
};

module.exports = adminMiddleware;
