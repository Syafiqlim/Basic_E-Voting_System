const http = require('http');
const express = require('express');
const mysql = require('mysql2');
const os = require('os');
const app = express();
const server = http.createServer(app);
const port = 3000;
const session = require('express-session');

// Function to find the local IP address of a specific network adapter
function findLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  const adapterName = 'Wi-Fi'; // Replace with your network adapter name
  const adapter = networkInterfaces[adapterName];
  if (!adapter) {
    return null;
  }

  const address = adapter.find((entry) => entry.family === 'IPv4');
  return address ? address.address : null;
}

const localIP = findLocalIP();
if (!localIP) {
  console.error('Error: Network adapter not found.');
  process.exit(1);
}

// Add express-session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

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
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
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
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Server error.');
    } else if (results.length === 1) {
      // Voter credentials are valid, send a success response
      res.send('Login Successful');
    } else {
      // Invalid credentials, send a 401 Unauthorized response
      res.status(401).send('Invalid credentials. Please try again.');
    }
  });
});

// Handle vote requests
app.post('/vote', (req, res) => {
  const { candidate, voterID } = req.body;

  // Check if the voter has already voted
  const checkVoteSql = 'SELECT * FROM votes WHERE voterID = ?';
  connection.query(checkVoteSql, [voterID], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Server error.');
    } else if (results.length > 0) {
      // Voter has already voted, reject the vote
      res.status(403).send('You have already cast your vote.');
    } else {
      // Insert the vote data into the "votes" table
      const insertVoteSql = 'INSERT INTO votes (candidate, voterID) VALUES (?, ?)';
      connection.query(insertVoteSql, [candidate, voterID], (err, result) => {
        if (err) {
          console.error('Error storing vote:', err);
          res.status(500).send('Server error.');
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
