import type Player from '../structures/Player';

export default class PlayerJoinEvent {
  public constructor(public player: Player) {}
}
