import { ProtocolVersions, type RawPacket } from '@pmcs/packets';
import { HandshakingServerboundHandshakePacket } from '@pmcs/packets/1.8';
import type { UnknownPlayer } from '@/structures';
import createPlayer from '@/versions/createPlayer';

export function handleHandshake(packet: RawPacket, player: UnknownPlayer) {
  const handshakeData = new HandshakingServerboundHandshakePacket(packet.data);

  player
    .setState(handshakeData.nextState)
    .setVersion(ProtocolVersions[handshakeData.protocolVersion])
    .setProtocolVersion(handshakeData.protocolVersion);

  player.server._allPlayers.set(
    player.uuid,
    createPlayer(player.protocolVersion, { socket: player.socket, server: player.server }),
  );
}
