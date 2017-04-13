// server.js
// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser'),
  db = require('./models');

  // from Brianna 4/13
  // custom middleware to console.log some helpful information
//   in terminal every time we get a request
function logRequestInfo(req, res, next){
  console.log(`\nRECEIVED REQUEST : ${req.method} ${req.url}`);
  console.log('query params:', req.query);
  console.log('body:', req.body);
  // request url parameters haven't been decided yet
  //  so we'll have to log them inside any routes where
  //  we want to use them
  next();
}
app.use(logRequestInfo);

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // find one book by its id
  db.Book.find({})
    .populate('author')
    .exec(function(err, books){
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(books);
    });

});



app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  db.Book.findById(req.params.id)
    // populate the author
    .populate('author')
    .exec(function(err, book){
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(book);
    });

});



app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
  });
  // find the author from req.body
  db.Author.findOne({name: req.body.author}, function(err, author){
    if (err) {
      return console.log(err);
    }
    // add this author to the book
    newBook.author = author;
    // save newBook to database
    newBook.save(function(err, book){
      if (err) {
        return console.log("save error: " + err);
      }
      console.log("saved ", book.title);
      // send back the book!
      res.json(book);
    });
  });

});


// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log(req.params)
  var bookId = req.params.id;

  db.Book.findOneAndRemove({ _id: bookId }, function (err, deletedBook) {
    res.json(deletedBook);
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});
