const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const Anime = sequelize.define('Anime', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
    },
    imageType: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Anime;
