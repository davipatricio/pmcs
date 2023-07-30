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

  /**
   * Sets the player's state. Should not be changed manually.
   * @param state The state to set the player to.
   */
  setState(state: PlayerState) {
    this.state = state;
  }

  /**
   * Sends a Packet to the player.
   * @param packet The packet to send to the player.
   */
  sendPacket(packet: Packet) {
    this.socket.write(packet.getBuffer());
  }

  /**
   * Kicks the player from the server with the specified reason.
   * @param reason The reason the player is being kicked. e.g. `§cYou have been kicked.`
   */
  kick(reason: string) {
    const packet = new Packet()
      .setID(writeVarInt(this.state === PlayerState.Login ? 0x00 : 0x1a))
      .setData(writeString(JSON.stringify(createChatComponent(reason))));

    this.sendPacket(packet);
    this.disconnect();
  }

  /**
   * Drops the connection with the player immediately.
   */
  disconnect() {
    this.socket.destroy();
  }
}
