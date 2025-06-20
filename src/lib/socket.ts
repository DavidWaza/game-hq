import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { TypeChatMessage, TypePlayer } from '../../types/global';

export type NextApiResponseWithSocket = NextApiResponse & {
    socket: {
        server: NetServer & {
            io?: SocketIOServer;
        };
    };
};

// Global variables for game management
let io: SocketIOServer | null = null;

// Global variables for lobby management
const lobbies: Record<string, {
    players: Record<string, TypePlayer>;
    wagerId: string;
    chatMessages: Array<TypeChatMessage>;
    createdAt: Date;
    gameStarted: boolean | undefined;
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
                    player: TypePlayer,
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
                            createdAt: new Date(),
                            gameStarted: undefined
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
                                // set new player 
                                lobbies[lobbyId].players[socket.id] = {
                                    ...lobbies[lobbyId].players[socketKey],
                                    status: !lobbies[lobbyId].gameStarted ? "not ready" : "ready",
                                    isConnected: true,
                                    socketId: socket.id,
                                    online: true
                                };
                                // delete old player data
                                delete lobbies[lobbyId].players[socketKey];
                                // remove player from lobby
                                if (io) {
                                    io.sockets.sockets.get(socketKey)?.leave(lobbyId);
                                }
                            }
                        });

                        // Send reconnection message to chat
                        const reconnectMessage: TypeChatMessage = {
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

                        console.log(`Player ${player.name} reconnected to lobby ${slug}`);
                    } else {
                        // Add new player to lobby
                        lobbies[lobbyId].players[socket.id] = {
                            ...player,
                            isConnected: true,
                            socketId: socket.id,
                            online: true
                        };

                        // Send welcome message if this is the first player
                        if (Object.keys(lobbies[lobbyId].players).length === 1) {
                            const welcomeMessage: TypeChatMessage = {
                                id: `welcome_${Date.now()}`,
                                sender: "System",
                                message: `Welcome to the ${wagerTitle || slug} lobby! Get ready for an exciting match!`,
                                time: new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }),
                                type: 'system' as const
                            };
                            lobbies[lobbyId].chatMessages = [welcomeMessage];
                        }

                        // Send player joined message to chat
                        const joinMessage: TypeChatMessage = {
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

                        console.log(`Player ${player.name} joined lobby ${slug}`);
                    }

                    // in this order
                    // Send game started to all in lobby
                    io.to(lobbyId).emit('gameStarted', lobbies[lobbyId].gameStarted);

                    // Broadcast player joined to all in lobby
                    io.to(lobbyId).emit('playerJoined', player);

                    // Send current player list to all in lobby
                    io.to(lobbyId).emit('playerListUpdate', Object.values(lobbies[lobbyId].players));

                    // Send chat history
                    io.to(lobbyId).emit('chatHistory', lobbies[lobbyId].chatMessages);

                    // log players object
                    console.log('Players object:', lobbies[lobbyId].players);
                });

                // Handle leaving a lobby
                socket.on('leaveLobby', (data: { slug: string }) => {
                    if (!io) return;

                    const { slug } = data;
                    const lobbyId = `lobby_${slug}`;

                    if (lobbies[lobbyId] && lobbies[lobbyId].players[socket.id]) {
                        const playersObj = { ...lobbies[lobbyId].players };
                        const player = playersObj[socket.id];
                        // Mark player as disconnected but keep in lobby
                        playersObj[socket.id] = {
                            ...player,
                            previousStatus: player.status === "disconnected" ? player.previousStatus : player.status,
                            status: "disconnected",
                            isConnected: false,
                            online: false
                        };
                        lobbies[lobbyId].players = playersObj;
                        const playerArr = Object.values(playersObj);
                        const isAllDisconnected = playerArr.every(p => p.status === "disconnected");
                        if (isAllDisconnected) {
                            lobbies[lobbyId].players = {}
                            lobbies[lobbyId].chatMessages = []
                            // delete lobby
                            io.to(lobbyId).emit('chatHistory', lobbies[lobbyId].chatMessages);
                            io.to(lobbyId).emit('playerListUpdate', Object.values(lobbies[lobbyId].players));
                            delete lobbies[lobbyId];
                            console.log('Lobby Deleted:', lobbyId);
                        } else {
                            // Send player left message to chat
                            const leaveMessage: TypeChatMessage = {
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
                            io.to(lobbyId).emit('chatHistory', lobbies[lobbyId].chatMessages);

                            // Broadcast player left to all in lobby
                            io.to(lobbyId).emit('playerLeft', player);
                            // Send updated player list to all in lobby
                            io.to(lobbyId).emit('playerListUpdate', Object.values(lobbies[lobbyId].players));

                            console.log('Players left:', Object.values(lobbies[lobbyId].players));
                        }
                        // Leave the lobby room
                        socket.leave(lobbyId);
                        console.log("lobbyId", lobbyId)
                    }
                });

                // Handle updating lobby game started
                socket.on('updateLobbyGameStarted', (data: { slug: string, gameStarted: boolean }) => {
                    if (!io) return;
                    const { slug, gameStarted } = data;
                    const lobbyId = `lobby_${slug}`;
                    lobbies[lobbyId].gameStarted = gameStarted;
                    // Send updated game started to all in lobby
                    io.to(lobbyId).emit('gameStarted', gameStarted);
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
                        const playerList = Object.values(lobbies[lobbyId].players);
                        io.to(lobbyId).emit('playerListUpdate', playerList);

                        console.log(`Player ${player.name} status changed to ${status} in lobby ${slug}`);
                    }
                });
                // Handle player online status updates
                socket.on('updatePlayerOnlineStatus', (data: { slug: string, online: boolean }) => {
                    if (!io) return;

                    const { slug, online } = data;
                    const lobbyId = `lobby_${slug}`;

                    if (lobbies[lobbyId] && lobbies[lobbyId].players[socket.id]) {
                        const player = lobbies[lobbyId].players[socket.id];

                        // Update player online status
                        lobbies[lobbyId].players[socket.id].online = online;

                        // Broadcast online status change to all in lobby
                        io.to(lobbyId).emit('playerOnlineStatusChanged', player.id, online);

                        // Send updated player list to all in lobby
                        const playerList = Object.values(lobbies[lobbyId].players);
                        io.to(lobbyId).emit('playerListUpdate', playerList);

                        console.log(`Player ${player.name} online status changed to ${online} in lobby ${slug}`);
                    }
                });

                // Handle chat messages
                socket.on('sendChatMessage', (data: { slug: string, message: string }) => {
                    if (!io) return;

                    const { slug, message } = data;
                    const lobbyId = `lobby_${slug}`;

                    if (lobbies[lobbyId] && lobbies[lobbyId].players[socket.id]) {
                        const player = lobbies[lobbyId].players[socket.id];
                        const chatMessage: TypeChatMessage = {
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
                        io.to(lobbyId).emit('chatHistory', lobbies[lobbyId].chatMessages);

                        console.log(`Chat message from ${player.name} in lobby ${slug}: ${message}`);
                    }
                });

                // Handle disconnection
                socket.on('disconnect', () => {
                    if (!io) return;

                    // === LOBBY CLEANUP ===
                    // Find all lobbies the player is in and mark them as disconnected
                    Object.entries(lobbies).forEach(([lobbyId, lobby]) => {
                        if (lobby.players[socket.id]) {
                            const player = lobby.players[socket.id];

                            // Mark player as disconnected but keep in lobby
                            lobby.players[socket.id] = {
                                ...player,
                                previousStatus: player.status === "disconnected" ? player.previousStatus : player.status,
                                status: "disconnected",
                                isConnected: false,
                                online: false
                            };

                            // Send player disconnected message to chat
                            const disconnectMessage: TypeChatMessage = {
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
                                io.to(lobbyId).emit('chatHistory', lobby.chatMessages);
                            }

                            // Send updated player list to all in lobby
                            const playerList = Object.values(lobby.players);
                            if (io) {
                                io.to(lobbyId).emit('playerListUpdate', playerList);
                            }

                            console.log(`Player ${player.name} disconnected from lobby ${lobby.wagerId}`);
                        }
                    });
                });
            });

            // Periodic cleanup of empty lobbies (all players disconnected)
            setInterval(() => {
                Object.entries(lobbies).forEach(([lobbyId, lobby]) => {
                    const connectedPlayers = Object.values(lobby.players).filter(p => p.isConnected);

                    // If no players are connected, clean up the lobby
                    if (connectedPlayers.length === 0) {
                        console.log(`Cleaning up empty lobby: ${lobby.wagerId}`);
                        delete lobbies[lobbyId];
                    }
                });
            }, 30000); // Check every 30 seconds

            console.log('Socket.IO server initialized');
        } catch (error) {
            console.error('Socket initialization error:', error);
            throw error;
        }
    }
    return io;
}