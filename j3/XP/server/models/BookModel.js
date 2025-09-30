let books = [
  { id: 1, title: 'Book 1', author: 'Author 1', publishedYear: 2020 },
  { id: 2, title: 'Book 2', author: 'Author 2', publishedYear: 2021 }
];

const getAllBooks = () => books;
const getBookById = (id) => books.find(book => book.id === id);
const createBook = (book) => {
  book.id = books.length + 1;
  books.push(book);
  return book;
};
const updateBook = (id, data) => {
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return null;
  books[index] = { ...books[index], ...data };
  return books[index];
};
const deleteBook = (id) => {
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return false;
  books.splice(index, 1);
  return true;
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
