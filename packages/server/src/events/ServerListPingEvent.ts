import type { ChatComponent } from '@pmcs/chat';
import { createChatComponent } from '@pmcs/chat';
import type { StatusResponsePacketData } from '@pmcs/packets';
import { StatusClientboundStatusResponsePacket } from '@pmcs/packets';
import type { MCServer } from '../structures/MCServer';
import type { Player } from '../structures/Player';
import { PlayerState } from '../structures/Player';

export default class ServerListPingEvent {
  public readonly data: StatusResponsePacketData;
  public readonly server: MCServer;

  public constructor(public readonly player: Player) {
    this.server = player.server;

    this.data = {
      players: {
        max: this.server.options.server.maxPlayers,
        online: this.server.players.length,
      },
      description: createChatComponent(this.server.options.server.defaultMotd),
      version: {
        name: this.server.options.version.name,
        protocol: this.server.options.version.protocol,
      },
    };
  }

  public setMaxPlayers(maxPlayers: number) {
    this.data.players.max = maxPlayers;
    return this;
  }

  public setPlayers(players: number) {
    this.data.players.online = players;
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

  public setData(data: Partial<StatusResponsePacketData>) {
    Object.assign(this.data, data);
    return this;
  }

  public sendResponse() {
    if (this.player.state !== PlayerState.Status) {
      throw new Error('Player is not in status state.');
    }

    const packet = new StatusClientboundStatusResponsePacket(this.data);
    this.player.sendPacket(packet);
  }
}
