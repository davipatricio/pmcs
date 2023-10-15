import Server from './structures/MCServer';

const server = new Server();

server.listen();

server.on('serverListPing', (event) => {
  event.setMaxPlayers(100);
  event.setPlayers(1);
  event.setDescription('§bPMCS on Minecraft 1.8.9!');
  event.setVersionProtocol(47);
  event.setVersionName('1.8.9');
});
