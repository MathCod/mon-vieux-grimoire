const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');
const BookCtrl = require('../controllers/book');

const router = express.Router();

router.get('/', BookCtrl.getAllBooks);
router.get('/bestrating', BookCtrl.getBestRatings);
router.get('/:id', BookCtrl.getOneBook);

router.post('/:id/rating', auth, BookCtrl.createRating);

router.post('/', auth, multer, sharp, BookCtrl.createBook);
router.put('/:id', auth, multer, sharp, BookCtrl.modifyBook);
router.delete('/:id', auth, BookCtrl.deleteBook);


module.exports = router;