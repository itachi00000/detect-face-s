const expressJwt = require('express-jwt');
// const redis = require('redis');

// const redisClient = redis.createClient();

// redisClient.on('connect', () => {
//   console.log('<< connected to REDIS!');
// });

// redisClient.on('error', (error) => {
//   if (error) {
//     console.error('error', error);
//     throw error;
//   }
// });

// not using redis
// because no free remote-hosting for redis

// as middleware
// replace the requireAuth(w/ redis)
// access token from header.authorization, then jwt.verify it, then append req.auth
const isLoggedIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'auth' // this mw will append auth'. req.auth
});

// put only on router that has /:id
const isAuth = async (req, res, next) => {
  try {

    const authorized =
      req.profile.email &&
      req.auth.email &&
      req.profile.email === req.auth.email;

    if (!authorized) {
      return res.status(403).json('Unauthorized!');
    }

    return next();
  } catch (error) {
    return res.status(404).json(error);
  }
};

module.exports = { isLoggedIn, isAuth };
