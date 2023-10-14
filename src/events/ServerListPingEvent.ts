import Packet from '../structures/Packet';
import type Player from '../structures/Player';
import { PlayerState } from '../structures/Player';
import createChatComponent from '../utils/createChatComponent';
import { writeString } from '../utils/encoding/string';
import { writeVarInt } from '../utils/encoding/varInt';

const baseData = {
  version: {
    name: '1.20.2',
    protocol: 764,
  },
  enforcesSecureChat: true,
  previewsChat: true,
};

interface ServerListPingData {
  maxPlayers: number;
  playersCount: number;
  text: string;
}

export default class ServerListPingEvent {
  public sentResponse = false;
  public constructor(public player: Player) {}

  public sendResponse({ text, playersCount, maxPlayers } = {} as Partial<ServerListPingData>) {
    if (this.player.state !== PlayerState.Status) {
      throw new Error('Player is not in status state.');
    }

    const data = {
      ...baseData,
      players: {
        max: maxPlayers ?? 200,
        online: playersCount ?? this.player.server.players.length,
        sample: [
          {
            name: 'whoisveric',
            id: '0402d80a-fe57-44eb-8134-8d4988b74bf5',
          },
        ],
      },
      description: createChatComponent(text ?? this.player.server.options.defaultMotd),
    };

    const packet = new Packet().setID(writeVarInt(0x00)).setData(writeString(JSON.stringify(data)));

    this.player.sendPacket(packet);
    this.sentResponse = true;
  }
}
