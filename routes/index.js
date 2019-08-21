
//Requiring the needed modules
const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//creating a variable and setting page and count to equal 0
let page = 0; 
let count = 0;

//getting the home page 
router.get('/', (req, res, next) => {
  res.redirect('/books/page/0')
});
//getting the /books route and redirecting it to home 
router.get('/books', (req, res, next) => {
  res.redirect('/books/page/0')
});

//getting the books page
router.get('/books/page/:page', (req, res, next) => {
  if(req.params.page == -1){
    //Redirect to first page if the page was to go to a negative page
    res.redirect('/books/page/0') 
  }
  else{
    if(count > req.params.page){
      count -=1; 
    } 

    if(count < req.params.page){
      count +=1 
    }
    Book.findAll({
      order: [["createdAt", "DESC"]],
      //setting limit to 4 items
      limit: 4, 
      offset: req.params.page * 4
    }).then((books) => {
      if(books.length ===0){
        //render no found and reset the count if page number is exceeded 
        res.render('page-not-found'); 
        count = 0;
      }else {
        res.render('index', { 
          page: page + count, 
          pagePrevious: ((page + count)-2),
          books, 
          title:'Books'
        });
      }
    }).catch((err) => {
      if(err.name ==='SequelizeDatabaseError'){
        res.render('page-not-found');
        count = 0;
      }
    })
    
      count += 1; //every time after the render, increase the count by 1 
      if((count - req.params.page) === 2){
        count -= 1; 
      }
    }
  });

  //getting the new book 
  router.get('/books/new', (req, res, next) => {
    //passing a model instance to the form for later submission
    res.render('new-book', {book: Book.build()}) 
  });

  //posting new book
  router.post('/books/new', (req, res, next) => {
    Book.create({
      title: req.body.title, 
      author: req.body.author,
      genre: req.body.genre,
      year: req.body.year
    }).then(() => {
      res.redirect('/books/page/0')
    }).catch((err) => {
      // if statement to handle error if any
      if(err.name === 'SequelizeValidationError'){
        res.render('new-book', {
          book: Book.build,
          errors: err.errors
        })
      } else {
        throw err;
      }
    }).catch((err) => {
      res.send(500)
    })
});


//getting update book
router.get('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id).then((book) => {
    res.render('update-book',{book}) 
  })
});


//posting book id
router.post('/books/:id', (req, res, next) => {
  Book.update({
    title: req.body.title, 
    author: req.body.author,
    genre: req.body.genre,
    year: req.body.year
  }, {
    //find the book
    where: {id: req.params.id} 
  }).then(() => {
    res.redirect('/books/page/0')
  }).catch((err) => {
    if(err.name === 'SequelizeValidationError'){
      //getting an instance of the modal
      const book = Book.build(req.body); 
      //getting the correct id
      book.id = req.params.id; 
      res.render('new-book', {
        book: book, 
        errors: err.errors
      })
    } else {
      throw err;
    }
  }).catch((err) => {
    res.send(500)
  })
});

//posting book id delete
router.post('/books/:id/delete', (req, res, next) => {
  Book.destroy({where: {id: req.params.id}}).then(() => {
    res.redirect('/books/page/0')
  })
});

//getting book search 

router.get('/search', (req, res, next) => {
  //search the items
  const term = req.query.term;
  Book.findAll({
    order: [["createdAt", "DESC"]],
    where: {
      [Op.or]:[
        {title: {
          [Op.like] : '%' + term + '%'
        }},
        {author: {
          [Op.like] : '%' + term + '%'
        }},
        {genre: {
          [Op.like] : '%' + term + '%'
        }},
        {year: {
          [Op.like] : '%' + term + '%'
        }}
      ]
    }
  }).then((books) => {
    res.render(
      'index', 
    {
      books,
      search: true
    })
  })
  
});



module.exports = router;