const cohortName = '2310-fsa-et-web-pt-sf';

// Define the base API endpoint
const apiEndpoint = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

// DOM elements
const app = document.getElementById('app');
const rosterContainer = document.getElementById('roster-container');
const detailsContainer = document.getElementById('details-container');
const addPlayerForm = document.getElementById('add-player-form');
const puppyRainContainer = document.getElementById('puppy-rain-container');

// Function to fetch and render the roster
const fetchRoster = async () => {
  try {
    // Fetch roster data from the API
    const response = await fetch(`${apiEndpoint}players`);
    const roster = await response.json();

    // Render the roster
    rosterContainer.innerHTML = `
      <h2>Roster</h2>
      <div class="player-list">
        ${roster.map(renderPlayer).join('')}
      </div>`;
  } catch (error) {
    console.error('Error fetching roster:', error);
  }
};

// Function to render an individual player
const renderPlayer = (player) => `
  <div class="player" onclick="showPlayerDetails(${player.id})">
    <img src="${player.image}" alt="${player.name}" class="player-image">
    <p>${player.name} - ${player.breed}</p>
  </div>`;

// Function to fetch and render player details
const showPlayerDetails = async (playerId) => {
  try {
    // Fetch player details from the API
    const response = await fetch(`${apiEndpoint}/player/${playerId}`);
    const player = await response.json();

    // Render player details
    detailsContainer.innerHTML = `
      <h2>${player.name}</h2>
      <img src="${player.image}" alt="${player.name}" class="player-image-details">
      <p>Breed: ${player.breed}</p>
      <p>Age: ${player.age}</p>
      <button onclick="removePlayer(${player.id})">Remove Player</button>`;
  } catch (error) {
    console.error('Error fetching player details:', error);
  }
};

// Function to remove a player from the roster
const removePlayer = async (playerId) => {
  try {
    // Send a DELETE request to remove the player
    await fetch(`${apiEndpoint}/removePlayer/${playerId}`, { method: 'DELETE' });

    // Refresh the roster after removing a player
    fetchRoster();
    // Clear player details after removal
    detailsContainer.innerHTML = '';
  } catch (error) {
    console.error('Error removing player:', error);
  }
};

// Event listener for adding a player
addPlayerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get input values
  const name = document.getElementById('name').value;
  const breed = document.getElementById('breed').value;

  try {
    // Send a POST request to add a new player
    const response = await fetch(`${apiEndpoint}/addPlayer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, breed }),
    });

    // Refresh the roster after adding a player
    fetchRoster();
  } catch (error) {
    console.error('Error adding player:', error);
  }
});

// Initial fetch and render
fetchRoster();








