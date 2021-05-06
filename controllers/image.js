const clarifai = require('clarifai');

const clarifaiApp = new clarifai.App({
  apiKey: '8ea19eb392504707829b8a54eefc3ce0'
});

const handleApiCall = (req, res) => {
  clarifaiApp.models
    .predict(clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => {
      console.error(err);
      return res.status(400).json('unable to work with API');
    });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(() => res.status(400).json('Unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall
};
