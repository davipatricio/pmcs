import type { RawPacket } from '@pmcs/packets';
import { StatusClientboundStatusResponsePacket } from '@pmcs/packets/1.8';
import ServerListPingEvent from '@/events/ServerListPingEvent';
import type { Player } from '@/structures/Player';
import callEvents from '@/utils/callEvents';

export function handleStatusRequest(_packet: RawPacket, player: Player) {
  const event = new ServerListPingEvent(player);

  callEvents(player.server, 'serverListPing', event);
  player.sendPacket(new StatusClientboundStatusResponsePacket(event.data));
}

export function handlePingRequest(packet: RawPacket, player: Player) {
  sendPingResponse(packet, player);
}

export function handleLegacyPing(packet: RawPacket, player: Player) {
  sendLegacyPingResponse(packet, player);
}

function sendLegacyPingResponse(_packet: RawPacket, _player: Player) {
  throw new Error('Not implemented');
}

function sendPingResponse(packet: RawPacket, player: Player) {
  player.sendPacket(packet);
  player.disconnect();
}
