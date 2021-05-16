const jwt = require('jsonwebtoken');

// const redisClient = require('../auth').redisClient;

const handleSignin = (req, res, db, bcrypt) => {
  const { authorization } = req.headers

// if authorized, Bearer <token>
if( authorization ){
   const decoded = jwt.verify(authorization.replace('Bearer ', ''), process.env.JWT_SECRET)
   
   return db
    .select('*')
    .from('users')
    .where('email', '=', decoded.email)
    .then((data) => {

      if (!data.length) {
        throw Error('no user found');
      }

      return res.json(data[0])
    })
    .catch(console.error)
  }

// if not authorized

  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    throw Error('incorrect form submission');
  }

  // get by email
  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      
      // exist?
      if (!data.length) {
        throw Error('no user');
      }

      // validating password
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (!isValid) {
        throw Error('wrong credentials');
      }

      const token = jwt.sign({ email: data[0].email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return db
        .select('*')
        .from('users')
        .where('email', '=', email)
        .then((users) => {
          return res.json({
            success: true,
            userId: users[0].id,
            token
          });
        })
        .catch((err) => res.status(400).json(err.toString()));
    })
    .catch((err) => res.status(400).json(err.toString()));
};

// const getAuthTokenId = (req, res) => {
//   const { authorization } = req.headers;
//   console.log('processing authorize');

//   return redisClient.get(authorization, (err, reply) => {
//     if (err || !reply) {
//       return res.status(400).json('Unauthorized');
//     }
//     console.log('authorized');
//     return res.json({ id: reply });
//   });
// };

// const setToken = (token, id) => {
//   // .set(key, value)
//   // promisify it
//   return Promise.resolve(redisClient.set(token, id));
// };

// const createSessions = (user) => {
//   //  jwt

//   const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
//     expiresIn: '2d'
//   });

//   return setToken(token, user.id)
//     .then(() => ({
//       success: true,
//       userId: user.id,
//       token
//     }))
//     .catch((err) => console.error(err));
// };

const signinAuthentication = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;

  // session = { userId, token }
  // OR
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(req, res, db, bcrypt)
        .then((user) => {
          if (!user.id || !user.email) {
            return Promise.reject(Error('no user id or email'));
          }

          const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
          );

          return res.json({
            success: true,
            userId: user.id,
            token
          });
        })
        .catch((err) => res.status(400).json(err.toString()));
};

module.exports = {
  signinAuthentication,
  handleSignin
};
