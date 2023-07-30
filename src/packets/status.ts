import Packet from "../structures/Packet";
import Player from "../structures/Player";
import { writeString } from "../utils/encoding/string";
import { writeVarInt } from "../utils/encoding/varInt";

export function handleStatusRequest(_packet: Packet, player: Player) {
  sendStatusResponse(player);
}

export function handlePingRequest(packet: Packet, player: Player) {
  sendPingResponse(packet, player);
}

export function handleLegacyPing(packet: Packet, player: Player) {
  sendLegacyPingResponse(packet, player);
  console.log("Sending legacy ping response");
}

function sendLegacyPingResponse(packet: Packet, player: Player) {
  
}


function sendStatusResponse(player: Player) {
  const data = {
    version: {
      name: "1.8.9",
      protocol: 47
    },
    players: {
      max: 1,
      online: 0
    },
    description: {
      text: '12345678901',
      bold: 'true'
    }
  };

  const packet = new Packet();

  packet.setID(writeVarInt(0));
  packet.setData(writeString(JSON.stringify(data)));

  player.sendPacket(packet);
}

function sendPingResponse(packet: Packet, player: Player) {
  player.sendPacket(packet);
  player.disconnect();
}
