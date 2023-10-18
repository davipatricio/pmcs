import {
  readString,
  readUUID,
  writeBoolean,
  writeByte,
  writeInt,
  writeLong,
  writeString,
  writeUnsignedByte,
  writeUUID,
  writeVarInt,
} from '@pmcs/encoding';
import { RawPacket } from '@pmcs/packets';
import type { Player } from '../structures/Player';
import { PlayerState } from '../structures/Player';

export function handleLoginStart(packet: RawPacket, player: Player) {
  decodeLoginStart(packet, player);
}

export function handleLoginAcknowledge(_packet: RawPacket, player: Player) {
  player.setState(PlayerState.Configuration);
}

function decodeLoginStart(packet: RawPacket, player: Player) {
  const data = packet.data;

  const name = readString(data);
  const playerUuid = readUUID(data.slice(name.bytes));

  if (name.value.length > 16) {
    player.kick('§cYour username is too long.');
    return;
  }

  player.setUsername(name.value);
  player.setUUID(playerUuid.value);

  // if a player is already connected with the same name, kick the old player
  const playerWithSameName = player.server.players.find((oldPlayer) => oldPlayer.username === player.username);
  playerWithSameName?.kick('§cYou logged in from another location.');

  setCompression(player);

  // login success test
  const packet2 = new RawPacket()
    .setID(writeVarInt(0x02))
    .setData([...writeUUID(player.uuid), ...writeString(player.username), ...writeVarInt(0)]);

  player.sendPacket(packet2);

  // set player state to play
  const loginPlayPacket = new RawPacket().setID(writeVarInt(0x29)).setData([
    // entity id
    ...writeInt(1),
    // is hardcore
    ...writeBoolean(false),
    // dimension count
    ...writeVarInt(1),
    // dimension
    ...writeString('minecraft:overworld'),
    // max players
    ...writeVarInt(100),
    // view distance
    ...writeVarInt(10),
    // simulation distance
    ...writeVarInt(10),
    // reduced debug info
    ...writeBoolean(false),
    // enable respawn screen
    ...writeBoolean(true),
    // limited crafting
    ...writeBoolean(false),
    //  dimension type
    ...writeString('minecraft:overworld'),
    // world name
    ...writeString('minecraft:overworld'),
    // hashed seed (random 8 bytes)
    ...writeLong(BigInt(123)),
    // gmamemode
    ...writeUnsignedByte(0),
    // previous gamemode
    ...writeByte(0),
    // is debug
    ...writeBoolean(false),
    // is flat
    ...writeBoolean(false),
    // has death location
    ...writeBoolean(false),
    // portal cooldown
    ...writeVarInt(0),
  ]);

  player.sendPacket(loginPlayPacket);

  // SET HELD ITEM
  player.sendPacket(new RawPacket().setID(writeVarInt(0x2b)).setData([...writeVarInt(1)]));
}

function setCompression(player: Player) {
  if (player.server.options.connection.compress) {
    const packet = new RawPacket().setID(writeVarInt(0x03)).setData(writeVarInt(256));
    player.sendPacket(packet);
  }
}
