import http from 'http';

const TARGET_PORT = 3000;
const PROXY_PORT = 3001;

const server = http.createServer((req, res) => {
  // If requesting root on 3001, redirect browser to /app so Next.js router hydrates /app cleanly
  if (req.url === '/' || req.url === '') {
    res.writeHead(302, { Location: '/app' });
    res.end();
    return;
  }
  let targetPath = req.url;

  const options = {
    hostname: '127.0.0.1',
    port: TARGET_PORT,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${TARGET_PORT}`,
      'x-forwarded-host': req.headers.host || `localhost:${PROXY_PORT}`,
      'x-forwarded-port': String(PROXY_PORT),
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    // Pass headers
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('[Proxy Error]:', err.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end(`Bad Gateway: Unable to connect to FitFlow upstream on port ${TARGET_PORT}.`);
    }
  });

  req.pipe(proxyReq, { end: true });
});

// Support WebSocket upgrades for Next.js HMR
server.on('upgrade', (req, socket, head) => {
  const options = {
    hostname: '127.0.0.1',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${TARGET_PORT}`,
    },
  };

  const proxyReq = http.request(options);
  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    socket.write(`HTTP/1.1 101 Switching Protocols\r\n` +
      Object.keys(proxyRes.headers).map(h => `${h}: ${proxyRes.headers[h]}`).join('\r\n') +
      '\r\n\r\n');
    if (proxyHead && proxyHead.length) socket.unshift(proxyHead);
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.on('error', (err) => {
    console.error('[Proxy WS Error]:', err.message);
    socket.destroy();
  });

  proxyReq.end();
});

server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`🚀 FitFlow Mobile App proxy listening on http://localhost:${PROXY_PORT}`);
  console.log(`🔗 Proxies root to http://localhost:${TARGET_PORT}/app`);
});
