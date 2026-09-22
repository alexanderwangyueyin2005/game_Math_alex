'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const allowed = new Set(['index.html', 'adaptive-engine.js', 'array-architects.js', 'telemetry.js']);
const server = http.createServer((req, res) => {
  const name = new URL(req.url, 'http://localhost').pathname.slice(1) || 'index.html';
  if (!allowed.has(name)) { res.writeHead(404); res.end('Not found'); return; }
  res.setHeader('Content-Type', name.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
  fs.createReadStream(path.join(__dirname, name)).pipe(res);
});
server.listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => console.log('Array Architects: http://127.0.0.1:' + server.address().port));
