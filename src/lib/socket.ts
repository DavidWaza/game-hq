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
    userId: string;
    name: string;
    totalScore: number;
    roundScores: number[];
    hasRolledThisRound: boolean;
    isReady: boolean;
    bet: number;
    rank?: number;
}

interface GameSettings {
    scheduledTime: Date | null;
    notificationInterval: NodeJS.Timeout | null;
    autoStartTimeout: NodeJS.Timeout | null;
    gameStartTime: Date | null;
    minPlayers: number;
    maxPlayers: number;
    betAmount: number | null;
    currentRound: number;
    totalRounds: number;
    rollTimeLimit: number;
    roundEndDisplayTime: number;
    nextRoundCountdownTime: number;
    gameInProgress: boolean;
    gameLoading: boolean;
    roundTimerInterval: NodeJS.Timeout | null;
    houseCommissionRate: number;
}

class Game {
    id: string;
    wagerId: string;
    players: Record<string, Player>;
    playerUserIds: Set<string>;
    settings: GameSettings;
    io: SocketIOServer;

    constructor(id: string, wagerId: string, io: SocketIOServer) {
        this.id = id;
        this.wagerId = wagerId;
        this.io = io;
        this.players = {};
        this.playerUserIds = new Set();
        this.settings = {
            scheduledTime: null,
            notificationInterval: null,
            autoStartTimeout: null,
            gameStartTime: null,
            minPlayers: 2,
            maxPlayers: 30,
            betAmount: null,
            currentRound: 0,
            totalRounds: 5,
            rollTimeLimit: 12,
            roundEndDisplayTime: 12,
            nextRoundCountdownTime: 5,
            gameInProgress: false,
            gameLoading: false,
            roundTimerInterval: null,
            houseCommissionRate: 0.10
        };
    }

    broadcastSystemNotification(message: string) {
        this.io.to(this.id).emit('systemNotification', message);
        console.log(`Game ${this.id} - Broadcast: ${message}`);
    }

    cleanup() {
        if (this.settings.notificationInterval) clearInterval(this.settings.notificationInterval);
        if (this.settings.autoStartTimeout) clearTimeout(this.settings.autoStartTimeout);
        if (this.settings.roundTimerInterval) clearInterval(this.settings.roundTimerInterval);
        this.players = {};
        this.playerUserIds.clear();
        this.settings = {
            scheduledTime: null,
            notificationInterval: null,
            autoStartTimeout: null,
            gameStartTime: null,
            minPlayers: 2,
            maxPlayers: 30,
            betAmount: null,
            currentRound: 0,
            totalRounds: 5,
            rollTimeLimit: 12,
            roundEndDisplayTime: 12,
            nextRoundCountdownTime: 5,
            gameInProgress: false,
            gameLoading: false,
            roundTimerInterval: null,
            houseCommissionRate: 0.10
        };
    }

    scheduleGame(startTime: Date) {
        this.settings.scheduledTime = startTime;
        console.log(`Game ${this.id} scheduled for: ${this.settings.scheduledTime}`);

        // Notifications leading up to the game
        const preGameNotifDelay = (this.settings.scheduledTime.getTime() - Date.now()) - (3 * 60 * 1000);
        if (preGameNotifDelay > 0) {
            setTimeout(() => {
                let notificationCount = 0;
                this.settings.notificationInterval = setInterval(() => {
                    if (this.settings.gameInProgress || this.settings.gameLoading || !this.settings.scheduledTime) {
                        clearInterval(this.settings.notificationInterval!);
                        return;
                    }
                    const timeLeftMs = this.settings.scheduledTime!.getTime() - Date.now() + (90 * 1000);
                    if (timeLeftMs <= 0) {
                        clearInterval(this.settings.notificationInterval!);
                        return;
                    }
                    const minutesLeft = Math.floor((timeLeftMs / (1000 * 60)) % 60);
                    const secondsLeft = Math.floor((timeLeftMs / 1000) % 60);
                    if (minutesLeft * 60 + secondsLeft <= 180) {
                        this.broadcastSystemNotification(`Dice Roll Challenge starts in ~${Math.ceil(timeLeftMs / (1000 * 60))} minutes!`);
                        notificationCount++;
                        if (notificationCount >= 6) clearInterval(this.settings.notificationInterval!);
                    }
                }, 30 * 1000);
            }, preGameNotifDelay);
        }

        // Automatic game start
        const autoStartTime = this.settings.scheduledTime.getTime() + (90 * 1000);
        const delayToAutoStart = autoStartTime - Date.now();

        if (delayToAutoStart > 0) {
            this.settings.autoStartTimeout = setTimeout(() => {
                if (!this.settings.gameInProgress && !this.settings.gameLoading) {
                    console.log('Auto-starting game.');
                    this.startGame();
                }
            }, delayToAutoStart);
        } else if (!this.settings.gameInProgress && !this.settings.gameLoading && Object.keys(this.players).length >= this.settings.minPlayers) {
            console.log('Scheduled time is past, auto-starting now.');
            this.startGame();
        }
    }

