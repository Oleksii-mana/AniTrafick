const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('anitrafik', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
