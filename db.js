const { Pool } = require('pg');

const pool = new Pool({
    user:"postgres",
    password: "259726777",
    host:"localhost",
    port:5432,
    database:"Backend",
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};