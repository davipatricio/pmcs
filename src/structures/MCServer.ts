import { EventEmitter } from 'node:events';
import type { Server as NetServer, Socket } from 'node:net';
import { createServer } from 'node:net';
import type ServerListPingEvent from '../events/ServerListPingEvent';
import decidePacket from '../packets/decider';
import Packet from './Packet';
import Player, { PlayerState } from './Player';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

interface MCServerEvents {
  playerJoin(player: Player): void;
  playerQuit(player: Player): void;
  serverListPing(event: ServerListPingEvent): void;
}

interface MCServerOptions {
  /**
   * Options related to incoming connections.
   */
  connection: {
    /**
     * Whether to enable compression. Defaults to `false`.
     */
    compress: boolean;
    /**
     * Whether to disable the Nagle algorithm. Defaults to `false`.
     */
    noDelay: boolean;
  };
  /**
   * Options related to the server.
   */
  server: {
    /**
     * The default MOTD to send to clients. Can be changed at runtime. Defaults to `A Minecraft Server`.
     */
    defaultMotd: string;
    /**
     * Whether to force the gamemode on players when they join. Defaults to `false`.
     */
    forceGamemode: boolean;
    /**
     * The gamemode to set players to when they join. Defaults to `survival`.
     */
    gamemode: 'adventure' | 'creative' | 'spectator' | 'survival';
    /**
     * Whether to hide the sample of online players in the server list. Defaults to `false`.
     */
    hideOnlinePlayers: boolean;
    /**
     * The maximum amount of players that can be connected to the server at the same time. Can be changed at runtime. Defaults to `20`.
     */
    maxPlayers: number;
    /**
     * The port to listen on. Defaults to `25565`.
     */
    port: number;
  };
  /**
   * Information about the Minecraft version the server is running. Defaults to `1.20.2`.
   */
  version: {
    /**
     * The name of the Minecraft version or server software. Defaults to `1.20.2`.
     */
    name: string;
    /**
     * The protocol version of the Minecraft version or server software. Defaults to `764`.
     */
    protocol: number;
  };
}

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
  public options: MCServerOptions;
  private readonly netServer: NetServer;

  public constructor(options?: RecursivePartial<MCServerOptions>) {
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
