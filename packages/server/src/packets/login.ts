import type { RawPacket } from '@pmcs/packets';
import { getVersionData } from '@pmcs/packets';
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
  const mcData = getVersionData('1.8');

  const { username } = new mcData.LoginServerboundLoginStartPacket(data);

  if (username.length > 16) {
    player.kick('§cYour username is too long.');
    return;
  }

  player.setUsername(username);

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
  const mcData = getVersionData('1.8');

  const loginSuccess = new mcData.LoginClientboundLoginSuccessPacket({
    username: player.username,
    uuid: player.uuid,
    properties: [],
  });

  player.sendPacket(loginSuccess);
}

function sendLoginPlayPacket(player: Player) {
  const mcData = getVersionData('1.8');

  const joinGame = new mcData.PlayClientboundJoinGamePacket({
    entityId: 10,
    gamemode: 0,
    dimension: 0,
    difficulty: 0,
    maxPlayers: 100,
    levelType: 'default',
    reducedDebugInfo: false,
  });

  player.sendPacket(joinGame);
}

function enableCompression(player: Player) {
  const mcData = getVersionData('1.8');

  if (player.server.options.connection.compress) {
    const compressionPacket = new mcData.LoginClientboundSetCompressionPacket({ threshold: 256 });
    player.sendPacket(compressionPacket);
  }
}
