import Server from './structures/Server';

const server = new Server();

server.listen();

server.on('serverListPing', (event) => {
  event.sendResponse({
    maxPlayers: 100,
    playersCount: 1,
    text: 'A Minecraft Server',
  });
});
