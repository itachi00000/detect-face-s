const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// connect server to database (postgres or pg)
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

// vars
const Port = process.env.PORT || 3000;
var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


// express init
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(express.static('public'));

// request & response ??
app.get('/', (req, res) => {
  res.send(db.users);
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
app.listen(Port, () => {
  console.log(`Smart Brain App Server is running at port: ${Port}`);
});

/*

/ --> res  = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image  --> PUT (updating) = user

*/
