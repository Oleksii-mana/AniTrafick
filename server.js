const path = require('path');
const express = require('express');
const animeRoutes = require('./routes/animeRoutes');
const sequelize = require('./dataBase');
require('./models/associations');
const userRoutes = require('./routes/userRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const multer = require('multer');
const upload = multer(); 
const cors = require('cors');

const animeController = require('./controllers/animeController');
const app = express();
const PORT = 5000;

app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/animes', animeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/ratings', ratingRoutes);

app.post('/api/animes', upload.single('image'), animeController.createAnime);

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'Main.html')); 
});

app.get('/animes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Animes.html'));
});

app.get('/favourite', (req, res) => {
    res.sendFile(path.join(__dirname, 'Mylist.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'About.html'));
});

app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'FAQ.html'));
});

app.get('/accaunt', (req, res) => {
    res.sendFile(path.join(__dirname, 'Accaunt.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/anime/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'AnimePage.html'));
});


const start = async () => {

    try {
      await sequelize.sync({ force: false });
      console.log('✅ All models synced');
      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
      console.error(err);
  }
};

start();
