const cohortName = '2310-fsa-et-web-pt-sf';

;// Define the base API endpoint
const apiEndpoint = 'https://fsa-puppy-bowl.herokuapp.com/api/${2310-fsa-et-web-pt-sf}/';

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
    const response = await fetch(`${apiEndpoint}/roster`);
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

async function showHide(idx) {
    document.querySelector(`#span${idx} button`).style.display = "none"; // Fix: Hide the button, not the span
    await fetchSinglePlayer(idx);
};

function removeExInfo(id) {
    document.querySelector(`#extraInfo${id}`).style.display = "none";
    document.querySelector(`#span${id}`).style.display = "block";
}

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + "players/" + playerId);
        const result = await response.json();
        state.singlePlayer = result.data.player;
        let exInfoDiv = document.querySelector(`#extraInfo${playerId}`);
        exInfoDiv.style.display = "block";
        exInfoDiv.innerHTML = `
            <p>Status: ${state.singlePlayer.status}</p>     
            <p>Team ID: ${state.singlePlayer.teamId}</p>
            <button onclick="removeExInfo(${state.singlePlayer.id})">Show Less</button>
            <button onclick="removePlayer(${state.singlePlayer.id})">Remove</button>
        `;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL + "players/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        const result = await response.json();
        console.log(result);
        init();
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + "players/" + playerId, {
            method: "DELETE",
        });
        const result = await response.json();
        console.log(result);
        init();
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

const renderAllPlayers = (playerList) => {
    try {
        let renderedPlayers = playerList.map((p) => {
            let indPlayer = document.createElement("ul");
            indPlayer.innerHTML = `
            <div class="card">
                <img src=${p.imageUrl} alt="${p.breed} puppy">
                <div class="container${p.id} mainPuppyInfo">
                    <h4>Name: ${p.name}</h4>
                    <p>Breed: ${p.breed}</p>
                    <div id="extraInfo${p.id}" style="display:none">
                    </div>
                <div>
                <span id="span${p.id}">
                <button onclick="showHide(${p.id})"> Show more!</button>
                <button onclick="removePlayer(${p.id})">Remove</button>
                </span>
            </div>
            `;
            return indPlayer;
        });
        puppyListDiv.append(...renderedPlayers);
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderNewPlayerForm = () => {
    const formHTML = `
        <h2>Puppy Bowl New Player Form</h2>
        <form id="addPlayerForm">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="breed">Breed:</label>
            <input type="text" id="breed" name="breed" required>

            <label for="imageUrl">Image URL:</label>
            <input type="url" id="imageUrl" name="imageUrl" required>

            <button type="submit">Add Player</button>
        </form>
    `;
    newPlayerFormContainer.innerHTML = formHTML;

    const addPlayerForm = document.getElementById('addPlayerForm');
    addPlayerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(addPlayerForm);
        const playerObj = {
            name: formData.get('name'),
            breed: formData.get('breed'),
            imageUrl: formData.get('imageUrl'),
        };
        addNewPlayer(playerObj);
    });
};

function clearDom() {
    document.body.removeChild(playerContainer);
    document.body.removeChild(newPlayerFormContainer);
    const newApp = document.createElement("div");
    const newApp2 = document.createElement("div");
    newApp.innerHTML = `<h2 id=div1Heading>Puppy Bowl New Player Form</h2>`;
    newApp2.innerHTML = `<h2 id=div2Heading>Puppy Bowl Players:</h2>      
                        <div id=puppyListDiv></div>
    `;
    newApp.id = "new-Player-Container";
    newApp2.id = "all-Player-Container";
    playerContainer = newApp2;
    newPlayerFormContainer = newApp;
    document.body.append(newPlayerFormContainer);
    document.body.append(playerContainer);
    puppyListDiv = document.querySelector("#puppyListDiv");
};

const init = async () => {
    clearDom();
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
};

init();










