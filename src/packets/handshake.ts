import Packet from "../structures/Packet";
import Player from "../structures/Player";
import { readShort } from "../utils/encoding/short";
import { readString } from "../utils/encoding/string";
import { readVarInt } from "../utils/encoding/varInt";

export function handleHandshake(packet: Packet, player: Player) {
  const handshakeData = decodeHandshake(packet);
  player.setState(handshakeData.nextState);
}

function decodeHandshake(packet: Packet) {
  let data = packet.data;

  const protocolVersion = readVarInt(data);

  const serverAddress = readString(data.slice(protocolVersion.bytes));
  const serverPort = readShort(
    data.slice(protocolVersion.bytes + serverAddress.bytes)
  );
  const nextState = readVarInt(
    data.slice(protocolVersion.bytes + serverAddress.bytes + serverPort.bytes)
  );

  const parsedPacket = {
    protocolVersion: protocolVersion.value,
    serverAddress: serverAddress.value,
    serverPort: serverPort.value,
    nextState: nextState.value
  };

  return parsedPacket;
}
