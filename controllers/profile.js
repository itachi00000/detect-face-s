//
const handleProfile = (req, res, db) => {
  const user = req.profile;

  return res.json(user);
};

//
const handleProfileUpdate = (req, res, db) => {
  const { id } = req.profile;
  const { username, pet, age, name } = req.body.formInput;

  // testing to entry
  if (!name) {
    return res.status(400).json('enter username, pet, age');
  }

  //
  db.from('users')
    .select('*')
    .where({ id })
    .update({ name })
    // .returning('users')
    .then((resp) => {
      if (!resp) {
        return res.status(404).json('fail to update');
      }

      res.json('updated success');
    })
    .catch(console.error);
};

const byId = async (req, res, next, id, db) => {
  return db
    .select('*')
    .from('users')
    .where({ id })
    .then((users) => {
      if (!users.length) {
        return res.status(400).json('user Not found');
      }
      // mount
      req.profile = users[0];

      return next();
    })
    .catch(() => res.status(400).json('Error getting user'));
};

module.exports = {
  handleProfile,
  handleProfileUpdate,
  byId
};
