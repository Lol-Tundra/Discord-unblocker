const express = require('express');
const { createServer } = require('node:http');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
const { join } = require('node:path');

const app = express();
const server = createServer(app);

// Serve static files (the frontend)
app.use(express.static(join(__dirname, 'public')));

// Serve Ultraviolet script files
app.use('/uv/', express.static(uvPath));

app.use((req, res) => {
    res.status(404).sendFile(join(__dirname, 'public', '404.html'));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
});
