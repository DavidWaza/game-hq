

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public')); // Serve static files from public folder

// --- Game State and Configuration ---
let players = {}; // Store player data: { socketId: { name, totalScore, roundScores: [], hasRolledThisRound, isReady, bet } }
let gameSettings = {
    scheduledTime: null, // Set this to a future Date object
    notificationInterval: null,
    autoStartTimeout: null,
    gameStartTime: null,
    minPlayers: 2, //
    maxPlayers: 30, //
    betAmount: null, // All players must bet the same, set by first player or pre-configured
    currentRound: 0,
    totalRounds: 5, //
    rollTimeLimit: 12, // seconds
    roundEndDisplayTime: 12, // seconds for leaderboard
    nextRoundCountdownTime: 5, // seconds
    gameInProgress: false,
    gameLoading: false,
    roundTimerInterval: null,
    houseCommissionRate: 0.10 //
};

// --- Socket.IO Connection Handling ---
io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    socket.emit('systemNotification', 'Welcome! Please register to join the game.');
    // If game is scheduled, send notifications
    if (gameSettings.scheduledTime && !gameSettings.gameInProgress && !gameSettings.gameLoading) {
        // Initial notification logic can be here or handled by a global interval
    }


    socket.on('registerPlayer', (data) => {
        if (gameSettings.gameInProgress || gameSettings.gameLoading) {
            socket.emit('registrationError', 'Game has already started or is loading.');
            return;
        }
        if (Object.keys(players).length >= gameSettings.maxPlayers) {
            socket.emit('registrationError', 'Game is full.');
            return;
        }
        if (gameSettings.betAmount === null) {
            gameSettings.betAmount = data.bet; // First player sets the universal bet
        } else if (data.bet !== gameSettings.betAmount) {
            socket.emit('registrationError', `Bet amount must be ${gameSettings.betAmount}.`);
            return;
        }

        players[socket.id] = {
            id: socket.id,
            name: data.name,
            totalScore: 0, //
            roundScores: [], // To store sum of dice for each round
            hasRolledThisRound: false,
            isReady: false,
            bet: data.bet //
        };
        socket.emit('playerRegistered', socket.id);
        broadcastSystemNotification(`${data.name} has joined the game!`);
        console.log('Players:', players);

        // Schedule game if not already (example: first player triggers scheduling)
        if (!gameSettings.scheduledTime && Object.keys(players).length === 1) {
            scheduleGame(new Date(Date.now() + 3 * 60 * 1000)); // Schedule for 3 mins from now
        }
    });

    socket.on('playerReady', () => { //
        if (players[socket.id]) {
            players[socket.id].isReady = true;
            socket.emit('playerReadyStatus', 'You are Ready!'); //
            broadcastSystemNotification(`${players[socket.id].name} is ready!`);
            checkIfAllReadyAndStart();
        }
    });

    socket.on('rollDice', () => { //
        if (!gameSettings.gameInProgress || !players[socket.id] || players[socket.id].hasRolledThisRound) {
            return;
        }
        players[socket.id].hasRolledThisRound = true;
        socket.emit('diceRolling'); //

        // Simulate dice roll animation delay if desired
        setTimeout(() => {
            const die1 = Math.floor(Math.random() * 6) + 1;
            const die2 = Math.floor(Math.random() * 6) + 1;
            const roundScore = die1 + die2; //

            players[socket.id].roundScores[gameSettings.currentRound - 1] = roundScore;
            players[socket.id].totalScore += roundScore; //

            socket.emit('diceResult', { die1, die2, roundScore }); //
            socket.emit('scoreUpdate', { newTotalScore: players[socket.id].totalScore, message: `You rolled a ${die1} and a ${die2}! Round Score: ${roundScore}. Your Total Score is now ${players[socket.id].totalScore}.` }); //
            io.emit('gameStateUpdate', { players }); // Broadcast updated scores

            checkRoundCompletion();
        }, 1500); // Simulate roll animation time (adjust as needed)
    });


    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        if (players[socket.id]) {
            broadcastSystemNotification(`${players[socket.id].name} has left the game.`);
            delete players[socket.id];
            io.emit('gameStateUpdate', { players }); // Update player list/count for others

            if (gameSettings.gameInProgress && Object.keys(players).length < gameSettings.minPlayers) {
                // Handle game ending if not enough players, or just continue
                console.log("Not enough players to continue, game might need to end or pause.");
                // For this example, we'll let it continue, but in a real game, you might end it.
            }
        }
    });
});

