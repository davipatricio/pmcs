import { readString, readUUID } from '@pmcs/encoding';
import type { RawPacket } from '@pmcs/packets';
import { LoginClientboundLoginSuccessPacket, LoginClientboundSetCompressionPacket } from '@pmcs/packets';
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

  player.setUsername(name.value).setUUID(playerUuid.value);

  // if a player is already connected with the same name, kick the old player
  const playerWithSameName = player.server.players.find((oldPlayer) => oldPlayer.username === player.username);
  playerWithSameName?.kick('§cYou logged in from another location.');

  enableCompression(player);
  sendLoginSuccessPacket(player);

  player.setState(PlayerState.Play);

  sendLoginPlayPacket(player);

  // const setHeldItemPacket = new PlayClientboundSetHeldItemPacket({ slot: 0 });
  // player.sendPacket(setHeldItemPacket);
}

function sendLoginSuccessPacket(player: Player) {
  const loginSuccess = new LoginClientboundLoginSuccessPacket({
    username: player.username,
    uuid: player.uuid,
    properties: [],
  });
  player.sendPacket(loginSuccess);
}

function sendLoginPlayPacket(_player: Player) {
  /* const loginPlayPacket = new RawPacket().setID(writeVarInt(0x29)).setData([
  // entity id
  ...writeInt(1),
  // is hardcore
  ...writeBoolean(false),
  // dimension count
  ...writeVarInt(3),
  // dimension
  ...writeString('minecraft:overworld'),
  ...writeString('minecraft:the_nether'),
  ...writeString('minecraft:the_end'),
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
]);*/
  // player.sendPacket(loginPlayPacket);
}

function enableCompression(player: Player) {
  if (player.server.options.connection.compress) {
    const compressionPacket = new LoginClientboundSetCompressionPacket({ threshold: 256 });
    player.sendPacket(compressionPacket);
  }
}