    checkIfAllReadyAndStart() {
        if (this.settings.gameInProgress || this.settings.gameLoading) return;

        const presentPlayers = Object.values(this.players);
        if (presentPlayers.length < this.settings.minPlayers) {
            this.broadcastSystemNotification(`Waiting for at least ${this.settings.minPlayers} players. Currently ${presentPlayers.length}.`);
            return;
        }

        const allReady = presentPlayers.every(p => p.isReady);
        if (allReady) {
            this.broadcastSystemNotification('All ready players! Starting game immediately...');
            if (this.settings.autoStartTimeout) clearTimeout(this.settings.autoStartTimeout);
            if (this.settings.notificationInterval) clearInterval(this.settings.notificationInterval);
            this.startGame();
        } else {
            const unreadyCount = presentPlayers.filter(p => !p.isReady).length;
            this.io.to(this.id).emit('playerReadyStatus', `Waiting for ${unreadyCount} other player(s) to ready up...`);
        }
    }

    startGame() {
        if (this.settings.gameInProgress || this.settings.gameLoading) return;
        if (Object.keys(this.players).length < this.settings.minPlayers) {
            this.broadcastSystemNotification(`Cannot start game. Need at least ${this.settings.minPlayers} players. Only ${Object.keys(this.players).length} present.`);
            this.settings.scheduledTime = null;
            return;
        }

        this.settings.gameLoading = true;
        this.settings.gameInProgress = false;
        this.io.to(this.id).emit('gameLoading', 'Game Loading: Dice Roll Challenge...');

        setTimeout(() => {
            this.settings.gameLoading = false;
            this.settings.gameInProgress = true;
            this.settings.currentRound = 0;
            Object.values(this.players).forEach(p => {
                p.totalScore = 0;
                p.roundScores = new Array(this.settings.totalRounds).fill(0);
            });

            this.io.to(this.id).emit('gameIntro', 'Welcome to Dice Roll Challenge! Roll two dice each round for 5 rounds. Accumulate the highest score to win. Good luck!');
            this.broadcastSystemNotification('Game Started!');
            this.io.to(this.id).emit('gameStateUpdate', { players: this.players });

            setTimeout(() => {
                this.startNextRound();
            }, 20000);
        }, 3000);
    }

    startNextRound() {
        if (this.settings.currentRound >= this.settings.totalRounds) {
            this.endGame();
            return;
        }

        this.settings.currentRound++;
        Object.values(this.players).forEach(p => p.hasRolledThisRound = false);

        this.io.to(this.id).emit('roundStart', {
            roundNumber: this.settings.currentRound,
            rollTimeLimit: this.settings.rollTimeLimit
        });
        this.broadcastSystemNotification(`Round ${this.settings.currentRound} has begun! You have ${this.settings.rollTimeLimit} seconds to roll.`);

        let timeLeft = this.settings.rollTimeLimit;
        if (this.settings.roundTimerInterval) clearInterval(this.settings.roundTimerInterval);
        this.settings.roundTimerInterval = setInterval(() => {
            timeLeft--;
            this.io.to(this.id).emit('rollTimerUpdate', timeLeft);
            if (timeLeft <= 0) {
                clearInterval(this.settings.roundTimerInterval!);
                this.handleUnrolledPlayers();
                this.checkRoundCompletion();
            }
        }, 1000);
    }

