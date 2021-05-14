//
const handleProfile = (req, res, db) => {
  const { id } = req.params;

  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        return res.json(user[0]);
      } else {
        return res.status(400).json('Not found');
      }
    })
    .catch(() => res.status(400).json('Error getting user'));
};

//
const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { username, pet, age, name } = req.body.formInput;

  // testing to tight entry
  if (!username || !pet || !age || !id) {
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
        return res.status(404).json('fail');
      }

      res.json('success');
    })
    .catch(console.error);
};

module.exports = {
  handleProfile,
  handleProfileUpdate
};
