document.getElementById('voteForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const candidate = document.getElementById('candidate').value;

  // Get the voterID from localStorage (if stored during login)
  const voterID = localStorage.getItem('voterID');
  if (!voterID) {
    alert('VoterID not found. Please log in again.');
    return;
  }

  // Send the selected candidate and voterID to the server to save the vote
  const response = await fetch('/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ candidate, voterID })
  });

  // Check the response and handle accordingly
  if (response.ok) {
    // Vote successful, show a confirmation message
    alert('Vote successfully recorded. Thank you for voting!');
  } else if (response.status === 403) {
    // Voter has already voted, display a warning message
    alert('You have already cast your vote.');
  } else {
    // Voting failed, display an error message
    alert('Voting failed. Please try again later.');
  }
});
