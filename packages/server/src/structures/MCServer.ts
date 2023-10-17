import { EventEmitter } from 'node:events';
import type { Server as NetServer, Socket } from 'node:net';
import { createServer } from 'node:net';
import pino from 'pino';
import { PluginManager } from '../managers/PluginManager';
import decidePacket from '../packets/decider';
import type { MCServerEvents } from '../types/MCServerEvents';
import type { MCPartialServerOptions, MCServerOptions } from '../types/MCServerOptions';
import { Packet } from './Packet';
import { Player, PlayerState } from './Player';

const defaultOptions: MCServerOptions = {
  connection: {
    compress: false,
    noDelay: false,
  },
  enableLogger: true,
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

export class MCServer extends EventEmitter {
  private allPlayers: Player[] = [];
  private netServer: NetServer;

  public logger?: pino.Logger;
  public options: MCServerOptions;
  public pluginManager: PluginManager;

  public constructor(options?: MCPartialServerOptions) {
    super();

    this.options = {
      connection: {
        ...defaultOptions.connection,
        ...options?.connection,
      },
      enableLogger: options?.enableLogger ?? defaultOptions.enableLogger,
      server: {
        ...defaultOptions.server,
        ...options?.server,
      },
      version: {
        ...defaultOptions.version,
        ...options?.version,
      },
    };

    this.setup();

    this.logger?.info('Server initialized.');
  }

  public listen(port = this.options.server.port) {
    this.netServer.listen(port, () => {
      this.logger?.info(`Server listening on port ${port}.`);
    });

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

  protected setup() {
    this.netServer = createServer({
      noDelay: this.options.connection.noDelay,
    });

    this.pluginManager = new PluginManager(this);

    if (this.options.enableLogger) {
      this.logger = pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      });
    }
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
