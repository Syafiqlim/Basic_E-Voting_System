document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const voterID = document.getElementById('voterID').value;
  const password = document.getElementById('password').value;

  // Send the voterID and password to the server for verification
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ voterID, password })
  });

  // Check the response and handle accordingly
  const responseData = await response.json();
  if (response.ok) {
    if (responseData.warning) {
      // Voter has already voted, show a warning message
      alert(responseData.warning);
    } else {
      // Successful login, redirect to the vote form
      window.location.href = '/vote.html';
    }
  } else {
    // Login failed, display an error message
    alert('Login failed. Please check your credentials and try again.');
  }
});
