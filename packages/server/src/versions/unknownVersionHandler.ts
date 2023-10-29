import type { RawPacket } from '@pmcs/packets';
import type { Player } from '..';
import { default as v1_8_handlePacket } from './1.8/packets/packetHandler';

export default function handleUnknownVersionPacket(packet: RawPacket, player: Player) {
  switch (player.protocolVersion) {
    case 47:
      v1_8_handlePacket(packet, player);
  }
}
