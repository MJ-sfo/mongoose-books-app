console.log("Sanity Check: JS is working!");
var $booksList;
var allBooks = [];

$(document).ready(function(){

  $booksList = $('#bookTarget');
  $.ajax({
    method: 'GET',
    url: '/api/books',
    success: handleSuccess,
    error: handleError
  });

  $('#newBookForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/books',
      data: $(this).serialize(),
      success: newBookSuccess,
      error: newBookError
    });
  });

  $booksList.on('click', '.deleteBtn', function() {
    console.log('clicked delete button to', '/api/books/'+$(this).attr('data-id'));
    $.ajax({
      method: 'DELETE',
      url: '/api/books/'+$(this).attr('data-id'),
      success: deleteBookSuccess,
      error: deleteBookError
    });
  });
  //  this is from solutions
  $booksList.on('submit', '#addCharacterForm', function(e) {
    e.preventDefault();
    console.log('new characters');
    $.ajax({
      method: 'POST',
      url: '/api/books/'+$(this).attr('data-id')+'/characters',
      data: $(this).serializeArray(),
      success: newCharacterSuccess,
      error: newCharacterError
    });
  });
});  //  ALL $booksList functions need to be within this curly-bracket

// this is what i started with
// function getBookHtml(book) {
  // if change ${book.author.name}, makes webpage blank out
//   return `<hr>
//           <p>
//             <b>${book.title}</b>
//             by ${book.author}
//             <button type="button" name="button" class="deleteBtn btn btn-danger pull-right" data-id=${book._id}>Delete</button>
//           </p>`;
// }




// });

function getCharacterHtml(_book_id, character) {
return `${character.name} <button class="deleteCharacter btn btn-danger" data-bookid=${_book_id} data-charid=${character._id}><b>x</b></button>`;
}

function getAllCharactersHtml(_book_id, characters) {
if (characters) {
  return characters.map(function(character) {
              return getCharacterHtml(_book_id, character);
            }).join("");
} else {
  return "";
}
}

function getBookHtml(book) {
  return `<hr>
          <p>
            <b>${book.title}</b>
            by ${(book.author) ? book.author.name : 'null'}
            <br>
            <b>Characters:</b>
            ${getAllCharactersHtml(book.id, book.characters)}
            <button type="button" name="button" class="deleteBtn btn btn-danger pull-right" data-id=${book._id}>Delete</button>
          </p>
          <form class="form-inline" id="addCharacterForm" data-id=${book._id}>
            <div class="form-group">
              <input type="text" class="form-control" name="name" placeholder="Book character">
            </div>
            <button type="submit" class="btn btn-default">Add character</button>
          </form>
          `;
}

function getAllBooksHtml(books) {
  return books.map(getBookHtml).join("");
}

// helper function to render all posts to view
// note: we empty and re-render the collection each time our post data changes
function render () {
  // empty existing posts from view
  $booksList.empty();

  // pass `allBooks` into the template function
  var booksHtml = getAllBooksHtml(allBooks);

  // append html to the view
  $booksList.append(booksHtml);
};

function handleSuccess(json) {
  allBooks = json;
  render();
}

function handleError(e) {
  console.log('uh oh');
  $('#bookTarget').text('Failed to load books, is the server working?');
}

function newBookSuccess(json) {
  $('#newBookForm input').val('');
  allBooks.push(json);
  render();
}

function newBookError() {
  console.log('newbook error!');
}

function deleteBookSuccess(json) {
  var book = json;
  console.log(json);
  var bookId = book._id;
  console.log('delete book', bookId);
  // find the book with the correct ID and remove it from our allBooks array
  for(var index = 0; index < allBooks.length; index++) {
    if(allBooks[index]._id === bookId) {
      allBooks.splice(index, 1);
      break;  // we found our book - no reason to keep searching (this is why we didn't use forEach)
    }
  }
  render();
}

function deleteBookError() {
  console.log('deletebook error!');
}
