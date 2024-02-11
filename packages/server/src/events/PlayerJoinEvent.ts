import type { Player } from '..';

export default class PlayerJoinEvent {
  // biome-ignore lint/nursery/noEmptyBlockStatements: <explanation>
  public constructor(public readonly player: Player) {}
}
