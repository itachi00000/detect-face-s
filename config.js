const dotenv = require('dotenv'); // always on top

dotenv.config({ path: './.env.development.local' });

// if using connectionString
// const isProduction = process.env.NODE_ENV === 'production';
// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
// connection: {connectionString : connectionString}

// from knex site???
const knexConfig = {
  development: {
    client: 'pg',
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE
    }
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    },
    pool: { min: 0, max: 7 }
  }
};

// conditional but using object['key'] tricks,
// knexConfig['production'] or knexConfig['development']
// check if process.env.NODE_ENV === 'production' else use 'development'
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

module.exports = knex;
