import type { Player } from '..';

export default class PlayerJoinEvent {
  public constructor(public readonly player: Player) {}
}
