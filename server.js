const express = require('express');
const { createServer } = require('node:http');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
const createBareServer = require('@tomphttp/bare-server-node');
const { join } = require('node:path');

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');

app.use(express.static(join(__dirname, 'public')));
app.use('/uv/', express.static(uvPath));

// Fix the 404 error by sending a simple text response if file is missing
app.use((req, res) => {
    res.status(404).send('Page not found');
});

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Proxy active on port ${PORT}`);
});
