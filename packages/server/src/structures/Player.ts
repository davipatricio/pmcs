import type { Socket } from 'node:net';
import { createChatComponent } from '@pmcs/chat';
import { writeString, writeVarInt } from '@pmcs/encoding';
import { RawPacket } from '@pmcs/packets';
import PlayerQuitEvent from '../events/PlayerQuitEvent';
import callEvents from '../utils/callEvents';
import type { MCServer } from './MCServer';

export enum PlayerState {
  Handshaking,
  Status,
  Login,
  Play,
  Configuration,
}

export class Player {
  /**
   * The current state of the player.
   */
  public state: PlayerState = PlayerState.Handshaking;
  /**
   * The name of the current player. Empty string if user is not logged in (state not `Play`).
   */
  public username: string = '';
  /**
   * The UUID of the current player. Empty string if user is not logged in (state not `Play`).
   */
  public uuid: string = '';

  /**
   * @internal
   */
  public _forcedDisconnect: boolean = false;

  public constructor(
    private readonly socket: Socket,
    public readonly server: MCServer,
  ) {}

  /**
   * Sets the player's state. Should not be changed manually.
   *
   * @param state - The state to set the player to.
   */
  public setState(state: PlayerState) {
    this.state = state;
    return this;
  }

  /**
   * Sets the player's username. Should not be changed manually.
   *
   * @param username - The username to set the player to.
   */
  public setUsername(username: string) {
    this.username = username;
    return this;
  }

  /**
   * Sets the player's UUID. Should not be changed manually.
   */
  public setUUID(uuid: string) {
    this.uuid = uuid;
    return this;
  }

  /**
   * Sends a Packet to the player.
   *
   * @param packet - The packet to send to the player.
   */
  public sendPacket(packet: RawPacket) {
    if (this.socket.closed) return;
    this.socket.write(packet.getBuffer());
  }

  /**
   * Kicks the player from the server with the specified reason.
   *
   * @param reason - The reason the player is being kicked. e.g. `§cYou have been kicked.`
   */
  public kick(reason: string) {
    this._forcedDisconnect = true;

    const reasonComponent = writeString(JSON.stringify(createChatComponent(reason)));

    const packet = new RawPacket()
      .setID(writeVarInt(this.state === PlayerState.Login ? 0x00 : 0x1a))
      .setData(reasonComponent);

    this.sendPacket(packet);
    this.disconnect();

    const quitEvent = new PlayerQuitEvent(this, { wasKicked: true, reason });
    callEvents(this.server, 'playerQuit', quitEvent);
  }

  /**
   * Drops the connection with the player immediately.
   */
  public disconnect() {
    if (this.socket.closed) return;
    this.socket.destroy();
  }
}
