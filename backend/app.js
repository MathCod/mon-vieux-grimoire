const express = require('express');
const mongoose = require('mongoose'); // <-- IL MANQUAIT CETTE LIGNE !
require('dotenv').config(); // Décommente ça pour utiliser ton fichier .env
const app = express();

const Book = require('./models/Book');
const User = require('./models/User');

// Utilise la variable d'environnement pour plus de sécurité
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/books', (req, res, next) => {
  delete req.body._id; // On s'assure que l'ID généré par MongoDB est utilisé
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/books', (req, res, next) => {
  console.log('Récupération des livres');
  res.status(200).json([]);
});

module.exports = app;