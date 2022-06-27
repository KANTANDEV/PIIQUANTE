// on importe le module express
const express = require('express');
// on importe le module helmet
const helmet = require("helmet");
// on importe mongoose
const mongoose = require('mongoose');
// on importe le package path
const path = require('path');
// on importe body parser qui qnqlyse les corps de requete entrant
const bodyParser = require('body-parser');
// on cree l'application express
const app = express();
// On importe nos modules routers 
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
// Connection a la base de donnee mongoDB Atlas
// On import le package dotenv
const dotenv = require('dotenv');
// on configure notre package
dotenv.config()
// on effectue la mongoose.connection
mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB Atlas réussie !'))
    .catch(() => console.log('Connexion à MongoDB Atlas échouée !'));
// middleware CORS 'cross origin resource sharing'
app.use((req, res, next) => {
    // accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // On ajoute une exeption pour le cross origin ressourses
    res.setHeader('Cross-Origin-Resource-Policy', 'http://127.0.0.1:4200/');
    // ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
// Donne acces au corp de la requete 
app.use(express.json());
// on configure les option de notre package helmet
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
    })
);
// on analyse les corps de donnee entrant
app.use(bodyParser.json());
// on cree une route vers notre router
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
// on gere mutler
app.use('/images', express.static(path.join(__dirname, 'images')));
// On exporte notre application pour pouvoir s'en servir dans d'autre fichier 
module.exports = app;