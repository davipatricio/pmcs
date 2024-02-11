import type { Socket } from 'node:net';
import { UnknownPlayer } from '.';
import type { MCServer } from './MCServer';

export class Player extends UnknownPlayer {
  public constructor(
    public readonly _socket: Socket,
    public readonly server: MCServer
  ) {
    super(_socket, server);
  }

  /**
   * Kicks the player from the server with the specified reason.
   *
   * @param _reason - The reason the player is being kicked. e.g. `§cYou have been kicked.`
   */
  public kick(_reason: string) {
    throw new Error('Player not initialized correctly.');
  }
}
