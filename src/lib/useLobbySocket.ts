import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { TypePlayer } from '../../types/global';


interface LobbySocketEvents {
    onPlayerJoined?: (player: TypePlayer) => void;
    onPlayerLeft?: (player: TypePlayer) => void;
    onPlayerStatusChanged?: (playerId: number, status: "ready" | "not ready") => void;
    onPlayerListUpdate?: (players: TypePlayer[]) => void;
    onGameStarted?: () => void;
    onChatHistory?: (messages: ChatMessage[]) => void;
    onError?: (error: string) => void;
}

interface ChatMessage {
    id: string;
    sender: string;
    message: string;
    time: string;
    type: 'system' | 'user';
}

export function useLobbySocket(
    slug: string,
    isConnected: boolean,
    currentPlayer: TypePlayer | null,
    wagerTitle?: string,
    events: LobbySocketEvents = {}
) {
    const socketRef = useRef<Socket | null>(null);
    const eventsRef = useRef(events);
    const isConnectedRef = useRef(isConnected);
    const currentPlayerRef = useRef(currentPlayer);
    const slugRef = useRef(slug);
    const wagerTitleRef = useRef(wagerTitle);
    const isUnmountingRef = useRef(false);

    // Update refs when props change
    eventsRef.current = events;
    isConnectedRef.current = isConnected;
    currentPlayerRef.current = currentPlayer;
    slugRef.current = slug;
    wagerTitleRef.current = wagerTitle;

    // Connect to socket when isConnected becomes true
    useEffect(() => {
        if (isUnmountingRef.current) return;

        if (!isConnectedRef.current || !currentPlayerRef.current) {
            // Disconnect if conditions are not met
            if (socketRef.current) {
                socketRef.current.emit('leaveLobby', { slug: slugRef.current });
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        // Only create new socket if one doesn't exist
        if (!socketRef.current) {
            const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:2025', {
                path: '/api/socket',
                transports: ['websocket', 'polling'],
                auth: {
                    token: typeof window !== 'undefined' ? sessionStorage.getItem('token') || undefined : undefined
                }
            });

            // Join the specific lobby room
            socket.emit('joinLobby', {
                slug: slugRef.current,
                player: currentPlayerRef.current,
                wagerTitle: wagerTitleRef.current
            });

            // Set up event listeners
            socket.on('playerJoined', (player: TypePlayer) => {
                eventsRef.current.onPlayerJoined?.(player);
            });

            socket.on('playerLeft', (player: TypePlayer) => {
                eventsRef.current.onPlayerLeft?.(player);
            });

            socket.on('playerStatusChanged', (playerId: number, status: "ready" | "not ready") => {
                eventsRef.current.onPlayerStatusChanged?.(playerId, status);
            });

            socket.on('playerListUpdate', (players: TypePlayer[]) => {
                eventsRef.current.onPlayerListUpdate?.(players);
            });

            socket.on('gameStarted', () => {
                eventsRef.current.onGameStarted?.();
            });


            socket.on('chatHistory', (messages: ChatMessage[]) => {
                eventsRef.current.onChatHistory?.(messages);
            });

            socket.on('error', (error: string) => {
                eventsRef.current.onError?.(error);
            });

            socketRef.current = socket;
        }

        // Cleanup function
        return () => {
            isUnmountingRef.current = true;
            if (socketRef.current) {
                socketRef.current.emit('leaveLobby', { slug: slugRef.current });
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [isConnected, slug]); // Only depend on isConnected and slug

    // Functions to emit events
    const updatePlayerStatus = useCallback((status: "ready" | "not ready") => {
        if (socketRef.current) {
            socketRef.current.emit('updatePlayerStatus', { slug: slugRef.current, status });
        }
    }, []);

    const updatePlayerOnlineStatus = useCallback((online: boolean) => {
        if (socketRef.current) {
            socketRef.current.emit('updatePlayerOnlineStatus', { slug: slugRef.current, online });
        }
    }, []);

    const sendChatMessage = useCallback((message: string) => {
        if (socketRef.current) {
            socketRef.current.emit('sendChatMessage', { slug: slugRef.current, message });
        }
    }, []);

    const leaveLobby = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.emit('leaveLobby', { slug: slugRef.current });
            // Don't disconnect immediately to allow the server to process the leave event
            setTimeout(() => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            }, 400);
        }
    }, []);

    const updateLobbyGameStarted = useCallback((gameStarted: boolean) => {
        if (socketRef.current) {
            socketRef.current.emit('updateLobbyGameStarted', { slug: slugRef.current, gameStarted });
        }
    }, []);


    return {
        updatePlayerStatus,
        updatePlayerOnlineStatus,
        sendChatMessage,
        leaveLobby,
        updateLobbyGameStarted,
        isConnected: socketRef.current?.connected || false
    };
} 