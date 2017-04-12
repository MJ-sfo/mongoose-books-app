var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//  moved to index.js

var BookSchema = new Schema({
  title: String,
  author: String,
  image: String,
  release_date: String
});

var Book = mongoose.model('Book', BookSchema);


// to export Book from this module (that's this file)
// var Book = mongoose.model('Book', BookSchema);
module.exports = Book;