// --- Game Logic Functions ---

function scheduleGame(startTime) {
    gameSettings.scheduledTime = startTime;
    console.log(`Game scheduled for: ${gameSettings.scheduledTime}`);

    // Notifications leading up to the game
    const preGameNotifDelay = (gameSettings.scheduledTime.getTime() - Date.now()) - (3 * 60 * 1000);
    if (preGameNotifDelay > 0) {
        setTimeout(() => {
            let notificationCount = 0;
            gameSettings.notificationInterval = setInterval(() => {
                if (gameSettings.gameInProgress || gameSettings.gameLoading || !gameSettings.scheduledTime) {
                    clearInterval(gameSettings.notificationInterval);
                    return;
                }
                const timeLeftMs = gameSettings.scheduledTime.getTime() - Date.now() + (90 * 1000); // Relative to auto-start time
                if (timeLeftMs <= 0) { // Stop if past auto-start
                     clearInterval(gameSettings.notificationInterval);
                     return;
                }
                const minutesLeft = Math.floor( (timeLeftMs / (1000*60)) % 60 );
                const secondsLeft = Math.floor( (timeLeftMs/1000) % 60 );
                if (minutesLeft*60 + secondsLeft <= 180) { // Start within 3 mins of auto-start
                    broadcastSystemNotification(`Dice Roll Challenge starts in ~${Math.ceil(timeLeftMs / (1000*60))} minutes!`);
                     notificationCount++;
                     if (notificationCount >= 6) clearInterval(gameSettings.notificationInterval); // Approx every 30s for 3 mins
                }
            }, 30 * 1000); // Every 30 seconds
        }, preGameNotifDelay);
    }


    // Automatic game start
    const autoStartTime = gameSettings.scheduledTime.getTime() + (90 * 1000); // 1 min 30 secs after scheduled
    const delayToAutoStart = autoStartTime - Date.now();

    if (delayToAutoStart > 0) {
        gameSettings.autoStartTimeout = setTimeout(() => {
            if (!gameSettings.gameInProgress && !gameSettings.gameLoading) {
                console.log('Auto-starting game.');
                startGame();
            }
        }, delayToAutoStart);
    } else if (!gameSettings.gameInProgress && !gameSettings.gameLoading && Object.keys(players).length >= gameSettings.minPlayers) {
        // If current time is already past scheduled auto-start, and we have players, start immediately.
        console.log('Scheduled time is past, auto-starting now.');
        startGame();
    }
}


function checkIfAllReadyAndStart() { //
    if (gameSettings.gameInProgress || gameSettings.gameLoading) return;

    const presentPlayers = Object.values(players);
    if (presentPlayers.length < gameSettings.minPlayers) {
        broadcastSystemNotification(`Waiting for at least ${gameSettings.minPlayers} players. Currently ${presentPlayers.length}.`);
        return;
    }

    const allReady = presentPlayers.every(p => p.isReady);
    if (allReady) {
        broadcastSystemNotification('All ready players! Starting game immediately...');
        if (gameSettings.autoStartTimeout) clearTimeout(gameSettings.autoStartTimeout);
        if (gameSettings.notificationInterval) clearInterval(gameSettings.notificationInterval);
        startGame();
    } else {
        const unreadyCount = presentPlayers.filter(p => !p.isReady).length;
        io.emit('playerReadyStatus', `Waiting for ${unreadyCount} other player(s) to ready up...`); //
    }
}

