import ServerListPingEvent from '../events/ServerListPingEvent';
import type { Packet } from '../structures/Packet';
import type { Player } from '../structures/Player';
import callEvents from '../utils/callEvents';

export function handleStatusRequest(_packet: Packet, player: Player) {
  const event = new ServerListPingEvent(player);

  callEvents(player.server, 'serverListPing', event);
  event.sendResponse();
}

export function handlePingRequest(packet: Packet, player: Player) {
  sendPingResponse(packet, player);
}

export function handleLegacyPing(packet: Packet, player: Player) {
  sendLegacyPingResponse(packet, player);
}

function sendLegacyPingResponse(_packet: Packet, _player: Player) {
  throw new Error('Not implemented');
}

function sendPingResponse(packet: Packet, player: Player) {
  player.sendPacket(packet);
  player.disconnect();
}
