const http = require('http');
//test
const PORT = 60100;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Minimal server is running!\n');
});

server.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
