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
    host: '127.0.0.1',
    user: 'postgres',
    password: '1234',
    database: 'smart-brain-db'
  }
});

const Port = process.env.PORT || 3000;

// express init
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors());

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

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

// listen to localhost:3000
app.listen(Port, () => {
  console.log('Smart Brain App Server is running at port: ' + Port);
});

/*

/ --> res  = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image  --> PUT (updating) = user

*/
