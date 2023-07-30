import type Packet from '../structures/Packet';
import type Player from '../structures/Player';
import { PlayerState } from '../structures/Player';
import { handleHandshake } from './handshake';
import { handleLoginStart } from './login';
import { handleLegacyPing, handlePingRequest, handleStatusRequest } from './status';

export default function decidePacket(packet: Packet, player: Player) {
  console.log(`State: ${player.state} | Received packet ${packet.id} with ${packet.length} bytes of data.`);

  switch (player.state) {
    case PlayerState.Handshaking: {
      handleHandshakingPackets(packet, player);
      break;
    }

    case PlayerState.Status: {
      handleStatusPackets(packet, player);
      break;
    }

    case PlayerState.Login: {
      handleLoginPackets(packet, player);
      break;
    }

    case PlayerState.Play: {
      break;
    }
  }
}

function handleHandshakingPackets(packet: Packet, player: Player) {
  switch (packet.id) {
    case 0x00:
      handleHandshake(packet, player);
      break;
    case 0xfe:
      handleLegacyPing(packet, player);
      break;
  }
}

function handleStatusPackets(packet: Packet, player: Player) {
  switch (packet.id) {
    case 0x00:
      handleStatusRequest(packet, player);
      break;
    case 0x01:
      handlePingRequest(packet, player);
      break;
  }
}

function handleLoginPackets(packet: Packet, player: Player) {
  switch (packet.id) {
    case 0x00:
      handleLoginStart(packet, player);
      break;
  }
}
