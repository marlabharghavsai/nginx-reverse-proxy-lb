const http = require('http');
const PORT = process.env.PORT || 3000;
const ID = process.env.BACKEND_ID || 'backend-1';

const server = http.createServer((req, res) => {
  if (req.url === '/static/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end('body { font-family: Arial; background: #f0f0f0; }');
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>Hello from ${ID}</h1><p>Path: ${req.url}</p>`);
  }
});

server.listen(PORT, () => {
  console.log(`${ID} listening on ${PORT}`);
});
