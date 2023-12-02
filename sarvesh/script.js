let playerContainer = document.getElementById('all-players-container');
let newPlayerFormContainer = document.getElementById('new-player-form');
let puppyListDiv=null;                              //the image and info of the puppy will be inside this div

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2310-FSA-ET-WEB-PT-SF';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

let state={
    allPlayers:[],
    singlePlayer:null,          //This is where the info of the player selected will be stored
};

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        let response=await fetch(APIURL+"players");
        let playersData=await response.json();
        state.allPlayers=playersData.data.players;          //assigns the info about the players to the allPlayers array inside the state
        return playersData.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

async function showHide(idx){               //when the "Show More!" button is clicked, thi function will be invoked first
    document.querySelector(`#span${idx}`).style.display="none";         //first it will hide the "Show more" and "Remove" button so that they can be replaced by "Show Less" and "Remove Button"
    await fetchSinglePlayer(idx);           //Then it will invoke this function to fetch data from the API
};

function removeExInfo(id){                  //When the "Show Less" button is clicked, this function will be invoked
    document.querySelector(`#extraInfo${id}`).style.display="none"      //it will hide the span tag that has the "Show Less" and "Remove" button
    document.querySelector(`#span${id}`).style.display="block";         //It will unhide the div tag that has the "Show More!" and "Remove" button
}

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL+"players/"+playerId);       //fetch info of a single puppy
        const result= await response.json();
        state.singlePlayer=result.data.player;          //store that info inside singlePlayer which is inside the state 
        let exInfoDiv=document.querySelector(`#extraInfo${playerId}`);
        exInfoDiv.style.display="block";        //unhide the div element that has the "Show Less" and "Remove" button
        exInfoDiv.innerHTML=`
            <p>Status: ${state.singlePlayer.status}</p>     
            <p>Team ID: ${state.singlePlayer.teamId}</p>
            <button onclick="removeExInfo(${state.singlePlayer.id})">Show Less</button>
            <button onclick="removePlayer(${state.singlePlayer.id})">Remove</button>
        `;                                      //update the puppy info with the newly fetched data and create event listener for the "Remove" and "Show Less" button
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};


const addNewPlayer = async (playerObj) => {
    try {
        // const response = await fetch('https://fsa-puppy-bowl.herokuapp.com/api/2310-FSA-ET-WEB-PT-SF/players',{
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         name: 'Demo puppy',
        //         breed: 'Demo breed',
        //     }),
        //     }
        // );
        // const result = await response.json();
        // console.log(result);
        // init();
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {

    try {
        const response=await fetch(APIURL+"players/"+playerId,
        {
            method: "DELETE",           //declares that it intents to delete this player
        });
        const result=await response.json();
        console.log(result);
        init();                         //initialize the webpage to reflect that the deleted player is not visible anymore
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        let renderedPlayers=playerList.map((p)=>{       //get each player info from the playerlist 
            let indPlayer=document.createElement("ul"); 
            indPlayer.innerHTML=`
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
            return indPlayer;       //pertinent info about the player is assigned to multiple HTML tags
        })
        puppyListDiv.append(...renderedPlayers);    //all those tags are appended to the DOM
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

function clearDom(){
    document.body.removeChild(playerContainer);             //removes the two main div elements of the webpage
    document.body.removeChild(newPlayerFormContainer);
    const newApp=document.createElement("div");             //creates two new div elements 
    const newApp2=document.createElement("div");
    newApp.innerHTML=`<h2 id=div1Heading>Puppy Bowl New Player Form</h2>`;
    newApp2.innerHTML=`<h2 id=div2Heading>Puppy Bowl Players:</h2>      
                        <div id=puppyListDiv></div>
    `;                                                      //creates heading for the two new div
    newApp.id="new-Player-Container";
    newApp2.id="all-Player-Container";
    playerContainer=newApp2;
    newPlayerFormContainer=newApp;
    document.body.append(newPlayerFormContainer);       // appends the two new div to the DOM
    document.body.append(playerContainer);
    puppyListDiv=document.querySelector("#puppyListDiv")
};

const init = async () => {
    clearDom();                                         //clearDom clears the DOM by removing all previous tags
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
};

init();
addNewPlayer({});