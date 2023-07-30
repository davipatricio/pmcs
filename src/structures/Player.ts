import { Socket } from "net";
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

  disconnect() {
    this.socket.destroy();
  }
}