function startGame() {
    if (gameSettings.gameInProgress || gameSettings.gameLoading) return;
    if (Object.keys(players).length < gameSettings.minPlayers) {
        broadcastSystemNotification(`Cannot start game. Need at least ${gameSettings.minPlayers} players. Only ${Object.keys(players).length} present.`);
        gameSettings.scheduledTime = null; // Reset schedule
        return;
    }

    gameSettings.gameLoading = true;
    gameSettings.gameInProgress = false; // Ensure it's false during loading
    io.emit('gameLoading', 'Game Loading: Dice Roll Challenge...'); //

    setTimeout(() => {
        gameSettings.gameLoading = false;
        gameSettings.gameInProgress = true;
        gameSettings.currentRound = 0; // Will be incremented in startNextRound
        Object.values(players).forEach(p => {
            p.totalScore = 0;
            p.roundScores = new Array(gameSettings.totalRounds).fill(0);
        });

        io.emit('gameIntro', 'Welcome to Dice Roll Challenge! Roll two dice each round for 5 rounds. Accumulate the highest score to win. Good luck!'); //
        broadcastSystemNotification('Game Started!');
        io.emit('gameStateUpdate', { players });

        setTimeout(() => {
            startNextRound();
        }, 20000); // After intro message display
    }, 3000); // Brief loading screen time
}

function startNextRound() {
    if (gameSettings.currentRound >= gameSettings.totalRounds) {
        endGame();
        return;
    }

    gameSettings.currentRound++;
    Object.values(players).forEach(p => p.hasRolledThisRound = false);

    io.emit('roundStart', {
        roundNumber: gameSettings.currentRound,
        rollTimeLimit: gameSettings.rollTimeLimit
    });
    broadcastSystemNotification(`Round ${gameSettings.currentRound} has begun! You have ${gameSettings.rollTimeLimit} seconds to roll.`);

    // Start round timer
    let timeLeft = gameSettings.rollTimeLimit;
    if (gameSettings.roundTimerInterval) clearInterval(gameSettings.roundTimerInterval); // Clear previous if any
    gameSettings.roundTimerInterval = setInterval(() => {
        timeLeft--;
        io.emit('rollTimerUpdate', timeLeft); //
        if (timeLeft <= 0) {
            clearInterval(gameSettings.roundTimerInterval);
            handleUnrolledPlayers();
            checkRoundCompletion(); // This will trigger if all (those who will roll) have rolled or timer ends
        }
    }, 1000);
}

function handleUnrolledPlayers() {
    Object.values(players).forEach(player => {
        if (!player.hasRolledThisRound) {
            player.roundScores[gameSettings.currentRound - 1] = 0; // Score 0 for the round
            // Total score remains the same
            io.to(player.id).emit('scoreUpdate', {
                newTotalScore: player.totalScore,
                message: "No roll this round! +0 points." //
            });
            player.hasRolledThisRound = true; // Mark as processed for this round
        }
    });
}

function checkRoundCompletion() {
    const allPlayersProcessedForRound = Object.values(players).every(p => p.hasRolledThisRound);
    if (allPlayersProcessedForRound) {
        if (gameSettings.roundTimerInterval) clearInterval(gameSettings.roundTimerInterval); // Stop timer early if all rolled
        broadcastSystemNotification(`Round ${gameSettings.currentRound} ended. Calculating scores...`);

        // Display leaderboard
        const leaderboardData = getLeaderboardData(players);
        io.emit('roundEndLeaderboard', { leaderboard: leaderboardData.slice(0, 5) }); // Send Top 5
        io.emit('gameStateUpdate', { players }); // Ensure all clients have latest scores

        setTimeout(() => {
            if (gameSettings.currentRound >= gameSettings.totalRounds) {
                io.emit('calculatingFinalResults', 'Calculating Final Results...'); //
                setTimeout(endGame, 2000); // Brief delay before showing final results
            } else {
                const nextRound = gameSettings.currentRound + 1;
                let countdown = gameSettings.nextRoundCountdownTime;
                const countdownInterval = setInterval(() => {
                    io.emit('nextRoundCountdown', { message: `Get Ready for Round ${nextRound}!`, countdown: countdown }); //
                    countdown--;
                    if (countdown < 0) {
                        clearInterval(countdownInterval);
                        startNextRound();
                    }
                }, 1000);
            }
        }, gameSettings.roundEndDisplayTime * 1000);
    }
}


