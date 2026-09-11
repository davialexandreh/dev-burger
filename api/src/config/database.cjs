require('dotenv').config();

const usaSSL = process.env.PG_SSL === 'true';

module.exports = {
  dialect: 'postgres',
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  // provedores gerenciados (Neon, Render, Supabase) exigem SSL
  dialectOptions: usaSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  define: {
    timespamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
