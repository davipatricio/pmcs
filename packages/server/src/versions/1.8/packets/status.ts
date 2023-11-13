import type { RawPacket } from '@pmcs/packets';
import { StatusClientboundStatusResponsePacket } from '@pmcs/packets/1.8';
import ServerListPingEvent from '@/events/ServerListPingEvent';
import type { UnknownPlayer } from '@/structures';
import callEvents from '@/utils/callEvents';

export function handleStatusRequest(_packet: RawPacket, player: UnknownPlayer) {
  const event = new ServerListPingEvent(player);

  callEvents(player.server, 'serverListPing', event);
  player.sendPacket(new StatusClientboundStatusResponsePacket(event.data));
}

export function handlePingRequest(packet: RawPacket, player: UnknownPlayer) {
  sendPingResponse(packet, player);
}

export function handleLegacyPing(packet: RawPacket, player: UnknownPlayer) {
  sendLegacyPingResponse(packet, player);
}

function sendLegacyPingResponse(_packet: RawPacket, _player: UnknownPlayer) {
  throw new Error('Not implemented');
}

function sendPingResponse(packet: RawPacket, player: UnknownPlayer) {
  player.sendPacket(packet);
  player.disconnect();
}
