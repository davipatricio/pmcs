import Server from "./structures/Server";

const server = new Server({
  port: 25565
});

server.start();
