const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

//const SECRET = 'your_jwt_secret_key'; 

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Користувач з таким імʼям або емейлом вже існує' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed });
        res.json({ message: 'Користувач зареєстрований' });
    } catch (err) {
        console.error('❌ Помилка при реєстрації:', err);
        res.status(500).json({ error: 'Помилка реєстрації' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Неправильна електронна пошта або пароль' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Неправильна електронна пошта або пароль' });

        const token = jwt.sign({ id: user.id,  username: user.username, email: user.email, isAdmin: user.isAdmin },  process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Помилка входу' });
    }
};

exports.getMe = async (req, res) => {
    const user = req.user;
    res.json({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
    });
};
