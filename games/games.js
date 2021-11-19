import { 
    logout, 
    checkAuth,
    getGames,
    createGame,
} from '../fetch-utils.js';
// import functions and grab DOM elements
const currentGameEl = document.getElementById('current-game-container');
const pastGamesEl = document.getElementById('past-games-container');
const logoutButton = document.getElementById('logout');

const nameForm = document.getElementById('name-form');
const teamOneAddButton = document.getElementById('team-one-add-button');
const teamTwoAddButton = document.getElementById('team-two-add-button');
const teamOneSubtractButton = document.getElementById('team-one-subtract-button');
const teamTwoSubtractButton = document.getElementById('team-two-subtract-button');
const finishGameButton = document.getElementById('finish-game-button');
const teamOneLabel = document.getElementById('team-one-name');
const teamTwoLabel = document.getElementById('team-two-name');

checkAuth();

let pastGames = [];

let currentGame = {
    name1: '',
    name2: '',
    score1: 0,
    score2: 0,
};

// set event listeners 
  // get user input
  // use user input to update state 
  // update DOM to reflect the new state

nameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(nameForm);
  
    const name1 = formData.get('team-one');
    const name2 = formData.get('team-two');

    currentGame.name1 = name1;
    currentGame.name2 = name2;
    
    nameForm.reset();
    updateCurrentGameEl();
});


teamOneAddButton.addEventListener('click', () => {
    currentGame.score1++;
    
    updateCurrentGameEl();
});

teamTwoAddButton.addEventListener('click', () => {
    currentGame.score2++;

    updateCurrentGameEl();
});

teamOneSubtractButton.addEventListener('click', () => {
    currentGame.score1--;

    updateCurrentGameEl();
});

teamTwoSubtractButton.addEventListener('click', () => {
    currentGame.score2--;
    updateCurrentGameEl();
});

function updateCurrentGameEl() {
    currentGameEl.textContent = '';

    teamOneLabel.textContent = currentGame.name1;
    teamTwoLabel.textContent = currentGame.name2;

    const gameEl = renderGame(currentGame);
    
    gameEl.classList.add('current');

    currentGameEl.append(gameEl);
}

function renderGame(game) {
    const div = document.createElement('div');
    const team1Div = renderTeam(game.name1, game.score1);
    const team2Div = renderTeam(game.name2, game.score2);

    div.append(team1Div, team2Div);

    div.classList.add('game');

    return div;
}

function renderTeam(name, score) {
    const teamDiv = document.createElement('div');
    const nameDiv = document.createElement('p');
    const scoreDiv = document.createElement('p');

    teamDiv.classList.add('team');
    nameDiv.classList.add('name');
    scoreDiv.classList.add('score');

    nameDiv.textContent = name;
    scoreDiv.textContent = score;

    teamDiv.append(nameDiv, scoreDiv);

    return teamDiv;
}


function renderAllGames() {
    pastGamesEl.textContent = '';

    for (let game of pastGames) {
        const gameEl = renderGame(game);

        gameEl.classList.add('past');
        
        pastGamesEl.append(gameEl);
    }
}


finishGameButton.addEventListener('click', async() => {
    
    await createGame(currentGame);
    
    const games = await getGames();

    pastGames = games;
    
    renderAllGames();
    
    currentGame = {
        name1: '',
        name2: '',
        score1: 0,
        score2: 0
    };

    updateCurrentGameEl();
});

updateCurrentGameEl();


logoutButton.addEventListener('click', () => {
    logout();
});

window.addEventListener('load', async() => {
    const games = await getGames();

    if (games) {
        pastGames = games;

        renderAllGames();
    }
});