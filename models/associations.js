const User = require('./User');
const Anime = require('./Anime');
const Favourite = require('./Favourite');
const Rating = require('./Rating');


User.belongsToMany(Anime, { through: Favourite, as: 'Favourites', foreignKey: 'userId', otherKey: 'animeId' });
Anime.belongsToMany(User, { through: Favourite, as: 'FavouritedBy', foreignKey: 'animeId', otherKey: 'userId' });


User.hasMany(Rating);
Rating.belongsTo(User);


Anime.hasMany(Rating);
Rating.belongsTo(Anime);

module.exports = { User, Anime, Favourite, Rating };
