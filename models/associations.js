const User = require('./User');
const Anime = require('./Anime');
const Favourite = require('./Favourite');

User.belongsToMany(Anime, { through: Favourite, foreignKey: 'userId' });
Anime.belongsToMany(User, { through: Favourite, foreignKey: 'animeId' });

module.exports = () => {
};
