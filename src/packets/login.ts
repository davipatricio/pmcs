import Packet from '../structures/Packet';
import type Player from '../structures/Player';
import { readString } from '../utils/encoding/string';
import { readUUID } from '../utils/encoding/uuid';
import { writeVarInt } from '../utils/encoding/varInt';

export function handleLoginStart(packet: Packet, player: Player) {
  decodeLoginStart(packet, player);
}

function decodeLoginStart(packet: Packet, player: Player) {
  const data = packet.data;

  const name = readString(data);
  const playerUuid = readUUID(data.slice(name.bytes));

  if (name.value.length > 16) {
    player.kick('§cYour username is too long.');
    return;
  }

  player.setUsername(name.value);
  player.setUUID(playerUuid.value);

  setCompression(player);
}

function setCompression(player: Player) {
  if (player.server.options.connection.compress) {
    const packet = new Packet().setID(writeVarInt(0x03)).setData(writeVarInt(256));
    player.socket.write(packet.getBuffer());
  }
}
