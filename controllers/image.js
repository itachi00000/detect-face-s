const clarifai = require('clarifai');

// add clarifai key at heroku "config vars"
const clarifaiApp = new clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

const handleApiCall = (req, res) => {
  clarifaiApp.models
    .predict(clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => {
      console.error(err);
      return res.status(400).json('unable to work with clarifai API');
    });
};

const handleImage = (req, res, db) => {
  const { id, email } = req.body;

if(req.auth.email !== email){
  throw Error('not authorized')
}

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
  handleApiCall,
  handleImage
};
