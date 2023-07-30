# pmcs 

**pmcs** ('Performant Minecraft Server') is a Minecraft server written in Node.js with the goal of being fast and lightweight. It is currently in development and is not ready for use.

## Example

```js
import { Server } from 'pmcs';

const server = new Server();

server.on('serverListPing', (event) => {
  event.sendResponse({
    playersCount: 1,
    maxPlayers: 2000,
    text: '§aPMCS'
  });
});

// Server will listen on port 25565 by default
server.listen();
```

## Credits

- [wiki.vg](https://wiki.vg) for the [protocol documentation](https://wiki.vg/Protocol).

## License

This project is licensed under the [MIT License](LICENSE).