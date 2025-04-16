// server.mjs
import { createServer } from 'node:http';
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<p style="color: yellow">Heading level 5</p>');
});
// starts a simple http server locally on port 3000
server.listen(8086, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:8086');
});
// run with `node server.mjs`