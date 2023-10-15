import type Packet from '../structures/Packet';
import type Player from '../structures/Player';
import { readString } from '../utils/encoding/string';
import { readUUID } from '../utils/encoding/uuid';

export function handleLoginStart(packet: Packet, player: Player) {
  decodeLoginStart(packet);

  player.kick('§cNot implemented.');
}

function decodeLoginStart(packet: Packet) {
  const data = packet.data;

  const name = readString(data);
  const playerUuid = readUUID(data.slice(name.bytes));

  return {
    name: name.value,
    uuid: playerUuid.value,
  };
}
