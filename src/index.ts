import Server from './structures/MCServer';

const server = new Server({
  connection: {
    noDelay: true,
  },
  server: {
    defaultMotd: '§7A Minecraft Server',
    hideOnlinePlayers: true,
    maxPlayers: 100,
  },
});

server.listen();

server.on('serverListPing', (event) => {
  event.setPlayers(1).setVersionProtocol(764).setVersionName('1.20.2');
});
