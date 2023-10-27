import { MCServer } from '@pmcs/server';

const server = new MCServer({
  connection: {
    compress: false,
    noDelay: true,
  },
  server: {
    defaultMotd: '§7A Minecraft Server',
    hideOnlinePlayers: true,
    maxPlayers: 100,
  },
  version: {
    name: '1.8.9',
    protocol: 47,
  },
});

server.listen();

server.on('serverListPing', (event) => {
  event.setPlayers(1);
});
