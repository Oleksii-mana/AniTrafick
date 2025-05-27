const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');
const User = require('./User');
const Anime = require('./Anime');

const Favourite = sequelize.define('Favourite', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    animeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Anime,
            key: 'id'
        }
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['userId', 'animeId']
        }
    ]
});

module.exports = Favourite;
