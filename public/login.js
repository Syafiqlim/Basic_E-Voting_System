// login.js
document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const voterID = document.getElementById('voterID').value;
  const password = document.getElementById('password').value;

  // Send the voterID and password to the server for verification
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ voterID, password }),
  });

  // Check the response and handle accordingly
  if (response.ok) {
    // Successful login, save the voterID to the session and redirect to the vote form
    sessionStorage.setItem('voterID', voterID);
    window.location.href = '/vote.html';
  } else {
    // Login failed, display an error message
    alert('Login failed. Please check your credentials and try again.');
  }
});
