import type { RawPacket } from '@pmcs/packets';
import {
  LoginClientboundLoginSuccessPacket,
  LoginClientboundSetCompressionPacket,
  LoginServerboundLoginStartPacket,
  PlayClientboundJoinGamePacket,
} from '@pmcs/packets/1.8';
import type { Player } from '@/structures/Player';
import { PlayerState } from '@/structures/Player';

export function handleLoginStart(packet: RawPacket, player: Player) {
  decodeLoginStart(packet, player);
}

export function handleLoginAcknowledge(_packet: RawPacket, player: Player) {
  player.setState(PlayerState.Configuration);
}

function decodeLoginStart(packet: RawPacket, player: Player) {
  const data = packet.data;

  const { username } = new LoginServerboundLoginStartPacket(data);

  if (username.length > 16) {
    player.kick('§cYour username is too long.');
    return;
  }

  player.setUsername(username);

  // if a player is already connected with the same name, kick the old player
  for (const [_uuid, otherPlayer] of player.server.players) {
    if (otherPlayer.username === username && otherPlayer !== player) {
      otherPlayer.kick('Logged in from another location');
    }
  }

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

function sendLoginPlayPacket(player: Player) {
  const joinGame = new PlayClientboundJoinGamePacket({
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
  if (player.server.options.connection.compress) {
    const compressionPacket = new LoginClientboundSetCompressionPacket({ threshold: 256 });
    player.sendPacket(compressionPacket);
  }
}
