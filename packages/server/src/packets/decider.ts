import type { Packet } from '../structures/Packet';
import type { Player } from '../structures/Player';
import { PlayerState } from '../structures/Player';
import { handleHandshake } from './handshake';
import { handleLoginAcknowledge, handleLoginStart } from './login';
import { handleLegacyPing, handlePingRequest, handleStatusRequest } from './status';

const numberToHex = (number: number) => `0x${number.toString(16)}`;

export default function decidePacket(packet: Packet, player: Player) {
  console.log(
    `[RECEIVE] State: ${PlayerState[player.state]} | Packet ${numberToHex(packet.id)} with ${
      packet.length
    } bytes of data.`,
  );

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

function handleHandshakingPackets(packet: Packet, player: Player) {
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
    case 0x03:
      handleLoginAcknowledge(packet, player);
      break;
  }
}
