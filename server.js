const http = require('http');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const server = http.createServer(app);
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

      // Check if the voter has already voted
      const voterID = results[0].voterID;
      const checkVoteSql = 'SELECT * FROM votes WHERE voterID = ?';
      connection.query(checkVoteSql, [voterID], (err, voteResults) => {
        if (err) throw err;

        if (voteResults.length > 0) {
          // Voter has already voted, send a warning message upon successful login
          res.json({ warning: 'Warning: You have already cast your vote.' });
        } else {
          // Voter has not voted yet, proceed with login
          res.json({ message: 'Login Successful' }); // Send a JSON response
        }
      });
    } else {
      // Invalid credentials
      res.status(401).send('Invalid credentials. Please try again.');
    }
  });
});

app.post('/vote', (req, res) => {
  const { candidate, voterID } = req.body;

  // Check if the voter has already voted
  const checkVoteSql = 'SELECT * FROM votes WHERE voterID = ?';
  connection.query(checkVoteSql, [voterID], (err, voteResults) => {
    if (err) {
      console.error('Error checking vote:', err);
      res.status(500).send('Error checking vote.');
    } else if (voteResults.length > 0) {
      // Voter has already voted, send an error message
      res.status(400).send('Error: You have already cast your vote.');
    } else {
      // Insert the vote data into the "votes" table
      const insertVoteSql = 'INSERT INTO votes (candidate, voterID) VALUES (?, ?)';
      connection.query(insertVoteSql, [candidate, voterID], (err, result) => {
        if (err) {
          console.error('Error storing vote:', err);
          res.status(500).send('Error storing vote.');
        } else {
          console.log('Vote successfully recorded:', result);
          res.send('Vote Successful');
        }
      });
    }
  });
});

server.listen(port, localIP, () => {
  console.log(`Server running at http://${localIP}:${port}/`);
});
