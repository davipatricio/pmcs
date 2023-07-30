import Server from './structures/Server';

const server = new Server({
  port: 25_565,
});

server.start();

server.on('serverListPing', (event) => {
  event.sendResponse({
    maxPlayers: 999,
    playerCount: 12,
    text: 'A',
  }); 
});
