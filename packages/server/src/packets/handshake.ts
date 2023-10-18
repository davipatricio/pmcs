import { HandshakingServerboundHandshakePacket } from '@pmcs/packets';
import type { Packet } from '../structures/Packet';
import type { Player } from '../structures/Player';

export function handleHandshake(packet: Packet, player: Player) {
  const handshakeData = new HandshakingServerboundHandshakePacket(packet.data);
  player.setState(handshakeData.nextState);
}
