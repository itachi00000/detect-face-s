const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

const db = require('./config');

// route
const robotsRoute = require('./routes/robots.route');

// controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// auth
const { isLoggedIn, isAuth } = require('./auth');

// env
dotenv.config({
  path: './.env.dev.local'
});

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

// app.get('/hi', (req, res) => {
//   console.log('sessionId', req.sessionID);
//   return res.json('hi world ' + req.sessionID);
// });

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// auth.requireAuth has (req, res, next)
app.post('/signin', (req, res) => {
  return signin.handleSignin(req, res, db, bcrypt);
});

app.get('/profile/:id', isLoggedIn, isAuth, (req, res) => {
  profile.handleProfile(req, res);
});

// patch or put
app.patch('/profile/:id', isLoggedIn, isAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

// /imageUrl - for clarifai api
app.post('/imageurl', isLoggedIn, (req, res) => {
  image.handleApiCall(req, res);
});

app.put('/image', isLoggedIn, (req, res) => {
  image.handleImage(req, res, db);
});

app.use('/robots', robotsRoute);

// params
app.param('id', (req, res, next, id) => {
  profile.byId(req, res, next, id, db);
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
