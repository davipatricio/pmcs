import type Player from '../structures/Player';

export default class BaseEvent {
  public cancelled = false;
  public constructor(public player: Player) {}
}
