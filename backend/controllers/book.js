const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !'})})
    .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message : 'Non-authorisé'});
      } 
      if (req.file) {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) console.log("Erreur suppression ancienne image :", err);
        });
      
      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message : 'Objet modifié!'}))
        .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message : 'Non-authorisé'});
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message : 'Objet supprimé !'}))
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
        if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
        res.status(200).json(book);
    })
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getBestRatings = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};



exports.createRating = (req, res, next) => {
  // On s'assure que la note est valide
  const rating = parseFloat(req.body.rating);
  if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'La note doit être entre 0 et 5' });
  }

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // On vérifie si l'utilisateur a déjà noté
      const userAlreadyRated = book.ratings.find(r => r.userId === req.auth.userId);
      if (userAlreadyRated) {
        return res.status(400).json({ message: 'Livre déjà noté' });
      }

      // Ajout de la note
      book.ratings.push({ userId: req.auth.userId, grade: rating });

      // Recalcul de la moyenne
      const totalGrades = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
      book.averageRating = parseFloat((totalGrades / book.ratings.length).toFixed(1));

      // Sauvegarde et envoi du livre mis à jour
      return book.save();
    })
    .then(savedBook => {
      // TRÈS IMPORTANT : On renvoie le livre sauvegardé (savedBook) 
      // car le frontend attend l'objet complet avec son _id
      res.status(200).json(savedBook);
    })
    .catch(error => res.status(500).json({ error }));
};