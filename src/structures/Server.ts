import * as EventEmitter from 'node:events';
import { createServer } from 'node:net';
import type { Socket, Server as NetServer } from 'node:net';
import decidePacket from '../packets/decider';
import Packet from './Packet';
import Player from './Player';

interface ServerOptions {
  compress?: boolean;
  maxPlayers?: number;
  noDelay?: boolean;
  port: number;
}

interface ServerEvents {
  playerJoin(player: Player): void;
  playerQuit(player: Player): void;
}

const defaultOptions: ServerOptions = {
  compress: false,
  maxPlayers: 20,
  noDelay: false,
  port: 25_565,
};

export default class Server extends EventEmitter.EventEmitter {
  public players: Player[] = [];
  public options: ServerOptions;
  private readonly netServer: NetServer;

  public constructor(options?: ServerOptions) {
    super();

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.netServer = createServer({
      noDelay: this.options.noDelay,
    });
  }

  public start() {
    this.netServer.listen(this.options.port, () =>
      console.log(`Server started on port ${this.options.port}`),
    );

    this.netServer.on('connection', (socket: Socket) => {
      const player = new Player(socket);
      this.players.push(player);

      socket.on('data', (data) => {
        for (const packet of Packet.fromBuffer(data))
          decidePacket(packet, player);
      });

      socket.on('close', () => {
        this.players.splice(this.players.indexOf(player), 1);
      });
    });
  }

  public on<T extends keyof ServerEvents>(
    event: T,
    listener: ServerEvents[T],
  ): this {
    return super.on(event, listener);
  }

  public once<T extends keyof ServerEvents>(
    event: T,
    listener: ServerEvents[T],
  ): this {
    return super.once(event, listener);
  }
}
