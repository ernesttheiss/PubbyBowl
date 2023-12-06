let playerContainer = document.getElementById('all-players-container');
let newPlayerFormContainer = document.getElementById('new-player-form');
let puppyListDiv = null;

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2310-FSA-ET-WEB-PT-SF';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

let state = {
    allPlayers: [],
    singlePlayer: null,
};

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        let response = await fetch(APIURL + "players");
        let playersData = await response.json();
        state.allPlayers = playersData.data.players;
        return playersData.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
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










