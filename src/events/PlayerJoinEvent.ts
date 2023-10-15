import type Player from '../structures/Player';
import BaseEvent from './BaseEvent';

export default class PlayerJoinEvent extends BaseEvent {
  public constructor(public readonly player: Player) {
    super();
  }
}
