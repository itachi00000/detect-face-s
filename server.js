const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// middleware
app.use(bodyParser.json());

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
  ]
};

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
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(`Welcome back ${req.body.name}`);
  } else {
    res.status(400).json('Error Logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  database.users.push({
    id: '125',
    name,
    email,
    password,
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
    res.status(400).json('no such user');
  }
});

app.listen(3000, () => {
  console.log('Smart Brain API is running on port 3000');
});

/*

/ --> res  = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image  --> PUT (updating) = user


*/
