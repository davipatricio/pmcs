import { type Server as NetServer, createServer, Socket } from "net";
import decidePacket from "../packets/decider";
import Packet from "./Packet";
import Player from "./Player";

interface ServerOptions {
  compress?: boolean;
  maxPlayers?: number;
  noDelay?: boolean;
  port: number;
}

const defaultOptions: ServerOptions = {
  compress: false,
  maxPlayers: 20,
  noDelay: false,
  port: 25565
};

export default class Server {
  players: Player[] = [];
  options: ServerOptions;
  #netServer: NetServer;

  constructor(options?: ServerOptions) {
    this.options = {
      ...defaultOptions,
      ...options
    };

    this.#netServer = createServer({
      noDelay: this.options.noDelay
    });
  }

  start() {
    this.#netServer.listen(this.options.port, () =>
      console.log(`Server started on port ${this.options.port}`)
    );

    this.#netServer.on("connection", (socket: Socket) => {
      const player = new Player(socket);
      this.players.push(player);

      socket.on("data", (data) => {
        Packet.fromBuffer(data).forEach((packet) =>
          decidePacket(packet, player)
        );
      });

      socket.on("close", () => {
        this.players.splice(this.players.indexOf(player), 1);
      });
    });
  }
}
