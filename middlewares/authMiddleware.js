const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
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

module.exports = authMiddleware;
