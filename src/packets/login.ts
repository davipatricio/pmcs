import type Packet from '../structures/Packet';
import type Player from '../structures/Player';
import { readBoolean } from '../utils/encoding/boolean';
import { readString } from '../utils/encoding/string';

export function handleLoginStart(packet: Packet, _player: Player) {
  decodeLoginStart(packet);
}

function decodeLoginStart(packet: Packet) {
  const data = packet.data;

  const name = readString(data);

  const playerHasUUID = readBoolean(data.slice(name.bytes));

  let uuid: string | undefined;

  if (playerHasUUID.value) {
    uuid = readString(data.slice(name.bytes + playerHasUUID.bytes)).value;
  }

  return {
    name: name.value,
    playerHasUUID: playerHasUUID.value,
    uuid,
  };
}
