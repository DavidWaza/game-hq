import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
    socket: {
        server: NetServer & {
            io?: SocketIOServer;
        };
    };
};

interface Player {
    id: string;
    name: string;
    totalScore: number;
    roundScores: number[];
    hasRolledThisRound: boolean;
    isReady: boolean;
    bet: number;
    rank?: number;
}

// Game state (moved outside to be shared across connections)
let players: Record<string, Player> = {};
const gameSettings = {
    scheduledTime: null as Date | null,
    notificationInterval: null as NodeJS.Timeout | null,
    autoStartTimeout: null as NodeJS.Timeout | null,
    gameStartTime: null as Date | null,
    minPlayers: 2,
    maxPlayers: 30,
    betAmount: null as number | null,
    currentRound: 0,
    totalRounds: 5,
    rollTimeLimit: 12,
    roundEndDisplayTime: 12,
    nextRoundCountdownTime: 5,
    gameInProgress: false,
    gameLoading: false,
    roundTimerInterval: null as NodeJS.Timeout | null,
    houseCommissionRate: 0.10
};

let io: SocketIOServer | null = null;

export function getIO() {
    if (!io) {
        throw new Error('Socket.IO server not initialized');
    }
    return io;
}

export function initSocket(existingIo: SocketIOServer) {
    if (!io) {
        console.log('Initializing Socket.IO server...');
        try {
            io = existingIo;

            io.on('connection', (socket) => {
                if (!io) return;
                console.log('Client connected:', socket.id);
                socket.emit('systemNotification', 'Welcome! Please register to join the game.');

                // If game is scheduled, send notifications
                if (gameSettings.scheduledTime && !gameSettings.gameInProgress && !gameSettings.gameLoading) {
                    // Initial notification logic can be here or handled by a global interval
                }

                // Handle player registration
                socket.on('registerPlayer', (data) => {
                    if (!io) return;
                    if (gameSettings.gameInProgress || gameSettings.gameLoading) {
                        socket.emit('registrationError', 'Game has already started or is loading.');
                        return;
                    }
                    if (Object.keys(players).length >= gameSettings.maxPlayers) {
                        socket.emit('registrationError', 'Game is full.');
                        return;
                    }
                    if (gameSettings.betAmount === null) {
                        gameSettings.betAmount = data.bet;
                    } else if (data.bet !== gameSettings.betAmount) {
                        socket.emit('registrationError', `Bet amount must be ${gameSettings.betAmount}.`);
                        return;
                    }

                    players[socket.id] = {
                        id: socket.id,
                        name: data.name,
                        totalScore: 0,
                        roundScores: [],
                        hasRolledThisRound: false,
                        isReady: false,
                        bet: data.bet
                    };

                    socket.emit('playerRegistered', socket.id);
                    io.emit('systemNotification', `${data.name} has joined the game!`);

                    // Schedule game if not already (example: first player triggers scheduling)
                    if (!gameSettings.scheduledTime && Object.keys(players).length === 1) {
                        scheduleGame(new Date(Date.now() + 3 * 60 * 1000)); // Schedule for 3 mins from now
                    }
                });

                // Handle player ready status
                socket.on('playerReady', () => {
                    if (!io) return;
                    if (players[socket.id]) {
                        players[socket.id].isReady = true;
                        socket.emit('playerReadyStatus', 'You are Ready!');
                        io.emit('systemNotification', `${players[socket.id].name} is ready!`);
                        checkIfAllReadyAndStart();
                    }
                });

                // Handle dice rolls
                socket.on('rollDice', () => {
                    if (!io) return;
                    if (!gameSettings.gameInProgress || !players[socket.id] || players[socket.id].hasRolledThisRound) {
                        return;
                    }

                    players[socket.id].hasRolledThisRound = true;
                    socket.emit('diceRolling');

                    setTimeout(() => {
                        if (!io) return;
                        const die1 = Math.floor(Math.random() * 6) + 1;
                        const die2 = Math.floor(Math.random() * 6) + 1;
                        const roundScore = die1 + die2;

                        players[socket.id].roundScores[gameSettings.currentRound - 1] = roundScore;
                        players[socket.id].totalScore += roundScore;

                        socket.emit('diceResult', { die1, die2, roundScore });
                        socket.emit('scoreUpdate', {
                            newTotalScore: players[socket.id].totalScore,
                            message: `You rolled a ${die1} and a ${die2}! Round Score: ${roundScore}. Your Total Score is now ${players[socket.id].totalScore}.`
                        });

                        io.emit('gameStateUpdate', { players });
                        checkRoundCompletion();
                    }, 1500);
                });

                // Handle disconnection
                socket.on('disconnect', () => {
                    if (!io) return;
                    if (players[socket.id]) {
                        io.emit('systemNotification', `${players[socket.id].name} has left the game.`);
                        delete players[socket.id];
                        io.emit('gameStateUpdate', { players });

                        if (gameSettings.gameInProgress && Object.keys(players).length < gameSettings.minPlayers) {
                            console.log("Not enough players to continue, game might need to end or pause.");
                        }
                    }
                });
            });

            console.log('Socket.IO server initialized');
        } catch (error) {
            console.error('Socket initialization error:', error);
            throw error;
        }
    }
    return io;
}

