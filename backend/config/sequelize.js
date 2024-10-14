// require('dotenv').config({ path: './backend/.env' });
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,      
//   user: process.env.DB_USER,      
//   password: process.env.DB_PASS,  
//   database: process.env.DB_NAME   
// });
// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error('Error connecting to the database:', err.message);
//   } else {
//     console.log('Connected to the MySQL database successfully!');
//     connection.release(); 
//   }
// });

// module.exports = pool.promise();

// backend/config/db.js

require('dotenv').config({ path: './backend/.env' });  // Load environment variables
const { Sequelize } = require('sequelize');

// Initialize Sequelize with environment variables
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',  // Assuming you're using MySQL
});

// Export the Sequelize instance
module.exports = sequelize;

