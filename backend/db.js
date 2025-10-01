const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',  // or your MySQL host
  user: 'admin',       // your MySQL username
  password: 'U925JbruGuBEaln5',  // your MySQL password
  database: 'evolve'   // your DB name
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = connection;