// Game Management Functions
function scheduleGame(startTime: Date) {
    gameSettings.scheduledTime = startTime;
    console.log(`Game scheduled for: ${gameSettings.scheduledTime}`);

    // Notifications leading up to the game
    const preGameNotifDelay = (gameSettings.scheduledTime.getTime() - Date.now()) - (3 * 60 * 1000);
    if (preGameNotifDelay > 0) {
        setTimeout(() => {
            let notificationCount = 0;
            gameSettings.notificationInterval = setInterval(() => {
                if (gameSettings.gameInProgress || gameSettings.gameLoading || !gameSettings.scheduledTime) {
                    clearInterval(gameSettings.notificationInterval!);
                    return;
                }
                const timeLeftMs = gameSettings.scheduledTime!.getTime() - Date.now() + (90 * 1000);
                if (timeLeftMs <= 0) {
                    clearInterval(gameSettings.notificationInterval!);
                    return;
                }
                const minutesLeft = Math.floor((timeLeftMs / (1000 * 60)) % 60);
                const secondsLeft = Math.floor((timeLeftMs / 1000) % 60);
                if (minutesLeft * 60 + secondsLeft <= 180) {
                    broadcastSystemNotification(`Dice Roll Challenge starts in ~${Math.ceil(timeLeftMs / (1000 * 60))} minutes!`);
                    notificationCount++;
                    if (notificationCount >= 6) clearInterval(gameSettings.notificationInterval!);
                }
            }, 30 * 1000);
        }, preGameNotifDelay);
    }

    // Automatic game start
    const autoStartTime = gameSettings.scheduledTime.getTime() + (90 * 1000);
    const delayToAutoStart = autoStartTime - Date.now();

    if (delayToAutoStart > 0) {
        gameSettings.autoStartTimeout = setTimeout(() => {
            if (!gameSettings.gameInProgress && !gameSettings.gameLoading) {
                console.log('Auto-starting game.');
                startGame();
            }
        }, delayToAutoStart);
    } else if (!gameSettings.gameInProgress && !gameSettings.gameLoading && Object.keys(players).length >= gameSettings.minPlayers) {
        console.log('Scheduled time is past, auto-starting now.');
        startGame();
    }
}

function checkIfAllReadyAndStart() {
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
        io?.emit('playerReadyStatus', `Waiting for ${unreadyCount} other player(s) to ready up...`);
    }
}

function startGame() {
    if (gameSettings.gameInProgress || gameSettings.gameLoading) return;
    if (Object.keys(players).length < gameSettings.minPlayers) {
        broadcastSystemNotification(`Cannot start game. Need at least ${gameSettings.minPlayers} players. Only ${Object.keys(players).length} present.`);
        gameSettings.scheduledTime = null;
        return;
    }

    gameSettings.gameLoading = true;
    gameSettings.gameInProgress = false;
    io?.emit('gameLoading', 'Game Loading: Dice Roll Challenge...');

    setTimeout(() => {
        gameSettings.gameLoading = false;
        gameSettings.gameInProgress = true;
        gameSettings.currentRound = 0;
        Object.values(players).forEach(p => {
            p.totalScore = 0;
            p.roundScores = new Array(gameSettings.totalRounds).fill(0);
        });

        io?.emit('gameIntro', 'Welcome to Dice Roll Challenge! Roll two dice each round for 5 rounds. Accumulate the highest score to win. Good luck!');
        broadcastSystemNotification('Game Started!');
        io?.emit('gameStateUpdate', { players });

        setTimeout(() => {
            startNextRound();
        }, 20000);
    }, 3000);
}

