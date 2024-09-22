require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,      
  user: process.env.DB_USER,      
  password: process.env.DB_PASS,  
  database: process.env.DB_NAME   
});
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database successfully!');
    connection.release(); 
  }
});

module.exports = pool.promise();