    handleUnrolledPlayers() {
        Object.values(this.players).forEach(player => {
            if (!player.hasRolledThisRound) {
                player.roundScores[this.settings.currentRound - 1] = 0;
                this.io.to(player.id).emit('scoreUpdate', {
                    newTotalScore: player.totalScore,
                    message: "No roll this round! +0 points."
                });
                player.hasRolledThisRound = true;
            }
        });
    }

    checkRoundCompletion() {
        const allPlayersProcessedForRound = Object.values(this.players).every(p => p.hasRolledThisRound);
        if (allPlayersProcessedForRound) {
            if (this.settings.roundTimerInterval) clearInterval(this.settings.roundTimerInterval);
            this.broadcastSystemNotification(`Round ${this.settings.currentRound} ended. Calculating scores...`);

            const leaderboardData = this.getLeaderboardData();
            this.io.to(this.id).emit('roundEndLeaderboard', { leaderboard: leaderboardData.slice(0, 5) });
            this.io.to(this.id).emit('gameStateUpdate', { players: this.players });

            setTimeout(() => {
                if (this.settings.currentRound >= this.settings.totalRounds) {
                    this.io.to(this.id).emit('calculatingFinalResults', 'Calculating Final Results...');
                    setTimeout(() => this.endGame(), 2000);
                } else {
                    const nextRound = this.settings.currentRound + 1;
                    let countdown = this.settings.nextRoundCountdownTime;
                    const countdownInterval = setInterval(() => {
                        this.io.to(this.id).emit('nextRoundCountdown', { message: `Get Ready for Round ${nextRound}!`, countdown });
                        countdown--;
                        if (countdown < 0) {
                            clearInterval(countdownInterval);
                            this.startNextRound();
                        }
                    }, 1000);
                }
            }, this.settings.roundEndDisplayTime * 1000);
        }
    }

