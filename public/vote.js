document.getElementById('voteForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const candidate = document.getElementById('candidate').value;

  // Retrieve the voterID from LocalStorage
  const voterID = localStorage.getItem('voterID');

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
  } else if (response.status === 400) {
    // Voter has already voted for the candidate
    alert('You have already voted for this candidate.');
  } else {
    // Voting failed, display an error message
    alert('Voting failed. Please try again later.');
  }
});
