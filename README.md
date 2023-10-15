# pmcs

**pmcs** ('Performant Minecraft Server') is a Minecraft server written in TypeScript with the goal of being fast and lightweight. It is currently in development and is not ready for use.

pmcs aims to be fully compatible with the latest version of Minecraft (1.20.2 at the time of writing). Support for older versions may be added in the future.

## Features

- [ ] Player join
- [ ] Plugins
- [ ] Commands
- [x] Events
- [ ] World
- [ ] Entities
- [ ] Physics

## Example

```js
import { Server } from 'pmcs';

const server = new Server();

server.on('serverListPing', (event) => {
  event.setMaxPlayers(2000).setDescription('§aPMCS - A performant Minecraft server');
});

// Server will listen on port 25565 by default
server.listen();
```

## Credits

- [wiki.vg](https://wiki.vg) for the [protocol documentation](https://wiki.vg/Protocol).

## License

This project is licensed under the [MIT License](LICENSE).
