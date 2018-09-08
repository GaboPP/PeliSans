var pgp = require("pg-promise")(/*options*/);
var connection = pgp("postgres://postgres:@host:5432/cine"); 
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: '5432', //suele ser 5432,
  user: 'postgres',
  password: '',
  database: 'cine',
})

client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('conectado!')
    }
})

module.exports = connection;