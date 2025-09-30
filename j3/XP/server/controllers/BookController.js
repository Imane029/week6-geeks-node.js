const Book = require('../models/BookModel');

const getAll = (req, res) => res.json(Book.getAllBooks());
const getById = (req, res) => {
  const book = Book.getBookById(parseInt(req.params.bookId));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};
const create = (req, res) => res.status(201).json(Book.createBook(req.body));
const update = (req, res) => {
  const book = Book.updateBook(parseInt(req.params.bookId), req.body);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};
const remove = (req, res) => {
  const success = Book.deleteBook(parseInt(req.params.bookId));
  if (!success) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book deleted' });
};

module.exports = { getAll, getById, create, update, remove };
