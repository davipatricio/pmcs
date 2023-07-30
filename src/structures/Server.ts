import { EventEmitter } from 'node:events';
import { createServer } from 'node:net';
import type { Socket, Server as NetServer } from 'node:net';
import type ServerListPingEvent from '../events/ServerListPingEvent';
import decidePacket from '../packets/decider';
import Packet from './Packet';
import Player, { PlayerState } from './Player';

interface ServerEvents {
  playerJoin(player: Player): void;
  playerQuit(player: Player): void;
  serverListPing(event: ServerListPingEvent): void;
}

interface ServerOptions {
  /**
   * Whether to enable compression. Defaults to `false`.
   */
  compress: boolean;
  /**
   * The default MOTD to send to clients. Can be changed at runtime. Defaults to `A Minecraft Server`.
   */
  defaultMotd: string;
  /**
   * The maximum amount of players that can be connected to the server at the same time. Can be changed at runtime. Defaults to `20`.
   */
  maxPlayers: number;
  /**
   * Whether to disable the Nagle algorithm. Defaults to `false`.
   */
  noDelay: boolean;
  /**
   * The port to listen on. Defaults to `25565`.
   */
  port: number;
}

const defaultOptions: ServerOptions = {
  compress: false,
  maxPlayers: 20,
  noDelay: false,
  port: 25_565,
  defaultMotd: 'A Minecraft Server',
};

export default class Server extends EventEmitter {
  private allPlayers: Player[] = [];
  public options: ServerOptions;
  private readonly netServer: NetServer;

  public constructor(options?: Partial<ServerOptions>) {
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
    this.netServer.listen(this.options.port, () => console.log(`Server started on port ${this.options.port}`));

    this.netServer.on('connection', (socket: Socket) => {
      const player = new Player(socket, this);
      this.allPlayers.push(player);

      socket.on('data', (data) => {
        for (const packet of Packet.fromBuffer(data)) decidePacket(packet, player);
      });

      socket.on('close', () => {
        this.allPlayers.splice(this.allPlayers.indexOf(player), 1);
      });
    });
  }

  public get players() {
    return this.allPlayers.filter((player) => player.state === PlayerState.Play);
  }

  public on<T extends keyof ServerEvents>(event: T, listener: ServerEvents[T]): this {
    return super.on(event, listener);
  }

  public once<T extends keyof ServerEvents>(event: T, listener: ServerEvents[T]): this {
    return super.once(event, listener);
  }

  public emit<T extends keyof ServerEvents>(event: T, ...args: Parameters<ServerEvents[T]>): boolean {
    return super.emit(event, ...args);
  }
}
