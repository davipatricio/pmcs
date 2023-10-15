import { EventEmitter } from 'node:events';
import type { Socket } from 'node:net';
import { createChatComponent } from '../utils/chatComponent';
import { writeString } from '../utils/encoding/string';
import { writeVarInt } from '../utils/encoding/varInt';
import type Server from './MCServer';
import Packet from './Packet';

export enum PlayerState {
  Handshaking,
  Status,
  Login,
  Play,
}

interface PlayerEvents {
  quit(): void;
}

export default class Player extends EventEmitter {
  /**
   * The current state of the player.
   */
  public state: PlayerState = PlayerState.Handshaking;
  /**
   * The name of the current player. Empty string if user is not logged in (state not `Play`).
   */
  public username: string = '';

  public constructor(
    public socket: Socket,
    public server: Server,
  ) {
    super();
  }

  /**
   * Sets the player's state. Should not be changed manually.
   *
   * @param state - The state to set the player to.
   */
  public setState(state: PlayerState) {
    this.state = state;
  }

  /**
   * Sets the player's username. Should not be changed manually.
   *
   * @param username - The username to set the player to.
   */
  public setUsername(username: string) {
    this.username = username;
  }

  /**
   * Sends a Packet to the player.
   *
   * @param packet - The packet to send to the player.
   */
  public sendPacket(packet: Packet) {
    this.socket.write(packet.getBuffer());
  }

  /**
   * Kicks the player from the server with the specified reason.
   *
   * @param reason - The reason the player is being kicked. e.g. `§cYou have been kicked.`
   */
  public kick(reason: string) {
    const packet = new Packet()
      .setID(writeVarInt(this.state === PlayerState.Login ? 0x00 : 0x1a))
      .setData(writeString(JSON.stringify(createChatComponent(reason))));

    this.sendPacket(packet);
    this.disconnect();
  }

  /**
   * Drops the connection with the player immediately.
   */
  public disconnect() {
    this.socket.destroy();
  }

  public on<T extends keyof PlayerEvents>(event: T, listener: PlayerEvents[T]): this {
    return super.on(event, listener);
  }

  public once<T extends keyof PlayerEvents>(event: T, listener: PlayerEvents[T]): this {
    return super.once(event, listener);
  }

  public emit<T extends keyof PlayerEvents>(event: T, ...args: Parameters<PlayerEvents[T]>): boolean {
    return super.emit(event, ...args);
  }
}