    getLeaderboardData() {
        return Object.values(this.players)
            .sort((a, b) => {
                if (b.totalScore !== a.totalScore) {
                    return b.totalScore - a.totalScore;
                }
                for (let i = 0; i < this.settings.totalRounds; i++) {
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

    endGame() {
        this.settings.gameInProgress = false;
        this.broadcastSystemNotification('Game Over! Final results are in.');

        const finalRankings = this.getLeaderboardData();
        const totalPot = Object.values(this.players).reduce((sum, p) => sum + p.bet, 0);
        const houseCommission = totalPot * this.settings.houseCommissionRate;
        const distributablePot = totalPot - houseCommission;

        const finalWinners = this.determineWinnersAndPayouts(finalRankings, distributablePot);

        finalRankings.forEach(playerData => {
            let tiebreakerNote = null;
            const tiedGroups = this.groupTiedPlayers(finalRankings, 'totalScore');
            for (const group of tiedGroups) {
                if (group.length > 1 && group.find(p => p.id === playerData.id)) {
                    const firstInGroup = group[0];
                    const playerInGroup = group.find(p => p.id === playerData.id);
                    if (playerInGroup && playerInGroup.rank !== firstInGroup.rank) {
                        for (let i = 0; i < this.settings.totalRounds; i++) {
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

            this.io.to(playerData.id).emit('gameOver', {
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

        // Clean up the game
        this.cleanup();
        delete games[this.id];
    }

    groupTiedPlayers(rankedPlayers: Player[], scoreField: keyof Player) {
        const groups: Player[][] = [];
        if (!rankedPlayers || rankedPlayers.length === 0) return groups;

        let currentGroup = [rankedPlayers[0]];
        for (let i = 1; i < rankedPlayers.length; i++) {
            if (rankedPlayers[i][scoreField] === currentGroup[0][scoreField]) {
                let stillTiedOnRounds = true;
                for (let r = 0; r < this.settings.totalRounds; r++) {
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

    determineWinnersAndPayouts(finalRankings: Player[], distributablePot: number) {
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
}

// Global variables for game management
let io: SocketIOServer | null = null;
const games: Record<string, Game> = {};
const wagerGames: Record<string, string> = {};

// Global variables for lobby management
const lobbies: Record<string, {
    players: Record<string, {
        id: number;
        name: string;
        status: "ready" | "not ready" | "disconnected";
        captain: boolean;
        socketId: string;
        isConnected?: boolean;
        previousStatus?: "ready" | "not ready";
    }>;
    wagerId: string;
    chatMessages: Array<{
        id: string;
        sender: string;
        message: string;
        time: string;
        type: 'system' | 'user';
    }>;
    createdAt: Date;
}> = {};

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

                // === LOBBY MANAGEMENT ===

                // Handle joining a lobby
                socket.on('joinLobby', (data: {
                    slug: string,
                    player: { id: number; name: string; status: "ready" | "not ready"; captain: boolean },
                    wagerTitle?: string
                }) => {
                    if (!io) return;

                    const { slug, player, wagerTitle } = data;
                    const lobbyId = `lobby_${slug}`;

                    // Create lobby if it doesn't exist
                    if (!lobbies[lobbyId]) {
                        lobbies[lobbyId] = {
                            players: {},
                            wagerId: slug,
                            chatMessages: [],
                            createdAt: new Date()
                        };
                    }

                    // Join the lobby room
                    socket.join(lobbyId);

                    // Check if player already exists (reconnection)
                    const existingPlayer = Object.values(lobbies[lobbyId].players).find(p => p.id === player.id);
                    if (existingPlayer) {
                        // Update existing player's connection status
                        Object.keys(lobbies[lobbyId].players).forEach(socketKey => {
                            if (lobbies[lobbyId].players[socketKey].id === player.id) {
                                lobbies[lobbyId].players[socketKey] = {
                                    ...lobbies[lobbyId].players[socketKey],
                                    status: lobbies[lobbyId].players[socketKey].previousStatus || "not ready",
                                    isConnected: true,
                                    socketId: socket.id
                                };
                            }
                        });

                        // Send reconnection message to chat
                        const reconnectMessage = {
                            id: `reconnect_${Date.now()}_${player.id}`,
                            sender: "System",
                            message: `${player.name} has reconnected!`,
                            time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            type: 'system' as const
                        };
                        lobbies[lobbyId].chatMessages.push(reconnectMessage);
                        io.to(lobbyId).emit('chatMessage', reconnectMessage);

                        console.log(`Player ${player.name} reconnected to lobby ${slug}`);
                    } else {
                        // Add new player to lobby
                        lobbies[lobbyId].players[socket.id] = {
                            ...player,
                            socketId: socket.id,
                            isConnected: true
                        };

                        // Send welcome message if this is the first player
                        if (Object.keys(lobbies[lobbyId].players).length === 1) {
                            const welcomeMessage = {
                                id: `welcome_${Date.now()}`,
                                sender: "System",
                                message: `Welcome to the ${wagerTitle || slug} lobby! Get ready for an exciting match!`,
                                time: new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }),
                                type: 'system' as const
                            };
                            lobbies[lobbyId].chatMessages.push(welcomeMessage);
                            io.to(lobbyId).emit('chatMessage', welcomeMessage);
                        }

                        // Send player joined message to chat
                        const joinMessage = {
                            id: `join_${Date.now()}_${player.id}`,
                            sender: "System",
                            message: `${player.name} has joined the lobby!`,
                            time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            type: 'system' as const
                        };
                        lobbies[lobbyId].chatMessages.push(joinMessage);
                        io.to(lobbyId).emit('chatMessage', joinMessage);

                        console.log(`Player ${player.name} joined lobby ${slug}`);
                    }

                    // Broadcast player joined to all in lobby
                    io.to(lobbyId).emit('playerJoined', player);

                    // Send current player list to all in lobby
                    const playerList = Object.values(lobbies[lobbyId].players).map(p => ({
                        id: p.id,
                        name: p.name,
                        status: p.status,
                        captain: p.captain
                    }));
                    io.to(lobbyId).emit('playerListUpdate', playerList);

                    // Send chat history to the new player
                    socket.emit('chatHistory', lobbies[lobbyId].chatMessages);
                });

                // Handle leaving a lobby
                socket.on('leaveLobby', (data: { slug: string }) => {
                    if (!io) return;

                    const { slug } = data;
                    const lobbyId = `lobby_${slug}`;

                    if (lobbies[lobbyId] && lobbies[lobbyId].players[socket.id]) {
                        const player = lobbies[lobbyId].players[socket.id];

                        // Remove player from lobby
                        delete lobbies[lobbyId].players[socket.id];

                        // Leave the lobby room
                        socket.leave(lobbyId);

                        // Send player left message to chat
                        const leaveMessage = {
                            id: `leave_${Date.now()}_${player.id}`,
                            sender: "System",
                            message: `${player.name} has left the lobby.`,
                            time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            type: 'system' as const
                        };
                        lobbies[lobbyId].chatMessages.push(leaveMessage);
                        io.to(lobbyId).emit('chatMessage', leaveMessage);

                        // Broadcast player left to all in lobby
                        io.to(lobbyId).emit('playerLeft', player.id);

                        // Send updated player list to all in lobby
                        const playerList = Object.values(lobbies[lobbyId].players).map(p => ({
                            id: p.id,
                            name: p.name,
                            status: p.status,
                            captain: p.captain
                        }));
                        io.to(lobbyId).emit('playerListUpdate', playerList);

                        // Clean up empty lobbies
                        if (Object.keys(lobbies[lobbyId].players).length === 0) {
                            delete lobbies[lobbyId];
                        }

                        console.log(`Player ${player.name} left lobby ${slug}`);
                    }
                });

                // Handle player status updates
                socket.on('updatePlayerStatus', (data: { slug: string, status: "ready" | "not ready" }) => {
                    if (!io) return;

                    const { slug, status } = data;
                    const lobbyId = `lobby_${slug}`;

                    if (lobbies[lobbyId] && lobbies[lobbyId].players[socket.id]) {
                        const player = lobbies[lobbyId].players[socket.id];

                        // Update player status
                        lobbies[lobbyId].players[socket.id].status = status;

                        // Broadcast status change to all in lobby
                        io.to(lobbyId).emit('playerStatusChanged', player.id, status);

                        // Send updated player list to all in lobby
                        const playerList = Object.values(lobbies[lobbyId].players).map(p => ({
                            id: p.id,
                            name: p.name,
                            status: p.status,
                            captain: p.captain
                        }));
                        io.to(lobbyId).emit('playerListUpdate', playerList);

                        console.log(`Player ${player.name} status changed to ${status} in lobby ${slug}`);
                    }
                });

                // Handle chat messages
                socket.on('sendChatMessage', (data: { slug: string, message: string }) => {
                    if (!io) return;

                    const { slug, message } = data;
                    const lobbyId = `lobby_${slug}`;

                    if (lobbies[lobbyId] && lobbies[lobbyId].players[socket.id]) {
                        const player = lobbies[lobbyId].players[socket.id];
                        const chatMessage = {
                            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            sender: player.name,
                            message: message.trim(),
                            time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            type: 'user' as const
                        };

                        // Add message to lobby history
                        lobbies[lobbyId].chatMessages.push(chatMessage);

                        // Broadcast message to all players in lobby
                        io.to(lobbyId).emit('chatMessage', chatMessage);

                        console.log(`Chat message from ${player.name} in lobby ${slug}: ${message}`);
                    }
                });

                // === GAME MANAGEMENT (existing code) ===

                // Handle initial connection with wager ID and user ID check
                socket.on('checkWagerId', (data: { wagerId?: string, userId?: string }) => {
                    if (!data.wagerId || !data.userId) {
                        socket.emit('redirectToMyGames');
                        return;
                    }

                    // Check if a game already exists for this wager
                    const existingGameId = wagerGames[data.wagerId];
                    if (existingGameId) {
                        const game = games[existingGameId];
                        if (game) {
                            // Check if user is already in the game
                            if (game.playerUserIds.has(data.userId)) {
                                socket.emit('error', 'You are already in this game');
                                return;
                            }
                            if (!game.settings.gameInProgress && !game.settings.gameLoading) {
                                socket.emit('gameFound', { gameId: existingGameId });
                            } else {
                                socket.emit('redirectToMyGames', 'Game is already in progress');
                            }
                        }
                    } else {
                        socket.emit('createGamePrompt', { wagerId: data.wagerId });
                    }
                });

                // Handle game creation
                socket.on('createGame', (data: { wagerId: string, userId: string }) => {
                    if (!io) return;
                    const gameId = `game_${Date.now()}`;
                    const game = new Game(gameId, data.wagerId, io);
                    games[gameId] = game;
                    wagerGames[data.wagerId] = gameId;
                    socket.join(gameId);
                    socket.emit('gameCreated', { gameId });
                });

                // Handle joining a game
                socket.on('joinGame', (data: { gameId: string, wagerId: string, userId: string, name: string, bet: number }) => {
                    if (!io) return;
                    const game = games[data.gameId];
                    if (!game) {
                        socket.emit('error', 'Game not found');
                        return;
                    }

                    // Verify wager ID matches
                    if (game.wagerId !== data.wagerId) {
                        socket.emit('error', 'Invalid wager ID for this game');
                        return;
                    }

                    // Check if user is already in the game
                    if (game.playerUserIds.has(data.userId)) {
                        socket.emit('error', 'You are already in this game');
                        return;
                    }

                    if (game.settings.gameInProgress || game.settings.gameLoading) {
                        socket.emit('registrationError', 'Game has already started or is loading.');
                        return;
                    }

                    if (Object.keys(game.players).length >= game.settings.maxPlayers) {
                        socket.emit('registrationError', 'Game is full.');
                        return;
                    }

                    if (game.settings.betAmount === null) {
                        game.settings.betAmount = data.bet;
                    } else if (data.bet !== game.settings.betAmount) {
                        socket.emit('registrationError', `Bet amount must be ${game.settings.betAmount}.`);
                        return;
                    }

                    socket.join(data.gameId);
                    game.players[socket.id] = {
                        id: socket.id,
                        userId: data.userId,
                        name: data.name,
                        totalScore: 0,
                        roundScores: [],
                        hasRolledThisRound: false,
                        isReady: false,
                        bet: data.bet
                    };
                    game.playerUserIds.add(data.userId);

                    socket.emit('playerRegistered', socket.id);
                    game.broadcastSystemNotification(`${data.name} has joined the game!`);
                    game.io.to(game.id).emit('gameStateUpdate', { players: game.players });

                    if (!game.settings.scheduledTime && Object.keys(game.players).length === 1) {
                        game.scheduleGame(new Date(Date.now() + 3 * 60 * 1000));
                    }
                });

                // Handle player ready status
                socket.on('playerReady', (data: { gameId: string, wagerId: string, userId: string, playerId: string }) => {
                    if (!io) return;
                    console.log('playerReady', data);
                    const game = games[data.gameId];
                    if (!game) {
                        socket.emit('error', 'Game not found');
                        return;
                    }

                    // Verify wager ID matches
                    if (game.wagerId !== data.wagerId) {
                        socket.emit('error', 'Invalid wager ID for this game');
                        return;
                    }

                    if (game.players[data.playerId]) {
                        game.players[data.playerId].isReady = true;
                        socket.emit('playerReadyStatus', 'You are Ready!');
                        game.broadcastSystemNotification(`${game.players[data.playerId].name} is ready!`);
                        game.io.to(game.id).emit('gameStateUpdate', { players: game.players });
                        game.checkIfAllReadyAndStart();
                    }
                });

                // Handle dice rolls
                socket.on('rollDice', (data: { gameId: string, wagerId: string }) => {
                    if (!io) return;
                    const game = games[data.gameId];
                    if (!game) {
                        socket.emit('error', 'Game not found');
                        return;
                    }

                    // Verify wager ID matches
                    if (game.wagerId !== data.wagerId) {
                        socket.emit('error', 'Invalid wager ID for this game');
                        return;
                    }

                    if (!game.settings.gameInProgress || !game.players[socket.id] || game.players[socket.id].hasRolledThisRound) {
                        return;
                    }

                    game.players[socket.id].hasRolledThisRound = true;
                    socket.emit('diceRolling');

                    setTimeout(() => {
                        if (!io) return;
                        const die1 = Math.floor(Math.random() * 6) + 1;
                        const die2 = Math.floor(Math.random() * 6) + 1;
                        const roundScore = die1 + die2;

                        game.players[socket.id].roundScores[game.settings.currentRound - 1] = roundScore;
                        game.players[socket.id].totalScore += roundScore;

                        socket.emit('diceResult', { die1, die2, roundScore });
                        socket.emit('scoreUpdate', {
                            newTotalScore: game.players[socket.id].totalScore,
                            message: `You rolled a ${die1} and a ${die2}! Round Score: ${roundScore}. Your Total Score is now ${game.players[socket.id].totalScore}.`
                        });

                        game.io.to(game.id).emit('gameStateUpdate', { players: game.players });
                        game.checkRoundCompletion();
                    }, 1500);
                });

                // Handle disconnection
                socket.on('disconnect', () => {
                    if (!io) return;

                    // === LOBBY CLEANUP ===
                    // Find all lobbies the player is in and mark them as disconnected
                    Object.entries(lobbies).forEach(([lobbyId, lobby]) => {
                        if (lobby.players[socket.id]) {
                            const player = lobby.players[socket.id];
                            const playerCount = Object.keys(lobby.players).length;

                            // Only remove if this is the only player
                            if (playerCount === 1) {
                                // Remove player from lobby
                                delete lobby.players[socket.id];

                                // Broadcast player left to all in lobby
                                if (io) {
                                    io.to(lobbyId).emit('playerLeft', player.id);
                                }

                                // Clean up empty lobbies
                                delete lobbies[lobbyId];
                            } else {
                                // Mark player as disconnected but keep in lobby
                                lobby.players[socket.id] = {
                                    ...player,
                                    previousStatus: player.status === "disconnected" ? player.previousStatus : player.status,
                                    status: "disconnected",
                                    isConnected: false
                                };

                                // Send player disconnected message to chat
                                const disconnectMessage = {
                                    id: `disconnect_${Date.now()}_${player.id}`,
                                    sender: "System",
                                    message: `${player.name} has disconnected.`,
                                    time: new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }),
                                    type: 'system' as const
                                };
                                lobby.chatMessages.push(disconnectMessage);
                                if (io) {
                                    io.to(lobbyId).emit('chatMessage', disconnectMessage);
                                }

                                // Send updated player list to all in lobby
                                const playerList = Object.values(lobby.players).map(p => ({
                                    id: p.id,
                                    name: p.name,
                                    status: p.status,
                                    captain: p.captain
                                }));
                                if (io) {
                                    io.to(lobbyId).emit('playerListUpdate', playerList);
                                }
                            }

                            console.log(`Player ${player.name} disconnected from lobby ${lobby.wagerId}`);
                        }
                    });

                    // === GAME CLEANUP ===
                    // Find all games the player is in
                    Object.values(games).forEach(game => {
                        if (game.players[socket.id]) {
                            const userId = game.players[socket.id].userId;
                            game.broadcastSystemNotification(`${game.players[socket.id].name} has left the game.`);
                            game.playerUserIds.delete(userId); // Remove user ID from set
                            delete game.players[socket.id];
                            game.io.to(game.id).emit('gameStateUpdate', { players: game.players });

                            if (game.settings.gameInProgress && Object.keys(game.players).length < game.settings.minPlayers) {
                                game.endGame();
                                // Clean up wager game mapping
                                delete wagerGames[game.wagerId];
                            }
                        }
                    });
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

// Move all the game management functions to be methods of the Game class
// ... rest of the existing functions will be moved to the Game class ... 