import type { Socket } from 'node:net';
import type { RawPacket } from '@pmcs/packets';
import type { MCServer } from './MCServer';

export enum PlayerState {
  Handshaking = 0,
  Status = 1,
  Login = 2,
  Play = 3,
  Configuration = 4
}

export class UnknownPlayer {
  /**
   * The current state of the player.
   */
  public state: PlayerState = PlayerState.Handshaking;

  /**
   * @internal
   */
  public _forcedDisconnect = false;

  /**
   * The name of the current player. Empty string if user is not logged in (state not `Play`).
   */
  public username = '';

  /**
   * The UUID of the current player. Empty string if user is not logged in (state not `Play`).
   */
  public uuid = '';

  /**
   * The version of the client the player is using.
   */
  public readonly version: `${string}.${string}` = '1.20.2';

  /**
   * The protocol version of the client the player is using.
   */
  public readonly protocolVersion: number = 754;

  public constructor(
    public readonly socket: Socket,
    public readonly server: MCServer
    // biome-ignore lint/nursery/noEmptyBlockStatements: <explanation>
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

  public setVersion(version: string) {
    Object.defineProperty(this, 'version', { value: version, writable: false, configurable: false });
    return this;
  }

  public setProtocolVersion(protocolVersion: number) {
    Object.defineProperty(this, 'protocolVersion', { value: protocolVersion, writable: false, configurable: false });
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
   * Drops the connection with the player immediately.
   */
  public disconnect() {
    if (this.socket.closed) return;
    this.socket.destroy();
  }
}
