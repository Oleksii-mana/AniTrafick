const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const Rating = sequelize.define('Rating', {
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10
        }
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Rating;
