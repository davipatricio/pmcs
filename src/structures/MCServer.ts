import { EventEmitter } from 'node:events';
import type { Server as NetServer, Socket } from 'node:net';
import { createServer } from 'node:net';
import { PluginManager } from '../managers/PluginManager';
import decidePacket from '../packets/decider';
import type { MCServerEvents } from '../types/MCServerEvents';
import type { MCPartialServerOptions, MCServerOptions } from '../types/MCServerOptions';
import Packet from './Packet';
import Player, { PlayerState } from './Player';

const defaultOptions: MCServerOptions = {
  connection: {
    compress: false,
    noDelay: false,
  },
  server: {
    port: 25_565,
    maxPlayers: 20,
    defaultMotd: 'A Minecraft Server',
    gamemode: 'survival',
    forceGamemode: false,
    hideOnlinePlayers: false,
  },
  version: {
    name: '1.20.2',
    protocol: 764,
  },
};

export default class MCServer extends EventEmitter {
  private allPlayers: Player[] = [];
  private readonly netServer: NetServer;

  public options: MCServerOptions;

  public pluginManager: PluginManager;

  public constructor(options?: MCPartialServerOptions) {
    super();

    this.options = {
      connection: {
        ...defaultOptions.connection,
        ...options?.connection,
      },
      server: {
        ...defaultOptions.server,
        ...options?.server,
      },
      version: {
        ...defaultOptions.version,
        ...options?.version,
      },
    };

    this.netServer = createServer({
      noDelay: this.options.connection.noDelay,
    });

    this.pluginManager = new PluginManager(this);
  }

  public listen(port = this.options.server.port) {
    this.netServer.listen(port, () => console.log(`Server started on port ${port}`));

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

  public on<T extends keyof MCServerEvents>(event: T, listener: MCServerEvents[T]): this {
    return super.on(event, listener);
  }

  public once<T extends keyof MCServerEvents>(event: T, listener: MCServerEvents[T]): this {
    return super.once(event, listener);
  }

  public emit<T extends keyof MCServerEvents>(event: T, ...args: Parameters<MCServerEvents[T]>): boolean {
    return super.emit(event, ...args);
  }
}
