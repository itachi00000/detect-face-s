const jwt = require('jsonwebtoken');

const handleSignin = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;

  // if authorized, Bearer <token>
  if (authorization) {
    const decoded = jwt.verify(
      authorization.replace('Bearer ', ''),
      process.env.JWT_SECRET
    );

    return db
      .select('*')
      .from('users')
      .where('email', '=', decoded.email)
      .then((data) => {
        if (!data.length) {
          throw Error('no user found');
        }

        return res.json(data[0]);
      })
      .catch(console.error);
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
        expiresIn: '1h'
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

module.exports = {
  handleSignin
};
