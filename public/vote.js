document.getElementById('voteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const candidate = document.getElementById('candidate').value; // Ensure this line is present to get the selected candidate
  
    // Send the selected candidate to the server to save the vote
    const response = await fetch('/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ candidate }) // Make sure "candidate" is passed in the body
    });
  
    // Check the response and handle accordingly
    if (response.ok) {
      // Vote successful, show a confirmation message
      alert('Vote successfully recorded. Thank you for voting!');
    } else {
      // Voting failed, display an error message
      alert('Voting failed. Please try again later.');
    }
  });
  