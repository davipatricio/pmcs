import { EventEmitter } from 'node:events';
import type { Server as NetServer, Socket } from 'node:net';
import { createServer } from 'node:net';
import { ProtocolVersions, RawPacket } from '@pmcs/packets';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';
import type { MCServerEvents } from '../types/MCServerEvents';
import { Player } from './Player';
import { PlayerState, UnknownPlayer } from '.';
import PlayerQuitEvent from '@/events/PlayerQuitEvent';
import { PluginManager } from '@/managers/PluginManager';
import type { MCPartialServerOptions, MCServerOptions } from '@/types/MCServerOptions';
import callEvents from '@/utils/callEvents';
import handleUnknownVersionPacket from '@/versions/unknownVersionHandler';

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
  private netServer: NetServer;

  /**
   * All players that have a connection to the server, regardless of state.
   * Mapped by player UUID's.
   * If a player is not logged in, their UUID will be `unknown-<random uuid>`.
   */
  public readonly _allPlayers = new Map<string, Player | UnknownPlayer>();
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
      const unknownPlayerUUID = `unknown-${uuidv4()}`;
      const player = new UnknownPlayer(socket, this).setUUID(unknownPlayerUUID);

      this.players.set(player.uuid, player);

      socket.on('data', (data) => {
        for (const packet of RawPacket.fromBuffer(data)) handleUnknownVersionPacket(packet, player);
      });

      socket.on('end', () => {
        this.players.delete(player.uuid);

        if (!player._forcedDisconnect && player instanceof Player) {
          callEvents(this, 'playerQuit', new PlayerQuitEvent(player));
        }
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

    if (!ProtocolVersions[this.options.version.protocol]) {
      throw new Error(`Unsupported Minecraft version: ${this.options.version.protocol}`);
    }
  }

  /**
   * The players currently connected to the server.
   */
  public get players() {
    return new Map([...this._allPlayers].filter(([, player]) => player.state === PlayerState.Play));
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
