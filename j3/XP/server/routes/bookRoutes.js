const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');

router.get('/', BookController.getAll);
router.get('/:bookId', BookController.getById);
router.post('/', BookController.create);
router.put('/:bookId', BookController.update);
router.delete('/:bookId', BookController.remove);

module.exports = router;