function getLeaderboardData(currentPlayers) { //
    return Object.values(currentPlayers)
        .sort((a, b) => {
            if (b.totalScore !== a.totalScore) {
                return b.totalScore - a.totalScore;
            }
            // Tie-breaking logic using roundScores
            for (let i = 0; i < gameSettings.totalRounds; i++) {
                const scoreA = a.roundScores[i] !== undefined ? a.roundScores[i] : -1; // Treat unplayed rounds as worse than 0
                const scoreB = b.roundScores[i] !== undefined ? b.roundScores[i] : -1;
                if (scoreB !== scoreA) {
                    return scoreB - scoreA;
                }
            }
            return 0; // Persistent tie if all round scores are identical
        })
        .map((player, index) => ({ ...player, rank: index + 1 }));
}


function endGame() { //
    gameSettings.gameInProgress = false;
    broadcastSystemNotification('Game Over! Final results are in.');

    const finalRankings = getLeaderboardData(players);

    // Payout calculation
    const totalPot = Object.values(players).reduce((sum, p) => sum + p.bet, 0);
    const houseCommission = totalPot * gameSettings.houseCommissionRate;
    const distributablePot = totalPot - houseCommission;
    let payouts = {}; // {playerId: amount}

    // Determine winners and apply tie-breaking for prize money
    const finalWinners = determineWinnersAndPayouts(finalRankings, distributablePot);


    finalRankings.forEach(playerData => {
        let tiebreakerNote = null;
        // Check if this player was part of a resolved tie for a prize position for notification
        const tiedGroups = groupTiedPlayers(finalRankings, 'totalScore');
        for (const group of tiedGroups) {
            if (group.length > 1 && group.find(p => p.id === playerData.id)) {
                // Find if this tie was broken for ranking
                const firstInGroup = group[0];
                const playerInGroup = group.find(p => p.id === playerData.id);
                if (playerInGroup && playerInGroup.rank !== firstInGroup.rank) { // Implies tie was broken by round scores
                     for (let i = 0; i < gameSettings.totalRounds; i++) {
                         if ( (playerInGroup.roundScores[i] !== undefined ? playerInGroup.roundScores[i] : -1) !==
                              (firstInGroup.roundScores[i] !== undefined ? firstInGroup.roundScores[i] : -1) ) {
                            tiebreakerNote = `Note on Tiebreak for rank ${playerInGroup.rank}: ${playerInGroup.name} and ${firstInGroup.name} had the same total score of ${playerInGroup.totalScore}. `;
                            tiebreakerNote += `${firstInGroup.name} is ranked higher because their dice sum in Round ${i+1} (${firstInGroup.roundScores[i]}) was greater than ${playerInGroup.name}'s dice sum in Round ${i+1} (${playerInGroup.roundScores[i]}).`; //
                            break;
                         }
                     }
                }
                break; // Only show one relevant tie-break note if applicable
            }
        }


        io.to(playerData.id).emit('gameOver', {
            yourRank: playerData.rank,
            yourScore: playerData.totalScore, //
            finalLeaderboard: finalRankings.slice(0, 5), //
            tiebreakerNote: tiebreakerNote,
            payout: { //
                totalPot: totalPot,
                houseCommission: houseCommission,
                distributablePot: distributablePot,
                yourWinnings: finalWinners.payouts[playerData.id] || 0
            }
        });
    });

    // Reset for a new game (or could go to a lobby)
    players = {};
    gameSettings.scheduledTime = null;
    gameSettings.betAmount = null;
    gameSettings.currentRound = 0;
    // Further cleanup as needed
}

