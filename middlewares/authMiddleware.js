const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const required = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Немає токена' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Користувача не знайдено' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Помилка авторизації:', err);
        res.status(401).json({ message: 'Невірний токен' });
    }
};

const optional = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (user) {
                req.user = user;
            }
        }
    } catch (err) {}
    next();
};

module.exports = required;
module.exports.required = required;
module.exports.optional = optional;
