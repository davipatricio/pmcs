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

export default class Server {
  options: ServerOptions = {
    compress: false,
    maxPlayers: 20,
    noDelay: false,
    port: 25565
  };

  #netServer: NetServer;

  constructor(options: ServerOptions) {
    this.options = options;

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
    
      console.log("Client connected");
    
      socket.on("data", (data) => {
        const packets = Packet.fromBuffer(data);
    
        for (const packet of packets) {
          decidePacket(packet, player);
        }
      });
    
      // socket.on("close", () => console.log("Client disconnected"));
    });
  }
}
