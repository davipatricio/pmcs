import { getVersionData, ProtocolVersions, type RawPacket } from '@pmcs/packets';
import type { Player } from '../structures/Player';

export function handleHandshake(packet: RawPacket, player: Player) {
  const packets = getVersionData('1.20.2');
  const handshakeData = new packets.HandshakingServerboundHandshakePacket(packet.data);

  player
    .setState(handshakeData.nextState)
    .setVersion(ProtocolVersions[handshakeData.protocolVersion])
    .setProtocolVersion(handshakeData.protocolVersion);
}
