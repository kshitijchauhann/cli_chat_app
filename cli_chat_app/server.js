const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data, isBinary) => {
    server.clients.forEach( (client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, {binary: isBinary});
      }
    });
  });
});


