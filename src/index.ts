import Server from './structures/MCServer';

const server = new Server({
  connection: {
    noDelay: true,
  },
  server: {
    defaultMotd: '§a§nPMCS§r§a on §b§lMinecraft 1.8.9!',
    hideOnlinePlayers: true,
    maxPlayers: 100,
  },
});

server.listen();

server.on('serverListPing', (event) => {
  event.setPlayers(1).setVersionProtocol(47).setVersionName('1.8.9');
});
