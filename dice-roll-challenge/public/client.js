
// --- Basic DOM Elements ---
const socket = io(); // Connect to the server

// Pre-Game
const notificationsDiv = document.getElementById('notifications');
const gameStatusP = document.getElementById('game-status');
const yourScoreDisplayP = document.getElementById('your-score-display');
const preGameControlsDiv = document.getElementById('pre-game-controls');
const playerNameInput = document.getElementById('playerName');
const betAmountInput = document.getElementById('betAmount'); // As per doc, bet is equal
const joinGameButton = document.getElementById('joinGameButton');
const readyNowButton = document.getElementById('readyNowButton');
const readyStatusP = document.getElementById('readyStatus');

// Game Area
const gameAreaDiv = document.getElementById('game-area');
const roundInfoH2 = document.getElementById('round-info');
const rollTimerDisplayP = document.getElementById('roll-timer-display');
const rollDiceButton = document.getElementById('rollDiceButton');
const die1ValueSpan = document.getElementById('die1-value');
const die2ValueSpan = document.getElementById('die2-value');
const roundScoreSpan = document.getElementById('round-score');
const playerOutcomeMessageP = document.getElementById('player-outcome-message');

// Leaderboard
const leaderboardAreaDiv = document.getElementById('leaderboard-area');
const leaderboardListUl = document.getElementById('leaderboard-list');

// Post-Game
const postGameInfoDiv = document.getElementById('post-game-info');
const finalRankDisplayP = document.getElementById('final-rank-display');
const finalLeaderboardListUl = document.getElementById('final-leaderboard-list');
const tiebreakerNoteP = document.getElementById('tiebreaker-note');
const totalPotDisplayP = document.getElementById('total-pot-display');
const houseCommissionDisplayP = document.getElementById('house-commission-display');
const distributablePotDisplayP = document.getElementById('distributable-pot-display');
const yourWinningsDisplayP = document.getElementById('your-winnings-display');


let myPlayerId = null;
let currentBetAmount = 0;

// --- Socket Event Handlers ---
socket.on('connect', () => {
    gameStatusP.textContent = 'Connected! Waiting to join game.';
    preGameControlsDiv.style.display = 'block';
});

socket.on('disconnect', () => {
    gameStatusP.textContent = 'Disconnected from server.';
});

socket.on('playerRegistered', (playerId) => {
    myPlayerId = playerId;
    gameStatusP.textContent = `Joined game! Your ID: ${playerId}. Waiting for game to start.`;
    joinGameButton.style.display = 'none';
    playerNameInput.disabled = true;
    betAmountInput.disabled = true;
    readyNowButton.style.display = 'inline-block';
});

socket.on('registrationError', (message) => {
    alert(`Registration Error: ${message}`);
    playerNameInput.disabled = false;
    betAmountInput.disabled = false;
});

socket.on('systemNotification', (message) => { //
    const notif = document.createElement('p');
    notif.textContent = message;
    notificationsDiv.insertBefore(notif, notificationsDiv.firstChild);
    setTimeout(() => notif.remove(), 5000); // Remove after 5s
});

socket.on('playerReadyStatus', (message) => { //
    readyStatusP.textContent = message;
});

socket.on('gameLoading', (message) => { //
    preGameControlsDiv.style.display = 'none';
    gameAreaDiv.style.display = 'none';
    leaderboardAreaDiv.style.display = 'none';
    postGameInfoDiv.style.display = 'none';
    gameStatusP.textContent = message;
});

socket.on('gameIntro', (message) => { //
    // Display intro message prominently
    const introP = document.createElement('p');
    introP.id = 'intro-message';
    introP.textContent = message;
    document.getElementById('game-info').appendChild(introP);
    setTimeout(() => introP.remove(), 20000); // As per doc, 15-20 seconds
});

socket.on('gameStateUpdate', (gameState) => {
    // Update player's own score
    const myPlayerData = gameState.players[myPlayerId];
    if (myPlayerData) {
        yourScoreDisplayP.textContent = `Your Score: ${myPlayerData.totalScore}`; //
    }
    // Potentially more general game state updates
});

socket.on('roundStart', (data) => { //
    gameAreaDiv.style.display = 'block';
    leaderboardAreaDiv.style.display = 'none'; // Hide leaderboard during roll phase
    roundInfoH2.textContent = `Round ${data.roundNumber} of 5`;
    rollDiceButton.disabled = false;
    rollDiceButton.textContent = "Roll Dice";
    playerOutcomeMessageP.textContent = "Click 'Roll Dice' to roll your two dice!";
    die1ValueSpan.textContent = '-';
    die2ValueSpan.textContent = '-';
    roundScoreSpan.textContent = '-';
    updateRollTimer(data.rollTimeLimit);
});

socket.on('rollTimerUpdate', (timeLeft) => {
    rollTimerDisplayP.textContent = `Time to Roll: ${timeLeft}s`; //
});

