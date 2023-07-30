import Packet from "../structures/Packet";
import Player from "../structures/Player";
import { readBoolean } from "../utils/encoding/boolean";
import { readString } from "../utils/encoding/string";

export function handleLoginStart(packet: Packet, _player: Player) {
  decodeLoginStart(packet);
}

function decodeLoginStart(packet: Packet) {
  let data = packet.data;

  const name = readString(data);

  const playerHasUUID = readBoolean(data.slice(name.bytes));

  let uuid: string | undefined;

  if (playerHasUUID.value) {
    uuid = readString(data.slice(name.bytes + playerHasUUID.bytes)).value;
  }

  const parsedPacket = {
    name: name.value,
    playerHasUUID: playerHasUUID.value,
    uuid
  };

  return parsedPacket;
}