function startNextRound() {
    if (gameSettings.currentRound >= gameSettings.totalRounds) {
        endGame();
        return;
    }

    gameSettings.currentRound++;
    Object.values(players).forEach(p => p.hasRolledThisRound = false);

    io?.emit('roundStart', {
        roundNumber: gameSettings.currentRound,
        rollTimeLimit: gameSettings.rollTimeLimit
    });
    broadcastSystemNotification(`Round ${gameSettings.currentRound} has begun! You have ${gameSettings.rollTimeLimit} seconds to roll.`);

    let timeLeft = gameSettings.rollTimeLimit;
    if (gameSettings.roundTimerInterval) clearInterval(gameSettings.roundTimerInterval);
    gameSettings.roundTimerInterval = setInterval(() => {
        timeLeft--;
        io?.emit('rollTimerUpdate', timeLeft);
        if (timeLeft <= 0) {
            clearInterval(gameSettings.roundTimerInterval!);
            handleUnrolledPlayers();
            checkRoundCompletion();
        }
    }, 1000);
}

function handleUnrolledPlayers() {
    Object.values(players).forEach(player => {
        if (!player.hasRolledThisRound) {
            player.roundScores[gameSettings.currentRound - 1] = 0;
            io?.to(player.id).emit('scoreUpdate', {
                newTotalScore: player.totalScore,
                message: "No roll this round! +0 points."
            });
            player.hasRolledThisRound = true;
        }
    });
}

