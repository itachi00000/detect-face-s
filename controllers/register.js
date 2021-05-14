const handleRegister = (req, res, db, bcrypt) => {
  const { email, password, name } = req.body;

  // checking for number
  db.from('users')
    .select('*')
    .then(data => {
      if (data.length > 10) {
        return res.status(500).json('full! use, e: guest@gmail.com, p: guest');
      }
    })
    .catch(err => res.status(404).json(err));

  // checking for empty value
  if (!name || !password || !email) {
    return res.status(400).json('enter name password email');
  }

  // create hash
  const hash = bcrypt.hashSync(password);

  // transaction of login and users table
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(() => res.status(400).json('Unable to Register'));
};

module.exports = {
  handleRegister: handleRegister
};
