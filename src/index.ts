import Server from "./structures/Server";

const server = new Server({
  port: 25_565
});

server.start();
