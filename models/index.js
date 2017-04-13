var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/book-app");

// from Biranna - to avoid warning
// (node:788) DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
// Use native JavaScript promises to avoid warning about Mongoose promises
mongoose.Promise = global.Promise;

module.exports.Book = require("./book.js");
module.exports.Author = require("./author.js");

// var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Schema = mongoose.Schema; is probably not needed in this file/doc 