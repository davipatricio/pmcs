import { Socket } from "net";
import createChatComponent from "../utils/createChatComponent";
import { writeString } from "../utils/encoding/string";
import { writeVarInt } from "../utils/encoding/varInt";
import Packet from "./Packet";

export enum PlayerState {
  Handshaking,
  Status,
  Login,
  Play
}

export default class Player {
  state: PlayerState = PlayerState.Handshaking;
  constructor(public socket: Socket, public name: string | null = null) {}

  setState(state: PlayerState) {
    this.state = state;
  }

  sendPacket(packet: Packet) {
    this.socket.write(packet.getBuffer());
  }

  kick(reason: string) {
    const packet = new Packet()
      .setID(writeVarInt(this.state === PlayerState.Login ? 0x00 : 0x1a))
      .setData(writeString(JSON.stringify(createChatComponent(reason))));

    this.sendPacket(packet);
  }

  disconnect() {
    this.socket.destroy();
  }
}
