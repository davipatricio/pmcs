import Packet from "../structures/Packet";
import Player from "../structures/Player";
import { DATA_LENGTH } from "../utils/constants/dataLength";
import { readBoolean } from "../utils/encoding/boolean";
import { readString, writeString } from "../utils/encoding/string";
import { writeVarInt } from "../utils/encoding/varInt";

export function handleLoginStart(packet: Packet, player: Player) {
  console.log('login')
  const data = decodeLoginStart(packet);
  console.log(data);
  player.name = data.name;
}

function decodeLoginStart(packet: Packet) {
  let data = packet.data;

  const name = readString(data);

  const playerHasUUID = readBoolean(data.slice(name.bytes));

  let uuid: string | undefined;

  if (playerHasUUID.value) {
    uuid = readString(data.slice(name.bytes + DATA_LENGTH.boolean)).value;
  }

  const parsedPacket = {
    name: name.value,
    playerHasUUID: playerHasUUID.value,
    uuid
  };

  return parsedPacket;
}
