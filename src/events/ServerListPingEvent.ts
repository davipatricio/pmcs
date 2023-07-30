import Packet from '../structures/Packet';
import type Player from '../structures/Player';
import { PlayerState } from '../structures/Player';
import createChatComponent from '../utils/createChatComponent';
import { writeString } from '../utils/encoding/string';
import { writeVarInt } from '../utils/encoding/varInt';

const baseData = {
  version: {
    name: '1.8.9',
    protocol: 47,
  },
};

export default class ServerListPingEvent {
  public constructor(public player: Player) {}

  public sendResponse({
    text,
    playerCount,
    maxPlayers,
  }: Partial<{
    maxPlayers: number;
    playerCount: number;
    text: string;
  }>) {
    if (this.player.state !== PlayerState.Status) {
      throw new Error('Player is not in status state.');
    }

    const data = {
      ...baseData,
      players: {
        max: maxPlayers ?? 200,
        online: playerCount ?? this.player.server.players.length,
      },
      description: createChatComponent(
        text ?? this.player.server.options.defaultMotd,
      ),
    };

    const packet = new Packet()
      .setID(writeVarInt(0x00))
      .setData(writeString(JSON.stringify(data)));

    this.player.sendPacket(packet);
  }
}
