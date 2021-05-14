const { createClient } = require('redis');

// default- host: 127.0.0.1, port: 6379
const redisClient = createClient();

redisClient.on('connect', () => {
  console.log('<< connected to redis-DB');
});

// error
redisClient.on('error', (error) => {
  if (error) {
    // console.error('error-redis', error);
    throw error;
  }
});

const requireAuth = (req, res, next) => {
  // by standard, authorization format is 'Bearer <token>'
  const { authorization } = req.headers;

  if (!authorization) {
    console.log('require-auth-failed');
    return res.status(403).json('Unauthorized');
  }

  // replace/removing 'Bearer '
  return redisClient.get(authorization.replace('Bearer ', ''), (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    console.log('require-auth-passed');
    return next();
  });
};

module.exports = { requireAuth, redisClient };
