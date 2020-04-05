const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1234',
    database: 'smart-brain-db'
  }
});

const PORT = 3000;

const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors());

// database
const database = {
  users: [
    {
      id: '123',
      name: 'Juan',
      email: 'juan@gmail.com',
      password: 'bayabas',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Maria',
      email: 'maria@gmail.com',
      password: 'sampaguita',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      has: '',
      email: 'john@gmail.com'
    }
  ]
};

// request & response ??
app.get('/', (req, res) => {
  res.send(database.users);
});

app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (userId === user.id) {
      found = true;
      return res.json(user);
    }
  });

  if (!found) {
    res.status(400).json('no such user');
  }
});

app.post('/signin', (req, res) => {
  bcrypt.compare(
    'apple',
    '$2a$10$5b8ejcXaBbGY0uS6M8yFH.j83pL5fWp7nrofyj/KSk.L9GZPCSLzq',
    function(err, res) {
      console.log('first guest', res);
    }
  );

  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json({ msg: 'error' });
  }
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  // bcrypt.hash(password, null, null, function(err, hash) {
  //   console.log(hash);
  // });

  if (!name || !password || !email) {
    return res.status(400).json({ msg: 'error' });
  }

  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });

  res.json(database.users[database.users.length - 1]);
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (id === user.id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    res.status(404).json('no such user');
  }
});

app.listen(PORT, () => {
  console.log('Smart Brain App Server is running on port: ' + PORT);
});

/*

/ --> res  = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image  --> PUT (updating) = user


*/
