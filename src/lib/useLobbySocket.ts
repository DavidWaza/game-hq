import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface LobbyPlayer {
    id: number;
    name: string;
    status: "ready" | "not ready" | "disconnected";
    captain: boolean;
    isConnected?: boolean;
    previousStatus?: "ready" | "not ready";
}

interface LobbySocketEvents {
    onPlayerJoined?: (player: LobbyPlayer) => void;
    onPlayerLeft?: (playerId: number) => void;
    onPlayerStatusChanged?: (playerId: number, status: "ready" | "not ready") => void;
    onPlayerListUpdate?: (players: LobbyPlayer[]) => void;
    onGameStarted?: () => void;
    onChatMessage?: (message: ChatMessage) => void;
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
    currentPlayer: LobbyPlayer | null,
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
                    token: typeof window !== 'undefined' ? localStorage.getItem('token') || undefined : undefined
                }
            });

            socketRef.current = socket;

            // Join the specific lobby room
            socket.emit('joinLobby', {
                slug: slugRef.current,
                player: currentPlayerRef.current,
                wagerTitle: wagerTitleRef.current
            });

            // Set up event listeners
            socket.on('playerJoined', (player: LobbyPlayer) => {
                console.log('Player joined lobby:', player);
                eventsRef.current.onPlayerJoined?.(player);
            });

            socket.on('playerLeft', (playerId: number) => {
                console.log('Player left lobby:', playerId);
                eventsRef.current.onPlayerLeft?.(playerId);
            });

            socket.on('playerStatusChanged', (playerId: number, status: "ready" | "not ready") => {
                console.log('Player status changed:', playerId, status);
                eventsRef.current.onPlayerStatusChanged?.(playerId, status);
            });

            socket.on('playerListUpdate', (players: LobbyPlayer[]) => {
                console.log('Player list updated:', players);
                eventsRef.current.onPlayerListUpdate?.(players);
            });

            socket.on('gameStarted', () => {
                console.log('Game started');
                eventsRef.current.onGameStarted?.();
            });

            socket.on('chatMessage', (message: ChatMessage) => {
                console.log('Chat message received:', message);
                eventsRef.current.onChatMessage?.(message);
            });

            socket.on('chatHistory', (messages: ChatMessage[]) => {
                console.log('Chat history received:', messages);
                eventsRef.current.onChatHistory?.(messages);
            });

            socket.on('error', (error: string) => {
                console.error('Socket error:', error);
                eventsRef.current.onError?.(error);
            });

            socket.on('connect', () => {
                console.log('Connected to lobby socket');
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from lobby socket');
            });
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

    const sendChatMessage = useCallback((message: string) => {
        if (socketRef.current) {
            socketRef.current.emit('sendChatMessage', { slug: slugRef.current, message });
        }
    }, []);

    const leaveLobby = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.emit('leaveLobby', { slug: slugRef.current });
        }
    }, []);

    return {
        updatePlayerStatus,
        sendChatMessage,
        leaveLobby,
        isConnected: socketRef.current?.connected || false
    };
} 