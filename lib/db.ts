import mysql, { Connection } from 'mysql2';

// Define the database connection
const connection: Connection = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql.railway.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'bysauvdvVVxWbzLuwRtCKFrfGIOeofMZ',
  database: process.env.DB_NAME || 'railway',
  port: Number(process.env.DB_PORT) || 3306,  // MySQL default port
});

// Optional: test the connection
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

export default connection;