function groupTiedPlayers(rankedPlayers, scoreField) {
    const groups = [];
    if (!rankedPlayers || rankedPlayers.length === 0) return groups;

    let currentGroup = [rankedPlayers[0]];
    for (let i = 1; i < rankedPlayers.length; i++) {
        if (rankedPlayers[i][scoreField] === currentGroup[0][scoreField]) {
            // Check further tie-breaking by round scores
            let stillTiedOnRounds = true;
            for (let r = 0; r < gameSettings.totalRounds; r++) {
                if ( (rankedPlayers[i].roundScores[r] || 0) !== (currentGroup[0].roundScores[r] || 0) ) {
                    stillTiedOnRounds = false;
                    break;
                }
            }
            if (stillTiedOnRounds) {
                 currentGroup.push(rankedPlayers[i]);
            } else {
                groups.push(currentGroup);
                currentGroup = [rankedPlayers[i]];
            }
        } else {
            groups.push(currentGroup);
            currentGroup = [rankedPlayers[i]];
        }
    }
    groups.push(currentGroup); // Add the last group
    return groups;
}


function determineWinnersAndPayouts(finalRankings, distributablePot) { //
    const payouts = {};
    const numPlayers = finalRankings.length;

    if (numPlayers === 0) return { winners: [], payouts };

    // Group by truly final rank (after all tie-breaking)
    const rankedGroups = [];
    let currentRankGroup = [finalRankings[0]];
    for (let i = 1; i < finalRankings.length; i++) {
        if (finalRankings[i].rank === currentRankGroup[0].rank) {
            currentRankGroup.push(finalRankings[i]);
        } else {
            rankedGroups.push(currentRankGroup);
            currentRankGroup = [finalRankings[i]];
        }
    }
    rankedGroups.push(currentRankGroup);


    let prizePools = [];
    if (numPlayers >= 5 || numPlayers === 4) { // Similar structure for 4 and 5+ initially
        prizePools = [
            distributablePot * 0.60, // 1st
            distributablePot * 0.20, // 2nd
            distributablePot * 0.10  // 3rd
        ];
        if (numPlayers === 4) { // 10% unallocated for 4 players as per doc example
            // The logic from doc: "1st gets 70%, 2nd gets 20%, 10% unallocated"
            // This seems to contradict the 60/20/10 example. Let's adjust if numPlayers is exactly 4.
            // For now, sticking to 60/20/10 if 3+ winners possible.
            // If strictly 4 players: "1st gets 70%, 2nd gets 20%, 10% unallocated"
            // This implies 3rd place gets 0 if only 4 players.
             prizePools = [ distributablePot * 0.70, distributablePot * 0.20, 0];
        }
    } else if (numPlayers >= 2 && numPlayers <= 3) { // Winner takes all
        prizePools = [distributablePot, 0, 0];
    }


    let currentPrizeIndex = 0;
    for (const group of rankedGroups) {
        if (currentPrizeIndex >= prizePools.length || prizePools[currentPrizeIndex] === 0) break; // No more prizes to distribute

        const prizeForThisRankAndLower = prizePools.slice(currentPrizeIndex, currentPrizeIndex + group.length).reduce((a, b) => a + b, 0);
        const individualShare = prizeForThisRankAndLower / group.length;

        group.forEach(player => {
            payouts[player.id] = individualShare;
        });
        currentPrizeIndex += group.length;
    }
    return { payouts };
}


function broadcastSystemNotification(message) {
    io.emit('systemNotification', message);
    console.log(`Broadcast: ${message}`);
}


// --- Server Listening ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Guru Dice Server running on port ${PORT}`);
    // Example: Schedule a game to start in 2 minutes for testing
    // scheduleGame(new Date(Date.now() + 0.5 * 60 * 1000));
});
