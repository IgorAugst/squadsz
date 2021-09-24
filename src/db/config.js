const dotenv = require('dotenv');

dotenv.config();

const database = {
  user: process.env.POSTGRES_USER || '',
  host: process.env.POSTGRES_HOST || '',
  database: process.env.POSTGRES_DB || '',
  password: process.env.POSTGRES_PASSWORD || '',
  port: process.env.POSTGRES_PORT || 5432,
};

module.exports = database;
