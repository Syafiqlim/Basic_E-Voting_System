const http = require('http');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const server = http.createServer(app)
const port = 3000;
const localIP = '192.168.37.242';

// Create a MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'farasyafiq2404',
  database: 'evoting_db',
  port: 3306 // Replace with the actual MySQL protocol port if different
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Serve static assets from the "public" folder
app.use(express.static('public'));

// Parse incoming request bodies (for parsing POST data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle login requests
app.post('/login', (req, res) => {
  const { voterID, password } = req.body;

  // Check if the provided voter credentials exist in the "voters" table
  const sql = 'SELECT * FROM voters WHERE voterID = ? AND password = ?';
  connection.query(sql, [voterID, password], (err, results) => {
    if (err) throw err;

    if (results.length === 1) {
      // Voter credentials are valid
      res.send('Login Successful');
    } else {
      // Invalid credentials
      res.status(401).send('Invalid credentials. Please try again.');
    }
  });
});

app.post('/vote', (req, res) => {
  const { candidate } = req.body; // Ensure this line is present to extract "candidate" from the request body

  // Insert the vote data into the "votes" table
  const sql = 'INSERT INTO votes (candidate) VALUES (?)';
  connection.query(sql, [candidate], (err, result) => {
    if (err) {
      console.error('Error storing vote:', err);
      res.status(500).send('Error storing vote.');
    } else {
      console.log('Vote successfully recorded:', result);
      res.send('Vote Successful');
    }
  });
});

server.listen(port, localIP, () => {
  console.log(`Server running at http://${localIP}:${port}/`);
});