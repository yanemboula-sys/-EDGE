const http = require('http');
const httpProxy = require('http-proxy');

// on pointe vers TON NGINX VPS
const VPS = 'https://81.17.99.235';

const proxy = httpProxy.createProxyServer({
    target: VPS,
    ws: true,
    changeOrigin: true,
    secure: false
});

proxy.on('error', (err, req, res) => {
    console.error(err);
    if (res && !res.headersSent) {
        res.writeHead(502);
    }
    if (res) res.end('bad gateway');
});

const server = http.createServer((req, res) => {

    // on laisse passer uniquement ton endpoint V2Ray
    if (req.url.startsWith('/x/nom')) {
        proxy.web(req, res);
    } else {
        res.writeHead(404);
        res.end('not found');
    }

});

server.on('upgrade', (req, socket, head) => {

    if (req.url.startsWith('/x/nom')) {
        proxy.ws(req, socket, head);
    } else {
        socket.destroy();
    }

});

server.listen(process.env.PORT || 3000);