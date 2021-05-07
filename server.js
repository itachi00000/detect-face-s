const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const db = require('./config');

// controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// vars
const Port = process.env.PORT || 3000;
// var whitelist = ['http://localhost:3000/']
// var corsOptions = { origin: true }

// express init
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors());

// app.use(express.static('public'));

// request & response ??
app.get('/', (req, res) => {
  db.from('users')
    .select('*')
    .then(data => {
      console.log('data', data);
      return res.json(data);
    })
    .catch(error => {
      console.error(error);
      return res.status(404).json(error);
    });
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfile(req, res, db);
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// for clarifai api
app.post('/imageUrl', (req, res) => {
  image.handleApiCall(req, res);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

// listen to localhost:3000
app.listen(Port, err => {
  if (err) throw err;
  console.log(`Smart Brain App Server is running at port: ${Port}`);
});

/*

/ --> res  = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image  --> PUT (updating) = user

*/
