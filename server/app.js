var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();

require('./config/middleware.js')(app, express);
mongoose.connect('mongodb://localhost/makerpair');
app.set('view engine', 'ejs');



app.use(session({//Always requires these 3 things:
                 //Keycode for what it will use on cookies
                 secret:'qwerty12345',
                 //Save sessions on permanent storage. 
                 //Persistant login even if server goes down
                 saveUninitialized: true,
                 //Even if nothing is changed, save again
                 resave: true }));



////////SCHEMA & CONNECT ///////////

var Schema = mongoose.Schema;

var User = mongoose.model('User', new Schema({
  cohort: String,
  username: {type: String, unique: true},
  password: String
}));


///////////////////////////////////////

//This will display all users
// User.find({}, function(err,docs){
// if (!err){
//   // console.log(docs);
//   // process.exit();
// } else {throw err;}

// });
var randomUser = function(cb) {
  var result = User.count().exec(function(err, count){

    var random = Math.floor(Math.random() * count);

    User.findOne().skip(random).exec(
      function (err, result) {
        return result.username;
      });

  });
  cb(result);
}



app.get('/pair', function(req, res){
  randomUser(function(result){
    console.log(result);
    res.end(result);
  });  
});

////////////////REGISTER/////////////

app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res){
  var user = new User({
    cohort: req.body.cohort,
    username: req.body.username,
    password: req.body.password
  });
  user.save(function(err){
    if (err) {
      var err = 'Sorry, error :(';
      if(err.code === 11000) {
        console.log('That username was already taken, try another');
      }
      res.render('register', {error: error})
    } else {
      req.session.user = user;
      res.redirect('/dashboard');
    }
  }); 
});

/////////////////////////////////////


/////////////LOGIN///////////////////

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res){
  User.findOne({username: req.body.username}, function(err, user){
    if (!user) {
      //Errors should display on the html when error occurs, currently is not
      res.render('login', {error: 'Invald username or password'});
    } else {
      if (req.body.password === user.password) {
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        res.render('login', {error: 'Invald username or password'});
      }
    }
  });
});


/////////////////////////////////////


/////////////DASHBOARD///////////////////

app.get('/dashboard', function(req, res) {
  if (req.session && req.session.user) {
    User.findOne({username: req.session.user.username}, function(err, user){
      if(!user) {
        req.session.destroy(function(err){
          if(err) {
            throw err;
          } else {
            res.redirect('/login'); 
          }
        });
      } else {
        //We can now access user in any of our templates
        res.locals.user = user;
        res.render('dashboard');
      }
    });
  } else {
    res.redirect('/');
  }
});
/////////////////////////////////////







app.get('/', function(req, res){
  res.render('index');
});



app.get('/logout', function(req, res) {
  req.session.destroy(function(err){
    if(err) {
      throw err;
    } else {
      res.redirect('/'); 
    }
  });
});



module.exports = app;




//Mongo commands
//Mongo - to run
//use 'db name'; - in my case, makerpair
//show collections; - show all the tables in db
//db.users.find(); - shows all users that are in the table 






