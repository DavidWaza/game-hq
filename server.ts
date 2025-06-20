import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { initSocket } from './src/lib/socket';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    // Create Socket.IO server and attach it to the HTTP server
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:2025',
            methods: ['GET', 'POST'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization']
        },
        path: '/api/socket',
        addTrailingSlash: true,
        transports: ['websocket', 'polling'],
        allowEIO3: true,
        pingTimeout: 60000,
        pingInterval: 25000,
        connectTimeout: 45000,
        allowUpgrades: true,
        cookie: false,
        serveClient: false
    });

    // Add error handling for the Socket.IO server
    io.engine.on('connection_error', (err) => {
        console.error('Socket.IO connection error:', err);
    });

    // Initialize Socket.IO server with the io instance
    initSocket(io);

    server.listen(2025, () => {
        console.log(`> Ready on ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:2025'}`);
    });
}); 