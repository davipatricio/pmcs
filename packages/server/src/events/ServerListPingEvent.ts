import type { ChatComponent } from '@pmcs/chat';
import { createChatComponent } from '@pmcs/chat';
import { writeString, writeVarInt } from '@pmcs/encoding';
import type { MCServer } from '../structures/MCServer';
import { Packet } from '../structures/Packet';
import type { Player } from '../structures/Player';
import { PlayerState } from '../structures/Player';
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

  public readonly server: MCServer;

  public constructor(public readonly player: Player) {
    super();

    this.server = player.server;

    this.data = {
      players: this.server.players.length,
      maxPlayers: this.server.options.server.maxPlayers,
      description: createChatComponent(this.server.options.server.defaultMotd),
      version: {
        name: this.server.options.version.name,
        protocol: this.server.options.version.protocol,
      },
    };
  }

  public setMaxPlayers(maxPlayers: number) {
    this.data.maxPlayers = maxPlayers;
    return this;
  }

  public setPlayers(players: number) {
    this.data.players = players;
    return this;
  }

  public setDescription(data: ChatComponent | string) {
    this.data.description = typeof data === 'string' ? createChatComponent(data) : data;
    return this;
  }

  public setVersionProtocol(protocol: number) {
    this.data.version.protocol = protocol;
    return this;
  }

  public setVersionName(name: string) {
    this.data.version.name = name;
    return this;
  }

  public setData(data: Partial<ServerListPingEventData>) {
    this.data = {
      ...this.data,
      ...data,
    };
    return this;
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
        max: this.data.maxPlayers ?? this.server.options.server.maxPlayers,
        online: this.data.players ?? this.server.players.length,
        sample: this.server.options.server.hideOnlinePlayers
          ? []
          : [
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
