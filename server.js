const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const db = require('./config');

// controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
// auth
const auth = require('./auth');

// vars
// heroku has it own PORT
const Port = process.env.PORT || 3000;

// express init
const app = express();

// middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(express.static('public'));

// request & response ??
// app.get('/', (req, res) => {
//   db.from('users')
//     .select('*')
//     .then((data) => {
//       return res.json(data);
//     })
//     .catch((error) => {
//       console.error(error);
//       return res.status(404).json(error);
//     });
// });

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// auth.requireAuth has (req, res, next)
app.post('/signin', (req, res) => {
  signin.signinAuthentication(req, res, db, bcrypt);
});

app.get('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfile(req, res, db);
});

app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

// /imageUrl - for clarifai api
app.post('/imageurl', auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

app.put('/image', auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});

//
app.use('*', (req, res, next) => {
  const error = new Error(`${req.ip} tried to access ${req.originalUrl}`);
  console.log(error);

  return res.status(404).json('not existed');
});

// listen to localhost:3000
app.listen(Port, (err) => {
  if (err) throw err;
  console.log(`<< Smart-Brain-App ExpServer is running at port: ${Port}`);
});

/*

/ --> res  = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image  --> PUT (updating) = user

*/
