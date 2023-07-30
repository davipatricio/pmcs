import Server from './structures/Server';

const server = new Server();

server.listen();

server.on('serverListPing', (event) => {
  event.sendResponse({
    maxPlayers: 999,
    playersCount: 12,
    text: 'A',
  });
});
