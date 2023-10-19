import type { RawPacket } from '@pmcs/packets';
import { HandshakingServerboundHandshakePacket } from '@pmcs/packets';
import type { Player } from '../structures/Player';

export function handleHandshake(packet: RawPacket, player: Player) {
  const handshakeData = new HandshakingServerboundHandshakePacket(packet.data);
  player.setState(handshakeData.nextState);
}
