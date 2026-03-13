const express = require('express');
const { createServer } = require('node:http');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
const { createBareServer } = require('@tomphttp/bare-server-node');
const { join } = require('node:path');

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');

// 1. Serve static files from the 'public' folder
app.use(express.static(join(__dirname, 'public')));

// 2. Serve Ultraviolet internal scripts
app.use('/uv/', express.static(uvPath));

// 3. Fallback for 404s
app.use((req, res) => {
    res.status(404).send('Resource not found');
});

// 4. Handle HTTP requests (Proxy vs Web Server)
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

// 5. Handle WebSocket upgrades (Required for Discord)
server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