socket.on('diceRolling', () => {
    playerOutcomeMessageP.textContent = "Rolling Dice..."; //
    rollDiceButton.disabled = true;
});

socket.on('diceResult', (data) => { //
    die1ValueSpan.textContent = data.die1;
    die2ValueSpan.textContent = data.die2;
    roundScoreSpan.textContent = data.roundScore;
    playerOutcomeMessageP.textContent = `You rolled a ${data.die1} and a ${data.die2}! Round Score: ${data.roundScore}.`;
    // Total score is updated via 'gameStateUpdate' or specific 'scoreUpdate' event
});

socket.on('scoreUpdate', (data) => {
    yourScoreDisplayP.textContent = `Your Score: ${data.newTotalScore}`; //
    if (data.message) { // For no roll message
        playerOutcomeMessageP.textContent = data.message; //
    }
});


socket.on('roundEndLeaderboard', (data) => { //
    gameAreaDiv.style.display = 'none';
    leaderboardAreaDiv.style.display = 'block';
    leaderboardListUl.innerHTML = ''; // Clear previous
    data.leaderboard.forEach(player => { //
        const li = document.createElement('li');
        li.textContent = `${player.rank}. ${player.name} - ${player.totalScore} pts`;
        // Add fanfare for players moving up (more complex UI logic)
        leaderboardListUl.appendChild(li);
    });
    // Player's own score is already displayed
});

socket.on('nextRoundCountdown', (data) => { //
    notificationsDiv.textContent = `${data.message} Starting in ${data.countdown}s...`;
});

socket.on('calculatingFinalResults', (message) => { //
    leaderboardAreaDiv.style.display = 'none';
    notificationsDiv.textContent = message;
});

socket.on('gameOver', (data) => { //
    gameAreaDiv.style.display = 'none';
    leaderboardAreaDiv.style.display = 'none';
    postGameInfoDiv.style.display = 'block';

    finalRankDisplayP.textContent = `Game Over! Your Final Rank: ${data.yourRank}, Final Score: ${data.yourScore}`; //

    finalLeaderboardListUl.innerHTML = ''; // Clear previous
    data.finalLeaderboard.forEach(player => { //
        const li = document.createElement('li');
        li.textContent = `${player.rank}. ${player.name} - ${player.totalScore} pts`;
        finalLeaderboardListUl.appendChild(li);
    });

    if (data.tiebreakerNote) { //
        tiebreakerNoteP.textContent = data.tiebreakerNote;
        tiebreakerNoteP.style.display = 'block';
    } else {
        tiebreakerNoteP.style.display = 'none';
    }

    // Payout Info
    if(data.payout) {
        totalPotDisplayP.textContent = `Total Pot: ${data.payout.totalPot}`;
        houseCommissionDisplayP.textContent = `House Commission (10%): ${data.payout.houseCommission}`;
        distributablePotDisplayP.textContent = `Distributable Pot: ${data.payout.distributablePot}`;
        if(data.payout.yourWinnings !== undefined) {
            yourWinningsDisplayP.textContent = `Your Winnings: ${data.payout.yourWinnings}`;
        } else {
            yourWinningsDisplayP.textContent = `You did not place in a winning position.`;
        }
        document.getElementById('payout-info').style.display = 'block';
    } else {
        document.getElementById('payout-info').style.display = 'none';
    }


    // Option to play again can be added here
});


// --- Event Listeners ---
joinGameButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    const bet = parseInt(betAmountInput.value);

    if (!playerName) {
        alert('Please enter your name.');
        return;
    }
    if (isNaN(bet) || bet <= 0) {
        alert('Please enter a valid bet amount.');
        // In a real scenario, the server might dictate the bet amount or validate it.
        // For now, client sends it, server should enforce equality.
        return;
    }
    currentBetAmount = bet;
    socket.emit('registerPlayer', { name: playerName, bet: bet }); //
    joinGameButton.disabled = true;
    playerNameInput.disabled = true;
    betAmountInput.disabled = true;
});

readyNowButton.addEventListener('click', () => {
    socket.emit('playerReady'); //
    readyNowButton.disabled = true;
    readyStatusP.textContent = "You are Ready!"; //
});

rollDiceButton.addEventListener('click', () => {
    socket.emit('rollDice'); //
    rollDiceButton.disabled = true; // Prevent multiple rolls
});


// --- Helper Functions ---
function updateRollTimer(duration) {
    let timer = duration;
    rollTimerDisplayP.textContent = `Time to Roll: ${timer}s`;
    const interval = setInterval(() => {
        timer--;
        rollTimerDisplayP.textContent = `Time to Roll: ${timer}s`;
        if (timer <= 0) {
            clearInterval(interval);
            // Server will handle no-roll scenario
        }
    }, 1000);
    // Store interval if you need to clear it prematurely (e.g., if player rolls)
    // Server-side timer is the source of truth, this is for display.
}

console.log('Client JS Loaded');

