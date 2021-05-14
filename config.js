const dotenv = require('dotenv'); // always on top

dotenv.config({ path: './.env.dev.local' });

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
    },
    pool: {
      // afterCreate callback (rawDriverConnection, done)
      afterCreate(connection, done) {
        console.log('database connected?');
        done(null, connection);
        // for both error and connected
        done(null, connection);
      },
      min: 0,
      max: 7
    }
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    },
    pool: {
      afterCreate(connection, done) {
        console.log('database connected?');
        done(null, connection);
      },
      min: 0,
      max: 7
    }
  }
};

// conditional but using object['key'] tricks,
// knexConfig['production'] or knexConfig['development']
// check if process.env.NODE_ENV === 'production' else use 'development'
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

//  checking connection
// knex
//   .raw('SELECT VERSION()')
//   .then(() => {
//     console.log('DB connection established');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// then export
module.exports = knex;
