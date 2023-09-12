const mysql = require('mysql');

const myConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,  
});

myConnection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = { myConnection }