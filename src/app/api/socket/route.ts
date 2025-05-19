import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Get the upgrade header
        const upgrade = request.headers.get('upgrade');
        const connection = request.headers.get('connection');

        // If this is a WebSocket upgrade request
        if (upgrade?.toLowerCase() === 'websocket' && connection?.toLowerCase().includes('upgrade')) {
            const response = new NextResponse(null, {
                status: 101,
                headers: {
                    'Upgrade': 'websocket',
                    'Connection': 'Upgrade',
                },
            });

            // Add CORS headers
            response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:2025');
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            response.headers.set('Access-Control-Allow-Credentials', 'true');

            return response;
        }

        // For non-WebSocket requests, return a 400
        return NextResponse.json({ error: 'WebSocket upgrade required' }, { status: 400 });
    } catch (error) {
        console.error('Socket initialization error:', error);
        return NextResponse.json({ error: 'Failed to initialize socket' }, { status: 500 });
    }
} 