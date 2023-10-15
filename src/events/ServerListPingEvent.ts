import type MCServer from '../structures/MCServer';
import Packet from '../structures/Packet';
import type Player from '../structures/Player';
import { PlayerState } from '../structures/Player';
import type { ChatComponent } from '../utils/chatComponent';
import { createChatComponent } from '../utils/chatComponent';
import { writeString } from '../utils/encoding/string';
import { writeVarInt } from '../utils/encoding/varInt';
import BaseEvent from './BaseEvent';

interface ServerListPingEventData {
  description: ChatComponent;
  maxPlayers: number;
  players: number;
  version: {
    name: string;
    protocol: number;
  };
}

export default class ServerListPingEvent extends BaseEvent {
  public data: ServerListPingEventData;

  public server: MCServer;

  public constructor(public player: Player) {
    super(player);

    this.server = player.server;

    this.data = {
      players: this.server.players.length,
      maxPlayers: this.player.server.options.maxPlayers,
      description: createChatComponent(this.server.options.defaultMotd),
      version: {
        name: this.server.options.version.name,
        protocol: this.server.options.version.protocol,
      },
    };
  }

  public setMaxPlayers(maxPlayers: number) {
    this.data.maxPlayers = maxPlayers;
  }

  public setPlayers(players: number) {
    this.data.players = players;
  }

  public setDescription(data: ChatComponent | string) {
    this.data.description = typeof data === 'string' ? createChatComponent(data) : data;
  }

  public setVersionProtocol(protocol: number) {
    this.data.version.protocol = protocol;
  }

  public setVersionName(name: string) {
    this.data.version.name = name;
  }

  public setData(data: Partial<ServerListPingEventData>) {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  public sendResponse() {
    if (this.player.state !== PlayerState.Status) {
      throw new Error('Player is not in status state.');
    }

    const data = {
      version: {
        name: this.data.version.name,
        protocol: this.data.version.protocol,
      },
      enforcesSecureChat: true,
      previewsChat: true,
      players: {
        max: this.data.maxPlayers ?? this.server.options.maxPlayers,
        online: this.data.players ?? this.server.players.length,
        sample: [
          {
            name: 'whoisveric',
            id: '0402d80a-fe57-44eb-8134-8d4988b74bf5',
          },
        ],
      },
      description: this.data.description,
    };

    const packet = new Packet().setID(writeVarInt(0x00)).setData(writeString(JSON.stringify(data)));

    this.player.sendPacket(packet);
  }
}
