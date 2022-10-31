// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  // Render view/books/details.ejs and pass values for title and the book object
  res.render('books/details', {title: 'Add a book', books: book})
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

  // Create a book object called newBook using the books model
  // Get values entered from the form and pass them into the newBook object
  let newBook = book({
    "Title" : req.body.title,
    "Description" : req.body.description,
    "Price" : req.body.price,
    "Author": req.body.author,
    "Genre" : req.body.genre
  });

  // call create method to add the newBook object to the collection
  // use lambda function to log any errors to the console; if no errors then push user back to book list
  book.create(newBook, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/books');
    }
  })
});

// GET the Book Details page in order to edit an existing Book
router.get('/edit/:id', (req, res, next) => {
  // get mongo id of document to be edited
  let id = req.params.id;

  // call findById method to locate book, then pass the book fields reusing the details view to edit the book
  book.findById(id, (err, book) => {
    if(err) {
      console.log(err);
      res.end(err);
    } else {
      res.render('books/details', {title: 'Edit Book', books: book});
    }
  })
});

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', (req, res, next) => {
  // get mongo id of document to be edited
  let id = req.params.id;

  // create new book object, keep the same id as the old book, but update every other field with new details
  let updatedBook = book({
    "_id": id,
    "Title" : req.body.title,
    "Description" : req.body.description,
    "Price" : req.body.price,
    "Author": req.body.author,
    "Genre" : req.body.genre
  });

  // Use updateOne method find document with the id in the collection, then replace existing book document with
  // updatedBook object
  book.updateOne({_id: id}, updatedBook, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/books');
    }
  });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  // get mongo id of document to be deleted
  let id = req.params.id;

  // call remove function to look up id, then delete document from collection
  book.remove({_id: id}, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/books');
    }
  })
});

module.exports = router;