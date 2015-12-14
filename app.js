var bodyParser = require('body-parser');
var partials = require('express-partials');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');


app.set('view engine', 'ejs');



///////MIDDLEWARE////////
app.use(partials());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({//Always requires these 3 things:
                 //Keycode for what it will use on cookies
                 secret:'qwerty12345',
                 //Save sessions on permanent storage. 
                 //Persistant login even if server goes down
                 saveUninitialized: true,
                 //Even if nothing is changed, save again
                 resave: true }));

app.use(express.static(__dirname +'/public'));

/////////////////////////








////////SCHEMA & CONNECT ///////////

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User', new Schema({
  id: ObjectId,
  cohort: String,
  username: {type: String, unique: true},
  password: String
}));

// var Assignment = mongoose.model('Assignment', new Schema(){
//   id: ObjectId,
//   name: String,
//   password: String

// })

mongoose.connect('mongodb://localhost/makerpair');

///////////////////////////////////////






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
      res.redirect('/login'); 
    }
  });
});

app.listen(3000);
console.log('server up');











