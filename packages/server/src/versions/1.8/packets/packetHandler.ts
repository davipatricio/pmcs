import type { RawPacket } from '@pmcs/packets';
import type { UnknownPlayer } from '../../../structures/UnknownPlayer';
import { PlayerState } from '../../../structures/UnknownPlayer';
import { handleHandshake } from './handshake';
import { handleLoginAcknowledge, handleLoginStart } from './login';
import { handleLegacyPing, handlePingRequest, handleStatusRequest } from './status';

export default function handlePacket(packet: RawPacket, player: UnknownPlayer) {
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

    case PlayerState.Configuration: {
      break;
    }
  }
}

function handleHandshakingPackets(packet: RawPacket, player: UnknownPlayer) {
  switch (packet.id) {
    case 0x00:
      handleHandshake(packet, player);
      break;
    case 0xfe:
      handleLegacyPing(packet, player);
      break;
    case 0x7a:
      console.log('TODO: Handle legacy status request');
      break;
  }
}

function handleStatusPackets(packet: RawPacket, player: UnknownPlayer) {
  switch (packet.id) {
    case 0x00:
      handleStatusRequest(packet, player);
      break;
    case 0x01:
      handlePingRequest(packet, player);
      break;
  }
}

function handleLoginPackets(packet: RawPacket, player: UnknownPlayer) {
  switch (packet.id) {
    case 0x00:
      handleLoginStart(packet, player);
      break;
    case 0x03:
      handleLoginAcknowledge(packet, player);
      break;
  }
}