function checkRoundCompletion() {
    const allPlayersProcessedForRound = Object.values(players).every(p => p.hasRolledThisRound);
    if (allPlayersProcessedForRound) {
        if (gameSettings.roundTimerInterval) clearInterval(gameSettings.roundTimerInterval);
        broadcastSystemNotification(`Round ${gameSettings.currentRound} ended. Calculating scores...`);

        const leaderboardData = getLeaderboardData(players);
        io?.emit('roundEndLeaderboard', { leaderboard: leaderboardData.slice(0, 5) });
        io?.emit('gameStateUpdate', { players });

        setTimeout(() => {
            if (gameSettings.currentRound >= gameSettings.totalRounds) {
                io?.emit('calculatingFinalResults', 'Calculating Final Results...');
                setTimeout(endGame, 2000);
            } else {
                const nextRound = gameSettings.currentRound + 1;
                let countdown = gameSettings.nextRoundCountdownTime;
                const countdownInterval = setInterval(() => {
                    io?.emit('nextRoundCountdown', { message: `Get Ready for Round ${nextRound}!`, countdown });
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

function getLeaderboardData(currentPlayers: Record<string, Player>) {
    return Object.values(currentPlayers)
        .sort((a, b) => {
            if (b.totalScore !== a.totalScore) {
                return b.totalScore - a.totalScore;
            }
            for (let i = 0; i < gameSettings.totalRounds; i++) {
                const scoreA = a.roundScores[i] !== undefined ? a.roundScores[i] : -1;
                const scoreB = b.roundScores[i] !== undefined ? b.roundScores[i] : -1;
                if (scoreB !== scoreA) {
                    return scoreB - scoreA;
                }
            }
            return 0;
        })
        .map((player, index) => ({ ...player, rank: index + 1 }));
}

function endGame() {
    gameSettings.gameInProgress = false;
    broadcastSystemNotification('Game Over! Final results are in.');

    const finalRankings = getLeaderboardData(players);
    const totalPot = Object.values(players).reduce((sum, p) => sum + p.bet, 0);
    const houseCommission = totalPot * gameSettings.houseCommissionRate;
    const distributablePot = totalPot - houseCommission;

    const finalWinners = determineWinnersAndPayouts(finalRankings, distributablePot);

    finalRankings.forEach(playerData => {
        let tiebreakerNote = null;
        const tiedGroups = groupTiedPlayers(finalRankings, 'totalScore');
        for (const group of tiedGroups) {
            if (group.length > 1 && group.find(p => p.id === playerData.id)) {
                const firstInGroup = group[0];
                const playerInGroup = group.find(p => p.id === playerData.id);
                if (playerInGroup && playerInGroup.rank !== firstInGroup.rank) {
                    for (let i = 0; i < gameSettings.totalRounds; i++) {
                        if ((playerInGroup.roundScores[i] !== undefined ? playerInGroup.roundScores[i] : -1) !==
                            (firstInGroup.roundScores[i] !== undefined ? firstInGroup.roundScores[i] : -1)) {
                            tiebreakerNote = `Note on Tiebreak for rank ${playerInGroup.rank}: ${playerInGroup.name} and ${firstInGroup.name} had the same total score of ${playerInGroup.totalScore}. `;
                            tiebreakerNote += `${firstInGroup.name} is ranked higher because their dice sum in Round ${i + 1} (${firstInGroup.roundScores[i]}) was greater than ${playerInGroup.name}'s dice sum in Round ${i + 1} (${playerInGroup.roundScores[i]}).`;
                            break;
                        }
                    }
                }
                break;
            }
        }

        io?.to(playerData.id).emit('gameOver', {
            yourRank: playerData.rank,
            yourScore: playerData.totalScore,
            finalLeaderboard: finalRankings.slice(0, 5),
            tiebreakerNote: tiebreakerNote,
            payout: {
                totalPot: totalPot,
                houseCommission: houseCommission,
                distributablePot: distributablePot,
                yourWinnings: finalWinners.payouts[playerData.id] || 0
            }
        });
    });

    // Reset for a new game
    players = {};
    gameSettings.scheduledTime = null;
    gameSettings.betAmount = null;
    gameSettings.currentRound = 0;
}

function groupTiedPlayers(rankedPlayers: Player[], scoreField: keyof Player) {
    const groups: Player[][] = [];
    if (!rankedPlayers || rankedPlayers.length === 0) return groups;

    let currentGroup = [rankedPlayers[0]];
    for (let i = 1; i < rankedPlayers.length; i++) {
        if (rankedPlayers[i][scoreField] === currentGroup[0][scoreField]) {
            let stillTiedOnRounds = true;
            for (let r = 0; r < gameSettings.totalRounds; r++) {
                if ((rankedPlayers[i].roundScores[r] || 0) !== (currentGroup[0].roundScores[r] || 0)) {
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
    groups.push(currentGroup);
    return groups;
}

function determineWinnersAndPayouts(finalRankings: Player[], distributablePot: number) {
    const payouts: Record<string, number> = {};
    const numPlayers = finalRankings.length;

    if (numPlayers === 0) return { winners: [], payouts };

    const rankedGroups: Player[][] = [];
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

    let prizePools: number[] = [];
    if (numPlayers >= 5 || numPlayers === 4) {
        prizePools = [
            distributablePot * 0.60,
            distributablePot * 0.20,
            distributablePot * 0.10
        ];
        if (numPlayers === 4) {
            prizePools = [distributablePot * 0.70, distributablePot * 0.20, 0];
        }
    } else if (numPlayers >= 2 && numPlayers <= 3) {
        prizePools = [distributablePot, 0, 0];
    }

    let currentPrizeIndex = 0;
    for (const group of rankedGroups) {
        if (currentPrizeIndex >= prizePools.length || prizePools[currentPrizeIndex] === 0) break;

        const prizeForThisRankAndLower = prizePools.slice(currentPrizeIndex, currentPrizeIndex + group.length).reduce((a, b) => a + b, 0);
        const individualShare = prizeForThisRankAndLower / group.length;

        group.forEach(player => {
            payouts[player.id] = individualShare;
        });
        currentPrizeIndex += group.length;
    }
    return { payouts };
}

function broadcastSystemNotification(message: string) {
    if (!io) return;
    io.emit('systemNotification', message);
    console.log(`Broadcast: ${message}`);
} 