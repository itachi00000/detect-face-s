const jwt = require('jsonwebtoken');

const redisClient = require('../auth').redisClient;
// const redis = require('redis');

// // (port, host)
// const redisClient = redis.createClient(6379, '127.0.0.1');
// // redisClient.selected_db = 1;

// redisClient.on('connect', ()=>{
//   console.log('<< connected to REDIS!')
// })

// // error
// redisClient.on('error', (error) => {
//   console.error('error-redis', error);
// });

// redisClient.set('foo', 'Ok');

// redisClient.get('foo', (err, reply) => {
//   console.log(reply.toString());
// });

const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }

  // get by email
  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      // exist?
      if (!data[0]) {
        return Promise.reject(Error('no user'));
      }

      // validating password
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => user[0])
          .catch((err) => Promise.reject(err));
      } else {
        return Promise.reject(Error('wrong credentials'));
      }
    })
    .catch((err) => Promise.reject(err));
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  console.log('processing authorize');

  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    console.log('authorized');
    return res.json({ id: reply });
  });
};

const setToken = (token, id) => {
  // .set(key, value)
  // promisify it
  return Promise.resolve(redisClient.set(token, id));
};

const createSessions = (user) => {
  //  jwt

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '2d'
  });

  return setToken(token, user.id)
    .then(() => ({
      success: true,
      userId: user.id,
      token
    }))
    .catch((err) => console.error(err));
};

const signinAuthentication = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;

  // session = { userId, token }
  // OR
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(req, res, db, bcrypt)
        .then((data) => {
          // console.log('data', data);
          if (data.id && data.email) {
            // if logging in
            // return .then((session) =>
            return createSessions(data);
          }
          return Promise.reject(Error('no user id or email'));
        })
        .then((session) => {
          console.log('session', session);
          return res.json(session);
        })
        .catch((err) => res.status(400).json(err.toString()));
};

module.exports = {
  signinAuthentication
};
