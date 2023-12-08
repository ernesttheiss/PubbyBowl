// DOM elements
let playerContainer = document.getElementById('all-players-container');
let newPlayerFormContainer = document.getElementById('new-player-form');
let puppyListDiv = null; // The image and info of the puppy will be inside this div

// Cohort information
const cohortName = '2310-FSA-ET-WEB-PT-SF';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

// State object
let state = {
    allPlayers: [],
    singlePlayer: null, // This is where the info of the player selected will be stored
    newPup: {},
};

// Fetch all players from the API
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

// Show more details when the "Show More!" button is clicked
async function showHide(idx) {
    document.querySelector(`#span${idx}`).style.display = "none";
    await fetchSinglePlayer(idx);
}

// Hide extra information when the "Show Less" button is clicked
function removeExInfo(id) {
    document.querySelector(`#extraInfo${id}`).style.display = "none";
    document.querySelector(`#span${id}`).style.display = "block";
}

// Fetch information of a single player
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

// Add a new player
const addNewPlayer = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(APIURL + "players", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: document.getElementById("puppyName").value,
                breed: document.getElementById("puppyBreed").value,
            }),
        });
        const result = await response.json();
        console.log(result);
        init();
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

// Remove a player
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

// Render all players to the DOM
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
                        <div id="extraInfo${p.id}" style="display:none"></div>
                        <div>
                            <span id="span${p.id}">
                                <button onclick="showHide(${p.id})"> Show more!</button>
                                <button onclick="removePlayer(${p.id})">Remove</button>
                            </span>
                        </div>
                    </div>
                </div>
            `;
            return indPlayer;
        });
        puppyListDiv.append(...renderedPlayers);
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

// Render the new player form to the DOM
const renderNewPlayerForm = () => {
    try {
        let firstDiv = document.querySelector("#div1Heading");
        firstDiv.innerHTML = `
            <h1 id="mainHeading">Puppy Bowl 2023</h1>
            <div id=formDiv>
                <h2 id=div1Heading>Puppy Bowl New Player Form</h2>
                <form id=addPup>
                    <label>Puppy Name</label>
                    <input type="text" id="puppyName">
                    <label>Puppy Breed</label>
                    <input type="text" id="puppyBreed">
                    <button id="addBtn">Add Player</button>
                </form>
            </div>
        `;
        let addPup = document.querySelector("#addPup");
        addPup.addEventListener("submit", addNewPlayer);
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

// Clear the DOM and initialize the application
function clearDom() {
    document.body.removeChild(playerContainer);
    document.body.removeChild(newPlayerFormContainer);
    const newApp = document.createElement("div");
    const newApp2 = document.createElement("div");
    newApp.innerHTML = `<h2 id=div1Heading>Puppy Bowl New Player Form</h2>`;
    newApp2.innerHTML = `
        <h2 id=div2Heading>Puppy Bowl Players</h2>      
        <div id=puppyListDiv></div>
    `;
    newApp.id = "new-Player-Container";
    newApp2.id = "all-Player-Container";
    playerContainer = newApp2;
    newPlayerFormContainer = newApp;
    document.body.append(newPlayerFormContainer);
    document.body.append(playerContainer);
    puppyListDiv = document.querySelector("#puppyListDiv");
}

// Initialize the application
const init = async () => {
    clearDom();
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
};

init();












